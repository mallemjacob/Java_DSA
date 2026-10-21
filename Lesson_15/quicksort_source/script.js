"use strict";

// Lomuto Quick Sort, captured as a collection of inspectable snapshots.
// The user chooses the pivot of the FIRST partition by clicking a bar.
// Every recursive partition afterwards uses its rightmost element.
const $ = (selector) => document.querySelector(selector);
const els = {
  track: $("#arrayTrack"), hint: $("#arrayHint"), range: $("#rangeLabel"),
  sorted: $("#sortedLabel"), chip: $("#stepChip"),
  eventLabel: $("#eventLabel"), depth: $("#depthLabel"),
  title: $("#eventTitle"), detail: $("#eventDetail"),
  prev: $("#prevBtn"), next: $("#nextBtn"), play: $("#playBtn"),
  reset: $("#resetBtn"), scrub: $("#scrubber"), progress: $("#progressText"),
  speed: $("#speed"), numbers: $("#numbersInput"), apply: $("#applyBtn"),
  shuffle: $("#shuffleBtn"), error: $("#inputError"),
  comparisons: $("#comparisonCount"), swaps: $("#swapCount"),
  partitions: $("#partitionCount"), fixed: $("#fixedCount")
};

let values = [42, 17, 68, 9, 53, 26, 74, 31, 12];
let frames = [];
let stepIndex = -1;
let playbackTimer = null;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function buildTimeline(numbers, firstPivotIndex) {
  const items = numbers.map((value, id) => ({ value, id }));
  const fixed = new Set();
  const stats = { comparisons: 0, swaps: 0, partitions: 0 };
  const snapshots = [];
  const exchange = (a, b) => { [items[a], items[b]] = [items[b], items[a]]; };

  function record(type, title, detail, options = {}) {
    snapshots.push({
      type, title, detail,
      items: items.map((item) => ({ ...item })),
      fixed: [...fixed], stats: { ...stats },
      active: null, pivotIndex: null, i: null, j: null,
      compared: [], swapped: [], focus: [], depth: 0,
      code: "start", ...options
    });
  }

  function quickSort(low, high, depth = 0, isFirst = false) {
    if (low > high) return;
    if (low === high) {
      fixed.add(low);
      record("sorted", "One element is already sorted",
        `Position ${low} contains ${items[low].value}. A single value needs no comparisons or swaps.`,
        { active: [low, high], focus: [low], depth, code: "recurse" });
      return;
    }

    const pivotChoice = isFirst ? firstPivotIndex : high;
    record("range", `Partition indices ${low}–${high}`,
      `We are working only on this section. Our pivot is ${items[pivotChoice].value} at index ${pivotChoice}.`,
      { active: [low, high], pivotIndex: pivotChoice, depth, code: "start" });

    if (pivotChoice !== high) {
      const chosenValue = items[pivotChoice].value;
      exchange(pivotChoice, high);
      stats.swaps++;
      record("swap", "Move the pivot to the right edge",
        `Swap indices ${pivotChoice} and ${high}. The chosen pivot (${chosenValue}) is now at the right end, as required by Lomuto partitioning.`,
        { active: [low, high], pivotIndex: high, swapped: [pivotChoice, high], depth, code: "swap" });
    }

    const pivot = items[high].value;
    let i = low - 1;
    record("pivot", `Pivot = ${pivot}`,
      `Start with i = ${i}. Everything at indices ≤ i will belong to the “≤ pivot” side. We will scan the remaining elements with j.`,
      { active: [low, high], pivotIndex: high, i, depth, code: "setup" });

    for (let j = low; j < high; j++) {
      const value = items[j].value;
      stats.comparisons++;
      const passes = value <= pivot;
      record("compare", `Compare ${value} with pivot ${pivot}`,
        `${value} ≤ ${pivot} is ${passes ? "TRUE" : "FALSE"}. ${passes ? "Advance i and move this value to the left partition." : "Leave this value on the right side for now."}`,
        { active: [low, high], pivotIndex: high, i, j, compared: [j], depth, code: "test" });

      if (passes) {
        i++;
        if (i !== j) {
          const other = items[i].value;
          exchange(i, j);
          stats.swaps++;
          record("swap", `Swap ${value} with ${other}`,
            `${value} is ≤ ${pivot}, so increase i to ${i} and swap positions ${i} and ${j}. The left partition grows.`,
            { active: [low, high], pivotIndex: high, i, j, swapped: [i, j], depth, code: "swap" });
        } else {
          record("keep", `${value} stays where it is`,
            `i and j are both ${i}, so no swap is necessary. The left partition now includes this value.`,
            { active: [low, high], pivotIndex: high, i, j, focus: [j], depth, code: "swap" });
        }
      } else {
        record("keep", `${value} stays to the right`,
          `Because ${value} is greater than ${pivot}, i remains ${i}. Continue checking the next element.`,
          { active: [low, high], pivotIndex: high, i, j, focus: [j], depth, code: "compare" });
      }
    }

    const finalPosition = i + 1;
    if (finalPosition !== high) {
      const moved = items[finalPosition].value;
      exchange(finalPosition, high);
      stats.swaps++;
      record("swap", `Put pivot ${pivot} in its final position`,
        `Swap pivot ${pivot} with ${moved} at index ${finalPosition}. Smaller or equal values lie to its left; larger values lie to its right.`,
        { active: [low, high], pivotIndex: finalPosition, swapped: [finalPosition, high], i, depth, code: "lock" });
    }

    fixed.add(finalPosition);
    stats.partitions++;
    record("lock", `Pivot ${pivot} is now sorted!`,
      `Index ${finalPosition} is final. Quick Sort never moves this pivot again. Next, recursively partition the left and right sections.`,
      { active: [low, high], focus: [finalPosition], depth, code: "lock" });

    quickSort(low, finalPosition - 1, depth + 1);
    quickSort(finalPosition + 1, high, depth + 1);
  }

  quickSort(0, items.length - 1, 0, true);
  record("done", "Array fully sorted!",
    `The result is [${items.map((x) => x.value).join(", ")}]. Every pivot found its final position, and the recursive partitions are complete.`,
    { focus: items.map((_, index) => index), code: "recurse" });
  return snapshots;
}

