// ─────────────────────────────────────────────────────────────────
//  BRAWL.AI — Coding Question Bank
//  Each question has:
//    id        - unique key
//    title     - short readable name
//    question  - full problem description (supports [[keyword]] for highlighting)
//    example   - { input, output } shown in the terminal box
//    answer    - normalized expected answer(s) — array allows aliases
//    hint      - shown when user clicks HINT
//    xp        - XP awarded on correct answer
//    tags      - topic tags (displayed as badges)
// ─────────────────────────────────────────────────────────────────

export const QUESTIONS = {
  Easy: [
    {
      id: 'e1',
      title: 'Reverse a String',
      question: '[[Reverse]] the given string and return the result.',
      example: { input: '"hello"', output: '"olleh"' },
      answer: ['olleh', '"olleh"'],
      hint: 'Read the characters from right to left.',
      xp: 10,
      tags: ['String', 'Basic'],
    },
    {
      id: 'e2',
      title: 'Find Max Element',
      question: 'Find the [[maximum]] element in the array.',
      example: { input: '[3, 7, 2, 9, 4]', output: '9' },
      answer: ['9'],
      hint: 'Scan through all elements and track the largest one.',
      xp: 10,
      tags: ['Array', 'Basic'],
    },
    {
      id: 'e3',
      title: 'Check Palindrome',
      question: 'Check if the string is a [[palindrome]]. Return true or false.',
      example: { input: '"racecar"', output: 'true' },
      answer: ['true'],
      hint: 'A palindrome reads the same forwards and backwards.',
      xp: 10,
      tags: ['String', 'Logic'],
    },
    {
      id: 'e4',
      title: 'Count Characters',
      question: 'Return the [[length]] (number of characters) of the string.',
      example: { input: '"brawl"', output: '5' },
      answer: ['5'],
      hint: 'Count each character: b-r-a-w-l = 5.',
      xp: 10,
      tags: ['String', 'Basic'],
    },
    {
      id: 'e5',
      title: 'Sum of Array',
      question: 'Return the [[sum]] of all elements in the array.',
      example: { input: '[1, 2, 3, 4, 5]', output: '15' },
      answer: ['15'],
      hint: '1+2+3+4+5 = 15.',
      xp: 10,
      tags: ['Array', 'Math'],
    },
  ],

  Medium: [
    {
      id: 'm1',
      title: 'Two Sum',
      question:
        'Given the array and a [[target]], return the [[indices]] of the two numbers that add up to the target.',
      example: { input: '[2, 7, 11, 15], target = 9', output: '[0, 1]' },
      answer: ['[0, 1]', '[0,1]', '0,1', '0 1'],
      hint: '2 + 7 = 9 → indices 0 and 1.',
      xp: 20,
      tags: ['Array', 'HashMap'],
    },
    {
      id: 'm2',
      title: 'Count Vowels',
      question: 'Count the number of [[vowels]] (a, e, i, o, u) in the string.',
      example: { input: '"programming"', output: '3' },
      answer: ['3'],
      hint: 'p-r-o-g-r-a-m-m-i-n-g → o, a, i = 3 vowels.',
      xp: 20,
      tags: ['String', 'Counting'],
    },
    {
      id: 'm3',
      title: 'Second Largest',
      question: 'Find the [[second largest]] element in the array.',
      example: { input: '[1, 5, 3, 8, 4]', output: '5' },
      answer: ['5'],
      hint: 'Sort descending: 8, 5, 4, 3, 1 → second is 5.',
      xp: 20,
      tags: ['Array', 'Sorting'],
    },
    {
      id: 'm4',
      title: 'FizzBuzz',
      question:
        'Return [[FizzBuzz]] if divisible by both 3 and 5, [[Fizz]] if by 3 only, [[Buzz]] if by 5 only, else the number.',
      example: { input: '15', output: 'FizzBuzz' },
      answer: ['fizzbuzz', '"fizzbuzz"'],
      hint: '15 is divisible by both 3 and 5.',
      xp: 20,
      tags: ['Math', 'Logic'],
    },
    {
      id: 'm5',
      title: 'Anagram Check',
      question: 'Check if the two strings are [[anagrams]] of each other. Return true or false.',
      example: { input: '"listen", "silent"', output: 'true' },
      answer: ['true'],
      hint: 'Both have the same characters: l,i,s,t,e,n sorted = eilnst.',
      xp: 20,
      tags: ['String', 'Sorting'],
    },
  ],

  Hard: [
    {
      id: 'h1',
      title: 'Longest Substring (No Repeats)',
      question:
        'Find the length of the [[longest substring]] without [[repeating characters]].',
      example: { input: '"abcabcbb"', output: '3' },
      answer: ['3'],
      hint: 'Sliding window: "abc" has length 3 before a repeat.',
      xp: 40,
      tags: ['String', 'Sliding Window'],
    },
    {
      id: 'h2',
      title: 'Valid Parentheses',
      question:
        'Check if the brackets string has [[valid parentheses]] (every open bracket is properly closed). Return true or false.',
      example: { input: '"()[]{}"', output: 'true' },
      answer: ['true'],
      hint: 'Use a stack: push opens, pop and match for closes.',
      xp: 40,
      tags: ['Stack', 'String'],
    },
    {
      id: 'h3',
      title: 'Merge Intervals',
      question:
        '[[Merge]] all overlapping intervals and return the result as a sorted array.',
      example: { input: '[[1,3],[2,6],[8,10]]', output: '[[1,6],[8,10]]' },
      answer: ['[[1,6],[8,10]]', '[[1, 6], [8, 10]]'],
      hint: '[1,3] and [2,6] overlap → merge to [1,6]. [8,10] is separate.',
      xp: 40,
      tags: ['Array', 'Sorting'],
    },
    {
      id: 'h4',
      title: 'Binary Search',
      question:
        'Return the [[index]] of the target using [[binary search]], or -1 if not found.',
      example: { input: '[1, 3, 5, 7, 9], target = 7', output: '3' },
      answer: ['3'],
      hint: 'Mid = index 2 (val 5). Target > 5 → search right half. Mid = index 3 (val 7). Found!',
      xp: 40,
      tags: ['Array', 'Binary Search'],
    },
    {
      id: 'h5',
      title: 'Fibonacci (Optimized)',
      question:
        'Return the [[nth Fibonacci]] number. (0-indexed: F(0)=0, F(1)=1, F(2)=1...)',
      example: { input: 'n = 10', output: '55' },
      answer: ['55'],
      hint: 'F(10) = 55. Use bottom-up DP: 0,1,1,2,3,5,8,13,21,34,55.',
      xp: 40,
      tags: ['DP', 'Math'],
    },
  ],
};

