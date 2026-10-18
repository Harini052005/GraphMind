/**
 * Procedural Memory: Actionable checklists and cognitive debugging procedures
 * tailored to specific DSA patterns and recurring mistake categories.
 */
export const PROCEDURAL_CHECKLISTS = {
  'two-pointers': {
    general: [
      'Verify if array is sorted. If not, determine if sorting is allowed (O(n log n)).',
      'Choose pointer placement: converging (left=0, right=n-1) or parallel / fast-slow (slow=0, fast=0).',
      'Verify termination condition: while (left < right) vs while (left <= right) to avoid index overflow.',
      'Check pointer movement logic: Ensure at least one pointer strictly moves every iteration to avoid infinite loops.',
    ],
    'Duplicate Handling': [
      'Sort the array beforehand so identical elements are contiguous.',
      'After recording a valid answer, advance the pointer past all identical neighbors: while (left < right && nums[left] === nums[left + 1]) left++;',
      'Do the same for the right pointer if symmetrical: while (left < right && nums[right] === nums[right - 1]) right--;',
      'For outer loops (e.g. 3Sum), skip outer duplicate if (i > 0 && nums[i] === nums[i - 1]) continue;',
    ],
    'Pointer Bounds': [
      'Ensure index checks (e.g. left < right) precede array element lookups (nums[left]).',
      'Be cautious of off-by-one errors when right is initialized to n vs n - 1.',
    ],
  },
  'sliding-window': {
    general: [
      'Identify whether the window size is fixed (k elements) or dynamic (expand right, shrink left).',
      'Maintain window state hash map or counter inside the right-pointer expansion loop.',
      'Write a while loop to contract the left pointer as soon as window condition is violated.',
      'Update optimal result (max/min length or sum) at the correct position (before or after shrinking).',
    ],
  },
  'binary-search': {
    general: [
      'Determine the search boundary: left = 0, right = n - 1 (inclusive) vs right = n (exclusive).',
      'Calculate midpoint safely: mid = left + Math.floor((right - left) / 2) to prevent 32-bit integer overflow.',
      'Check boundary updates: left = mid + 1 and right = mid - 1 to guarantee progress.',
      'Confirm return value: mid on exact match vs left for insertion index.',
    ],
  },
  'recursion-backtracking': {
    general: [
      'State Definition: Clearly define what parameters each recursive frame holds.',
      'Base Case: Identify the exact termination condition where recursion MUST return.',
      'Choice & Constraints: Iterate through valid options and prune invalid branches early.',
      'Backtrack Step: Undo mutations to shared state (e.g. path.pop()) after the recursive call returns.',
    ],
    'Base Case Missing': [
      'Write base cases at the very top of the recursive function before any state modification.',
      'Verify that every recursive branch has a valid base case return to prevent Maximum Call Stack Exceeded.',
    ],
  },
  'tree-traversal': {
    general: [
      'Check base case: if (!node) return null / 0 / empty array.',
      'For BFS, record queue size before the level loop (const levelSize = queue.length) to separate levels.',
      'For DFS, decide pre-order, in-order, or post-order based on whether parent needs child results.',
    ],
  },
  'dynamic-programming': {
    general: [
      'Define DP state in plain words: dp[i] represents the answer for prefix of length i.',
      'Formulate recurrence relation: How does state i depend on state i-1, i-2, etc.?',
      'Initialize base cases (e.g. dp[0] = 1, dp[1] = ...).',
      'Check iteration direction (increasing vs decreasing) to avoid overwriting needed previous states.',
    ],
  },
}

/**
 * Returns a procedural checklist for a target pattern, enriched by any recurring mistake.
 */
export function getProceduralChecklist(patternId, mistakeCategory = null) {
  const patternRules = PROCEDURAL_CHECKLISTS[patternId] || {
    general: [
      'Read problem constraints carefully and estimate required time complexity.',
      'Trace example inputs by hand on paper before coding.',
      'Identify edge cases: empty array, single element, negative numbers, extreme values.',
      'Test solution step-by-step against example cases.',
    ],
  }

  const checklist = [...patternRules.general]

  if (mistakeCategory && patternRules[mistakeCategory]) {
    checklist.unshift(...patternRules[mistakeCategory])
  }

  return checklist
}
