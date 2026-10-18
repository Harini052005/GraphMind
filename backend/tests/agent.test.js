import { describe, it, expect } from 'vitest'
import { runAgentRecommendation, agentRecommendationSchema } from '../src/agent/orchestrator.js'
import { recordAttemptService } from '../src/services/attempt.service.js'

describe('AI Agent Recommendation Engine & Deterministic Fallback', () => {
  it('should recommend foundational topic for a new user with 0 attempts', async () => {
    const userId = `agent-new-user-${Date.now()}`
    const recommendation = await runAgentRecommendation(userId)

    expect(recommendation.decision).toBe('CONTINUE_NEW_TOPIC')
    expect(recommendation.targetPattern).toBe('arrays-hashing')
    expect(recommendation.mode).toBe('deterministic-fallback')

    const validated = agentRecommendationSchema.safeParse(recommendation)
    expect(validated.success).toBe(true)
  })

  it('should recommend targeted revision with procedural checklist when repeated mistakes exist', async () => {
    const userId = `agent-weak-user-${Date.now()}`

    // 2 failed Two Pointers attempts with Duplicate Handling
    await recordAttemptService(userId, {
      problemTitle: '3Sum',
      difficulty: 'Medium',
      patternId: 'two-pointers',
      result: 'Failed',
      timeTakenMinutes: 30,
      mistakeCategory: 'Duplicate Handling',
    })

    await recordAttemptService(userId, {
      problemTitle: '3Sum Closest',
      difficulty: 'Medium',
      patternId: 'two-pointers',
      result: 'Failed',
      timeTakenMinutes: 25,
      mistakeCategory: 'Duplicate Handling',
    })

    const recommendation = await runAgentRecommendation(userId)

    expect(recommendation.decision).toBe('REVISE_WEAK_PATTERN')
    expect(recommendation.targetPattern).toBe('two-pointers')
    expect(recommendation.reasoning).toContain('duplicate handling')
    expect(recommendation.evidence.some((e) => e.includes('Duplicate Handling'))).toBe(true)

    // Verify procedural checklist exists and contains duplicate handling steps
    expect(recommendation.actionableTask.proceduralChecklist.length).toBeGreaterThan(0)
    expect(
      recommendation.actionableTask.proceduralChecklist.some((item) =>
        item.toLowerCase().includes('duplicate')
      )
    ).toBe(true)

    // Verify it automatically created a revision task
    expect(recommendation.revisionTaskCreated).toBe(true)
  })
})
