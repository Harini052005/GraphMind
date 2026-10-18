import { apiRequest } from './client'

const LOCAL_STORAGE_REVISIONS_KEY = 'recallgraph_local_revisions'

function getLocalRevisions() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_REVISIONS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveLocalRevision(revision) {
  try {
    const current = getLocalRevisions()
    const updated = [revision, ...current]
    localStorage.setItem(LOCAL_STORAGE_REVISIONS_KEY, JSON.stringify(updated))
  } catch (err) {
    console.warn('Failed to save revision locally', err)
  }
}

export async function fetchAgentRecommendation() {
  try {
    const res = await apiRequest('/api/agent/recommendation', {
      method: 'POST',
      body: {},
    })
    return res.data
  } catch (error) {
    console.warn('Agent API unavailable, using resilient fallback', error.message)
    return MOCK_AGENT_RECOMMENDATION
  }
}

export async function fetchRevisions(status = null) {
  const query = status ? `?status=${status}` : ''
  try {
    const res = await apiRequest(`/api/revisions${query}`)
    return res.data || []
  } catch (error) {
    console.warn('Revisions API unavailable, using local store', error.message)
    const local = getLocalRevisions()
    if (!status) return local.length ? local : MOCK_REVISIONS
    return local.filter((r) => r.status === status)
  }
}

export async function createRevision(task) {
  try {
    const res = await apiRequest('/api/revisions', {
      method: 'POST',
      body: task,
    })
    return res.data
  } catch (error) {
    console.warn('Failed to persist revision to backend, saving locally', error.message)
    const localItem = {
      id: `rev_local_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      ...task,
      status: 'PENDING',
      source: 'agent',
      createdAt: new Date().toISOString(),
      completedAt: null,
      reflectionNotes: '',
    }
    saveLocalRevision(localItem)
    return localItem
  }
}

export async function completeRevision(revisionId, reflectionNotes = '') {
  try {
    return await apiRequest(`/api/revisions/${revisionId}`, {
      method: 'PATCH',
      body: { status: 'COMPLETED', reflectionNotes },
    })
  } catch (error) {
    console.warn('Backend update failed, updating locally', error.message)
    const current = getLocalRevisions()
    const updated = current.map((r) =>
      r.id === revisionId
        ? {
            ...r,
            status: 'COMPLETED',
            reflectionNotes,
            completedAt: new Date().toISOString(),
          }
        : r
    )
    localStorage.setItem(LOCAL_STORAGE_REVISIONS_KEY, JSON.stringify(updated))
    return { success: true }
  }
}

export const MOCK_AGENT_RECOMMENDATION = {
  decision: 'REVISE_WEAK_PATTERN',
  headline: 'Priority Revision: Strengthen Two Pointers',
  targetPattern: 'two-pointers',
  targetPatternName: 'Two Pointers',
  reasoning:
    'You had repeated duplicate-handling mistakes in Two Pointers problems (2 times). Review the pattern and solve one targeted problem before moving forward.',
  evidence: [
    'Two Pointers: 40% success rate across 5 attempts',
    "Repeated mistake 'Duplicate Handling' occurred 2 times in Two Pointers",
  ],
  actionableTask: {
    problemRecommendation:
      'Solve 1 targeted Medium problem in Two Pointers focusing on error prevention.',
    proceduralChecklist: [
      'Sort the array beforehand so identical elements are contiguous.',
      'After recording a valid answer, advance the pointer past all identical neighbors: while (left < right && nums[left] === nums[left + 1]) left++;',
      'For outer loops (e.g. 3Sum), skip outer duplicate if (i > 0 && nums[i] === nums[i - 1]) continue;',
      'Verify termination condition: while (left < right) vs while (left <= right) to avoid index overflow.',
    ],
  },
  revisionTaskCreated: true,
  mode: 'deterministic-fallback',
}

export const MOCK_REVISIONS = [
  {
    id: 'rev_sample_01',
    patternId: 'two-pointers',
    patternName: 'Two Pointers',
    reason: 'Repeated Duplicate Handling mistakes detected (40% accuracy)',
    recommendation: 'Master the duplicate-skipping while loop template for 3Sum',
    checklist: [
      'Sort the array beforehand',
      'Advance left pointer past duplicates: while (left < right && nums[left] === nums[left + 1]) left++',
      'Verify boundary conditions against array bounds',
    ],
    focusProblem: '3Sum & 4Sum duplicate avoidance',
    status: 'PENDING',
    source: 'agent',
    reflectionNotes: '',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    completedAt: null,
  },
  {
    id: 'rev_sample_02',
    patternId: 'recursion-backtracking',
    patternName: 'Recursion & Backtracking',
    reason: 'Base Case Missing misconception cluster',
    recommendation: 'Formalize base cases and decision branch pruning',
    checklist: [
      'Identify terminal depth / valid combination leaf',
      'Ensure state is popped after exploring recursive branch',
      'Write termination test cases first',
    ],
    focusProblem: 'Subsets & Permutations',
    status: 'COMPLETED',
    source: 'agent',
    reflectionNotes:
      'Understood that backtracking requires restoring visited set before function returns.',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    completedAt: new Date(Date.now() - 3600000 * 20).toISOString(),
  },
]
