import { z } from 'zod'
import { config } from '../config/index.js'
import { agentTools } from './tools.js'
import { getProceduralChecklist } from '../services/checklist.service.js'
import { DSA_PATTERNS } from '../graph/patternsData.js'

export const agentRecommendationSchema = z.object({
  decision: z.enum(['REVISE_WEAK_PATTERN', 'CONTINUE_NEW_TOPIC', 'MAINTAIN_STABLE']),
  headline: z.string(),
  targetPattern: z.string().nullable(),
  targetPatternName: z.string().nullable(),
  reasoning: z.string(),
  evidence: z.array(z.string()),
  actionableTask: z.object({
    problemRecommendation: z.string(),
    proceduralChecklist: z.array(z.string()),
  }),
  revisionTaskCreated: z.boolean(),
  mode: z.enum(['llm-grounded', 'deterministic-fallback']),
})

/**
 * Generates an explainable, deterministic recommendation grounded in graph memory.
 * Ensures the system operates 100% reliably even without an external LLM key.
 */
export async function generateDeterministicRecommendation(userId) {
  const stats = await agentTools.getPatternStats({ userId })
  const history = await agentTools.getUserHistory({ userId, limit: 10 })
  const mistakes = await agentTools.getRepeatedMistakes({ userId })

  const { overview, weakPatterns, patternMastery } = stats

  // Case 1: Brand new user with 0 attempts
  if (overview.totalAttempted === 0) {
    const firstPattern = DSA_PATTERNS[0]
    return {
      decision: 'CONTINUE_NEW_TOPIC',
      headline: `Start your mastery journey with ${firstPattern.name}`,
      targetPattern: firstPattern.id,
      targetPatternName: firstPattern.name,
      reasoning: 'No previous attempts found in graph memory. Begin with foundational memory navigation and frequency hashing.',
      evidence: ['0 attempts recorded in database'],
      actionableTask: {
        problemRecommendation: 'Solve 1 Easy warm-up problem: "Two Sum" or "Contains Duplicate".',
        proceduralChecklist: getProceduralChecklist(firstPattern.id),
      },
      revisionTaskCreated: false,
      mode: 'deterministic-fallback',
    }
  }

  // Case 2: Critical Weak Patterns or Repeated Mistakes Detected
  if (weakPatterns.length > 0) {
    const topWeak = weakPatterns[0]
    const topMistake = topWeak.topMistakes && topWeak.topMistakes.length > 0 ? topWeak.topMistakes[0] : null

    let headline = `Priority Revision: Strengthen ${topWeak.patternName}`
    let reasoning = ''
    const evidence = [
      `${topWeak.patternName}: ${topWeak.successRate}% success rate across ${topWeak.evidence}`,
    ]

    if (topMistake) {
      reasoning = `You had repeated ${topMistake.category.toLowerCase()} mistakes in ${topWeak.patternName} problems (${topMistake.count} times). Review the pattern and solve one targeted problem before moving forward.`
      evidence.push(`Repeated mistake '${topMistake.category}' occurred ${topMistake.count} times in ${topWeak.patternName}`)
    } else {
      reasoning = `Your current success rate in ${topWeak.patternName} is ${topWeak.successRate}%. Grounding this pattern before advancing will prevent downstream confusion.`
    }

    if (overview.daysSinceLastSession !== null && overview.daysSinceLastSession >= 3) {
      evidence.push(`It has been ${overview.daysSinceLastSession} days since your last practice session`)
    }

    const checklist = getProceduralChecklist(topWeak.patternId, topMistake?.category)

    // Automatically commit this revision task to persistent graph memory
    let revisionCreated = false
    try {
      await agentTools.createRevisionTask({
        userId,
        patternId: topWeak.patternId,
        reason: topWeak.evidence,
        recommendation: reasoning,
        checklist,
        focusProblem: `Targeted ${topWeak.patternName} refresher problem`,
      })
      revisionCreated = true
    } catch (e) {
      console.warn('[Agent] Note on revision persistence:', e.message)
    }

    return {
      decision: 'REVISE_WEAK_PATTERN',
      headline,
      targetPattern: topWeak.patternId,
      targetPatternName: topWeak.patternName,
      reasoning,
      evidence,
      actionableTask: {
        problemRecommendation: `Solve 1 targeted Medium problem in ${topWeak.patternName} focusing on error prevention.`,
        proceduralChecklist: checklist,
      },
      revisionTaskCreated: revisionCreated,
      mode: 'deterministic-fallback',
    }
  }

  // Case 3: All practiced patterns are Stable - Recommend Next Prerequisite Topic
  const unpracticed = patternMastery.filter((p) => p.metrics.totalAttempts === 0)
  if (unpracticed.length > 0) {
    const nextTopic = unpracticed[0]
    return {
      decision: 'CONTINUE_NEW_TOPIC',
      headline: `Ready to unlock: ${nextTopic.name}`,
      targetPattern: nextTopic.id,
      targetPatternName: nextTopic.name,
      reasoning: `All previous patterns are in a Stable state. You have built sufficient conceptual foundations to advance to ${nextTopic.name}.`,
      evidence: [
        `Overall success rate: ${overview.overallSuccessRate}%`,
        `Stable patterns: ${overview.patternsMasteredCount}`,
        `0 active misconception clusters`,
      ],
      actionableTask: {
        problemRecommendation: `Attempt 1 introductory problem in ${nextTopic.name}.`,
        proceduralChecklist: getProceduralChecklist(nextTopic.id),
      },
      revisionTaskCreated: false,
      mode: 'deterministic-fallback',
    }
  }

  // Case 4: Complete Mastery Maintenance
  return {
    decision: 'MAINTAIN_STABLE',
    headline: 'Maintain Mastery & Speed Practice',
    targetPattern: null,
    targetPatternName: null,
    reasoning: 'You have practiced all fundamental patterns with no critical weakness flags. Practice speed challenges or mixed contests.',
    evidence: [`Total problems solved: ${overview.totalSolved} / ${overview.totalAttempted}`],
    actionableTask: {
      problemRecommendation: 'Pick a random LeetCode Daily Challenge or timed mock test.',
      proceduralChecklist: ['Read carefully', 'Write invariants', 'Analyze complexities'],
    },
    revisionTaskCreated: false,
    mode: 'deterministic-fallback',
  }
}

