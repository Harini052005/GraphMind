import { apiRequest, getActiveUserId } from './client'

const LOCAL_STORAGE_KEY = 'recallgraph_local_attempts'

export const SEEDED_DEMO_ATTEMPTS = [
  // Arrays & Hashing (Stable - 4 attempts, 4 solved)
  {
    id: 'demo_att_01',
    problemTitle: 'Contains Duplicate',
    leetcodeUrl: 'https://leetcode.com/problems/contains-duplicate/',
    difficulty: 'Easy',
    patternId: 'arrays-hashing',
    result: 'Solved',
    timeTakenMinutes: 10,
    notes: 'Used HashSet for O(n) lookup.',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
  {
    id: 'demo_att_02',
    problemTitle: 'Valid Anagram',
    leetcodeUrl: 'https://leetcode.com/problems/valid-anagram/',
    difficulty: 'Easy',
    patternId: 'arrays-hashing',
    result: 'Solved',
    timeTakenMinutes: 12,
    notes: 'Fixed size frequency array of 26 letters.',
    createdAt: new Date(Date.now() - 3600000 * 44).toISOString(),
  },
  {
    id: 'demo_att_03',
    problemTitle: 'Two Sum',
    leetcodeUrl: 'https://leetcode.com/problems/two-sum/',
    difficulty: 'Easy',
    patternId: 'arrays-hashing',
    result: 'Solved',
    timeTakenMinutes: 8,
    notes: 'HashMap complement lookup in single pass.',
    createdAt: new Date(Date.now() - 3600000 * 40).toISOString(),
  },
  {
    id: 'demo_att_04',
    problemTitle: 'Group Anagrams',
    leetcodeUrl: 'https://leetcode.com/problems/group-anagrams/',
    difficulty: 'Medium',
    patternId: 'arrays-hashing',
    result: 'Solved',
    timeTakenMinutes: 22,
    notes: 'Sorted string as map key.',
    createdAt: new Date(Date.now() - 3600000 * 36).toISOString(),
  },

  // Two Pointers (Critical Weak - 4 attempts, 2 solved, 2 failed with REPEATED Duplicate Handling)
  {
    id: 'demo_att_05',
    problemTitle: 'Valid Palindrome',
    leetcodeUrl: 'https://leetcode.com/problems/valid-palindrome/',
    difficulty: 'Easy',
    patternId: 'two-pointers',
    result: 'Solved',
    timeTakenMinutes: 14,
    notes: 'Converging left and right pointers skipping non-alphanumeric.',
    createdAt: new Date(Date.now() - 3600000 * 30).toISOString(),
  },
  {
    id: 'demo_att_06',
    problemTitle: '3Sum',
    leetcodeUrl: 'https://leetcode.com/problems/3sum/',
    difficulty: 'Medium',
    patternId: 'two-pointers',
    result: 'Failed',
    timeTakenMinutes: 35,
    mistakeCategory: 'Duplicate Handling',
    notes: 'Generated duplicate triplets because I forgot while (left < right && nums[left] === nums[left + 1]) left++.',
    codeSnippet: '// Bug: Missing duplicate skip loop\nif (sum === 0) { res.push([nums[i], nums[l], nums[r]]); l++; r--; }',
    createdAt: new Date(Date.now() - 3600000 * 26).toISOString(),
  },
  {
    id: 'demo_att_07',
    problemTitle: '4Sum',
    leetcodeUrl: 'https://leetcode.com/problems/4sum/',
    difficulty: 'Medium',
    patternId: 'two-pointers',
    result: 'Failed',
    timeTakenMinutes: 40,
    mistakeCategory: 'Duplicate Handling',
    notes: 'Repeated the exact same duplicate issue in nested 2-pointer loop.',
    codeSnippet: 'while (l < r && nums[l] === nums[l - 1]) l++; // Erroneous index check',
    createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
  },
  {
    id: 'demo_att_08',
    problemTitle: 'Container With Most Water',
    leetcodeUrl: 'https://leetcode.com/problems/container-with-most-water/',
    difficulty: 'Medium',
    patternId: 'two-pointers',
    result: 'Solved',
    timeTakenMinutes: 20,
    notes: 'Greedy move pointer at shorter height inwards.',
    createdAt: new Date(Date.now() - 3600000 * 16).toISOString(),
  },

  // Binary Search (Stable - 2 attempts, 2 solved)
  {
    id: 'demo_att_09',
    problemTitle: 'Binary Search',
    leetcodeUrl: 'https://leetcode.com/problems/binary-search/',
    difficulty: 'Easy',
    patternId: 'binary-search',
    result: 'Solved',
    timeTakenMinutes: 7,
    notes: 'Standard left <= right template.',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: 'demo_att_10',
    problemTitle: 'Search in Rotated Sorted Array',
    leetcodeUrl: 'https://leetcode.com/problems/search-in-rotated-sorted-array/',
    difficulty: 'Medium',
    patternId: 'binary-search',
    result: 'Solved',
    timeTakenMinutes: 24,
    notes: 'Identified which half is sorted first.',
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
  },

  // Recursion & Backtracking (Needs Revision - 3 attempts, 2 solved, 1 failed)
  {
    id: 'demo_att_11',
    problemTitle: 'Generate Parentheses',
    leetcodeUrl: 'https://leetcode.com/problems/generate-parentheses/',
    difficulty: 'Medium',
    patternId: 'recursion-backtracking',
    result: 'Solved',
    timeTakenMinutes: 25,
    notes: 'Tracked open and close count.',
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
  },
  {
    id: 'demo_att_12',
    problemTitle: 'Subsets',
    leetcodeUrl: 'https://leetcode.com/problems/subsets/',
    difficulty: 'Medium',
    patternId: 'recursion-backtracking',
    result: 'Failed',
    timeTakenMinutes: 30,
    mistakeCategory: 'Base Case Missing',
    notes: 'Infinite call stack due to misplaced return statement.',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'demo_att_13',
    problemTitle: 'Combination Sum',
    leetcodeUrl: 'https://leetcode.com/problems/combination-sum/',
    difficulty: 'Medium',
    patternId: 'recursion-backtracking',
    result: 'Solved',
    timeTakenMinutes: 28,
    notes: 'Handled reuse of same element.',
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
  },
]

function getLocalAttempts() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (raw) return JSON.parse(raw)
    // If empty and default demo user, seed initial realistic attempts
    if (getActiveUserId() === 'demo-user') {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(SEEDED_DEMO_ATTEMPTS))
      return SEEDED_DEMO_ATTEMPTS
    }
    return []
  } catch {
    return []
  }
}

