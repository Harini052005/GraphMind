import { runAgentRecommendation } from '../agent/orchestrator.js'

/**
 * POST /api/agent/recommendation - Runs the AI Agent or Deterministic Fallback
 */
export async function getAgentRecommendationHandler(req, res, next) {
  try {
    const userId = req.headers['x-user-id'] || req.body?.userId || 'demo-user'
    const recommendation = await runAgentRecommendation(userId)
    res.json({
      success: true,
      data: recommendation,
    })
  } catch (error) {
    next(error)
  }
}
