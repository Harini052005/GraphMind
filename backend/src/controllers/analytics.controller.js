import { getAnalyticsService } from '../services/analytics.service.js'

/**
 * GET /api/analytics - Computes learning analytics, weak patterns, and mistake clusters
 */
export async function getAnalyticsHandler(req, res, next) {
  try {
    const userId = req.headers['x-user-id'] || 'demo-user'
    const analytics = await getAnalyticsService(userId)
    res.json({
      success: true,
      data: analytics,
    })
  } catch (error) {
    next(error)
  }
}
