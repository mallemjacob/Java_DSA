// Dependency-free Chrome DevTools browser checks. Start serve.py and a temporary
// headless Chrome with --remote-debugging-port=9222 before running this file.
import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { demos } from '../dist/algorithms.js';
import '../dist/structures.js';
import '../dist/recursion.js';
import '../dist/graphs.js';
import '../dist/exercises.js';
import { chapters } from '../dist/catalog.js';

const origin = process.argv[2] || process.env.DSA_TEST_ORIGIN || 'http://localhost:5173';
const devtoolsOrigin = process.argv[3] || 'http://127.0.0.1:9222';
const targets = await (await fetch(`${devtoolsOrigin}/json`)).json();
const target = targets.find(t => t.type === 'page');
assert.ok(target, 'Chrome must expose a page target');
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
let serial = 0; const pending = new Map(), exceptions = [], failedResponses = [];
socket.onmessage = event => {
  const message = JSON.parse(event.data);
  if (message.id) { const item = pending.get(message.id); if (item) { pending.delete(message.id); message.error ? item.reject(new Error(message.error.message)) : item.resolve(message.result); } }
  if (message.method === 'Runtime.exceptionThrown') exceptions.push(message.params.exceptionDetails);
  if (message.method === 'Network.responseReceived' && message.params.response.status >= 400) failedResponses.push(message.params.response.url);
};
const send = (method, params = {}) => new Promise((resolve, reject) => { const id = ++serial; pending.set(id, { resolve, reject }); socket.send(JSON.stringify({ id, method, params })); });
const evaluate = async expression => {
  const result = await send('Runtime.evaluate', { expression: `(() => eval(${JSON.stringify(expression)}))()`, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
  return result.result.value;
};
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
async function until(expression, label = expression) {
  for (let i = 0; i < 100; i++) { if (await evaluate(expression)) return; await delay(50); }
  throw new Error('Timed out: ' + label);
}
async function visit(hash) {
  await send('Page.navigate', { url: `${origin}/${hash}` });
  await until(`document.querySelector('h1') && document.querySelector('.tab.active')`, 'app shell');
  await delay(80);
}
async function click(selector) { await evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`); }
async function screenshot(name) {
  const { data } = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  writeFileSync(new URL(`../artifacts/${name}.png`, import.meta.url), Buffer.from(data, 'base64'));
}
const results = [];
function check(label, actual, expected = true) { assert.deepEqual(actual, expected, label); results.push(label); }

mkdirSync(fileURLToPath(new URL('../artifacts', import.meta.url)), { recursive: true });
try {
  await send('Page.enable'); await send('Runtime.enable'); await send('Network.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1050, deviceScaleFactor: 1, mobile: false });
  await visit('#14/theory/linked-search');
  await until(`document.querySelectorAll('.chapter-link').length === 20`);
  check('Twenty chapters are available', await evaluate(`document.querySelectorAll('.chapter-link').length`), 20);
  check('Chapter 14 theory opens', await evaluate(`document.querySelector('h1').textContent`), 'Node-Based Data Structures');
  await evaluate(`document.documentElement.dataset.theme = 'light'`); await screenshot('01-theory-light');
  await click('[data-action="theme"]');
  check('Dark theme toggles', await evaluate(`document.documentElement.dataset.theme`), 'dark');
  await screenshot('02-theory-dark');
  await send('Page.reload'); await delay(300);
  check('Theme survives reload', await evaluate(`document.documentElement.dataset.theme`), 'dark');
  await click('[data-action="theme"]');

  await visit('#2/visualize/binary-search');
  check('Initial Java statement is highlighted', await evaluate(`document.querySelector('.code-line.active code').textContent.includes('int low')`));
  await click('#next-step');
  check('Next advances one frame', await evaluate(`document.querySelector('#timeline').value`), '1');
  check('Java highlight advances with the step', await evaluate(`document.querySelector('.code-line.active code').textContent.includes('while')`));
  await click('#previous-step');
  check('Previous restores the earlier state', await evaluate(`document.querySelector('#timeline').value`), '0');
  await evaluate(`const button=document.querySelector('#next-step'); button.focus(); button.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));`);
  check('Arrow shortcuts work with transport-button focus', await evaluate(`document.querySelector('#timeline').value`), '1');
  await click('#reset');
  await click('#next-step'); await click('#next-step');
  await screenshot('03-binary-search');
  await evaluate(`const t=document.querySelector('#timeline'); t.value=t.max; t.dispatchEvent(new Event('input',{bubbles:true}));`);
  check('Scrubbing to completion displays the result', await evaluate(`document.querySelector('#result').textContent`), 'Result → 5');
  await click('#play'); await delay(1350);
  check('Replay progresses automatically', await evaluate(`Number(document.querySelector('#timeline').value) > 0`));
  await click('#play');
  const paused = await evaluate(`document.querySelector('#timeline').value`); await delay(1350);
  check('Pause stops the timer', await evaluate(`document.querySelector('#timeline').value`), paused);
  await click('#reset');
  check('Reset restores the first frame', await evaluate(`document.querySelector('#timeline').value`), '0');
  await evaluate(`document.querySelector('[name="values"]').value='30, 10, 20'; document.querySelector('#input-form').requestSubmit();`);
  check('Unsorted binary-search input is rejected', await evaluate(`!document.querySelector('#input-error').hidden`));
  await evaluate(`document.querySelector('[name="values"]').value='10, 20, 30'; document.querySelector('[name="target"]').value='20'; document.querySelector('#input-form').requestSubmit();`);
  check('Valid custom inputs apply', await evaluate(`document.querySelector('[name="values"]').value`), '10, 20, 30');

  await visit('#14/visualize/linked-search');
  check('Linked-list targets accept text', await evaluate(`document.querySelector('[name="target"]').type`), 'text');
  await evaluate(`const values=document.querySelector('[name="values"]'); values.value='Ada, Grace, Linus'; values.dispatchEvent(new Event('input',{bubbles:true})); document.querySelector('[name="target"]').value='Grace';`);
  check('Editing inputs gives loading guidance', await evaluate(`document.querySelector('#input-feedback').textContent.includes('Inputs changed')`));
  await click('#load-example');
  check('Load example confirms that inputs were loaded', await evaluate(`document.querySelector('#input-feedback').textContent.includes('Example loaded at step 1') && document.querySelector('#toast').textContent.includes('Next or Play')`));
  check('Loading does not execute the operation', await evaluate(`document.querySelector('#timeline').value`), '0');
  await evaluate(`const timeline=document.querySelector('#timeline'); timeline.value=timeline.max; timeline.dispatchEvent(new Event('input',{bubbles:true}));`);
  check('String search returns the matching index', await evaluate(`document.querySelector('#result').textContent`), 'Result → 1');
  check('Search Java compares values with Objects.equals', await evaluate(`document.querySelector('#code-window').textContent.includes('Objects.equals')`));
  await click('#load-example');
  check('Loading again visibly resets an existing run', await evaluate(`document.querySelector('#timeline').value`), '0');

  await evaluate(`const select=document.querySelector('#topic-select'); select.value='linked-read'; select.dispatchEvent(new Event('change',{bubbles:true}));`);
  await until(`document.querySelector('.panel-head h2')?.textContent.includes('read by index')`);
  check('Switching linked operations retains the entered values', await evaluate(`document.querySelector('[name="values"]').value`), '"Ada", "Grace", "Linus"');
  await evaluate(`document.querySelector('[name="index"]').value='1'; document.querySelector('#input-form').requestSubmit();`);
  await click('#next-step'); await click('#next-step'); await click('#next-step');
  check('Reading animates the traversed next reference', await evaluate(`document.querySelector('.svg-node.active .value').textContent`), 'Grace');
  await evaluate(`const timeline=document.querySelector('#timeline'); timeline.value=timeline.max; timeline.dispatchEvent(new Event('input',{bubbles:true}));`);
  check('Reading index 1 returns its text value', await evaluate(`document.querySelector('#result').textContent`), 'Result → Grace');
  check('Read highlights the returning Java statement', await evaluate(`document.querySelector('.code-line.active code').textContent.includes('return current.value')`));
  check('Indexed read follows exactly one link for index 1', await evaluate(`document.querySelector('#counter').textContent`), '1');
  await screenshot('09-linked-string-read');

  await evaluate(`document.querySelector('[name="index"]').value=''; document.querySelector('#input-form').requestSubmit();`);
  check('Invalid input reports a visible error instead of a silent blocked submit', await evaluate(`!document.querySelector('#input-error').hidden && document.querySelector('#input-error').textContent.includes('must be an integer')`));
  await visit('#14/visualize/linked-insert');
  await evaluate(`document.querySelector('[name="value"]').value='Hello world'; document.querySelector('[name="index"]').value='1'; document.querySelector('#input-form').requestSubmit(); const timeline=document.querySelector('#timeline'); timeline.value=timeline.max; timeline.dispatchEvent(new Event('input',{bubbles:true}));`);
  check('String insertion keeps all text values', await evaluate(`document.querySelector('#result').textContent`), 'Result → ["Ada","Hello world","Grace","Linus"]');
  await visit('#14/visualize/linked-delete');
  await evaluate(`document.querySelector('[name="index"]').value='1'; document.querySelector('#input-form').requestSubmit(); const timeline=document.querySelector('#timeline'); timeline.value=timeline.max; timeline.dispatchEvent(new Event('input',{bubbles:true}));`);
  check('String deletion preserves the rest of the chain', await evaluate(`document.querySelector('#result').textContent`), 'Result → ["Ada","Linus"]');
  await visit('#14/visualize/linked-search');
  await evaluate(`document.querySelector('[name="values"]').value='12, "12", Bob'; document.querySelector('[name="target"]').value='"12"'; document.querySelector('#input-form').requestSubmit(); const timeline=document.querySelector('#timeline'); timeline.value=timeline.max; timeline.dispatchEvent(new Event('input',{bubbles:true}));`);
  check('Numeric text remains distinct from an integer', await evaluate(`document.querySelector('#result').textContent`), 'Result → 1');
  await click('[data-preset="integers"]');
  await evaluate(`const timeline=document.querySelector('#timeline'); timeline.value=timeline.max; timeline.dispatchEvent(new Event('input',{bubbles:true}));`);
  check('Integer linked-list examples still work', await evaluate(`document.querySelector('#result').textContent`), 'Result → 2');
  await click('[data-preset="text"]');

  for (const demo of Object.values(demos)) {
    const chapter = chapters.find(c => c.topics.includes(demo.id));
    await visit(`#${chapter.id}/visualize/${demo.id}`);
    await until(`document.querySelector('.panel-head h2')?.textContent.includes(${JSON.stringify(demo.title)})`, demo.id);
    await evaluate(`const timeline=document.querySelector('#timeline'); timeline.value=timeline.max; timeline.dispatchEvent(new Event('input',{bubbles:true}));`);
    check(`${demo.id} renders its final state`, await evaluate(`!document.querySelector('#result').hidden && !!document.querySelector('.code-line.active')`));
  }

  await visit('#18/visualize/dijkstra'); await click('#next-step');
  await screenshot('04-graph');
  await visit('#14/visualize/linked-insert'); await click('#next-step'); await click('#next-step');
  await screenshot('05-linked-list');
  await visit('#2/complexity/binary-search');
  check('Complexity graph renders', await evaluate(`document.querySelectorAll('.chart-line').length`), 2);
  await evaluate(`document.querySelector('[data-curve="quadratic"]').click(); document.querySelector('#graph-scale').value='log'; document.querySelector('#graph-scale').dispatchEvent(new Event('change',{bubbles:true}));`);
  check('Graph controls update curves and scale', await evaluate(`document.querySelectorAll('.chart-line').length === 3 && document.querySelector('.complexity-svg').getAttribute('aria-label').includes('logarithmic')`));
  await screenshot('06-complexity');

  await visit('#2/resources/binary-search');
  await until(`document.querySelectorAll('.lesson-image img').length > 0`);
  await until(`Array.from(document.querySelectorAll('.lesson-image img')).filter(i=>i.complete && i.naturalWidth>0).length > 0`);
  check('Supplied images load', await evaluate(`Array.from(document.querySelectorAll('.lesson-image img')).some(i=>i.naturalWidth>0)`));
  await click('[data-image]');
  check('Image viewer opens', await evaluate(`document.querySelector('#image-dialog').open`));
  await click('#close-image');
  await click('.source-details summary');
  await until(`document.querySelector('.source-details pre').textContent.includes('class ')`);
  check('Original Java source loads', true);

  await visit('#14/theory/linked-search'); await click('[data-action="complete"]');
  check('Study progress persists', await evaluate(`JSON.parse(localStorage.getItem('dsa-completed')).includes(14)`));
  await click('[data-action="complete"]');
  await click('[data-nav-mode="topics"]');
  await evaluate(`const input=document.querySelector('#nav-search'); input.value='dijkstra'; input.dispatchEvent(new Event('input',{bubbles:true}));`);
  check('Topic search filters the menu', await evaluate(`document.querySelectorAll('.chapter-link').length`), 1);
  await evaluate(`const input=document.querySelector('#nav-search'); input.value=''; input.dispatchEvent(new Event('input',{bubbles:true}));`);
  await click('[data-nav-mode="chapters"]');

  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await visit('#14/theory/linked-search');
  check('Mobile page does not overflow', await evaluate(`document.documentElement.scrollWidth <= innerWidth`));
  await click('[data-action="drawer"]');
  check('Mobile menu opens', await evaluate(`document.body.classList.contains('drawer-open')`));
  await click('[data-action="close-drawer"]');
  await screenshot('07-mobile-theory');
  await visit('#2/visualize/binary-search');
  check('Mobile visualization does not overflow the page', await evaluate(`document.documentElement.scrollWidth <= innerWidth`));
  await screenshot('08-mobile-visualize');
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1050, deviceScaleFactor: 1, mobile: false });
  await visit('#14/theory/linked-search');
  check('No browser JavaScript exceptions', exceptions.length, 0);
  check('No failed resource responses', failedResponses, []);
  console.log(JSON.stringify({ passed: results.length, checks: results, screenshots: 'artifacts/*.png' }, null, 2));
} finally { socket.close(); }
