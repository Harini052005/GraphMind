import { Router } from 'express'
import {
  getRevisionsHandler,
  createRevisionHandler,
  updateRevisionStatusHandler,
} from '../controllers/revisions.controller.js'

const router = Router()

// GET /api/revisions - List revision tasks
router.get('/', getRevisionsHandler)

// POST /api/revisions - Create a revision task
router.post('/', createRevisionHandler)

// PATCH /api/revisions/:id - Update status (PENDING / COMPLETED / SKIPPED)
router.patch('/:id', updateRevisionStatusHandler)

export default router
