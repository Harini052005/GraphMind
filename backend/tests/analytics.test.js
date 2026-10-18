import { describe, it, expect } from 'vitest'
import { getAnalyticsService } from '../src/services/analytics.service.js'
import { recordAttemptService } from '../src/services/attempt.service.js'

describe('Deterministic Analytics & Weak Pattern Scorer', () => {
  it('should return clean default stats for a fresh user with no practice history', async () => {
    const userId = `fresh-user-${Date.now()}`
    const result = await getAnalyticsService(userId)

    expect(result.overview.totalAttempted).toBe(0)
    expect(result.overview.totalSolved).toBe(0)
    expect(result.overview.overallSuccessRate).toBe(0)
    expect(result.weakPatterns).toHaveLength(0)
    expect(result.repeatedMistakesLeaderboard).toHaveLength(0)
  })

  it('should NOT classify a pattern as Critical from a single failure (insufficient evidence rule)', async () => {
    const userId = `single-failure-user-${Date.now()}`

    // Record only 1 single failure
    await recordAttemptService(userId, {
      problemTitle: 'Subsets',
      difficulty: 'Medium',
      patternId: 'recursion-backtracking',
      result: 'Failed',
      timeTakenMinutes: 30,
      mistakeCategory: 'Base Case Missing',
    })

    const result = await getAnalyticsService(userId)
    const recursion = result.patternMastery.find((p) => p.id === 'recursion-backtracking')

    expect(recursion).toBeDefined()
    // It should be 'Needs Revision' (provisional) but NOT 'Critical'
    expect(recursion.status).not.toBe('Critical')
    expect(recursion.evidence).toContain('provisional')
  })

  it('should classify a pattern as Critical when there are repeated mistakes or low success rate with sufficient evidence', async () => {
    const userId = `struggling-user-${Date.now()}`

    // Attempt 1: Failed on Two Pointers with Duplicate Handling
    await recordAttemptService(userId, {
      problemTitle: '3Sum',
      difficulty: 'Medium',
      patternId: 'two-pointers',
      result: 'Failed',
      timeTakenMinutes: 35,
      mistakeCategory: 'Duplicate Handling',
    })

    // Attempt 2: Failed on Two Pointers with Duplicate Handling again!
    await recordAttemptService(userId, {
      problemTitle: '4Sum',
      difficulty: 'Medium',
      patternId: 'two-pointers',
      result: 'Failed',
      timeTakenMinutes: 40,
      mistakeCategory: 'Duplicate Handling',
    })

    // Attempt 3: Solved
    await recordAttemptService(userId, {
      problemTitle: 'Two Sum II',
      difficulty: 'Medium',
      patternId: 'two-pointers',
      result: 'Solved',
      timeTakenMinutes: 15,
    })

    const result = await getAnalyticsService(userId)
    const twoPointers = result.patternMastery.find((p) => p.id === 'two-pointers')

    expect(twoPointers).toBeDefined()
    expect(twoPointers.status).toBe('Critical')
    expect(twoPointers.evidence).toContain("Duplicate Handling")

    // Check weak patterns list
    const weakItem = result.weakPatterns.find((p) => p.patternId === 'two-pointers')
    expect(weakItem).toBeDefined()
    expect(weakItem.status).toBe('Critical')

    // Check mistake leaderboard
    expect(result.repeatedMistakesLeaderboard.length).toBeGreaterThan(0)
    expect(result.repeatedMistakesLeaderboard[0].category).toBe('Duplicate Handling')
    expect(result.repeatedMistakesLeaderboard[0].count).toBe(2)
  })
})