function renderTiles(frame, animate = false) {
  const oldRects = new Map();
  if (animate) {
    els.track.querySelectorAll(".tile").forEach((tile) => {
      oldRects.set(tile.dataset.id, tile.getBoundingClientRect());
    });
  }

  const allNumbers = frame.items.map((item) => item.value);
  const min = Math.min(...allNumbers);
  const max = Math.max(...allNumbers);
  els.track.style.setProperty("--count", frame.items.length);
  els.track.innerHTML = frame.items.map((item, index) => {
    const isFixed = frame.fixed.includes(index) || frame.type === "done";
    const isPivot = frame.pivotIndex === index;
    const isSwapped = frame.swapped.includes(index);
    const isCompared = frame.compared.includes(index);
    const outside = frame.active !== null && (index < frame.active[0] || index > frame.active[1]);
    const role = isFixed ? "✓" : isPivot ? "PIVOT" : isSwapped ? "SWAP" : isCompared ? "COMPARE" : frame.i === index && frame.j === index ? "i, j" : frame.j === index ? "j" : frame.i === index ? "i" : "";
    const className = isFixed ? "sorted" : isSwapped ? "swap" : isPivot ? "pivot" : isCompared ? "compare" : outside ? "inactive" : "";
    const normalized = max === min ? .5 : (item.value - min) / (max - min);
    const height = Math.round(106 + 101 * normalized);
    return `<button type="button" class="tile ${className}" style="--bar-height:${height}px" data-id="${item.id}" data-index="${index}" aria-label="Value ${item.value}, index ${index}${role ? `, ${role}` : ""}"><span class="tile-role">${role || "&nbsp;"}</span><strong>${item.value}</strong><small>${index}</small></button>`;
  }).join("");

  if (animate && !reducedMotion) {
    for (const tile of els.track.querySelectorAll(".tile")) {
      const oldRect = oldRects.get(tile.dataset.id);
      if (!oldRect) continue;
      const newRect = tile.getBoundingClientRect();
      const dx = oldRect.left - newRect.left;
      const dy = oldRect.top - newRect.top;
      if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
        tile.animate([
          { transform: `translate(${dx}px, ${dy}px)`, zIndex: 10 },
          { transform: "translate(0, 0)", zIndex: 1 }
        ], { duration: 430, easing: "cubic-bezier(.2,.8,.25,1)" });
      }
    }
  }
}

function markCode(line) {
  document.querySelectorAll("[data-code]").forEach((item) => {
    item.classList.toggle("active", line === item.dataset.code);
  });
}

function renderReady() {
  renderTiles({items: values.map((value, id) => ({id, value})), fixed: [], type: "ready", pivotIndex: null, swapped: [], compared: [], active: null, i: null, j: null}, false);
  els.chip.textContent = "AWAITING PIVOT";
  els.hint.textContent = "Click any number to make it the first pivot.";
  els.range.textContent = "Active range: entire array";
  els.sorted.textContent = "0 sorted";
  els.eventLabel.textContent = "READY TO BEGIN";
  els.depth.textContent = "DEPTH 0";
  els.title.textContent = "Pick your first pivot";
  els.detail.textContent = "Click any numbered bar. The walkthrough will show comparisons, swaps, fixed pivots and recursive partitions. After selecting the pivot, click bars again or use Next move.";
  els.progress.textContent = "Step 0 of 0";
  els.scrub.max = "0"; els.scrub.value = "0"; els.scrub.disabled = true;
  els.comparisons.textContent = "0"; els.swaps.textContent = "0";
  els.partitions.textContent = "0"; els.fixed.textContent = "0";
  markCode(""); updateButtons();
}

