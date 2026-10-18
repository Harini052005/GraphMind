import { createAttemptSchema, getAttemptsQuerySchema } from '../validation/attempt.schema.js'
import { recordAttemptService, getUserAttemptsService } from '../services/attempt.service.js'

/**
 * POST /api/attempts - Record a new LeetCode problem attempt
 */
export async function createAttemptHandler(req, res, next) {
  try {
    const userId = req.headers['x-user-id'] || 'demo-user'

    // Validate body
    const parseResult = createAttemptSchema.safeParse(req.body)
    if (!parseResult.success) {
      return res.status(400).json({
        error: {
          message: 'Validation failed',
          issues: parseResult.error.issues.map((i) => ({
            field: i.path.join('.'),
            message: i.message,
          })),
        },
      })
    }

    const saved = await recordAttemptService(userId, parseResult.data)
    res.status(201).json({
      success: true,
      data: saved,
      message: 'Attempt successfully recorded in persistent graph memory',
    })
  } catch (error) {
    next(error)
  }
}

/**
 * GET /api/attempts - Retrieve user's practice history
 */
export async function getAttemptsHandler(req, res, next) {
  try {
    const userId = req.headers['x-user-id'] || 'demo-user'

    const parseQuery = getAttemptsQuerySchema.safeParse(req.query)
    const filters = parseQuery.success ? parseQuery.data : {}

    const attempts = await getUserAttemptsService(userId, filters)

    res.json({
      success: true,
      count: attempts.length,
      data: attempts,
    })
  } catch (error) {
    next(error)
  }
}
