# DSA Lab

A browser-based Java teaching companion for all 20 chapters of Jay Wengrow’s
*A Common-Sense Guide to Data Structures and Algorithms in Python, Volume 1*.
The app opens at Chapter 14, your current teaching chapter.

## Run locally

From this directory:

```sh
python3 serve.py
```

Open **http://localhost:5173**. Choose another port with `python3 serve.py --port 8080`.
There are no runtime packages, API keys, build steps, or external fonts to install.
Serve the app over HTTP; opening `index.html` directly does not support module imports
and resource fetching in normal browsers.

## Included

- All 20 chapters in book order, with original Java-focused theory, edge cases,
  learning challenges, book page references, and Java documentation links.
- 56 interactive examples across arrays, sets, searching, sorting, hashing,
  stacks, queues, recursion, dynamic programming, linked lists, binary search
  trees, heaps, tries, graphs, space complexity, and optimization.
- Editable inputs, presets, single stepping, previous step, play/pause, replay,
  reset, speed, and timeline scrubbing.
- Linked-list read-by-index, search, insertion, and deletion accept text and
  integers. Enter `Alice, Bob, Carol`, `10, 20, 30`, or mixed values; quote
  numeric text (`"12"`) and values containing commas (`"Last, First"`).
  Text comparisons are case-sensitive. Java examples use `Node<T>` and
  `Objects.equals` for value equality.
- **Load example** applies the entered inputs and restarts at step 1 with
  visible confirmation. **Next** executes one step; **Play** runs the timeline.
- Animated state changes, Java statement highlighting, variable values,
  operation counters, caches, call stacks, and results.
- Interactive growth graphs with selectable curves, input ranges, inspectable
  values, and linear/logarithmic vertical scales.
- Light/dark themes and chapter study progress saved on the current device.
- Searchable chapter/topic navigation, mobile drawer, keyboard controls,
  reduced-motion support, image enlargement, original Java/Markdown viewers.
- Your supplied illustrations, Java files, and Markdown notes,
  associated with their corresponding book chapters. Original lesson files
  are untouched. The supplied PDF is used as a reference and is not bundled.

## Add future lesson folders

The lesson folders and book chapters have separate numbering. For example,
`Lesson_16` maps to book Chapter 14. To add your next lesson:

1. Add your notes, `.java` files, and images in a `Lesson_*` folder beside
   `dsa-lab/`.
2. Add its book chapter to `chapter-map.json`, for example `"Lesson_17": 15`.
   Alternatively, put `Book chapter: 15` in a Markdown note. Folder names
   matching `Chapter_15` can also identify their chapter automatically.
3. Run:

   ```sh
   python3 scripts/sync_lessons.py
   ```

4. Refresh the app. The lesson resources appear under that chapter. Unmapped
   folders appear in Resources with an explanation of how to map them.

Chapters 15–20 already have theory and interactive examples. New lesson
resources supplement those chapters. The sync command copies resources into
`dist/assets/` and rebuilds `dist/lesson-assets.json`; it never edits the lessons.
Java source is displayed as text, never executed by the web server.

New algorithms need an explicit visualization module. Add one with `define()`
in an existing algorithm module or a new module imported by `app.js`, and add
its ID to the appropriate chapter’s `topics` in `dist/catalog.js`. A demo
provides its fields, defaults, Java implementation, complexity metadata, and
a generator that emits immutable snapshots with Java source matches. Unknown
Java code is not automatically interpreted or converted into an animation.

## Code organization

| File | Purpose |
| --- | --- |
| `dist/catalog.js` | Chapter order, expanded theory, teaching notes, references |
| `dist/algorithms.js` | Snapshot engine, arrays, searches, sorts |
| `dist/structures.js` | Hash tables, stacks/queues, lists, BSTs, heaps, tries |
| `dist/recursion.js` | Recursion, dynamic programming, space and optimization |
| `dist/graphs.js` | Editable graph model, DFS, BFS, Dijkstra |
| `dist/exercises.js` | Standalone exercises from your Java lesson files |
| `dist/app.js` | Navigation, validation, playback, preferences, resources |
| `dist/views.js` | Diagrams, Java highlighting, growth graph rendering |
| `dist/styles.css` | Themes, responsive layout, interface styles |
| `chapter-map.json` | Explicit lesson-folder to book-chapter mapping |

The app uses standard JavaScript modules and SVG/HTML diagrams, keeping the
player and content independent without requiring a framework or build tool.
`dist/` is both editable web source and the complete static deployment artifact.

## Validation

Node.js is only needed for development checks, not for using the app:

```sh
node tests/algorithms.test.js
```

These checks cover algorithm results and boundaries, immutable traces,
source locations, linked/tree/heap invariants, graph cases, growth charts,
and compilation of every Java example. Install a JDK (17+) for the compilation
check. Downloaded Java examples are compilable helper classes; call their
methods from your own `main` or JShell session.

For the browser checks, start the local app and a **temporary** Chrome profile:

```sh
google-chrome --headless --disable-gpu --remote-debugging-port=9222 \
  --user-data-dir=/tmp/dsa-lab-browser-check about:blank
node tests/browser.mjs
```

The browser script uses Node’s built-in WebSocket (Node 22+), needs no browser
test packages, and saves desktop/mobile screenshots to ignored `artifacts/`.
Close the temporary browser afterward. The test navigates only its temporary
page, checks all demos, and restores the study-progress toggle it exercises.

## Teaching conventions

The player simulates the displayed Java algorithm in the browser. It is not a
JVM debugger or a Java editor. One timeline frame is a meaningful statement,
condition, or illustrated return; setup and final-summary frames provide
context. Previous restores a saved snapshot rather than re-executing Java.

Counters have explicit labels: for example, binary search counts midpoint
probes, insertion sort counts key comparisons, and Dijkstra counts minimum-scan
candidate checks separately from successful relaxations. Graph curves are
theoretical models with illustrative constants, distinct from these counters.
Input limits keep the animations readable and prevent explosive recursive
examples from generating unmanageable timelines.

The hash-table demo uses seven buckets and a transparent integer hash; it
does not visualize Java HashMap internals. BSTs are deliberately unbalanced.
Heaps are max-heaps, whereas Java PriorityQueue defaults to a min-heap. Trie
examples use lowercase ASCII and TreeMap child links. Dijkstra uses the
displayed scan-based minimum selection, with an O(V² + E) bound. Java-specific
performance qualifications appear in theory and complexity notes.

## Hosting

Any static host can serve `dist/`. The Sites manifest is `.openai/hosting.json`;
the registered Site starts private. Static publication includes the generated
lesson resources, not the reference PDF. Source synchronization and deployment
use the Sites plugin workflow.

## Sources

The supplied book (P1.0, December 2023) determines the chapter sequence and
teaching scope. Explanations are written in original wording and adapted to
Java. Supplied book illustrations are credited to Jay Wengrow / The Pragmatic
Bookshelf in the interface. Java API references are linked under Resources.
