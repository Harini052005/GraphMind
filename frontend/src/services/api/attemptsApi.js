import { apiRequest, getActiveUserId } from './client'

const LOCAL_STORAGE_KEY = 'recallgraph_local_attempts'

function getLocalAttempts() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
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
