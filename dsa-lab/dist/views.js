export const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
export const icons = {
  code: '<path d="m8 5-6 7 6 7m8-14 6 7-6 7m-2-17-4 20"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
  book: '<path d="M12 5C8 2 4 3 2 4v15c3-1 6-1 10 2 4-3 7-3 10-2V4c-2-1-6-2-10 1Zm0 0v16"/>',
  play: '<path d="m8 4 12 8-12 8Z"/>', pause: '<path d="M8 4v16M16 4v16"/>',
  next: '<path d="m8 5 8 7-8 7m11-14v14"/>', previous: '<path d="m16 5-8 7 8 7M5 5v14"/>',
  reset: '<path d="M3 11a9 9 0 1 1 2 7M3 4v7h7"/>',
  arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>', left: '<path d="M20 12H4m6-6-6 6 6 6"/>',
  chevron: '<path d="m9 5 7 7-7 7"/>', sun: '<circle cx="12" cy="12" r="4"/><path d="M12 1v2m0 18v2M1 12h2m18 0h2M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2"/>',
  moon: '<path d="M21 13a9 9 0 0 1-10-10 9 9 0 1 0 10 10Z"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  chart: '<path d="M4 3v17h17M7 16l4-5 4 2 5-8"/>',
  nodes: '<rect x="2" y="8" width="5" height="8" rx="1"/><rect x="17" y="8" width="5" height="8" rx="1"/><path d="M7 12h10m-4-3 3 3-3 3"/>',
  tree: '<rect x="9" y="2" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="16" y="16" width="6" height="6" rx="1"/><path d="M12 8v4H5v4m7-4h7v4"/>',
  graph: '<circle cx="12" cy="3" r="2"/><circle cx="3" cy="15" r="2"/><circle cx="21" cy="15" r="2"/><circle cx="12" cy="21" r="2"/><path d="m11 5-7 8m9-8 7 8M5 16l5 4m4 0 5-4M5 15h14"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  lightbulb: '<path d="M8 17h8m-7 4h6M8 17v-2a7 7 0 1 1 8 0v2"/>',
  file: '<path d="M14 2H5v20h14V7l-5-5Zm0 0v6h5M8 13h8m-8 4h6"/>',
  external: '<path d="M14 3h7v7m0-7-11 11m-1-10H3v17h17v-6"/>',
  copy: '<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V3H3v13h5"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9 8a3 3 0 0 1 6 1c0 2-3 2-3 5m0 3h.01"/>',
  terminal: '<path d="m4 7 5 5-5 5m8 0h8"/>',
  layers: '<path d="m12 2 10 6-10 6L2 8Zm-10 10 10 6 10-6M2 16l10 6 10-6"/>',
  image: '<rect x="2" y="3" width="20" height="18" rx="2"/><circle cx="8" cy="8" r="2"/><path d="m3 19 6-6 4 3 4-6 4 7"/>',
};
export const icon = name => `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || icons.code}</svg>`;

