import { getUserAttemptsService } from '../services/attempt.service.js'
import { getAnalyticsService } from '../services/analytics.service.js'
import { createRevisionService } from '../services/revision.service.js'

/**
 * Graph Tools exposed to the AI Agent and Orchestrator.
 * Each tool fetches grounded evidence directly from FalkorDB / Graph Memory.
 */
export const agentTools = {
  /**
   * Retrieves chronological problem practice history for the user.
   */
  async getUserHistory({ userId, limit = 15 }) {
    return await getUserAttemptsService(userId, { limit })
  },

  /**
   * Retrieves pattern-level statistics, success rates, and weak pattern flags.
   */
  async getPatternStats({ userId }) {
    const analytics = await getAnalyticsService(userId)
    return {
      overview: analytics.overview,
      patternMastery: analytics.patternMastery,
      weakPatterns: analytics.weakPatterns,
    }
  },

  /**
   * Retrieves repeated mistake categories clustered by pattern.
   */
  async getRepeatedMistakes({ userId }) {
    const analytics = await getAnalyticsService(userId)
    return analytics.repeatedMistakesLeaderboard
  },

  /**
   * Commits a targeted revision task into the persistent graph.
   */
  async createRevisionTask({ userId, patternId, reason, recommendation, checklist, focusProblem }) {
    return await createRevisionService(userId, {
      patternId,
      reason,
      recommendation,
      checklist,
      focusProblem,
      source: 'agent',
    })
  },
}
