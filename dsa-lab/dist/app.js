import { chapters, book, references } from './catalog.js';
import { demos } from './algorithms.js';
import './structures.js';
import './recursion.js';
import './graphs.js';
import './exercises.js';
import { icon, escape as e, syntax, renderDiagram, chartSVG, curves, formatNumber } from './views.js';
import { parseListValue, parseListValues, formatListValue } from './list-input.js';

const $ = selector => document.querySelector(selector);
const readStorage = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
const saveStorage = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* Private browsing may disable storage. */ } };
const storedDone = readStorage('dsa-completed', []);
const state = {
  chapter: 14, tab: 'theory', topic: 'linked-search', navMode: 'chapters', search: '',
  complete: new Set(Array.isArray(storedDone) ? storedDone.filter(n => Number.isInteger(n) && n >= 1 && n <= 20) : []),
  resources: [], resourceError: false, trace: null, input: null, index: 0, playing: false, timer: null, speed: 1,
  selectedCurves: ['linear'], graphMax: 16, graphProbe: 8, graphScale: 'linear', animations: [],
};
const tabs = [['theory', 'Theory', 'book'], ['visualize', 'Visualize', 'play'], ['complexity', 'Complexity', 'chart'], ['resources', 'Resources', 'file']];
const currentChapter = () => chapters[state.chapter - 1];
const currentDemo = () => demos[state.topic];
const route = (chapter, tab = 'theory', topic = '') => `#${chapter}/${tab}${topic ? '/' + topic : ''}`;
const go = (chapter, tab = 'theory', topic = '') => {
  const hash = route(chapter, tab, topic);
  if (location.hash === hash) render(); else location.hash = hash;
};

