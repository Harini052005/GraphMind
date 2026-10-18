import { getUserAttemptsService } from './attempt.service.js'
import { DSA_PATTERNS, PREREQUISITE_EDGES } from '../graph/patternsData.js'

/**
 * Configurable scoring criteria constants
 */
export const SCORING_CRITERIA = {
  MIN_ATTEMPTS_FOR_EVALUATION: 2, // Avoid classifying weak from a single attempt
  WEAK_SUCCESS_RATE_THRESHOLD: 50, // Below 50% is weak/critical
  STABLE_SUCCESS_RATE_THRESHOLD: 70, // 70% or above is stable
  REPEATED_MISTAKE_THRESHOLD: 2, // 2 or more of the same mistake flags a cluster
  RECENCY_DECAY_DAYS: 7, // If > 7 days since last attempt, flag for revision
}

/**
 * Calculates days between an ISO timestamp and now.
 */
function getDaysSince(isoDateString) {
  if (!isoDateString) return null
  const then = new Date(isoDateString).getTime()
  const now = Date.now()
  const diffDays = Math.floor((now - then) / (1000 * 60 * 60 * 24))
  return Math.max(0, diffDays)
}

/**
 * Computes deterministic learning analytics and pattern mastery for a user.
 * 
 * @param {string} userId - User identifier
 */
