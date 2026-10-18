import { Router } from 'express'
import { getAnalyticsHandler } from '../controllers/analytics.controller.js'

const router = Router()

// GET /api/analytics - Learning progress, pattern mastery, and repeated mistakes
router.get('/', getAnalyticsHandler)

export default router
