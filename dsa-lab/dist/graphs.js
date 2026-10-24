import { define } from './algorithms.js';

export function parseGraph(text, directed = false, start = 'A') {
  const edges = [], ids = new Set([start]);
  for (const part of text.split(',').map(x => x.trim()).filter(Boolean)) {
    const match = part.match(/^([A-H])-([A-H])(?::(\d{1,2}))?$/);
    if (!match) throw new Error('Use edges like A-B:4, A-C:2. Vertices: A–H; weights: 0–99.');
    const [, from, to, weight = '1'] = match;
    ids.add(from); ids.add(to);
    const existing = edges.find(e => e.from === from && e.to === to || !directed && e.from === to && e.to === from);
    if (existing) existing.weight = Number(weight);
    else edges.push({ from, to, weight: Number(weight), directed });
  }
  if (edges.length > 18) throw new Error('Use at most 18 edges for a readable diagram.');
  const vertices = [...ids].sort();
  const adjacency = Object.fromEntries(vertices.map(v => [v, []]));
  for (const edge of edges) { adjacency[edge.from].push({ to: edge.to, weight: edge.weight }); if (!directed && edge.from !== edge.to) adjacency[edge.to].push({ to: edge.from, weight: edge.weight }); }
  for (const list of Object.values(adjacency)) list.sort((a, b) => a.to.localeCompare(b.to));
  return { vertices, edges, adjacency };
}