function saveLocalAttempt(attempt) {
  try {
    const current = getLocalAttempts()
    const updated = [attempt, ...current]
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated))
  } catch (err) {
    console.warn('Failed to save to localStorage fallback', err)
  }
}

export async function recordAttempt(payload) {
  try {
    const response = await apiRequest('/api/attempts', {
      method: 'POST',
      body: payload,
    })
    return response
  } catch (error) {
    console.warn('Backend unavailable for recording attempt, storing locally:', error.message)
    const mockAttempt = {
      id: `local_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      userId: getActiveUserId(),
      ...payload,
      createdAt: new Date().toISOString(),
      isLocalOffline: true,
    }
    saveLocalAttempt(mockAttempt)
    return {
      success: true,
      data: mockAttempt,
      message: 'Attempt saved locally (offline mode)',
    }
  }
}

export async function fetchUserAttempts(filters = {}) {
  const query = new URLSearchParams()
  if (filters.patternId) query.set('patternId', filters.patternId)
  if (filters.difficulty) query.set('difficulty', filters.difficulty)
  if (filters.result) query.set('result', filters.result)

  const queryString = query.toString() ? `?${query.toString()}` : ''

  try {
    const response = await apiRequest(`/api/attempts${queryString}`)
    return response.data || []
  } catch (error) {
    console.warn('Backend unavailable for fetching attempts, returning local data:', error.message)
    const local = getLocalAttempts()
    return local.filter((item) => {
      if (filters.patternId && item.patternId !== filters.patternId) return false
      if (filters.difficulty && item.difficulty !== filters.difficulty) return false
      if (filters.result && item.result !== filters.result) return false
      return true
    })
  }
}

export const DSA_PATTERNS = [
  { id: 'arrays-hashing', label: 'Arrays & Hashing' },
  { id: 'two-pointers', label: 'Two Pointers' },
  { id: 'sliding-window', label: 'Sliding Window' },
  { id: 'binary-search', label: 'Binary Search' },
  { id: 'recursion-backtracking', label: 'Recursion & Backtracking' },
  { id: 'tree-traversal', label: 'Tree Traversal' },
  { id: 'graph-algorithms', label: 'Graph Algorithms' },
  { id: 'dynamic-programming', label: 'Dynamic Programming' },
]

export const MISTAKE_CATEGORIES = [
  'Duplicate Handling',
  'Off-by-one',
  'Base Case Missing',
  'Pointer Bounds',
  'State Transition',
  'Time Limit Exceeded',
  'Memory Limit Exceeded',
  'Condition Inversion',
]
