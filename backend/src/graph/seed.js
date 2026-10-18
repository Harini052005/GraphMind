import { initializeSchema, seedSemanticPatterns } from './schema.js'
import { recordAttemptService } from '../services/attempt.service.js'
import { createRevisionService } from '../services/revision.service.js'
import { checkFalkorHealth, closeFalkorConnection } from './client.js'

const DEMO_USER_ID = 'demo-user'

/**
 * Realistic LeetCode practice demo data.
 * Deliberately crafted to showcase:
 * 1. Strong / Stable patterns (Arrays & Hashing, Binary Search)
 * 2. Critical Weak pattern with repeated mistakes (Two Pointers -> Duplicate Handling)
 * 3. Moderate / In-progress pattern (Recursion & Backtracking)
 * 4. Unpracticed patterns (Sliding Window, Trees, Graphs, DP)
 */
const DEMO_ATTEMPTS = [
  // Arrays & Hashing (Stable - 4 attempts, 4 solved)
  {
    problemTitle: 'Contains Duplicate',
    leetcodeUrl: 'https://leetcode.com/problems/contains-duplicate/',
    difficulty: 'Easy',
    patternId: 'arrays-hashing',
    result: 'Solved',
    timeTakenMinutes: 10,
    notes: 'Used HashSet for O(n) lookup.',
  },
  {
    problemTitle: 'Valid Anagram',
    leetcodeUrl: 'https://leetcode.com/problems/valid-anagram/',
    difficulty: 'Easy',
    patternId: 'arrays-hashing',
    result: 'Solved',
    timeTakenMinutes: 12,
    notes: 'Fixed size frequency array of 26 letters.',
  },
  {
    problemTitle: 'Two Sum',
    leetcodeUrl: 'https://leetcode.com/problems/two-sum/',
    difficulty: 'Easy',
    patternId: 'arrays-hashing',
    result: 'Solved',
    timeTakenMinutes: 8,
    notes: 'HashMap complement lookup in single pass.',
  },
  {
    problemTitle: 'Group Anagrams',
    leetcodeUrl: 'https://leetcode.com/problems/group-anagrams/',
    difficulty: 'Medium',
    patternId: 'arrays-hashing',
    result: 'Solved',
    timeTakenMinutes: 22,
    notes: 'Sorted string as map key.',
  },

  // Two Pointers (Critical Weak - 4 attempts, 2 solved, 2 failed with REPEATED Duplicate Handling)
  {
    problemTitle: 'Valid Palindrome',
    leetcodeUrl: 'https://leetcode.com/problems/valid-palindrome/',
    difficulty: 'Easy',
    patternId: 'two-pointers',
    result: 'Solved',
    timeTakenMinutes: 14,
    notes: 'Converging left and right pointers skipping non-alphanumeric.',
  },
  {
    problemTitle: '3Sum',
    leetcodeUrl: 'https://leetcode.com/problems/3sum/',
    difficulty: 'Medium',
    patternId: 'two-pointers',
    result: 'Failed',
    timeTakenMinutes: 35,
    mistakeCategory: 'Duplicate Handling',
    notes: 'Generated duplicate triplets because I forgot while (left < right && nums[left] === nums[left + 1]) left++.',
    codeSnippet: '// Bug: Missing duplicate skip loop\nif (sum === 0) { res.push([nums[i], nums[l], nums[r]]); l++; r--; }',
  },
  {
    problemTitle: '4Sum',
    leetcodeUrl: 'https://leetcode.com/problems/4sum/',
    difficulty: 'Medium',
    patternId: 'two-pointers',
    result: 'Failed',
    timeTakenMinutes: 40,
    mistakeCategory: 'Duplicate Handling',
    notes: 'Repeated the exact same duplicate issue in nested 2-pointer loop.',
    codeSnippet: 'while (l < r && nums[l] === nums[l - 1]) l++; // Erroneous index check',
  },
  {
    problemTitle: 'Container With Most Water',
    leetcodeUrl: 'https://leetcode.com/problems/container-with-most-water/',
    difficulty: 'Medium',
    patternId: 'two-pointers',
    result: 'Solved',
    timeTakenMinutes: 20,
    notes: 'Greedy move pointer at shorter height inwards.',
  },

  // Binary Search (Stable - 2 attempts, 2 solved)
  {
    problemTitle: 'Binary Search',
    leetcodeUrl: 'https://leetcode.com/problems/binary-search/',
    difficulty: 'Easy',
    patternId: 'binary-search',
    result: 'Solved',
    timeTakenMinutes: 7,
    notes: 'Standard left <= right template.',
  },
  {
    problemTitle: 'Search in Rotated Sorted Array',
    leetcodeUrl: 'https://leetcode.com/problems/search-in-rotated-sorted-array/',
    difficulty: 'Medium',
    patternId: 'binary-search',
    result: 'Solved',
    timeTakenMinutes: 24,
    notes: 'Identified which half is sorted first.',
  },

  // Recursion & Backtracking (Needs Revision - 3 attempts, 2 solved, 1 failed)
  {
    problemTitle: 'Generate Parentheses',
    leetcodeUrl: 'https://leetcode.com/problems/generate-parentheses/',
    difficulty: 'Medium',
    patternId: 'recursion-backtracking',
    result: 'Solved',
    timeTakenMinutes: 25,
    notes: 'Tracked open and close count.',
  },
  {
    problemTitle: 'Subsets',
    leetcodeUrl: 'https://leetcode.com/problems/subsets/',
    difficulty: 'Medium',
    patternId: 'recursion-backtracking',
    result: 'Failed',
    timeTakenMinutes: 30,
    mistakeCategory: 'Base Case Missing',
    notes: 'Infinite call stack due to misplaced return statement.',
  },
  {
    problemTitle: 'Combination Sum',
    leetcodeUrl: 'https://leetcode.com/problems/combination-sum/',
    difficulty: 'Medium',
    patternId: 'recursion-backtracking',
    result: 'Solved',
    timeTakenMinutes: 28,
    notes: 'Handled reuse of same element.',
  },
]