const graphFields = [
  { key: 'edges', label: 'Edges', type: 'text', hint: 'A-B:4, A-C:2 · vertices A–H · weights 0–99' },
  { key: 'start', label: 'Start', type: 'select', options: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'] },
  { key: 'direction', label: 'Edge direction', type: 'select', options: ['undirected', 'directed'] }
];
const defaults = { edges: 'A-B:4, A-C:2, B-D:5, B-C:1, C-D:8, C-E:10, D-E:2, D-F:6, E-F:3', start: 'A', direction: 'undirected' };
const edgeJava = `record Edge(String to, int weight) {}`;

for (const bfs of [true, false]) define(bfs ? 'bfs' : 'dfs', bfs ? 'Breadth-first search' : 'Depth-first search', {
  kind: 'graph', fields: graphFields, defaults, space: 'O(V) visited & frontier', curves: ['linear'], counter: 'Edges examined',
  time: { best: 'O(V + E) full traversal', average: 'O(V + E)', worst: 'O(V + E)' }, complexityNote: 'Traversal ignores the displayed edge weights. BFS finds shortest paths by number of edges. A single-source run visits only the reachable component. The Java sample assumes expected O(1) hash-map/set operations.'
}, bfs ? `${edgeJava}
static List<String> bfs(Map<String, List<Edge>> graph, String start) {
  Set<String> visited = new HashSet<>();
  Deque<String> queue = new ArrayDeque<>();
  List<String> output = new ArrayList<>();
  visited.add(start);
  queue.addLast(start);
  while (!queue.isEmpty()) {
    String u = queue.removeFirst();
    output.add(u);
    for (Edge edge : graph.getOrDefault(u, List.of())) {
      if (visited.add(edge.to())) queue.addLast(edge.to());
    }
  }
  return output;
}` : `${edgeJava}
static void dfs(Map<String, List<Edge>> graph, String u,
                Set<String> visited, List<String> output) {
  visited.add(u);
  output.add(u);
  for (Edge edge : graph.getOrDefault(u, List.of())) {
    if (!visited.contains(edge.to())) {
      dfs(graph, edge.to(), visited, output);
    }
  }
}`, ({ state: s, emit }, p) => {
  const graph = parseGraph(p.edges, p.direction === 'directed', p.start);
  s.nodes = graph.vertices.map((id, i) => ({ id, label: id, x: 320 + 200 * Math.cos(i / graph.vertices.length * Math.PI * 2 - Math.PI / 2), y: 165 + 125 * Math.sin(i / graph.vertices.length * Math.PI * 2 - Math.PI / 2) }));
  s.edges = graph.edges; s.visitedNodes = []; s.frontier = []; s.calls = []; s.memory = [];
  const visited = new Set(), output = [];
  emit(bfs ? 'Set<String>' : 'static void dfs', bfs ? 'Prepare a queue' : 'Prepare depth-first traversal', `Start at ${p.start}. Neighbor lists use alphabetical order for a reproducible trace.`, { vars: { start: p.start, vertices: graph.vertices.length, edges: graph.edges.length } });
  if (bfs) {
    visited.add(p.start); s.frontier.push(p.start); emit('visited.add(start)', 'Discover the start vertex', 'Mark on enqueue so it cannot enter the queue twice.', { visitedNodes: [...visited], activeNodes: [p.start] });
    while (s.frontier.length) {
      const u = s.frontier.shift(); emit('String u =', `Dequeue ${u}`, 'The earliest discovered pending vertex is processed next.', { activeNodes: [u], activeEdges: [], vars: { current: u, 'queue size': s.frontier.length } }); output.push(u); emit('output.add(u)', `Visit ${u}`, 'Append it to the BFS order.', { memory: [...output] });
      for (const edge of graph.adjacency[u]) { const fresh = !visited.has(edge.to); if (fresh) { visited.add(edge.to); s.frontier.push(edge.to); } emit('if (visited.add(edge.to()))', `Inspect ${u} → ${edge.to}`, fresh ? 'First discovery: mark and enqueue this vertex.' : 'Already discovered: skip enqueuing it again.', { activeEdges: [[u, edge.to]], count: s.count + 1, visitedNodes: [...visited], activeNodes: [u, edge.to] }); }
    }
    emit('return output;', 'Breadth-first traversal complete', `Visit order: ${output.join(' → ')}.`, { result: output, activeNodes: [], activeEdges: [] });
  } else {
    const visit = u => { visited.add(u); s.calls.push({ label: `dfs(${u})` }); emit('visited.add(u)', `Discover ${u}`, 'Mark before entering its neighbors so cycles cannot recurse forever.', { visitedNodes: [...visited], activeNodes: [u], activeEdges: [], vars: { current: u, depth: s.calls.length } }); output.push(u); emit('output.add(u)', `Visit ${u}`, 'DFS goes deeper before returning to a sibling.', { memory: [...output] });
      for (const edge of graph.adjacency[u]) { emit('if (!visited.contains', `Inspect ${u} → ${edge.to}`, visited.has(edge.to) ? 'Already visited: skip this edge.' : 'An unvisited neighbor can be explored.', { count: s.count + 1, activeNodes: [u, edge.to], activeEdges: [[u, edge.to]] }); if (!visited.has(edge.to)) { emit('dfs(graph, edge.to()', 'Follow the branch', 'The current call waits for the child traversal.'); visit(edge.to); } }
      s.calls.pop(); emit('for (Edge edge', `Backtrack from ${u}`, 'Every neighbor of this vertex has been considered.', { activeNodes: [u], activeEdges: [] }); };
    visit(p.start); emit('for (Edge edge', 'Depth-first traversal complete', `Visit order: ${output.join(' → ')}.`, { result: output, activeNodes: [], activeEdges: [] });
  }
});

define('dijkstra', 'Dijkstra’s shortest paths', {
  kind: 'graph', fields: graphFields, defaults, space: 'O(V) auxiliary', curves: ['quadratic', 'linear'], counter: 'Minimum-scan comparisons', writeLabel: 'Relaxations',
  time: { best: 'O(V² + E) full scan', average: 'O(V² + E)', worst: 'O(V² + E)' }, complexityNote: 'This Java version selects the next vertex by scanning all vertices; it does not use a priority queue. V is the vertex count, E the adjacency entries. Only nonnegative weights are accepted. A binary-heap implementation has an O((V + E) log V) bound.'
}, `${edgeJava}
static Map<String, Long> dijkstra(Map<String, List<Edge>> graph, String start) {
  Map<String, Long> dist = new LinkedHashMap<>();
  Set<String> settled = new HashSet<>();
  for (String v : graph.keySet()) dist.put(v, Long.MAX_VALUE);
  dist.put(start, 0L);
  while (true) {
    String u = null;
    for (String v : graph.keySet()) {
      if (!settled.contains(v) && dist.get(v) != Long.MAX_VALUE
          && (u == null || dist.get(v) < dist.get(u))) u = v;
    }
    if (u == null) break;
    settled.add(u);
    for (Edge edge : graph.get(u)) {
      long candidate = dist.get(u) + edge.weight();
      if (candidate < dist.get(edge.to())) {
        dist.put(edge.to(), candidate);
      }
    }
  }
  return dist;
}`, ({ state: s, emit }, p) => {
  const graph = parseGraph(p.edges, p.direction === 'directed', p.start);
  s.nodes = graph.vertices.map((id, i) => ({ id, label: id, x: 320 + 200 * Math.cos(i / graph.vertices.length * Math.PI * 2 - Math.PI / 2), y: 165 + 125 * Math.sin(i / graph.vertices.length * Math.PI * 2 - Math.PI / 2) })); s.edges = graph.edges;
  const dist = Object.fromEntries(graph.vertices.map(v => [v, Infinity])), settled = new Set();
  const update = () => { s.nodes.forEach(n => n.sub = 'd = ' + (Number.isFinite(dist[n.id]) ? dist[n.id] : '∞')); s.memory = graph.vertices.map(v => `${v}: ${Number.isFinite(dist[v]) ? dist[v] : '∞'}`); s.visitedNodes = [...settled]; };
  update(); emit('for (String v', 'Initialize distances', 'No route is known yet: all distances begin at infinity.'); dist[p.start] = 0; update(); emit('dist.put(start', 'The source is zero distance away', `Start at ${p.start}.`, { activeNodes: [p.start], vars: { source: p.start } });
  while (true) {
    let u = null;
    for (const v of graph.vertices) { if (!settled.has(v) && Number.isFinite(dist[v]) && (u === null || dist[v] < dist[u])) u = v; emit('if (!settled.contains', 'Scan for the nearest unsettled vertex', `Candidate ${v}; smallest reachable candidate so far: ${u ?? 'none'}.`, { count: s.count + 1, activeNodes: [v], activeEdges: [], vars: { scan: v, selected: u ?? 'none' } }); }
    if (u === null) { emit('if (u == null)', 'No reachable unsettled vertex remains', 'Unreachable vertices keep infinite distance.'); break; }
    settled.add(u); update(); emit('settled.add(u)', `Settle ${u} at distance ${dist[u]}`, 'Nonnegative edge weights make this shortest distance final.', { activeNodes: [u], vars: { current: u, distance: dist[u] } });
    for (const edge of graph.adjacency[u]) { const candidate = dist[u] + edge.weight; emit('long candidate', `Try ${u} → ${edge.to}`, `${dist[u]} + ${edge.weight} = ${candidate}.`, { activeNodes: [u, edge.to], activeEdges: [[u, edge.to]], vars: { from: u, to: edge.to, candidate, known: Number.isFinite(dist[edge.to]) ? dist[edge.to] : '∞' } }); emit('if (candidate <', 'Is the route shorter?', candidate < dist[edge.to] ? 'Yes. Improve the tentative distance.' : 'No. Keep the current distance.'); if (candidate < dist[edge.to]) { dist[edge.to] = candidate; update(); emit('dist.put(edge.to()', 'Relax the edge', `The best known distance to ${edge.to} is now ${candidate}.`, { writes: s.writes + 1 }); } }
  }
  update(); emit('return dist;', 'Shortest distances complete', 'Distances refer to the selected source, not to the number of edges.', { result: Object.fromEntries(graph.vertices.map(v => [v, Number.isFinite(dist[v]) ? dist[v] : '∞'])), activeNodes: [], activeEdges: [] });
});