export async function getAnalyticsService(userId = 'demo-user') {
  const attempts = await getUserAttemptsService(userId, { limit: 500 })

  const totalAttempted = attempts.length
  const totalSolved = attempts.filter((a) => a.result === 'Solved').length
  const totalFailed = attempts.filter((a) => a.result === 'Failed').length
  const totalIncomplete = attempts.filter((a) => a.result === 'Attempted').length
  const overallSuccessRate = totalAttempted > 0 ? Math.round((totalSolved / totalAttempted) * 100) : 0

  const totalPracticeTimeMinutes = attempts.reduce(
    (acc, a) => acc + (a.timeTakenMinutes || 0),
    0
  )

  const lastAttempt = attempts.length > 0 ? attempts[0] : null
  const lastPracticeSession = lastAttempt ? lastAttempt.createdAt : null
  const daysSinceLastSession = getDaysSince(lastPracticeSession)

  // Aggregate mistake clusters across all attempts
  const globalMistakeMap = {}
  for (const a of attempts) {
    if (a.mistakeCategory) {
      if (!globalMistakeMap[a.mistakeCategory]) {
        globalMistakeMap[a.mistakeCategory] = { count: 0, patterns: new Set() }
      }
      globalMistakeMap[a.mistakeCategory].count++
      if (a.patternId) {
        globalMistakeMap[a.mistakeCategory].patterns.add(a.patternId)
      }
    }
  }

  const repeatedMistakesLeaderboard = Object.entries(globalMistakeMap)
    .map(([category, info]) => ({
      category,
      count: info.count,
      affectedPatterns: Array.from(info.patterns),
    }))
    .sort((a, b) => b.count - a.count)

  // Pattern-level evaluation
  const patternMastery = DSA_PATTERNS.map((pattern) => {
    const patternAttempts = attempts.filter(
      (a) => a.patternId === pattern.id || a.patternName === pattern.name
    )

    const count = patternAttempts.length
    const solved = patternAttempts.filter((a) => a.result === 'Solved').length
    const failed = patternAttempts.filter((a) => a.result === 'Failed').length
    const attempted = patternAttempts.filter((a) => a.result === 'Attempted').length
    const successRate = count > 0 ? Math.round((solved / count) * 100) : 0

    const totalTime = patternAttempts.reduce((acc, a) => acc + (a.timeTakenMinutes || 0), 0)
    const avgTimeTaken = count > 0 ? Math.round(totalTime / count) : 0

    // Mistakes in this pattern
    const patternMistakeMap = {}
    patternAttempts.forEach((a) => {
      if (a.mistakeCategory) {
        patternMistakeMap[a.mistakeCategory] = (patternMistakeMap[a.mistakeCategory] || 0) + 1
      }
    })

    const patternMistakes = Object.entries(patternMistakeMap)
      .map(([category, mCount]) => ({ category, count: mCount }))
      .sort((a, b) => b.count - a.count)

    const lastPatternAttempt = patternAttempts.length > 0 ? patternAttempts[0] : null
    const daysSincePatternPractice = lastPatternAttempt
      ? getDaysSince(lastPatternAttempt.createdAt)
      : null

    // Deterministic rule-based evaluation
    let status = 'Unpracticed'
    let score = 0
    let evidence = 'No attempts recorded yet.'

    if (count === 0) {
      status = 'Unpracticed'
      score = 0
    } else if (count < SCORING_CRITERIA.MIN_ATTEMPTS_FOR_EVALUATION) {
      // Single attempt - provisional evaluation (prevents single-failure false flag)
      score = solved === 1 ? 7 : 4
      status = solved === 1 ? 'Stable' : 'Needs Revision'
      evidence = `Single provisional attempt recorded (${solved}/${count} solved). Needs further attempts for conclusive mastery.`
    } else {
      // 2 or more attempts - rigorous evaluation
      score = Math.round((solved / count) * 10)
      const hasRepeatedMistakes = patternMistakes.some(
        (m) => m.count >= SCORING_CRITERIA.REPEATED_MISTAKE_THRESHOLD
      )
      const isStale =
        daysSincePatternPractice !== null &&
        daysSincePatternPractice >= SCORING_CRITERIA.RECENCY_DECAY_DAYS

      if (successRate >= SCORING_CRITERIA.STABLE_SUCCESS_RATE_THRESHOLD && !hasRepeatedMistakes) {
        if (isStale) {
          status = 'Needs Revision'
          evidence = `Solid mastery (${successRate}%), but not practiced in ${daysSincePatternPractice} days. Quick revision recommended.`
        } else {
          status = 'Stable'
          evidence = `Consistently high success rate of ${successRate}% with 0 recurring mistake patterns.`
        }
      } else if (
        successRate < SCORING_CRITERIA.WEAK_SUCCESS_RATE_THRESHOLD ||
        hasRepeatedMistakes
      ) {
        status = 'Critical'
        const reasons = []
        if (successRate < SCORING_CRITERIA.WEAK_SUCCESS_RATE_THRESHOLD) {
          reasons.push(`low success rate of ${successRate}%`)
        }
        if (hasRepeatedMistakes) {
          const topM = patternMistakes.find(
            (m) => m.count >= SCORING_CRITERIA.REPEATED_MISTAKE_THRESHOLD
          )
          reasons.push(`recurring '${topM.category}' mistake (${topM.count}x)`)
        }
        evidence = `Classified as Critical Weak Pattern due to ${reasons.join(' and ')}.`
      } else {
        status = 'Needs Revision'
        evidence = `Moderate success rate of ${successRate}%. Review recommended before moving to downstream dependencies.`
      }
    }

    return {
      id: pattern.id,
      name: pattern.name,
      category: pattern.category,
      difficulty: pattern.difficulty,
      recommendedOrder: pattern.recommendedOrder,
      score,
      status,
      evidence,
      metrics: {
        totalAttempts: count,
        solvedCount: solved,
        failedCount: failed,
        attemptedCount: attempted,
        successRate,
        avgTimeTakenMinutes: avgTimeTaken,
        daysSinceLastAttempt: daysSincePatternPractice,
        repeatedMistakes: patternMistakes,
      },
    }
  })

  // Weak patterns requiring immediate revision
  const weakPatterns = patternMastery
    .filter((p) => p.status === 'Critical' || p.status === 'Needs Revision')
    .sort((a, b) => {
      if (a.status === 'Critical' && b.status !== 'Critical') return -1
      if (b.status === 'Critical' && a.status !== 'Critical') return 1
      return a.metrics.successRate - b.metrics.successRate
    })
    .map((p) => {
      // Find prerequisite dependencies that might be the root cause
      const incomingEdges = PREREQUISITE_EDGES.filter((e) => e.to === p.id)
      const rootCauseCandidates = incomingEdges.map((e) => {
        const fromPattern = patternMastery.find((pm) => pm.id === e.from)
        return {
          prerequisiteId: e.from,
          prerequisiteName: fromPattern ? fromPattern.name : e.from,
          relation: e.relation,
          prerequisiteStatus: fromPattern ? fromPattern.status : 'Unknown',
        }
      })

      return {
        patternId: p.id,
        patternName: p.name,
        status: p.status,
        score: p.score,
        successRate: p.metrics.successRate,
        evidence: p.evidence,
        topMistakes: p.metrics.repeatedMistakes.slice(0, 2),
        rootCauseCandidates,
        recommendedAction:
          p.status === 'Critical'
            ? `Pause new topics. Review foundational mechanics and solve 1 targeted ${p.name} problem.`
            : `Schedule a 20-minute refresher practice session to maintain mastery.`,
      }
    })

  return {
    overview: {
      totalAttempted,
      totalSolved,
      totalFailed,
      totalIncomplete,
      overallSuccessRate,
      totalPracticeTimeMinutes,
      lastPracticeSession,
      daysSinceLastSession,
      patternsPracticedCount: patternMastery.filter((p) => p.metrics.totalAttempts > 0).length,
      patternsMasteredCount: patternMastery.filter((p) => p.status === 'Stable').length,
      weakPatternsCount: weakPatterns.length,
    },
    weakPatterns,
    patternMastery,
    repeatedMistakesLeaderboard,
  }
}