function showStep(index, animate = true) {
  if (!frames.length) return;
  stepIndex = Math.max(0, Math.min(index, frames.length - 1));
  const frame = frames[stepIndex];
  renderTiles(frame, animate);
  els.eventLabel.textContent = frame.type.toUpperCase();
  els.chip.textContent = frame.type === "done" ? "COMPLETE" : `STEP ${stepIndex + 1}`;
  els.hint.textContent = frame.type === "done" ? "Done! Press Reset to try a new pivot." : "Click any bar to advance one move, or use the controls below.";
  els.depth.textContent = `DEPTH ${frame.depth}`;
  els.title.textContent = frame.title;
  els.detail.textContent = frame.detail;
  els.range.textContent = frame.active ? `Active range: indices ${frame.active[0]}–${frame.active[1]}` : "Active range: complete";
  els.sorted.textContent = `${frame.fixed.length} sorted`;
  els.comparisons.textContent = frame.stats.comparisons;
  els.swaps.textContent = frame.stats.swaps;
  els.partitions.textContent = frame.stats.partitions;
  els.fixed.textContent = frame.fixed.length;
  els.scrub.value = String(stepIndex);
  els.progress.textContent = `Step ${stepIndex + 1} of ${frames.length}`;
  markCode(frame.code);
  updateButtons();
}

function updateButtons() {
  const started = frames.length > 0;
  els.prev.disabled = !started || stepIndex <= 0;
  els.next.disabled = !started || stepIndex >= frames.length - 1;
  els.play.disabled = !started;
  els.play.textContent = playbackTimer === null ? "▶ Auto play" : "Ⅱ Pause";
}

function pause() {
  if (playbackTimer !== null) clearInterval(playbackTimer);
  playbackTimer = null;
  updateButtons();
}
function nextStep() {
  if (stepIndex < frames.length - 1) showStep(stepIndex + 1);
  else pause();
}
function startWithPivot(index) {
  pause();
  frames = buildTimeline(values, index);
  stepIndex = -1;
  els.scrub.disabled = false;
  els.scrub.max = String(frames.length - 1);
  showStep(0, false);
}
function reset() {
  pause();
  frames = []; stepIndex = -1;
  renderReady();
}
function loadNumbers(numbers) {
  values = numbers.slice();
  els.numbers.value = values.join(", ");
  els.error.hidden = true;
  reset();
}

els.track.addEventListener("click", (event) => {
  const tile = event.target.closest(".tile");
  if (!tile) return;
  if (!frames.length) startWithPivot(Number(tile.dataset.index));
  else nextStep();
});
els.next.addEventListener("click", nextStep);
els.prev.addEventListener("click", () => { pause(); showStep(stepIndex - 1); });
els.reset.addEventListener("click", reset);
els.scrub.addEventListener("input", () => { pause(); showStep(Number(els.scrub.value), false); });

function play() {
  if (!frames.length) return;
  if (playbackTimer !== null) { pause(); return; }
  if (stepIndex >= frames.length - 1) showStep(0, false);
  nextStep();
  playbackTimer = window.setInterval(() => {
    if (stepIndex >= frames.length - 1) pause();
    else nextStep();
  }, Number(els.speed.value));
  updateButtons();
}
els.play.addEventListener("click", play);
els.speed.addEventListener("input", () => {
  if (playbackTimer !== null) { pause(); play(); }
});

function applyNumbers() {
  const raw = els.numbers.value.trim();
  const parts = raw.split(/[\s,]+/).filter(Boolean);
  const valid = parts.length >= 4 && parts.length <= 12 &&
    parts.every((part) => /^-?\d+$/.test(part) && Number.isSafeInteger(Number(part)) && Number(part) >= -99 && Number(part) <= 999);
  if (!valid) {
    els.error.hidden = false;
    els.error.textContent = "Please enter 4–12 whole numbers (−99 to 999), separated by commas or spaces.";
    return;
  }
  loadNumbers(parts.map(Number));
}
els.apply.addEventListener("click", applyNumbers);
els.numbers.addEventListener("keydown", (event) => {
  if (event.key === "Enter") applyNumbers();
});
els.shuffle.addEventListener("click", () => {
  const shuffled = values.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  loadNumbers(shuffled);
});

// Easy browser-console check while developing (not required to use the app).
window.quickSortWalkthrough = { buildTimeline };
renderReady();
