/**
 * Foundational Semantic DSA Patterns and their conceptual prerequisite dependencies.
 * Each pattern has an id, name, category, description, and difficulty recommendation.
 */
export const DSA_PATTERNS = [
  {
    id: 'arrays-hashing',
    name: 'Arrays & Hashing',
    category: 'Foundations',
    description: 'Hash maps, frequency counters, prefix sums, and basic contiguous memory traversal.',
    recommendedOrder: 1,
    difficulty: 'Easy',
  },
  {
    id: 'two-pointers',
    name: 'Two Pointers',
    category: 'Linear Structures',
    description: 'Converging or equidistant pointer navigation to eliminate nested iterations on sorted or paired data.',
    recommendedOrder: 2,
    difficulty: 'Easy-Medium',
  },
  {
    id: 'sliding-window',
    name: 'Sliding Window',
    category: 'Linear Structures',
    description: 'Dynamic or fixed-size contiguous subarray/substring tracking using expanding and contracting bounds.',
    recommendedOrder: 3,
    difficulty: 'Medium',
  },
  {
    id: 'binary-search',
    name: 'Binary Search',
    category: 'Searching',
    description: 'Logarithmic search space reduction on monotonic ranges or rotated sorted structures.',
    recommendedOrder: 4,
    difficulty: 'Medium',
  },
  {
    id: 'recursion-backtracking',
    name: 'Recursion & Backtracking',
    category: 'State Space Search',
    description: 'Call-stack state exploration, decision trees, permutations, combinations, and pruning dead ends.',
    recommendedOrder: 5,
    difficulty: 'Medium-Hard',
  },
  {
    id: 'tree-traversal',
    name: 'Tree Traversal (DFS/BFS)',
    category: 'Hierarchical Structures',
    description: 'Hierarchical node traversal using recursion (pre/in/post-order DFS) or queue-based level order (BFS).',
    recommendedOrder: 6,
    difficulty: 'Medium',
  },
  {
    id: 'graph-algorithms',
    name: 'Graph Algorithms',
    category: 'Non-Linear Structures',
    description: 'Topological sort, cycle detection, connected components, Dijkstra, and bipartite checks.',
    recommendedOrder: 7,
    difficulty: 'Medium-Hard',
  },
  {
    id: 'dynamic-programming',
    name: 'Dynamic Programming',
    category: 'Optimization',
    description: 'Overlapping subproblems and optimal substructure solved via memoization (top-down) or tabulation (bottom-up).',
    recommendedOrder: 8,
    difficulty: 'Hard',
  },
]

/**
 * Prerequisite dependency graph edges: (sourcePattern)-[:PREREQUISITE_FOR]->(targetPattern)
 * Aligned with both DSA pedagogy and the memory graph visual reference.
 */
export const PREREQUISITE_EDGES = [
  {
    from: 'arrays-hashing',
    to: 'two-pointers',
    relation: 'prerequisite',
    description: 'Element indexing and array bounds are prerequisites for dual-pointer convergence',
  },
  {
    from: 'two-pointers',
    to: 'sliding-window',
    relation: 'extends',
    description: 'Sliding window is an extension of fast/slow two pointer state tracking',
  },
  {
    from: 'arrays-hashing',
    to: 'binary-search',
    relation: 'prerequisite',
    description: 'Monotonic array ordering enables halving search space',
  },
  {
    from: 'recursion-backtracking',
    to: 'tree-traversal',
    relation: 'structural_basis',
    description: 'Call stack recursion mirrors tree hierarchy traversal',
  },
  {
    from: 'tree-traversal',
    to: 'graph-algorithms',
    relation: 'generalization',
    description: 'Graph traversal generalizes tree traversal with visited cycle tracking',
  },
  {
    from: 'recursion-backtracking',
    to: 'dynamic-programming',
    relation: 'recurrence_thinking',
    description: 'Dynamic programming memoizes repeated recursive subproblems',
  },
]
