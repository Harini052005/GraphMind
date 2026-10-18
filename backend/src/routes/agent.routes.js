import { Router } from 'express'
import { getAgentRecommendationHandler } from '../controllers/agent.controller.js'

const router = Router()

// POST /api/agent/recommendation - Triggers AI agent or deterministic recommendation
router.post('/recommendation', getAgentRecommendationHandler)

export default router