// ── HELPERS ─────────────────────────────────────────────────────

/**
 * Pick a random question from the pool that hasn't been used yet.
 * Returns { idx, question }.
 */
export function pickQuestion(pool, usedIds) {
  const available = pool.filter(q => !usedIds.includes(q.id));
  if (available.length === 0) return pool[0]; // fallback: repeat first
  return available[Math.floor(Math.random() * available.length)];
}

export function normalizeAnswer(str) {
  if (str === null || str === undefined) return '';
  return String(str).toLowerCase().replace(/\s+/g, '').replace(/["']/g, '');
}

/**
 * Execute user code against the question's test input and return a rich result.
 * Returns: { isCorrect, userOutput, expectedOutput, error, isError }
 */
export function executeCode(question, userInput) {
  const expectedOutput = question.answer[0]; // primary expected answer for display

  try {
    // Build argument string from the example input
    const argsStr = question.example && question.example.input
      ? question.example.input.replace(/[a-zA-Z_]+\s*=\s*/g, '')
      : '';

    const wrappedCode = `
      ${userInput}
      if (typeof solution === 'function') {
        return solution(${argsStr});
      }
      return undefined;
    `;

    const fn = new Function(wrappedCode);
    const rawResult = fn();

    let userOutput;
    if (rawResult !== undefined) {
      userOutput = typeof rawResult === 'object'
        ? JSON.stringify(rawResult)
        : String(rawResult);
    } else {
      // Fallback: treat the whole input as a plain answer
      userOutput = String(userInput).trim();
    }

    console.log('[executeCode] userOutput:', userOutput, '| expected:', question.answer);

    const normalizedUser = normalizeAnswer(userOutput);
    const isCorrect = question.answer.some(a => normalizeAnswer(a) === normalizedUser);

    return { isCorrect, userOutput, expectedOutput, error: null, isError: false };

  } catch (err) {
    console.error('[executeCode] Runtime error:', err.message);
    // On error: try plain-text fallback comparison before marking as error
    const fallbackNorm = normalizeAnswer(userInput);
    const isCorrect = question.answer.some(a => normalizeAnswer(a) === fallbackNorm);
    if (isCorrect) {
      return { isCorrect: true, userOutput: userInput.trim(), expectedOutput, error: null, isError: false };
    }
    return { isCorrect: false, userOutput: null, expectedOutput, error: err.message, isError: true };
  }
}

// Keep old export as alias so nothing else breaks
export function checkAnswer(question, userInput) {
  return executeCode(question, userInput).isCorrect;
}

/**
 * Parse a question string and split it into segments:
 *   { text: '...', highlight: false }
 *   { text: '...', highlight: true }
 * Anything wrapped in [[...]] becomes a highlighted segment.
 */
export function parseKeywords(questionStr) {
  const parts = [];
  const regex = /\[\[(.+?)\]\]/g;
  let lastIndex = 0;
  let match;
  while ((match = regex.exec(questionStr)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ text: questionStr.slice(lastIndex, match.index), highlight: false });
    }
    parts.push({ text: match[1], highlight: true });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < questionStr.length) {
    parts.push({ text: questionStr.slice(lastIndex), highlight: false });
  }
  return parts;
}

export const XP_PER_CORRECT = { Easy: 20, Medium: 50, Hard: 100 };
export const TOTAL_ROUNDS   = 5;
export const TIMER_DURATION = { Easy: 60, Medium: 45, Hard: 30 };