function parseRoute() {
  const [rawChapter, rawTab, rawTopic] = location.hash.slice(1).split('/');
  const chapter = Number(rawChapter);
  const c = chapters.find(c => c.id === chapter) || chapters[13];
  const topic = c.topics.includes(rawTopic) ? rawTopic : c.topics.includes(state.topic) && state.chapter === c.id ? state.topic : c.topics[0];
  const changed = state.topic !== topic;
  const previousListInput = currentDemo()?.kind === 'linked' ? state.input : null;
  state.chapter = c.id; state.tab = tabs.some(([id]) => id === rawTab) ? rawTab : 'theory'; state.topic = topic;
  stopPlayback();
  if (changed || !state.trace) {
    state.input = structuredClone(currentDemo().defaults);
    if (changed && previousListInput && currentDemo().kind === 'linked') {
      Object.assign(state.input, structuredClone(previousListInput));
      const maxIndex = state.input.values.length - (['linked-insert', 'doubly-list'].includes(topic) ? 0 : 1);
      state.input.index = Math.min(state.input.index, Math.max(0, maxIndex));
    }
    state.trace = currentDemo().build(state.input);
    state.index = 0; state.selectedCurves = [...currentDemo().curves];
    state.graphScale = currentDemo().curves.includes('exponential') || currentDemo().curves.includes('factorial') ? 'log' : 'linear';
  }
  render();
  $('.chapter-link.active')?.scrollIntoView({ block: 'nearest', behavior: 'instant' });
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function renderNav() {
  const query = state.search.toLowerCase().trim();
  const matchesChapter = c => !query || `${c.id} ${c.title} ${c.short} ${c.topics.map(id => demos[id].title).join(' ')}`.toLowerCase().includes(query);
  if (state.navMode === 'chapters') {
    let group = '';
    const result = chapters.filter(matchesChapter).map(c => {
      const heading = c.group !== group ? `<div class="nav-group section-label">${e(c.group)}</div>` : ''; group = c.group;
      return `${heading}<a class="chapter-link ${c.id === state.chapter ? 'active' : ''}" href="${route(c.id)}" ${c.id === state.chapter ? 'aria-current="page"' : ''}><span class="chapter-number">${state.complete.has(c.id) ? icon('check') : String(c.id).padStart(2, '0')}</span><span>${e(c.short)}</span>${c.id === 14 && !state.complete.has(c.id) ? '<span class="nav-status current-dot" title="Your current teaching chapter"></span>' : ''}</a>`;
    }).join('');
    return result || '<div class="chapter-empty">No matching chapters. Try “search”, “tree”, or “recursion”.</div>';
  }
  return ['Data structures', 'Algorithms'].map(category => {
    const entries = Object.values(demos).filter(d => d.category === category && (!query || `${d.title} ${d.kind}`.toLowerCase().includes(query)));
    if (!entries.length) return '';
    return `<div class="nav-group section-label">${category}</div>${entries.map(d => {
      const c = chapters.find(c => c.topics.includes(d.id));
      return `<a class="chapter-link ${d.id === state.topic ? 'active' : ''}" href="${route(c.id, 'visualize', d.id)}">${icon(d.kind === 'graph' ? 'graph' : ['tree', 'heap', 'trie'].includes(d.kind) ? 'tree' : 'nodes')}<span>${e(d.title)}</span></a>`;
    }).join('')}`;
  }).join('') || '<div class="chapter-empty">No matching topics.</div>';
}

function resourcesForChapter() { return state.resources.filter(r => Array.isArray(r.chapter) ? r.chapter.includes(state.chapter) : r.chapter === state.chapter); }
function allImages() { return resourcesForChapter().flatMap(r => r.images.map(i => ({ ...i, folder: r.folder }))); }
function imageFigure(image, index) {
  const caption = `Illustration ${index + 1} · ${image.folder}/${image.name}`;
  return `<figure class="lesson-image"><button data-image="${e(image.path)}" data-caption="${e(caption)}" aria-label="Enlarge ${e(caption)}"><img src="${encodeURI(image.path)}" alt="Supplied book illustration for ${e(currentChapter().short)}, from ${e(image.folder)}, ${e(image.name)}" loading="lazy"></button><figcaption>${e(caption)}<br>Jay Wengrow · The Pragmatic Bookshelf · supplied lesson image</figcaption></figure>`;
}

function renderTheory() {
  const c = currentChapter();
  const images = allImages();
  // Prefer overview images; keep every illustrated walkthrough available in Resources.
  const chosen = [...images.filter(i => !i.name.includes('/')), ...images.filter(i => i.name.includes('/'))].slice(0, 2);
  const demo = currentDemo();
  const previewFrame = state.trace.frames[0];
  return `<div class="theory-grid"><article class="panel article">
    <div class="article-heading"><h2>The idea, before the code.</h2><span>Understand the why</span></div>
    ${c.sections.map((s, i) => `<section class="lesson-section" id="section-${i}"><div class="section-heading"><span class="section-index">${String(i + 1).padStart(2, '0')}</span><h3>${e(s.title)}</h3></div>${s.paragraphs.map(p => `<p>${e(p)}</p>`).join('')}</section>${i === 0 && ['linked', 'tree', 'trie', 'heap', 'graph'].includes(demo.kind) ? `<figure class="native-illustration"><div class="diagram">${renderDiagram(previewFrame, demo)}</div><figcaption>Explore this structure one statement at a time in the Visualize section.</figcaption></figure>` : ''}`).join('')}
    <div class="takeaway">${icon('lightbulb')}<div><strong>The key idea</strong><p>${e(c.takeaway)}</p></div></div>
    ${chosen.length ? `<div class="images-heading"><h3>From your lesson illustrations</h3><small>Click to explore</small></div><div class="image-grid">${chosen.map(imageFigure).join('')}</div>` : ''}
    <div class="lesson-footer"><button class="button ${state.complete.has(c.id) ? '' : 'ghost'}" data-action="complete">${icon('check')}${state.complete.has(c.id) ? 'Marked as studied' : 'Mark as studied'}</button><button class="button primary" data-action="visualize">Explore the visualization ${icon('arrow')}</button></div>
  </article><aside class="right-rail">
    <div class="panel rail-card toc"><h3>On this page</h3>${c.sections.map((s, i) => `<a href="#section-${i}" data-section="${i}">${e(s.title)}</a>`).join('')}</div>
    <div class="panel rail-card"><h3>${icon('code')} The Java connection</h3><p>${e(c.javaNote)}</p></div>
    <div class="panel rail-card"><h3>${icon('lightbulb')} Watch for these</h3><ul>${c.pitfalls.map(p => `<li>${e(p)}</li>`).join('')}</ul></div>
    <div class="rail-cta"><h3>Make it click.</h3><p>Watch the structure change and follow each step in the Java code.</p><button class="button primary full-width" data-action="visualize">${icon('play')} Try it yourself</button></div>
    <div class="panel rail-card"><h3>${icon('terminal')} A small challenge</h3><p>${e(c.exercise)}</p></div>
  </aside></div>`;
}

function topicToolbar() {
  const c = currentChapter();
  return `<div class="topic-toolbar"><label for="topic-select">Explore a topic<select id="topic-select">${c.topics.map(id => `<option value="${id}" ${state.topic === id ? 'selected' : ''}>${e(demos[id].title)}</option>`).join('')}</select></label><span class="trace-label"><span class="dot"></span>Animation & Java, in sync</span></div>`;
}

function renderFields() {
  const d = currentDemo();
  return d.fields.map(field => {
    const rawValue = state.input[field.key];
    const value = field.type === 'list' ? rawValue.map(formatListValue).join(', ') : field.type === 'value' ? formatListValue(rawValue) : rawValue;
    return `<div class="field"><label for="input-${field.key}">${e(field.label)}</label>${field.type === 'select' ? `<select id="input-${field.key}" name="${field.key}">${field.options.map(option => `<option ${value === option ? 'selected' : ''}>${e(option)}</option>`).join('')}</select>` : `<input id="input-${field.key}" name="${field.key}" type="${field.type === 'number' ? 'number' : 'text'}" value="${e(Array.isArray(value) ? value.join(', ') : value)}" ${field.type === 'number' ? `min="${field.min}" max="${field.max}" step="1" required` : 'autocomplete="off" spellcheck="false"'} ${field.hint ? `aria-describedby="input-hint"` : ''}>`}</div>`;
  }).join('');
}

function renderVisualize() {
  const d = currentDemo();
  return `${topicToolbar()}
  <div class="panel input-panel"><form id="input-form" novalidate>${renderFields()}<button id="load-example" type="submit" class="button primary" title="Load these inputs and restart at step 1. Use Next or Play to execute.">${icon('reset')} ${d.fields.length ? 'Load example' : 'Restart example'}</button></form>
    <div class="preset-row"><span>Try an example:</span><button data-preset="default">Original example</button>${d.kind === 'linked' ? '<button data-preset="text">Text values</button><button data-preset="integers">Integer values</button><button data-preset="empty">Empty list</button>' : d.fields.some(f => f.type === 'array') ? `<button data-preset="random">Random values</button><button data-preset="sorted">Already sorted</button>${!d.sortedInput ? '<button data-preset="reversed">Reverse order</button><button data-preset="duplicates">With duplicates</button>' : ''}<button data-preset="empty">Empty input</button>` : ''}</div>
    <p class="input-hint" id="input-hint">${e(d.fields.map(f => f.hint).filter(Boolean).join(' · ') || 'A fixed virtual example. Use Next to follow each operation.')} ${d.sortedInput ? 'Ascending input required.' : ''}</p><p class="input-feedback" id="input-feedback" role="status">Load example uses your inputs and restarts at step 1. Next performs one step; Play runs all steps.</p><p class="input-error" id="input-error" role="alert" hidden></p>
  </div>
  <div class="visual-grid"><div>
    <section class="panel simulation" aria-label="Interactive visualization"><div class="panel-head"><h2>${icon(d.kind === 'graph' ? 'graph' : 'nodes')} ${e(d.title)}</h2><small id="player-status">READY TO EXPLORE</small></div>
      <div id="source-text"></div><div class="diagram-wrap"><div class="diagram" id="diagram" tabindex="0" aria-label="Visualization diagram"></div><div class="diagram-legend"><span><i class="legend-square"></i>Current focus</span><span><i class="legend-square done"></i>Final / visited</span><span><i class="legend-square waiting"></i>Waiting</span></div></div>
      <div class="step-story" aria-live="polite" aria-atomic="true"><div class="section-label" id="step-label"></div><h3 id="step-title"></h3><p id="step-detail"></p></div>
      <div class="variables" id="variables" aria-label="Current variable values"></div>
      <div class="result-banner" id="result" hidden></div>
      <div class="player"><div class="timeline-row"><input id="timeline" type="range" min="0" max="${state.trace.frames.length - 1}" value="${state.index}" aria-label="Step timeline"><span id="timeline-label"></span></div>
      <div class="player-buttons"><div class="transport"><button class="icon-button" id="previous-step" aria-label="Previous step" title="Previous step (←)">${icon('previous')}</button><button class="button primary" id="play">${icon('play')} Play</button><button class="button" id="next-step" title="Next step (→)">Next ${icon('next')}</button></div><label class="speed-control">Speed <select id="speed" aria-label="Playback speed">${[0.5, 1, 1.5, 2].map(v => `<option value="${v}" ${state.speed === v ? 'selected' : ''}>${v}×</option>`).join('')}</select></label><button class="button ghost small" id="reset" title="Reset (R)">${icon('reset')} Reset</button></div></div>
    </section>
    <section class="panel stats" aria-label="Actual run counters"><div class="stat"><strong id="counter">0</strong><small>${e(d.counter)}</small></div><div class="stat"><strong id="writes">0</strong><small>${e(d.writeLabel || (['bubble-sort', 'selection-sort', 'quick-sort', 'quick-select', 'heap-insert', 'heap-extract'].includes(d.id) ? 'Swaps' : 'Writes / updates'))}</small></div><div class="stat"><strong id="step-count">1</strong><small>Current timeline step</small></div></section>
    <section class="panel memory-panel" id="memory-panel" hidden><div class="section-label" id="memory-label">Remembered values / output</div><div class="memory-values" id="memory-values"></div></section>
    <section class="panel memory-panel" id="frontier-panel" hidden><div class="section-label">Frontier queue · next out on the left</div><div class="memory-values" id="frontier-values"></div></section>
  </div><div>
    <section class="panel code-panel" aria-label="Java code example"><div class="panel-head"><h2>${icon('code')} Java implementation</h2><div><small>Demo.java</small> <button class="icon-button" data-action="copy-code" aria-label="Copy Java code" title="Copy Java code">${icon('copy')}</button></div></div><div class="code-window" id="code-window">${d.code.split('\n').map((line, i) => `<div class="code-line" data-line="${i}"><span class="line-number">${i + 1}</span><code>${syntax(line)}</code></div>`).join('')}</div><div class="code-foot"><span></span>Highlighted statement matches the current step</div></section>
    <div class="panel rail-card" style="margin-top:17px"><h3>${icon('lightbulb')} Follow the execution</h3><p>Next runs one meaningful statement or condition. Play follows the same timeline. Step backward to inspect the previous state.</p><p style="margin-top:10px">Use <kbd>←</kbd> <kbd>→</kbd> to step, <kbd>Space</kbd> to play, and <kbd>R</kbd> to reset.</p></div>
    <div class="panel rail-card" style="margin-top:17px"><h3>${icon('code')} Java detail</h3><p>${e(currentChapter().javaNote)}</p><button class="button ghost small" data-action="download-code" style="margin-top:10px">${icon('file')} Download Java example</button></div>
    <section class="panel memory-panel" id="aux-calls" hidden><div class="section-label">Recursive call stack</div><div class="memory-values" id="aux-call-values"></div></section>
  </div></div>`;
}

function renderComplexity() {
  const d = currentDemo();
  return `${topicToolbar()}<div class="complexity-cards">${[['Best-case time', d.time.best], ['Average / expected time', d.time.average], ['Worst-case time', d.time.worst], ['Space', d.space]].map(([label, value]) => `<div class="panel complexity-card"><span class="section-label">${e(label)}</span><strong>${e(value)}</strong></div>`).join('')}</div>
  <div class="graph-grid"><section class="panel chart-panel"><h2>Watch the work grow.</h2><p>Compare theoretical growth as the input gets larger. Constants are set to 1 for illustration; these curves are not measured execution times.</p>
    <div id="chart"></div><div class="chart-legend">${Object.entries(curves).map(([key, c]) => `<label><input type="checkbox" data-curve="${key}" ${state.selectedCurves.includes(key) ? 'checked' : ''}><span style="color:${c.color}">${c.name}</span></label>`).join('')}</div>
    <div class="chart-controls"><label>Input range <select id="graph-max">${[8, 16, 32, 64, 128].map(n => `<option ${state.graphMax === n ? 'selected' : ''}>${n}</option>`).join('')}</select></label><label>Y-axis <select id="graph-scale"><option value="linear" ${state.graphScale === 'linear' ? 'selected' : ''}>Linear</option><option value="log" ${state.graphScale === 'log' ? 'selected' : ''}>Logarithmic</option></select></label><label>Inspect n = <b id="probe-label">${state.graphProbe}</b><input type="range" id="graph-probe" min="1" max="${state.graphMax}" value="${state.graphProbe}" aria-label="Input size to inspect"></label></div>
    <div class="table-wrap"><table><thead><tr><th>Growth model</th><th>At selected n</th><th>At twice n</th></tr></thead><tbody id="chart-table"></tbody></table></div>
  </section><aside class="right-rail"><div class="panel rail-card"><h3>${icon('chart')} Read the graph</h3><p>The horizontal axis is input size. The vertical axis is the modeled number of operations. Toggle curves and use logarithmic scale when exponential growth compresses the others.</p><p style="margin-top:10px">${e(d.complexityNote || 'These growth models describe the selected example. The actual trace counters in Visualize use the specific counting rule displayed beneath each counter.')}</p></div><div class="panel rail-card"><h3>${icon('layers')} Time and space</h3><p>${e(currentChapter().takeaway)}</p><p style="margin-top:10px">Space includes auxiliary storage and the call stack unless the label explicitly says output or total storage.</p></div><div class="rail-cta"><h3>Try the real example.</h3><p>Compare the growth model with the actual operations on your own input.</p><button class="button primary full-width" data-action="visualize">${icon('play')} Open visualization</button></div></aside></div>`;
}

function renderResources() {
  const c = currentChapter(), resources = resourcesForChapter(), images = allImages();
  const files = resources.flatMap(r => [...r.java, ...r.notes].map(f => ({ ...f, folder: r.folder })));
  return `<section class="panel source-card"><span class="section-label">The teaching reference</span><h2>${e(book.title)}</h2><p>${e(book.author)} · ${e(book.edition)}<br>Chapter ${c.id}: ${e(c.title)} · printed pages ${e(c.pages)}</p><p>The explanations in this lab are written for Java, using the supplied book and lesson material as references. Book diagrams are credited alongside the supplied images. The original lesson files remain available below.</p><a class="button small" href="${book.url}" target="_blank" rel="noreferrer">Book & publisher ${icon('external')}</a></section>
    <h2 class="resource-heading">Your lesson files <span class="tab-count">${files.length}</span></h2>
    ${state.resourceError ? '<p class="input-error">Lesson resources could not be loaded. Reload the page after running the resource sync script.</p>' : ''}
    ${files.length ? files.map(f => `<details class="source-details" data-source="${e(f.path)}"><summary>${icon(f.path.endsWith('.java') ? 'code' : 'file')} ${e(f.name)} <span>${e(f.folder)}</span></summary><pre>Open to load the original file.</pre></details>`).join('') : `<div class="panel rail-card"><p>This chapter’s Java teaching examples and theory are included in the app. Your folder material will appear here when you add it and run the lesson sync.</p></div>`}
    ${images.length ? `<h2 class="resource-heading">Lesson illustrations <span class="tab-count">${images.length}</span></h2><div class="image-grid">${images.map(imageFigure).join('')}</div>` : ''}
    <section class="panel source-card" style="margin-top:25px"><h2>Java reference shelf</h2>${references.map(r => `<a class="resource-link" href="${r.url}" target="_blank" rel="noreferrer">${e(r.title)} ${icon('external')}</a>`).join('')}</section>
    ${state.resources.some(r => r.chapter === null) ? `<section class="panel source-card"><h2>New folders awaiting a chapter mapping</h2><p>Add these folders to chapter-map.json and run the sync script again.</p>${state.resources.filter(r => r.chapter === null).map(r => `<p>${e(r.folder)} · ${r.java.length} Java files · ${r.images.length} images</p>`).join('')}</section>` : ''}`;
}

function render() {
  const c = currentChapter();
  const navScroll = $('.chapter-nav')?.scrollTop || 0;
  const iconName = state.chapter >= 18 ? 'graph' : state.chapter >= 15 ? 'tree' : state.chapter >= 14 ? 'nodes' : state.chapter >= 10 ? 'layers' : 'code';
  $('#app').innerHTML = `<div class="drawer-backdrop" data-action="close-drawer"></div><aside class="sidebar" aria-label="Lesson navigation">
    <a class="brand" href="${route(14)}" aria-label="DSA Lab home"><span class="brand-mark">${icon('code')}</span><span class="brand-name">DSA LAB<small>A LITTLE LESS ABSTRACT.</small></span></a>
    <div class="sidebar-controls"><div class="section-label">Your learning space</div><div class="segmented" aria-label="Browse mode"><button data-nav-mode="chapters" class="${state.navMode === 'chapters' ? 'active' : ''}" aria-pressed="${state.navMode === 'chapters'}">Chapters</button><button data-nav-mode="topics" class="${state.navMode === 'topics' ? 'active' : ''}" aria-pressed="${state.navMode === 'topics'}">Topics</button></div><div class="search">${icon('search')}<input id="nav-search" type="search" placeholder="Find a topic…" aria-label="Search chapters and topics" value="${e(state.search)}"><kbd>/</kbd></div></div>
    <nav class="chapter-nav">${renderNav()}</nav><div class="sidebar-footer"><span class="section-label">A chapter at a time.</span><p>${state.complete.size} of 20 chapters marked as studied</p><div class="progress-track" role="progressbar" aria-label="Chapters studied" aria-valuemin="0" aria-valuemax="20" aria-valuenow="${state.complete.size}"><span style="width:${state.complete.size / 20 * 100}%"></span></div></div>
  </aside><div class="layout"><header class="topbar"><button class="icon-button menu-button" data-action="drawer" aria-label="Open lesson menu">${icon('menu')}</button><div class="breadcrumb"><span>The learning path</span>${icon('chevron')}<strong>Chapter ${String(c.id).padStart(2, '0')}</strong></div><div class="top-actions"><span class="java-pill">${icon('code')} Built around Java</span><button class="icon-button" data-action="shortcuts" aria-label="Keyboard shortcuts" title="Keyboard shortcuts">${icon('help')}</button><button class="icon-button" id="theme-toggle" data-action="theme" aria-label="Toggle light and dark theme" title="Toggle theme">${icon(document.documentElement.dataset.theme === 'dark' ? 'sun' : 'moon')}</button></div></header>
    <main class="content ${state.tab === 'visualize' ? 'visual-mode' : ''}" id="main" tabindex="-1"><div class="chapter-meta">Chapter ${String(c.id).padStart(2, '0')} / 20 <span class="dot">·</span><span class="meta-muted">${e(c.group)}</span></div><div class="hero"><div class="hero-copy"><h1>${e(c.title)}</h1><p class="hero-intro">${e(c.intro)}</p></div><div class="hero-mark">${icon(iconName)}</div></div><div class="chapter-chips"><span>${icon('book')}Book pages ${e(c.pages)}</span><span>${icon('play')}${c.topics.length} interactive examples</span><span>${icon('code')}Java examples</span>${c.id === 14 ? '<span class="current-badge">Your current teaching chapter</span>' : ''}</div>
    <nav class="tabs" aria-label="Chapter sections">${tabs.map(([id, label, glyph]) => `<a class="tab ${state.tab === id ? 'active' : ''}" href="${route(c.id, id, state.topic)}" ${state.tab === id ? 'aria-current="page"' : ''}>${icon(glyph)}${label}${id === 'visualize' ? `<span class="tab-count">${c.topics.length}</span>` : ''}</a>`).join('')}</nav>
    <div id="section-content">${state.tab === 'theory' ? renderTheory() : state.tab === 'visualize' ? renderVisualize() : state.tab === 'complexity' ? renderComplexity() : renderResources()}</div>
    <nav class="chapter-pager" aria-label="Previous and next chapter">${c.id > 1 ? `<a class="pager-link" href="${route(c.id - 1)}">${icon('left')}<span><small>Previous chapter</small>${e(chapters[c.id - 2].short)}</span></a>` : ''}${c.id < 20 ? `<a class="pager-link" href="${route(c.id + 1)}"><span><small>Next chapter</small>${e(chapters[c.id].short)}</span>${icon('arrow')}</a>` : ''}</nav>
    <footer class="footer"><span>Understand it. See it. Step through it.</span><span>Java companion to <a href="${book.url}" target="_blank" rel="noreferrer">Jay Wengrow’s Common-Sense Guide</a></span></footer>
    </main></div>`;
  $('.chapter-nav').scrollTop = navScroll;
  if (state.tab === 'visualize') paintFrame(false);
  if (state.tab === 'complexity') paintChart();
  document.querySelectorAll('details[data-source]').forEach(details => details.addEventListener('toggle', loadSource));
}

function paintFrame(animate = true) {
  if (state.tab !== 'visualize' || !$('#diagram')) return;
  const d = currentDemo(), f = state.trace.frames[state.index], diagram = $('#diagram');
  const old = new Map([...diagram.querySelectorAll('[data-motion]')].map(node => [node.dataset.motion, node.getBoundingClientRect()]));
  state.animations.forEach(a => a.cancel()); state.animations = [];
  diagram.innerHTML = renderDiagram(f, d);
  if (d.kind === 'linked') {
    const focus = diagram.querySelector('.svg-node.active');
    if (focus) {
      const box = focus.getBoundingClientRect(), viewport = diagram.getBoundingClientRect();
      if (box.left < viewport.left + 10) diagram.scrollLeft += box.left - viewport.left - 10;
      else if (box.right > viewport.right - 10) diagram.scrollLeft += box.right - viewport.right + 10;
    }
  }
  const duration = Math.min(420, 650 / state.speed);
  if (animate && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    diagram.querySelectorAll('[data-motion]').forEach(node => {
      const rect = node.getBoundingClientRect(), prev = old.get(node.dataset.motion);
      const keyframes = prev ? [{ transform: `translate(${prev.left - rect.left}px, ${prev.top - rect.top}px)` }, { transform: 'translate(0, 0)' }] : [{ opacity: 0, transform: 'translateY(9px)' }, { opacity: 1, transform: 'translateY(0)' }];
      state.animations.push(node.animate(keyframes, { duration, easing: 'cubic-bezier(.2,.8,.2,1)' }));
    });
    const active = diagram.querySelector('.active .cell-value, .active .value, .call-frame:last-child');
    if (active) state.animations.push(active.animate([{ opacity: .5 }, { opacity: 1 }], { duration }));
  }
  if (d.kind === 'calls') diagram.scrollTop = 0;
  $('#step-label').textContent = `STEP ${String(state.index + 1).padStart(2, '0')} · LINE ${f.line + 1}`;
  $('#step-title').textContent = f.title; $('#step-detail').textContent = f.detail;
  $('#variables').innerHTML = Object.entries(f.vars || {}).map(([key, value]) => `<span class="variable">${e(key)} <b>${e(value)}</b></span>`).join('') || '<span class="empty-text">Variables will appear as execution progresses.</span>';
  $('#source-text').innerHTML = f.sourceText !== undefined ? `<div class="source-text" aria-label="Input text">${[...f.sourceText].map((c, i) => i === f.textIndex ? `<mark>${e(c)}</mark>` : e(c)).join('')}</div>` : '';
  $('#counter').textContent = f.count; $('#writes').textContent = f.writes; $('#step-count').textContent = state.index + 1;
  $('#timeline').value = state.index; $('#timeline-label').textContent = `${state.index + 1} / ${state.trace.frames.length}`;
  $('#previous-step').disabled = state.index === 0;
  $('#next-step').disabled = state.index === state.trace.frames.length - 1;
  $('#play').innerHTML = icon(state.playing ? 'pause' : 'play') + (state.playing ? ' Pause' : state.index === state.trace.frames.length - 1 ? ' Replay' : ' Play');
  $('#play').setAttribute('aria-label', state.playing ? 'Pause playback' : 'Play all steps');
  $('#player-status').textContent = state.playing ? 'PLAYING' : state.index === state.trace.frames.length - 1 ? 'COMPLETE' : state.index === 0 ? 'READY TO EXPLORE' : 'PAUSED';
  $('#result').hidden = f.result === null || f.result === undefined;
  $('#result').textContent = `Result → ${typeof f.result === 'string' ? f.result : JSON.stringify(f.result)}`;
  $('#memory-panel').hidden = f.memory === undefined;
  $('#memory-values').innerHTML = f.memory?.length ? f.memory.map(v => `<span class="memory-chip">${e(v)}</span>`).join('') : '<span class="empty-text">Empty</span>';
  $('#memory-label').textContent = d.id === 'copy-array' ? 'Separate output array · input above is unchanged' : d.id === 'hash-duplicates' ? 'Seen set' : d.id === 'fibonacci-memo' ? 'Memoization cache' : 'Remembered values / output';
  $('#frontier-panel').hidden = f.frontier === undefined;
  $('#frontier-values').innerHTML = f.frontier?.length ? f.frontier.map(v => `<span class="memory-chip">${e(v)}</span>`).join('') : '<span class="empty-text">Empty</span>';
  $('#aux-calls').hidden = !f.calls?.length || d.kind === 'calls';
  $('#aux-call-values').innerHTML = (f.calls || []).map(call => `<span class="memory-chip">${e(call.label)}</span>`).join('');
  const windowEl = $('#code-window'); const current = windowEl.querySelector('.code-line.active');
  if (current) current.classList.remove('active');
  const line = windowEl.querySelector(`[data-line="${f.line}"]`); line?.classList.add('active');
  if (line) { const top = line.offsetTop - windowEl.offsetTop; if (top < windowEl.scrollTop || top + line.offsetHeight > windowEl.scrollTop + windowEl.clientHeight) windowEl.scrollTo({ top: Math.max(0, top - windowEl.clientHeight / 2), behavior: 'instant' }); }
}

function stopPlayback() { clearTimeout(state.timer); state.timer = null; state.playing = false; }
function step(direction) { stopPlayback(); state.index = Math.max(0, Math.min(state.trace.frames.length - 1, state.index + direction)); paintFrame(); }
function scheduleStep() {
  state.timer = setTimeout(() => {
    if (!state.playing || state.tab !== 'visualize') return;
    state.index++;
    if (state.index >= state.trace.frames.length - 1) { state.index = state.trace.frames.length - 1; stopPlayback(); }
    paintFrame(); if (state.playing) scheduleStep();
  }, Math.max(500, 1200 / state.speed));
}
function togglePlayback() { if (state.playing) stopPlayback(); else { if (state.index === state.trace.frames.length - 1) state.index = 0; state.playing = true; scheduleStep(); } paintFrame(false); }
function reset() { stopPlayback(); state.index = 0; paintFrame(); }

function readInput(form) {
  const d = currentDemo(), input = { ...d.defaults };
  const data = new FormData(form);
  for (const field of d.fields) {
    const raw = String(data.get(field.key) ?? '').trim();
    if (field.type === 'list') input[field.key] = parseListValues(raw);
    else if (field.type === 'value') input[field.key] = parseListValue(raw);
    else if (field.type === 'array') {
      const parts = raw ? raw.split(',').map(x => x.trim()) : [];
      if (parts.length > 14 || parts.some(v => !/^-?\d+$/.test(v) || Number(v) < -999 || Number(v) > 999)) throw new Error('Enter up to 14 comma-separated integers between −999 and 999. Empty input is allowed.');
      input[field.key] = parts.map(Number);
    } else if (field.type === 'number') {
      if (!/^-?\d+$/.test(raw) || Number(raw) < field.min || Number(raw) > field.max) throw new Error(`${field.label} must be an integer from ${field.min} to ${field.max}.`);
      input[field.key] = Number(raw);
    } else if (field.type === 'select') {
      if (!field.options.includes(raw)) throw new Error('Select an available option.'); input[field.key] = raw;
    } else { if (raw.length > 350) throw new Error('This input is too long for the interactive diagram.'); input[field.key] = raw; }
  }
  if (d.sortedInput && input.values.some((v, i) => i > 0 && v < input.values[i - 1])) throw new Error('This example requires ascending values. Use the Already sorted preset or sort your input.');
  if (['reverse', 'count-x'].includes(d.id) && (!/^[\x20-\x7e]*$/.test(input.text) || input.text.length > 12)) throw new Error('Use up to 12 ASCII characters for this string example.');
  if (d.id === 'brackets' && (!/^[()[\]{}]*$/.test(input.text) || input.text.length > 30)) throw new Error('Use up to 30 bracket characters: ( ) [ ] { }.');
  if (d.id === 'anagrams' && (!/^[a-z]{1,5}$/.test(input.text) || new Set(input.text).size !== input.text.length)) throw new Error('Use 1–5 distinct lowercase letters so every arrangement is unique.');
  if (d.id.startsWith('trie-')) { const words = input.words.split(',').map(w => w.trim()).filter(Boolean); if (words.length > 6 || words.some(w => !/^[a-z]{1,7}$/.test(w)) || !/^[a-z]{0,7}$/.test(input.word) || d.id === 'trie-insert' && !input.word) throw new Error('Use at most 6 stored lowercase words of 1–7 letters. Query length: up to 7; a new word must be nonempty.'); }
  if (d.id === 'greedy-stock' && input.values.some(v => v < 0)) throw new Error('Stock prices must be nonnegative.');
  return input;
}

function applyInput(input) {
  const trace = currentDemo().build(input);
  stopPlayback(); state.input = input; state.trace = trace; state.index = 0;
  $('#section-content').innerHTML = renderVisualize(); paintFrame(false);
  $('#input-feedback').textContent = 'Example loaded at step 1. Click Next for one step, or Play to run the timeline.';
  $('#input-feedback').classList.add('loaded');
  toast('Example loaded. Click Next or Play to start.');
}

function paintChart() {
  if (!$('#chart')) return;
  $('#chart').innerHTML = chartSVG(state.selectedCurves, state.graphMax, state.graphScale, state.graphProbe);
  $('#probe-label').textContent = state.graphProbe;
  $('#chart-table').innerHTML = state.selectedCurves.map(key => `<tr><td><span style="color:${curves[key].color}">${curves[key].name}</span></td><td>${formatNumber(curves[key].fn(state.graphProbe))}</td><td>${formatNumber(curves[key].fn(state.graphProbe * 2))}</td></tr>`).join('') || '<tr><td colspan="3">Select at least one curve to compare.</td></tr>';
}

async function loadSource(event) {
  const details = event.currentTarget;
  if (!details.open || details.dataset.loaded) return;
  const pre = details.querySelector('pre'); pre.textContent = 'Loading…';
  try { const response = await fetch(details.dataset.source); if (!response.ok) throw new Error('File unavailable'); pre.textContent = await response.text(); details.dataset.loaded = 'true'; }
  catch { pre.textContent = 'This source file could not be loaded. Run the lesson sync script and reload.'; }
}

let toastTimer;
function toast(message) { $('#toast').textContent = message; $('#toast').classList.add('visible'); clearTimeout(toastTimer); toastTimer = setTimeout(() => $('#toast').classList.remove('visible'), 4000); }

document.addEventListener('click', async event => {
  const section = event.target.closest('[data-section]');
  if (section) { event.preventDefault(); $(`#section-${section.dataset.section}`)?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }); return; }
  const link = event.target.closest('.chapter-link, .pager-link');
  if (link) document.body.classList.remove('drawer-open');
  const browse = event.target.closest('[data-nav-mode]');
  if (browse) { state.navMode = browse.dataset.navMode; render(); $('#nav-search')?.focus(); return; }
  const imageButton = event.target.closest('[data-image]');
  if (imageButton) { $('#large-image').src = imageButton.dataset.image; $('#large-image').alt = imageButton.dataset.caption; $('#image-caption').textContent = imageButton.dataset.caption + ' · Jay Wengrow / The Pragmatic Bookshelf'; $('#image-dialog').showModal(); return; }
  const preset = event.target.closest('[data-preset]');
  if (preset) {
    const name = preset.dataset.preset, input = structuredClone(currentDemo().defaults);
    if (currentDemo().kind === 'linked' && name !== 'default') {
      input.values = name === 'empty' ? [] : name === 'integers' ? [12, 7, 24, 18] : ['Alice', 'Bob', 'Carol', 'Dave'];
      input.target = name === 'integers' ? 24 : 'Carol'; input.value = name === 'integers' ? 15 : 'Eve';
      input.index = Math.min(2, Math.max(0, input.values.length - 1));
    } else if (name !== 'default') {
      input.values = name === 'empty' ? [] : name === 'duplicates' ? [4, 8, 2, 7, 8, 3] : name === 'random' ? Array.from({ length: 7 }, () => Math.floor(Math.random() * 80) + 1) : [5, 10, 15, 20, 25, 30, 35];
      if (name === 'reversed') input.values.reverse();
      if (currentDemo().sortedInput) input.values.sort((a, b) => a - b);
      if (input.index !== undefined) input.index = Math.min(input.index, Math.max(0, input.values.length - 1));
      if (input.rank !== undefined) input.rank = Math.min(input.rank, Math.max(0, input.values.length - 1));
    }
    applyInput(input); return;
  }
  const action = event.target.closest('[data-action]')?.dataset.action;
  if (action === 'visualize') go(state.chapter, 'visualize', state.topic);
  if (action === 'theme') { const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'; document.documentElement.dataset.theme = theme; try { localStorage.setItem('dsa-theme', theme); } catch {} $('#theme-toggle').innerHTML = icon(theme === 'dark' ? 'sun' : 'moon'); $('meta[name="theme-color"]').content = theme === 'dark' ? '#111719' : '#f7f8fa'; }
  if (action === 'drawer') document.body.classList.add('drawer-open');
  if (action === 'close-drawer') document.body.classList.remove('drawer-open');
  if (action === 'complete') { state.complete.has(state.chapter) ? state.complete.delete(state.chapter) : state.complete.add(state.chapter); saveStorage('dsa-completed', [...state.complete]); render(); }
  if (action === 'shortcuts') toast('← / → Step · Space Play/pause · R Reset · / Search · Esc Close menu');
  if (action === 'copy-code' || action === 'download-code') {
    const code = 'import java.util.*;\n\npublic final class Demo {\n' + currentDemo().code.split('\n').map(line => '  ' + line).join('\n') + '\n}\n';
    if (action === 'copy-code') { try { await navigator.clipboard.writeText(code); toast('Java example copied.'); } catch { toast('Clipboard unavailable. Use Download Java example.'); } }
    else { const blob = new Blob([code], { type: 'text/plain' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'Demo.java'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000); }
  }
  const id = event.target.closest('button')?.id;
  if (id === 'next-step') step(1);
  if (id === 'previous-step') step(-1);
  if (id === 'play') togglePlayback();
  if (id === 'reset') reset();
});

document.addEventListener('submit', event => {
  if (event.target.id !== 'input-form') return;
  event.preventDefault();
  try { applyInput(readInput(event.target)); $('#load-example').focus({ preventScroll: true }); }
  catch (error) { $('#input-error').hidden = false; $('#input-error').textContent = error.message; }
});
document.addEventListener('input', event => {
  if (event.target.closest('#input-form')) {
    $('#input-feedback').textContent = 'Inputs changed. Click Load example to use them, then choose Next or Play.';
    $('#input-feedback').classList.remove('loaded');
  }
  if (event.target.id === 'nav-search') { state.search = event.target.value; $('.chapter-nav').innerHTML = renderNav(); }
  if (event.target.id === 'timeline') { stopPlayback(); state.index = Number(event.target.value); paintFrame(); }
  if (event.target.id === 'graph-probe') { state.graphProbe = Number(event.target.value); paintChart(); }
});
document.addEventListener('change', event => {
  if (event.target.id === 'topic-select') go(state.chapter, state.tab, event.target.value);
  if (event.target.id === 'speed') { state.speed = Number(event.target.value); if (state.playing) { clearTimeout(state.timer); scheduleStep(); } }
  if (event.target.dataset.curve) { const key = event.target.dataset.curve; state.selectedCurves = event.target.checked ? [...new Set([...state.selectedCurves, key])] : state.selectedCurves.filter(k => k !== key); paintChart(); }
  if (event.target.id === 'graph-max') { state.graphMax = Number(event.target.value); state.graphProbe = Math.min(state.graphProbe, state.graphMax); $('#graph-probe').max = state.graphMax; $('#graph-probe').value = state.graphProbe; paintChart(); }
  if (event.target.id === 'graph-scale') { state.graphScale = event.target.value; paintChart(); }
});
document.addEventListener('keydown', event => {
  const editing = ['INPUT', 'SELECT', 'TEXTAREA'].includes(event.target.tagName) || event.target.isContentEditable;
  if (event.key === 'Escape') document.body.classList.remove('drawer-open');
  if (event.key === '/' && !editing) { event.preventDefault(); if (innerWidth <= 740) document.body.classList.add('drawer-open'); $('#nav-search').focus(); return; }
  if (editing || $('#image-dialog').open || state.tab !== 'visualize') return;
  if (event.key === 'ArrowRight') { event.preventDefault(); step(1); }
  if (event.key === 'ArrowLeft') { event.preventDefault(); step(-1); }
  if (event.code === 'Space' && !['BUTTON', 'A', 'SUMMARY'].includes(event.target.tagName)) { event.preventDefault(); togglePlayback(); }
  if (event.key.toLowerCase() === 'r') reset();
});
$('#close-image').addEventListener('click', () => $('#image-dialog').close());
$('#image-dialog').addEventListener('click', event => { if (event.target === $('#image-dialog')) $('#image-dialog').close(); });
window.addEventListener('hashchange', parseRoute);
document.addEventListener('visibilitychange', () => { if (document.hidden && state.playing) { stopPlayback(); paintFrame(false); } });
parseRoute();
fetch('lesson-assets.json').then(response => { if (!response.ok) throw new Error('Resources unavailable'); return response.json(); }).then(resources => { state.resources = resources; if (state.tab === 'theory' || state.tab === 'resources') render(); }).catch(() => { state.resourceError = true; if (state.tab === 'resources') render(); });
