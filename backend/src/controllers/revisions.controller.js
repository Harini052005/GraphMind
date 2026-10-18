import {
  getRevisionsService,
  createRevisionService,
  updateRevisionStatusService,
} from '../services/revision.service.js'

/**
 * GET /api/revisions - Retrieves user's revision tasks
 */
export async function getRevisionsHandler(req, res, next) {
  try {
    const userId = req.headers['x-user-id'] || 'demo-user'
    const status = req.query.status
    const revisions = await getRevisionsService(userId, { status })
    res.json({
      success: true,
      count: revisions.length,
      data: revisions,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * POST /api/revisions - Creates a revision task manually or via agent
 */
export async function createRevisionHandler(req, res, next) {
  try {
    const userId = req.headers['x-user-id'] || 'demo-user'
    const { patternId, reason, recommendation, checklist, focusProblem } = req.body

    if (!patternId || !recommendation) {
      return res.status(400).json({
        error: { message: 'patternId and recommendation are required' },
      })
    }

    const created = await createRevisionService(userId, {
      patternId,
      reason: reason || 'Manual revision request',
      recommendation,
      checklist,
      focusProblem,
      source: 'manual',
    })

    res.status(201).json({
      success: true,
      data: created,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * PATCH /api/revisions/:id - Update revision task status (e.g. mark COMPLETED)
 */
export async function updateRevisionStatusHandler(req, res, next) {
  try {
    const userId = req.headers['x-user-id'] || 'demo-user'
    const revisionId = req.params.id
    const { status, reflectionNotes } = req.body

    const updated = await updateRevisionStatusService(userId, revisionId, {
      status,
      reflectionNotes,
    })

    if (!updated) {
      return res.status(404).json({
        error: { message: `Revision task ${revisionId} not found` },
      })
    }

    res.json({
      success: true,
      data: updated,
      message: 'Revision task status updated successfully',
    })
  } catch (error) {
    next(error)
  }
}
