import { Router } from 'express'
import { getPatternsHandler } from '../controllers/patterns.controller.js'

const router = Router()

// GET /api/patterns - Retrieves semantic pattern nodes, prerequisite edges, and mastery scores
router.get('/', getPatternsHandler)

export default router