export function syntax(line) {
  // Tokenize before adding markup so user/source text can never become HTML.
  return line.split(/(\/\/.*|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\b(?:static|class|record|int|long|double|boolean|char|void|if|else|for|while|return|new|throw|true|false|null|break|var)\b)/g)
    .map(token => {
      const safe = escape(token);
      if (token.startsWith('//')) return `<span class="code-comment">${safe}</span>`;
      if (/^["']/.test(token)) return `<span class="code-string">${safe}</span>`;
      if (/^(static|class|record|int|long|double|boolean|char|void|if|else|for|while|return|new|throw|true|false|null|break|var)$/.test(token)) return `<span class="code-keyword">${safe}</span>`;
      return safe;
    }).join('');
}

export function renderDiagram(frame, demo) {
  const f = frame, e = escape;
  if (demo.kind === 'calls') {
    return `<div class="call-stack">${f.calls?.length ? f.calls.map((call, i) => `<div class="call-frame" data-motion="call-${i}">${e(call.label)}<small>${i === f.calls.length - 1 ? 'EXECUTING' : 'WAITING'}</small></div>`).join('') : '<p class="empty-text">The call stack is empty.</p>'}</div>`;
  }
  if (demo.kind === 'hash') {
    return `<div class="hash-buckets">${(f.buckets || []).map((chain, b) => `<div class="bucket ${b === f.activeBucket ? 'active' : ''}"><span class="bucket-index">${b}</span><span class="bucket-null">→</span>${chain.length ? chain.map((entry, i) => `<span class="bucket-entry ${b === f.activeBucket && i === f.activeEntry ? 'active' : ''}" data-motion="key-${entry.key}">${entry.key} : ${entry.value}</span>${i < chain.length - 1 ? '<span class="bucket-null">→</span>' : ''}`).join('') : '<span class="bucket-null">empty</span>'}</div>`).join('')}</div>`;
  }
  if (f.nodes) {
    if (!f.nodes.length) return '<svg viewBox="0 0 600 200" role="img" aria-label="Empty structure"><text x="300" y="100" class="svg-empty">Empty structure · null</text></svg>';
    const map = new Map(f.nodes.map(n => [n.id, n]));
    const maxX = Math.max(300, ...f.nodes.map(n => n.x + (n.width || 0) / 2)) + (demo.kind === 'linked' ? 100 : 55), maxY = Math.max(150, ...f.nodes.map(n => n.y)) + 55;
    const edges = (f.edges || []).map(edge => {
      const a = map.get(edge.from), b = map.get(edge.to); if (!a || !b) return '';
      const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1;
      const active = (f.activeEdges || []).some(([from, to]) => from === edge.from && to === edge.to || !edge.directed && from === edge.to && to === edge.from);
      const offset = edge.back ? 8 : 0;
      const boundary = node => demo.kind === 'linked' ? Math.min((node.width / 2) / (Math.abs(dx) / len || Number.EPSILON), 22 / (Math.abs(dy) / len || Number.EPSILON)) : 25;
      const start = boundary(a), end = boundary(b) + (edge.directed ? 6 : 0);
      const x1 = a.x + dx / len * start, y1 = a.y + dy / len * start + offset;
      const x2 = b.x - dx / len * end, y2 = b.y - dy / len * end + offset;
      return `<path class="svg-edge ${active ? 'active' : ''}" d="M${x1},${y1} L${x2},${y2}" ${edge.directed ? `marker-end="url(#${active ? 'arrow-active' : 'arrow'})"` : ''}/>${edge.weight !== undefined ? `<text class="svg-edge-label" x="${(a.x + b.x) / 2 + (Math.abs(dx) < 50 ? 12 : 0)}" y="${(a.y + b.y) / 2 - 7}">${edge.weight}</text>` : ''}`;
    }).join('');
    const nodes = f.nodes.map(n => {
      const active = f.activeNodes?.includes(n.id), visited = f.visitedNodes?.includes(n.id);
      const square = demo.kind === 'linked' || demo.id === 'directory';
      const width = n.width || 62;
      return `<g class="svg-node ${active ? 'active' : visited ? 'visited' : ''}" transform="translate(${n.x},${n.y})"><title>${e(n.label)}</title><g data-motion="node-${e(n.id)}">${square ? `<rect x="${-width / 2}" y="-22" width="${width}" height="44" rx="8"/>` : '<circle r="23"/>'}${n.terminal ? '<circle class="terminal-inner" r="19"/>' : ''}<text class="value" y="5" style="font-size:${demo.kind === 'linked' ? '13' : String(n.label).length > 5 ? '9' : '15'}px">${e(n.label)}</text>${n.sub ? `<text class="node-sub" y="40">${e(n.sub)}</text>` : ''}</g></g>`;
    }).join('');
    const tail = demo.kind === 'linked' && map.has(f.nullTail) ? `<text class="svg-empty" x="${map.get(f.nullTail).x + map.get(f.nullTail).width / 2 + 35}" y="${map.get(f.nullTail).y + 4}">→ null</text>` : '';
    return `<svg ${demo.kind === 'linked' ? `class="linked-diagram" style="--diagram-width:${maxX}px"` : ''} viewBox="0 0 ${maxX} ${maxY}" role="img" aria-label="${e(demo.title)} diagram: ${e(f.nodes.map(n => n.label).join(', '))}"><defs><marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10z" fill="var(--faint)"/></marker><marker id="arrow-active" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10z" fill="var(--amber)"/></marker></defs>${edges}${nodes}${tail}</svg>`;
  }
  const occurrences = new Map();
  return `<div class="array-track">${f.held !== null && f.held !== undefined ? `<div class="held-value">held key = ${e(f.held)}</div>` : ''}${f.values.length ? f.values.map((value, i) => {
    const occurrence = occurrences.get(value) || 0; occurrences.set(value, occurrence + 1);
    const pointers = Object.entries(f.pointers || {}).filter(([, index]) => index === i).map(([name]) => name);
    if (demo.kind === 'stack' && i === f.values.length - 1) pointers.push('top');
    if (demo.kind === 'queue' && i === 0) pointers.push('front');
    if (demo.kind === 'queue' && i === f.values.length - 1) pointers.push('back');
    const excluded = f.range && (i < f.range[0] || i > f.range[1]);
    return `<div class="array-cell ${f.active?.includes(i) ? 'active' : f.sorted?.includes(i) ? 'sorted' : ''} ${excluded ? 'excluded' : ''} ${f.gap === i ? 'gap' : ''}" data-motion="value-${e(value)}-${occurrence}" aria-label="Index ${i}: ${e(value)}${pointers.length ? ', ' + pointers.join(', ') : ''}${f.active?.includes(i) ? ', active' : ''}"><span class="cell-index">${i}</span><div class="cell-value">${f.gap === i ? '·' : e(value)}</div><span class="cell-pointer">${pointers.length ? '↑ ' + e(pointers.join(' / ')) : ''}</span></div>`;
  }).join('') : '<span class="empty-text">Empty sequence</span>'}</div>`;
}

export const curves = {
  constant: { name: 'O(1)', label: 'Constant', color: '#539bba', fn: n => 1 },
  log: { name: 'O(log n)', label: 'Logarithmic', color: '#458bc5', fn: n => Math.log2(Math.max(1, n)) },
  linear: { name: 'O(n)', label: 'Linear', color: '#289775', fn: n => n },
  nlog: { name: 'O(n log n)', label: 'Linearithmic', color: '#b69440', fn: n => n * Math.log2(Math.max(1, n)) },
  quadratic: { name: 'O(n²)', label: 'Quadratic', color: '#cd8260', fn: n => n * n },
  exponential: { name: 'O(2ⁿ)', label: 'Exponential upper bound', color: '#b873a5', fn: n => 2 ** n },
  factorial: { name: 'O(n!)', label: 'Factorial output count', color: '#a677c7', fn: n => { let v = 1; for (let i = 2; i <= n; i++) { v *= i; if (v > 1e100) return 1e100; } return v; } }
};
export function formatNumber(value) {
  if (value < 1000) return Number.isInteger(value) ? String(value) : value.toFixed(1);
  if (value < 1e6) return (value / 1e3).toFixed(1) + 'k';
  if (value < 1e9) return (value / 1e6).toFixed(1) + 'm';
  return value.toExponential(1);
}

export function chartSVG(selected, n = 16, scale = 'linear', probe = 8) {
  const width = 700, height = 330, left = 65, top = 25, right = 20, bottom = 45;
  const w = width - left - right, h = height - top - bottom;
  const transform = v => scale === 'log' ? Math.log10(v + 1) : v;
  // Cap only the chart viewport; labels and table retain the full model values.
  const rawMax = Math.max(2, ...selected.map(key => Math.min(curves[key].fn(n), 1e100)));
  const ymax = transform(rawMax) * 1.05;
  const x = value => left + (value - 1) / Math.max(1, n - 1) * w;
  const y = value => top + h - transform(Math.min(value, rawMax)) / ymax * h;
  const grid = Array.from({ length: 5 }, (_, i) => { const transformed = ymax * i / 4; const raw = scale === 'log' ? 10 ** transformed - 1 : transformed; const py = top + h - h * i / 4; return `<line x1="${left}" y1="${py}" x2="${width - right}" y2="${py}" class="chart-axis" stroke-dasharray="3 5"/><text x="${left - 10}" y="${py + 4}" class="chart-text" text-anchor="end">${formatNumber(raw)}</text>`; }).join('');
  const ticks = [...new Set([1, Math.round(n / 4), Math.round(n / 2), Math.round(3 * n / 4), n])].filter(v => v >= 1);
  const lines = selected.map(key => { const c = curves[key]; const points = Array.from({ length: 151 }, (_, i) => { const input = 1 + i / 150 * (n - 1); return `${i === 0 ? 'M' : 'L'}${x(input).toFixed(2)},${y(c.fn(key === 'factorial' ? Math.floor(input) : input)).toFixed(2)}`; }).join(' '); return `<path d="${points}" class="chart-line" stroke="${c.color}"/><circle cx="${x(probe)}" cy="${y(c.fn(probe))}" r="4" fill="${c.color}" stroke="var(--surface)" stroke-width="2"/>`; }).join('');
  return `<svg class="complexity-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="Theoretical growth curves for ${selected.map(k => curves[k].name).join(', ')}; ${scale === 'log' ? 'logarithmic' : 'linear'} vertical scale"><text x="${left}" y="12" class="chart-text">Modeled operations${scale === 'log' ? ' · log scale' : ''}</text>${grid}<line x1="${left}" y1="${top}" x2="${left}" y2="${height - bottom}" class="chart-axis"/><line x1="${left}" y1="${height - bottom}" x2="${width - right}" y2="${height - bottom}" class="chart-axis"/>${ticks.map(v => `<text x="${x(v)}" y="${height - bottom + 21}" class="chart-text" text-anchor="middle">${v}</text>`).join('')}<text x="${left + w / 2}" y="${height - 4}" class="chart-text" text-anchor="middle">Input size (n)</text><line x1="${x(probe)}" y1="${top}" x2="${x(probe)}" y2="${top + h}" stroke="var(--faint)" stroke-dasharray="4 4" opacity=".5"/>${lines}</svg>`;
}
