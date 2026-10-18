import { apiRequest } from './client'

/**
 * Fetches learning analytics, weak patterns, and mistake clusters from Backend Phase 4.
 * Gracefully falls back to MOCK_ANALYTICS_DATA if server is offline or in mock mode.
 */
export async function fetchAnalytics() {
  try {
    const res = await apiRequest('/api/analytics')
    return res.data || res
  } catch (error) {
    console.warn('Analytics API unavailable, using fallback mock data', error)
    return MOCK_ANALYTICS_DATA
  }
}

export const MOCK_ANALYTICS_DATA = {
  overview: {
    totalAttempted: 12,
    totalSolved: 7,
    totalFailed: 4,
    totalIncomplete: 1,
    overallSuccessRate: 58,
    totalPracticeTimeMinutes: 310,
    lastPracticeSession: new Date().toISOString(),
    daysSinceLastSession: 0,
    patternsPracticedCount: 4,
    patternsMasteredCount: 1,
    weakPatternsCount: 2,
  },
  weakPatterns: [
    {
      patternId: 'two-pointers',
      patternName: 'Two Pointers',
      category: 'Linear Structures',
      status: 'Critical',
      score: 4,
      successRate: 40,
      evidence: "Classified as Critical Weak Pattern due to low success rate of 40% and recurring 'Duplicate Handling' mistake (2x).",
      topMistakes: [
        { category: 'Duplicate Handling', count: 2 },
      ],
      rootCauseCandidates: [
        {
          prerequisiteId: 'arrays-hashing',
          prerequisiteName: 'Arrays & Hashing',
          relation: 'prerequisite',
          prerequisiteStatus: 'Stable',
        },
      ],
      recommendedAction: 'Pause new topics. Review foundational mechanics and solve 1 targeted Two Pointers problem.',
    },
    {
      patternId: 'recursion-backtracking',
      patternName: 'Recursion & Backtracking',
      category: 'State Space Search',
      status: 'Needs Revision',
      score: 5,
      successRate: 50,
      evidence: "Success rate below threshold (50%) and repeated 'Base Case Missing' mistake cluster (2x).",
      topMistakes: [
        { category: 'Base Case Missing', count: 2 },
      ],
      rootCauseCandidates: [],
      recommendedAction: 'Practice base case bounding and stack frame tracing before advancing to Dynamic Programming.',
    },
  ],
  patternMastery: [
    {
      id: 'arrays-hashing',
      name: 'Arrays & Hashing',
      category: 'Foundations',
      score: 8,
      status: 'Stable',
      evidence: 'Consistently high success rate of 83% with 0 recurring mistake patterns.',
      metrics: {
        totalAttempts: 6,
        solvedCount: 5,
        failedCount: 0,
        attemptedCount: 1,
        successRate: 83,
        avgTimeTakenMinutes: 18,
        daysSinceLastAttempt: 1,
        repeatedMistakes: [],
      },
    },
    {
      id: 'two-pointers',
      name: 'Two Pointers',
      category: 'Linear Structures',
      score: 4,
      status: 'Critical',
      evidence: 'Low success rate of 40% and recurring Duplicate Handling mistake.',
      metrics: {
        totalAttempts: 5,
        solvedCount: 2,
        failedCount: 3,
        attemptedCount: 0,
        successRate: 40,
        avgTimeTakenMinutes: 28,
        daysSinceLastAttempt: 0,
        repeatedMistakes: [{ category: 'Duplicate Handling', count: 2 }],
      },
    },
    {
      id: 'binary-search',
      name: 'Binary Search',
      category: 'Searching',
      score: 7,
      status: 'Stable',
      evidence: 'Solid performance with 75% success rate on logarithmic search ranges.',
      metrics: {
        totalAttempts: 4,
        solvedCount: 3,
        failedCount: 0,
        attemptedCount: 1,
        successRate: 75,
        avgTimeTakenMinutes: 22,
        daysSinceLastAttempt: 2,
        repeatedMistakes: [],
      },
    },
    {
      id: 'recursion-backtracking',
      name: 'Recursion & Backtracking',
      category: 'State Space Search',
      score: 5,
      status: 'Needs Revision',
      evidence: '50% success rate with repeated base case omission.',
      metrics: {
        totalAttempts: 4,
        solvedCount: 2,
        failedCount: 2,
        attemptedCount: 0,
        successRate: 50,
        avgTimeTakenMinutes: 35,
        daysSinceLastAttempt: 1,
        repeatedMistakes: [{ category: 'Base Case Missing', count: 2 }],
      },
    },
    {
      id: 'sliding-window',
      name: 'Sliding Window',
      category: 'Linear Structures',
      score: 0,
      status: 'Unpracticed',
      evidence: 'No recorded attempts yet.',
      metrics: {
        totalAttempts: 0,
        solvedCount: 0,
        failedCount: 0,
        attemptedCount: 0,
        successRate: 0,
        avgTimeTakenMinutes: 0,
        daysSinceLastAttempt: null,
        repeatedMistakes: [],
      },
    },
    {
      id: 'dynamic-programming',
      name: 'Dynamic Programming',
      category: 'Optimization',
      score: 2,
      status: 'Critical',
      evidence: 'Unresolved state transition mistakes.',
      metrics: {
        totalAttempts: 3,
        solvedCount: 0,
        failedCount: 3,
        attemptedCount: 0,
        successRate: 0,
        avgTimeTakenMinutes: 45,
        daysSinceLastAttempt: 3,
        repeatedMistakes: [{ category: 'State Transition', count: 2 }],
      },
    },
  ],
  repeatedMistakesLeaderboard: [
    {
      category: 'Duplicate Handling',
      count: 2,
      affectedPatterns: ['two-pointers'],
    },
    {
      category: 'Base Case Missing',
      count: 2,
      affectedPatterns: ['recursion-backtracking'],
    },
    {
      category: 'State Transition',
      count: 2,
      affectedPatterns: ['dynamic-programming'],
    },
    {
      category: 'Off-by-one',
      count: 1,
      affectedPatterns: ['binary-search'],
    },
  ],
}
