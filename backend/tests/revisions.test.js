import { describe, it, expect } from 'vitest'
import {
  createRevisionService,
  getRevisionsService,
  updateRevisionStatusService,
} from '../src/services/revision.service.js'

describe('Revision Tasks Management', () => {
  it('should create a revision task with procedural checklist and retrieve it', async () => {
    const userId = `rev-user-${Date.now()}`

    const task = await createRevisionService(userId, {
      patternId: 'sliding-window',
      reason: 'Low success rate in expanding/shrinking window logic',
      recommendation: 'Solve Longest Substring Without Repeating Characters',
      focusProblem: 'Longest Substring Without Repeating Characters',
    })

    expect(task).toHaveProperty('id')
    expect(task.status).toBe('PENDING')
    expect(task.checklist.length).toBeGreaterThan(0)

    const list = await getRevisionsService(userId)
    expect(list.length).toBe(1)
    expect(list[0].patternId).toBe('sliding-window')
  })

  it('should update revision task status to COMPLETED with reflection notes', async () => {
    const userId = `rev-complete-user-${Date.now()}`

    const task = await createRevisionService(userId, {
      patternId: 'binary-search',
      reason: 'Off-by-one errors in boundary condition',
      recommendation: 'Review left <= right template',
    })

    const updated = await updateRevisionStatusService(userId, task.id, {
      status: 'COMPLETED',
      reflectionNotes: 'Understood why left = mid + 1 is required to guarantee convergence.',
    })

    expect(updated.status).toBe('COMPLETED')
    expect(updated.reflectionNotes).toContain('convergence')
    expect(updated.completedAt).toBeDefined()
  })
})