export async function runSeed() {
  console.log('====================================================')
  console.log('🌱 Starting RecallGraph AI Demo Data Seeder...')
  console.log(`👤 Target Demo User: "${DEMO_USER_ID}"`)
  console.log('====================================================')

  const health = await checkFalkorHealth()
  console.log(`📡 FalkorDB Status: ${health.connected ? 'Connected to Cloud' : 'Offline (Using In-Memory Fallback)'}`)

  // 1. Initialize schema & seed semantic patterns
  console.log('\n[1/3] Initializing Graph Schema & Semantic DSA Patterns...')
  await initializeSchema()
  await seedSemanticPatterns()

  // 2. Seed realistic problem attempts
  console.log('\n[2/3] Seeding 13 Realistic Problem Attempts...')
  for (const attempt of DEMO_ATTEMPTS) {
    const saved = await recordAttemptService(DEMO_USER_ID, attempt)
    const icon = saved.result === 'Solved' ? '✅' : '❌'
    console.log(`  ${icon} [${saved.difficulty}] ${saved.problemTitle} (${saved.patternId}) -> ${saved.result}${saved.mistakeCategory ? ` [Mistake: ${saved.mistakeCategory}]` : ''}`)
  }

  // 3. Seed an initial targeted revision task
  console.log('\n[3/3] Seeding Initial Grounded Revision Task...')
  const revision = await createRevisionService(DEMO_USER_ID, {
    patternId: 'two-pointers',
    reason: 'Detected 2 repeated Duplicate Handling mistakes in 3Sum and 4Sum (50% pattern success rate).',
    recommendation: 'You had repeated duplicate-handling mistakes in Two Pointers problems. Review the pattern and solve one targeted problem before moving forward.',
    focusProblem: '3Sum (Medium)',
    source: 'agent',
    checklist: [
      'Sort the array beforehand so identical elements are contiguous.',
      'After recording a valid triplet, advance left pointer while nums[left] === nums[left + 1].',
      'Also advance right pointer while nums[right] === nums[right - 1].',
      'For outer loop, skip duplicate: if (i > 0 && nums[i] === nums[i - 1]) continue;',
    ],
  })
  console.log(`  🎯 Revision Task Created: ${revision.id} for "${revision.patternId}"`)

  console.log('\n====================================================')
  console.log('✨ Demo Data Seeding Complete!')
  console.log('====================================================')
  console.log('Summary:')
  console.log('- 8 Semantic DSA Pattern Nodes')
  console.log('- 6 Prerequisite Dependency Edges')
  console.log('- 13 Practice Attempts (Solved: 10, Failed: 3)')
  console.log('- 1 Critical Weak Pattern ("Two Pointers" with 2x Duplicate Handling mistakes)')
  console.log('- 1 Targeted Revision Task ready in graph memory')
  console.log('====================================================\n')
}

// Execute directly if run as a CLI script
if (process.argv[1]?.endsWith('seed.js')) {
  runSeed()
    .then(async () => {
      await closeFalkorConnection()
      process.exit(0)
    })
    .catch(async (err) => {
      console.error('❌ Seeding failed:', err)
      await closeFalkorConnection()
      process.exit(1)
    })
}