/**
 * AI Agent Main Orchestrator:
 * Executes graph tools -> Calls LLM with grounded evidence -> Validates schema -> Stores revision task.
 * Automatically falls back to deterministic engine if API key is not configured or network fails.
 */
export async function runAgentRecommendation(userId = 'demo-user') {
  if (!config.llm.apiKey) {
    return await generateDeterministicRecommendation(userId)
  }

  try {
    // 1. Tool execution to retrieve ground-truth facts
    const stats = await agentTools.getPatternStats({ userId })
    const history = await agentTools.getUserHistory({ userId, limit: 10 })
    const mistakes = await agentTools.getRepeatedMistakes({ userId })

    // 2. Prepare structured LLM prompt
    const systemPrompt = `You are an expert DSA Pattern Mastery AI Agent.
You are given actual, verified graph memory records for a student.
STRICT RULES:
1. You MUST NOT invent user history, submission results, or database records.
2. Every claim in 'reasoning' and 'evidence' MUST be strictly grounded in the retrieved facts provided below.
3. If repeated mistakes exist, highlight them and explain how to avoid them using the procedural checklist.
4. Output MUST be valid JSON adhering strictly to the required schema.`

    const userPrompt = `Retrieved Graph Memory:
Overview: ${JSON.stringify(stats.overview)}
Weak Patterns: ${JSON.stringify(stats.weakPatterns)}
Repeated Mistakes: ${JSON.stringify(mistakes)}
Recent Attempts: ${JSON.stringify(history.slice(0, 5))}

Return a JSON object with this exact shape:
{
  "decision": "REVISE_WEAK_PATTERN" | "CONTINUE_NEW_TOPIC" | "MAINTAIN_STABLE",
  "headline": "string",
  "targetPattern": "string pattern id or null",
  "targetPatternName": "string pattern name or null",
  "reasoning": "string with grounded explanation",
  "evidence": ["list of factual evidence strings citing numbers from memory"],
  "actionableTask": {
    "problemRecommendation": "string problem suggestion",
    "proceduralChecklist": ["step 1", "step 2", "step 3"]
  }
}`

    const response = await fetch(`${config.llm.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.llm.apiKey}`,
      },
      body: JSON.stringify({
        model: config.llm.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.2,
        response_format: { type: 'json_object' },
      }),
    })

    if (!response.ok) {
      console.warn(`[Agent] LLM API returned ${response.status}. Falling back to deterministic engine.`)
      return await generateDeterministicRecommendation(userId)
    }

    const json = await response.json()
    const content = json.choices?.[0]?.message?.content
    const parsed = JSON.parse(content)

    // Validate with Zod
    const validated = agentRecommendationSchema.safeParse({
      ...parsed,
      revisionTaskCreated: false,
      mode: 'llm-grounded',
    })

    if (!validated.success) {
      console.warn('[Agent] LLM output failed schema validation. Falling back.', validated.error)
      return await generateDeterministicRecommendation(userId)
    }

    // Persist revision if decision is REVISE_WEAK_PATTERN
    if (validated.data.decision === 'REVISE_WEAK_PATTERN' && validated.data.targetPattern) {
      try {
        await agentTools.createRevisionTask({
          userId,
          patternId: validated.data.targetPattern,
          reason: validated.data.evidence.join('; '),
          recommendation: validated.data.reasoning,
          checklist: validated.data.actionableTask.proceduralChecklist,
          focusProblem: validated.data.actionableTask.problemRecommendation,
        })
        validated.data.revisionTaskCreated = true
      } catch (err) {
        console.warn('[Agent] Error saving LLM revision task:', err.message)
      }
    }

    return validated.data
  } catch (err) {
    console.warn(`[Agent] Exception in LLM execution: ${err.message}. Using deterministic fallback.`)
    return await generateDeterministicRecommendation(userId)
  }
}
