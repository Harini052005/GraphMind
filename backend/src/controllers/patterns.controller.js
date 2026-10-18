import { getPatternsGraph } from '../graph/store.js'

/**
 * Controller to fetch the semantic DSA patterns graph with user-specific mastery states.
 */
export async function getPatternsHandler(req, res, next) {
  try {
    const userId = req.headers['x-user-id'] || 'demo-user'
    const graphData = await getPatternsGraph(userId)
    res.json(graphData)
  } catch (error) {
    next(error)
  }
}
