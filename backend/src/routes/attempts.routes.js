import { Router } from 'express'
import { createAttemptHandler, getAttemptsHandler } from '../controllers/attempts.controller.js'

const router = Router()

// POST /api/attempts - Record a practice attempt
router.post('/', createAttemptHandler)

// GET /api/attempts - Retrieve user's attempts history
router.get('/', getAttemptsHandler)

export default router
