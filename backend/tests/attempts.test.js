import { describe, it, expect } from 'vitest'
import { createAttemptSchema } from '../src/validation/attempt.schema.js'
import { recordAttemptService, getUserAttemptsService } from '../src/services/attempt.service.js'

describe('Attempt Validation Schema', () => {
  it('should accept valid problem attempt input', () => {
    const validData = {
      problemTitle: '3Sum',
      leetcodeUrl: 'https://leetcode.com/problems/3sum/',
      difficulty: 'Medium',
      patternId: 'two-pointers',
      result: 'Failed',
      timeTakenMinutes: 35,
      mistakeCategory: 'Duplicate Handling',
      notes: 'Forgot to skip duplicate elements after finding a triplet.',
      codeSnippet: 'while (left < right && nums[left] === nums[left + 1]) left++;',
    }

    const result = createAttemptSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('should reject invalid difficulty or missing required fields', () => {
    const invalidData = {
      problemTitle: 'X', // too short (< 2 chars)
      difficulty: 'SuperHard', // invalid enum
      patternId: 'two-pointers',
      result: 'Solved',
      timeTakenMinutes: -5, // negative minutes
    }

    const result = createAttemptSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      const fields = result.error.issues.map((i) => i.path[0])
      expect(fields).toContain('problemTitle')
      expect(fields).toContain('difficulty')
      expect(fields).toContain('timeTakenMinutes')
    }
  })
})

describe('Attempt Persistence & Retrieval Service', () => {
  it('should record an attempt and retrieve it by user ID', async () => {
    const userId = `test-user-${Date.now()}`
    const payload = {
      problemTitle: 'Container With Most Water',
      leetcodeUrl: 'https://leetcode.com/problems/container-with-most-water/',
      difficulty: 'Medium',
      patternId: 'two-pointers',
      result: 'Solved',
      timeTakenMinutes: 20,
      mistakeCategory: '',
      notes: 'Greedy inward pointer movement based on shorter vertical line.',
    }

    const saved = await recordAttemptService(userId, payload)
    expect(saved).toHaveProperty('id')
    expect(saved.problemTitle).toBe('Container With Most Water')
    expect(saved.result).toBe('Solved')
    expect(saved.patternId).toBe('two-pointers')

    // Fetch user attempts
    const history = await getUserAttemptsService(userId)
    expect(history.length).toBeGreaterThanOrEqual(1)
    expect(history[0].problemTitle).toBe('Container With Most Water')
  })

  it('should strictly isolate attempts between different users', async () => {
    const userA = `user-a-${Date.now()}`
    const userB = `user-b-${Date.now()}`

    await recordAttemptService(userA, {
      problemTitle: 'Binary Tree Level Order Traversal',
      difficulty: 'Medium',
      patternId: 'tree-traversal',
      result: 'Solved',
      timeTakenMinutes: 15,
    })

    const userAAttempts = await getUserAttemptsService(userA)
    const userBAttempts = await getUserAttemptsService(userB)

    expect(userAAttempts.some((a) => a.problemTitle.includes('Level Order'))).toBe(true)
    expect(userBAttempts.length).toBe(0)
  })
})
