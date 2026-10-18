import { z } from 'zod'

export const VALID_PATTERNS = [
  'arrays-hashing',
  'two-pointers',
  'sliding-window',
  'binary-search',
  'recursion-backtracking',
  'tree-traversal',
  'graph-algorithms',
  'dynamic-programming',
]

export const createAttemptSchema = z.object({
  problemTitle: z
    .string({ required_error: 'Problem title is required' })
    .trim()
    .min(2, 'Problem title must be at least 2 characters')
    .max(200, 'Problem title must be under 200 characters'),
  leetcodeUrl: z
    .string()
    .url('Must be a valid URL')
    .optional()
    .or(z.literal('')),
  difficulty: z.enum(['Easy', 'Medium', 'Hard'], {
    required_error: 'Difficulty must be Easy, Medium, or Hard',
  }),
  patternId: z.string({ required_error: 'DSA pattern is required' }).refine(
    (val) => {
      const normalized = val.toLowerCase().replace(/[\s&()\/]+/g, '-')
      return (
        VALID_PATTERNS.includes(val) ||
        VALID_PATTERNS.some((p) => normalized.includes(p) || p.includes(normalized))
      )
    },
    { message: 'Invalid DSA pattern selection' }
  ),
  result: z.enum(['Solved', 'Attempted', 'Failed'], {
    required_error: 'Result must be Solved, Attempted, or Failed',
  }),
  timeTakenMinutes: z
    .number({ required_error: 'Time taken in minutes is required' })
    .int('Time taken must be an integer')
    .min(1, 'Time taken must be at least 1 minute')
    .max(300, 'Time taken cannot exceed 300 minutes'),
  mistakeCategory: z.string().trim().max(100).optional().or(z.literal('')),
  notes: z.string().trim().max(3000, 'Notes must be under 3000 characters').optional().or(z.literal('')),
  codeSnippet: z.string().max(15000, 'Code snippet must be under 15000 characters').optional().or(z.literal('')),
})

export const getAttemptsQuerySchema = z.object({
  patternId: z.string().optional(),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']).optional(),
  result: z.enum(['Solved', 'Attempted', 'Failed']).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
})
