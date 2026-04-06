// BRAWL.AI — Unique Question Database
// Each title embeds its input → every title is unique.
// Final array is shuffled so the UI always shows variety.

const gen = (pfx, tFn, diff, cat, desc, hint, xp, tags, data) =>
  data.map(([inp, out], i) => ({
    id: `${pfx}-${i+1}`,
    title: tFn(String(inp), String(out)),
    difficulty: diff,
    category: cat,
    description: desc,
    example: { input: String(inp), output: String(out) },
    answer: [String(out)],
    hint: `${hint} → ${out}`,
    xp,
    tags,
  }));

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// ── EASY · ARRAYS ────────────────────────────────────────────
const EA_MAX = gen('ea-max', i => `Max of ${i}`, 'Easy','Arrays',
  'Return the [[maximum]] element in the array.',
  'Scan all elements, track the largest', 10, ['Array','Search'], [
  ['[3,7,2,9,4]',9],['[1,5,8,2,6]',8],['[10,3,15,7,2]',15],['[4,4,4,4,5]',5],
  ['[100,200,50,75]',200],['[-5,-1,-3,-2]',-1],['[0,0,1,0]',1],['[7]',7],
  ['[1,2,3,4,5]',5],['[5,4,3,2,1]',5],['[3,3,3,8,3]',8],['[11,22,33,44]',44],
  ['[9,1,9,1,9]',9],['[6,2,8,4,10]',10],['[50,100,25,75]',100],['[1,1000,1,1]',1000],
  ['[2,4,6,8,10]',10],['[13,7,19,3]',19],['[42,17,39,8]',42],['[5,5,5,6]',6],
]);

const EA_MIN = gen('ea-min', i => `Min of ${i}`, 'Easy','Arrays',
  'Return the [[minimum]] element in the array.',
  'Scan all elements, track the smallest', 10, ['Array','Search'], [
  ['[3,7,2,9,4]',2],['[1,5,8,2,6]',1],['[10,3,15,7,2]',2],['[4,4,4,4,5]',4],
  ['[100,200,50,75]',50],['[-5,-1,-3,-2]',-5],['[0,0,1,0]',0],['[7]',7],
  ['[1,2,3,4,5]',1],['[5,4,3,2,1]',1],['[3,3,3,8,3]',3],['[11,22,33,44]',11],
  ['[9,1,9,1,9]',1],['[6,2,8,4,10]',2],['[50,100,25,75]',25],['[1,1000,1,1]',1],
  ['[2,4,6,8,10]',2],['[13,7,19,3]',3],['[42,17,39,8]',8],['[5,5,5,6]',5],
]);

const EA_SUM = gen('ea-sum', i => `Sum of ${i}`, 'Easy','Arrays',
  'Return the [[sum]] of all elements.',
  'Add every element together', 10, ['Array','Math'], [
  ['[1,2,3,4,5]',15],['[10,20,30]',60],['[1,1,1,1]',4],['[5,5,5,5,5]',25],
  ['[0,0,0,0]',0],['[100,200,300]',600],['[7,3,5]',15],['[2,4,6,8]',20],
  ['[1,10,100]',111],['[-1,-2,-3]',-6],['[0,1]',1],['[3,7]',10],
  ['[11,9]',20],['[50,50]',100],['[25,25,25,25]',100],['[1,2,3]',6],
  ['[10,10,10,10]',40],['[4,3,2,1]',10],['[6,8,4,2]',20],['[12,13]',25],
]);

const EA_FST = gen('ea-fst', i => `First element of ${i}`, 'Easy','Arrays',
  'Return the [[first]] (index 0) element.',
  'Access index 0', 10, ['Array','Indexing'], [
  ['[3,7,2,9,4]',3],['[1,5,8,2,6]',1],['[10,3,15,7,2]',10],['[42,17,39]',42],
  ['[100,200,50]',100],['[0,5,9]',0],['[7,8,9]',7],['[99,1,2,3]',99],
  ['[-1,0,1]',-1],['[5,5,5]',5],['[2024,2025]',2024],['[1000,1]',1000],
  ['[0,0,0]',0],['[13,7,19]',13],['[4,3,2,1]',4],['[6,8,4,2]',6],
  ['[50,25,75]',50],['[11,22,33]',11],['[9,1,9]',9],['[5,5,6]',5],
]);

const EA_LST = gen('ea-lst', i => `Last element of ${i}`, 'Easy','Arrays',
  'Return the [[last]] element of the array.',
  'Access index length-1', 10, ['Array','Indexing'], [
  ['[3,7,2,9,4]',4],['[1,5,8,2,6]',6],['[10,3,15,7,2]',2],['[42,17,39]',39],
  ['[100,200,50]',50],['[0,5,9]',9],['[7,8,9]',9],['[99,1,2,3]',3],
  ['[-1,0,1]',1],['[5,5,5]',5],['[2024,2025]',2025],['[1000,1]',1],
  ['[0,0,0]',0],['[13,7,19]',19],['[4,3,2,1]',1],['[6,8,4,2]',2],
  ['[50,25,75]',75],['[11,22,33]',33],['[9,1,9]',9],['[5,5,6]',6],
]);

const EA_LEN = gen('ea-len', i => `Length of array ${i}`, 'Easy','Arrays',
  'Return the [[length]] (number of elements) of the array.',
  'Count every element', 10, ['Array','Basic'], [
  ['[1,2,3,4,5]',5],['[10,20,30]',3],['[7]',1],['[]',0],
  ['[1,2,3,4,5,6,7]',7],['[0,0,0]',3],['[9,8,7,6,5,4]',6],['[3,1]',2],
  ['[100]',1],['[1,2]',2],['[5,5,5,5]',4],['[1,2,3,4,5,6,7,8]',8],
  ['[10,20]',2],['[3,6,9]',3],['[2,4,6,8,10]',5],['[1,1,1,1,1,1]',6],
  ['[7,14,21,28]',4],['[0]',1],['[5,10,15,20,25,30]',6],['[1,2,3]',3],
]);

const EA_IDX = gen('ea-idx', (i,o) => `Element at index → answer is ${o} in ${i}`, 'Easy','Arrays',
  'Return the element at the [[specified index]] in the array.',
  'Use array[index]', 10, ['Array','Indexing'], [
  ['[5,10,15,20], idx=2',15],['[3,6,9,12], idx=1',6],['[1,2,3,4,5], idx=0',1],
  ['[10,20,30,40], idx=3',40],['[7,14,21], idx=2',21],['[100,200,300], idx=1',200],
  ['[0,1,2,3,4], idx=4',4],['[9,8,7,6], idx=0',9],['[4,8,12,16], idx=3',16],
  ['[2,4,6,8,10], idx=2',6],['[1,3,5,7,9], idx=4',9],['[50,100,150], idx=0',50],
  ['[11,22,33,44], idx=1',22],['[5,10,15,20,25], idx=3',20],['[1,1,1,1], idx=2',1],
  ['[3,7,2,9,4], idx=3',9],['[6,12,18,24], idx=1',12],['[100,50,25], idx=2',25],
  ['[0,0,1,0], idx=2',1],['[8,6,4,2], idx=3',2],
]);

const EA_EVN = gen('ea-evn', i => `Count even numbers in ${i}`, 'Easy','Arrays',
  'Count how many [[even]] numbers are in the array.',
  'Even means divisible by 2 with no remainder', 10, ['Array','Counting'], [
  ['[1,2,3,4,5,6]',3],['[2,4,6,8]',4],['[1,3,5,7]',0],['[0,2,4]',3],
  ['[1,2,3]',1],['[10,21,32,43]',2],['[5,10,15,20]',2],['[3,6,9,12]',2],
  ['[7,8,9,10]',2],['[11,12,13,14]',2],['[2,2,2,2]',4],['[1,1,1,1]',0],
  ['[4,9,6,3,8]',3],['[5,6,7,8,9]',2],['[2,5,8,11]',2],['[0,1,2,3,4]',3],
  ['[100,101,102]',2],['[7,14,21,28]',2],['[3,5,7,9]',0],['[2,3,4,5]',2],
]);

const EA_ODD = gen('ea-odd', i => `Count odd numbers in ${i}`, 'Easy','Arrays',
  'Count how many [[odd]] numbers are in the array.',
  'Odd means not divisible by 2', 10, ['Array','Counting'], [
  ['[1,2,3,4,5]',3],['[2,4,6,8]',0],['[1,3,5,7]',4],['[0,2,4]',0],
  ['[1,2,3]',2],['[10,21,32,43]',2],['[5,10,15,20]',2],['[3,6,9,12]',2],
  ['[7,8,9,10]',2],['[11,12,13,14]',2],['[2,2,2,2]',0],['[1,1,1,1]',4],
  ['[4,9,6,3,8]',2],['[5,6,7,8,9]',3],['[2,5,8,11]',2],['[0,1,2,3,4]',2],
  ['[100,101,102]',1],['[7,14,21,28]',2],['[3,5,7,9]',4],['[2,3,4,5]',2],
]);

const EA_2ND = gen('ea-2nd', i => `Second largest in ${i}`, 'Easy','Arrays',
  'Return the [[second largest]] element.',
  'Sort descending, pick index 1', 10, ['Array','Sorting'], [
  ['[1,5,3,8,4]',5],['[3,7,2,9,4]',7],['[10,3,15,7,2]',10],['[4,6,2,8,1]',6],
  ['[5,5,5,6,6]',5],['[1,2,3,4,5]',4],['[9,8,7,6]',8],['[100,50,75,25]',75],
  ['[1,1,2,2]',1],['[3,3,3,4]',3],['[10,9,8,7]',9],['[20,15,10,5]',15],
  ['[2,4,6,8,10]',8],['[11,22,33,44]',33],['[5,3,1,4,2]',4],['[50,100,75,25]',75],
  ['[6,2,8,4,10]',8],['[7,3,9,5,1]',7],['[13,7,19,3]',13],['[42,17,39,8]',39],
]);

// ── EASY · STRINGS ───────────────────────────────────────────
const ES_LEN = gen('es-len', i => `Length of ${i}`, 'Easy','Strings',
  'Return the [[length]] of the string.',
  'Count every character', 10, ['String','Basic'], [
  ['"hello"',5],['"world"',5],['"brawl"',5],['"ai"',2],['"code"',4],
  ['"python"',6],['"java"',4],['"array"',5],['"stack"',5],['"queue"',5],
  ['"algorithm"',9],['"function"',8],['"variable"',8],['"string"',6],['"number"',6],
  ['"boolean"',7],['"object"',6],['"loop"',4],['"data"',4],['"node"',4],
]);

const ES_REV = gen('es-rev', i => `Reverse of ${i}`, 'Easy','Strings',
  '[[Reverse]] the string character by character.',
  'Read characters right to left', 10, ['String','Basic'], [
  ['"hello"','"olleh"'],['"world"','"dlrow"'],['"abc"','"cba"'],['"12345"','"54321"'],
  ['"brawl"','"lwarb"'],['"code"','"edoc"'],['"java"','"avaj"'],['"ai"','"ia"'],
  ['"stack"','"kcats"'],['"loop"','"pool"'],['"python"','"nohtyp"'],['"cyber"','"rebyc"'],
  ['"data"','"atad"'],['"node"','"edon"'],['"test"','"tset"'],
  ['"array"','"yarra"'],['"queue"','"eueuq"'],['"tree"','"eert"'],['"graph"','"hparg"'],
  ['"flag"','"galf"'],
]);

const ES_PAL = gen('es-pal', i => `Is ${i} a palindrome?`, 'Easy','Strings',
  'Return [[true]] if the string is a [[palindrome]], else [[false]].',
  'Compare string with its reverse', 10, ['String','Logic'], [
  ['"racecar"','true'],['"hello"','false'],['"madam"','true'],['"level"','true'],
  ['"world"','false'],['"radar"','true'],['"noon"','true'],['"code"','false'],
  ['"civic"','true'],['"refer"','true'],['"python"','false'],['"kayak"','true'],
  ['"java"','false'],['"deed"','true'],['"stack"','false'],['"abcba"','true'],
  ['"abcd"','false'],['"aaa"','true'],['"abba"','true'],['"xyz"','false'],
]);

const ES_VOW = gen('es-vow', i => `Vowel count in ${i}`, 'Easy','Strings',
  'Count the [[vowels]] (a,e,i,o,u) in the string.',
  'Count a, e, i, o, u', 10, ['String','Counting'], [
  ['"hello"',2],['"world"',1],['"python"',1],['"algorithm"',3],['"interface"',4],
  ['"array"',2],['"queue"',3],['"stack"',1],['"tree"',2],['"graph"',1],
  ['"code"',2],['"data"',2],['"ai"',2],['"java"',2],['"brawl"',1],
  ['"string"',1],['"function"',3],['"variable"',4],['"operator"',4],['"recursion"',4],
]);

const ES_UPR = gen('es-upr', i => `Uppercase of ${i}`, 'Easy','Strings',
  'Return the [[uppercase]] version of the string.',
  'Convert every letter to uppercase', 10, ['String','Transform'], [
  ['"hello"','"HELLO"'],['"world"','"WORLD"'],['"brawl"','"BRAWL"'],['"code"','"CODE"'],
  ['"java"','"JAVA"'],['"ai"','"AI"'],['"stack"','"STACK"'],['"node"','"NODE"'],
  ['"data"','"DATA"'],['"loop"','"LOOP"'],['"python"','"PYTHON"'],['"cyber"','"CYBER"'],
  ['"neon"','"NEON"'],['"tree"','"TREE"'],['"graph"','"GRAPH"'],['"array"','"ARRAY"'],
  ['"queue"','"QUEUE"'],['"test"','"TEST"'],['"flag"','"FLAG"'],['"swap"','"SWAP"'],
]);

const ES_FST = gen('es-fst', i => `First char of ${i}`, 'Easy','Strings',
  'Return the [[first]] character of the string.',
  'Access index 0', 10, ['String','Indexing'], [
  ['"hello"','"h"'],['"world"','"w"'],['"brawl"','"b"'],['"code"','"c"'],
  ['"java"','"j"'],['"ai"','"a"'],['"stack"','"s"'],['"node"','"n"'],
  ['"data"','"d"'],['"loop"','"l"'],['"python"','"p"'],['"cyber"','"c"'],
  ['"neon"','"n"'],['"tree"','"t"'],['"graph"','"g"'],['"array"','"a"'],
  ['"queue"','"q"'],['"test"','"t"'],['"flag"','"f"'],['"swap"','"s"'],
]);

const ES_LST = gen('es-lst', i => `Last char of ${i}`, 'Easy','Strings',
  'Return the [[last]] character of the string.',
  'Access index length-1', 10, ['String','Indexing'], [
  ['"hello"','"o"'],['"world"','"d"'],['"brawl"','"l"'],['"code"','"e"'],
  ['"java"','"a"'],['"ai"','"i"'],['"stack"','"k"'],['"node"','"e"'],
  ['"data"','"a"'],['"loop"','"p"'],['"python"','"n"'],['"cyber"','"r"'],
  ['"neon"','"n"'],['"tree"','"e"'],['"graph"','"h"'],['"array"','"y"'],
  ['"queue"','"e"'],['"test"','"t"'],['"flag"','"g"'],['"swap"','"p"'],
]);

// ── EASY · MATH ──────────────────────────────────────────────
const EM_FAC = gen('em-fac', (i,o) => `${i} = ?`, 'Easy','Math',
  'Compute the [[factorial]] n!.',
  'Multiply n × (n-1) × ... × 1', 10, ['Math','Recursion'], [
  ['0!',1],['1!',1],['2!',2],['3!',6],['4!',24],['5!',120],['6!',720],['7!',5040],
  ['8!',40320],['9!',362880],['10!',3628800],['3!+2!',8],['4!-3!',18],
  ['2!+2!',4],['5!-4!',96],['6!-5!',600],['4!/2',12],['3!×2',12],['2!^3',8],['1!+1!',2],
]);

const EM_FIB = gen('em-fib', (i,o) => `Fibonacci: ${i}`, 'Easy','Math',
  'Return the nth [[Fibonacci]] number (F(0)=0, F(1)=1).',
  'F(n) = F(n-1) + F(n-2)', 10, ['Math','Recursion'], [
  ['F(0)',0],['F(1)',1],['F(2)',1],['F(3)',2],['F(4)',3],['F(5)',5],['F(6)',8],
  ['F(7)',13],['F(8)',21],['F(9)',34],['F(10)',55],['F(11)',89],['F(12)',144],
  ['F(13)',233],['F(14)',377],['F(15)',610],['F(16)',985],['F(17)',1597],
  ['F(18)',2584],['F(19)',4181],
]);

const EM_FZZ = gen('em-fzz', (i,o) => `FizzBuzz of ${i}`, 'Easy','Math',
  'Return [[FizzBuzz]] if divisible by 3&5, [[Fizz]] if 3, [[Buzz]] if 5, else the number.',
  'Check divisibility by 3 and 5', 10, ['Math','Logic'], [
  [15,'FizzBuzz'],[3,'Fizz'],[5,'Buzz'],[1,1],[30,'FizzBuzz'],[9,'Fizz'],[25,'Buzz'],
  [7,7],[45,'FizzBuzz'],[12,'Fizz'],[10,'Buzz'],[11,11],[60,'FizzBuzz'],[6,'Fizz'],
  [20,'Buzz'],[13,13],[90,'FizzBuzz'],[21,'Fizz'],[35,'Buzz'],[17,17],
]);

const EM_POW = gen('em-pow', (i,o) => `${i} = ?`, 'Easy','Math',
  'Return 2 raised to the power [[2^n]].',
  'Multiply 2 by itself n times', 10, ['Math','Binary'], [
  ['2^0',1],['2^1',2],['2^2',4],['2^3',8],['2^4',16],['2^5',32],['2^6',64],['2^7',128],
  ['2^8',256],['2^9',512],['2^10',1024],['2^11',2048],['2^12',4096],['2^13',8192],
  ['2^14',16384],['2^15',32768],['2^16',65536],['2^3+2^2',12],['2^4-2^3',8],['2^2×2^3',32],
]);

const EM_EVN = gen('em-evn', (i,o) => `Is ${i} even?`, 'Easy','Math',
  'Return [[true]] if the number is [[even]], else [[false]].',
  'Even if num % 2 === 0', 10, ['Math','Logic'], [
  [2,'true'],[3,'false'],[0,'true'],[7,'false'],[100,'true'],[99,'false'],
  [4,'true'],[5,'false'],[1000,'true'],[1001,'false'],[12,'true'],[13,'false'],
  [8,'true'],[9,'false'],[20,'true'],[21,'false'],[50,'true'],[51,'false'],
  [64,'true'],[65,'false'],
]);

// ── EASY · STACK ─────────────────────────────────────────────
const ES_STK = gen('es-stk', (i) => `Stack top after: ${i}`, 'Easy','Stack',
  'What is the [[top]] of the stack after these operations?',
  'Last pushed element is on top (unless popped)', 10, ['Stack','LIFO'], [
  ['push(1),push(2),push(3)',3],['push(5),push(10)',10],['push(7)',7],
  ['push(1),push(2)',2],['push(9),push(4),push(6)',6],['push(100)',100],
  ['push(2),push(4),push(8)',8],['push(42)',42],
  ['push(1),push(2),push(3),pop()',2],['push(5),push(6),pop()',5],
  ['push(7),push(8),push(9),pop()',8],['push(1),pop(),push(2)',2],
  ['push(10),push(20),pop(),pop(),push(30)',30],
  ['push(3),push(6),push(9),pop(),pop()',3],
  ['push(1),push(2),push(3),pop(),pop()',1],
  ['push(5),push(10),push(15),pop()',10],
  ['push(2),push(4),pop(),push(8)',8],
  ['push(9),push(7),push(5),pop()',7],
  ['push(0),push(1)',1],['push(3),push(3)',3],
]);

// ── EASY · SORTING ───────────────────────────────────────────
const ES_SRT = gen('es-srt', (i) => `After 1 bubble-sort pass on ${i}: last element?`, 'Easy','Sorting',
  'After ONE pass of bubble sort, what is the [[last element]]?',
  'Largest bubbles to end in one pass', 10, ['Sorting','Array'], [
  ['[3,1,2]',3],['[5,2,4,1]',5],['[9,7,5,3]',9],['[4,2,6,1]',6],
  ['[10,3,2,7]',10],['[1,3,2]',3],['[8,5,3,9]',9],['[2,1,4,3]',4],
  ['[6,4,2,8]',8],['[5,1,3,2]',5],['[7,8,6,5]',8],['[1,2,3,4]',4],
  ['[4,3,2,1]',4],['[3,5,1,4]',5],['[9,2,7,4]',9],['[6,1,8,3]',8],
  ['[2,7,1,5]',7],['[10,1,5,2]',10],['[3,8,2,6]',8],['[1,9,4,7]',9],
]);

// ── MEDIUM · ARRAYS ──────────────────────────────────────────
const MA_TWO = gen('ma-two', (i) => `Two Sum indices in ${i}`, 'Medium','Arrays',
  'Find two [[indices]] whose values add up to the target. Return [i,j].',
  'Use a hash map or nested loop', 20, ['Array','HashMap'], [
  ['[2,7,11,15], target=9','[0,1]'],['[3,2,4], target=6','[1,2]'],
  ['[1,5,3,2], target=8','[1,2]'],['[4,6,2,8], target=10','[0,3]'],
  ['[1,2,3,4], target=7','[2,3]'],['[5,5], target=10','[0,1]'],
  ['[2,3,5,7], target=9','[1,3]'],['[1,4,7,3], target=10','[1,2]'],
  ['[3,5,6,2], target=8','[0,2]'],['[2,6,4,8], target=10','[0,3]'],
  ['[1,3,5,7], target=12','[2,3]'],['[4,2,6,8], target=6','[0,1]'],
  ['[10,20,30], target=50','[1,2]'],['[1,9,5,3], target=10','[0,1]'],
  ['[7,3,4,2], target=7','[1,2]'],['[5,3,8,1], target=9','[0,2]'],
  ['[2,4,6,8], target=14','[2,3]'],['[1,6,3,9], target=12','[1,3]'],
  ['[3,7,2,5], target=12','[1,2]'],['[4,4,4,4], target=8','[0,1]'],
]);

const MA_MIS = gen('ma-mis', (i) => `Missing number in ${i}`, 'Medium','Arrays',
  'Find the [[missing number]] in the 1-to-n sequence.',
  'Expected sum = n*(n+1)/2, subtract actual sum', 20, ['Array','Math'], [
  ['[1,2,4,5], n=5',3],['[1,3,4,5], n=5',2],['[2,3,4,5], n=5',1],
  ['[1,2,3,5], n=5',4],['[1,2,3,4], n=5',5],['[1,3,4,5,6], n=6',2],
  ['[1,2,4,5,6], n=6',3],['[2,3,4,5,6], n=6',1],['[1,2,3,4,6], n=6',5],
  ['[1,2,3,5,6,7], n=7',4],['[2,3,4,5,6,7], n=7',1],['[1,2,4,5,6,7], n=7',3],
  ['[1,3,4,5,6,7], n=7',2],['[1,2,3,4,5,7], n=7',6],
  ['[1,2,4], n=4',3],['[2,3,4], n=4',1],['[1,3,4], n=4',2],['[1,2,3], n=4',4],
  ['[1,2,3,4,5,6,8], n=8',7],['[1,2,3,4,5,7,8], n=8',6],
]);

const MA_DUP = gen('ma-dup', (i) => `Duplicate in ${i}`, 'Medium','Arrays',
  'Find the [[duplicate]] element in the array.',
  'The element appearing more than once', 20, ['Array','Hashing'], [
  ['[1,3,4,2,2]',2],['[3,1,3,4,2]',3],['[1,1,2,3]',1],['[2,3,4,2,5]',2],
  ['[5,1,5,2,3]',5],['[4,4,1,2,3]',4],['[6,1,2,3,6]',6],['[1,2,3,3]',3],
  ['[7,1,2,7,3]',7],['[9,1,9,2,3]',9],['[2,2,3,4,5]',2],['[1,4,4,2,3]',4],
  ['[5,6,5,7,8]',5],['[3,4,5,3,6]',3],['[8,7,8,6,5]',8],['[1,2,6,4,6]',6],
  ['[9,8,7,9,6]',9],['[2,3,4,5,2]',2],['[7,6,5,7,4]',7],['[3,4,3,5,6]',3],
]);

const MA_ROT = gen('ma-rot', (i) => `Rotate ${i} left by 1`, 'Medium','Arrays',
  '[[Rotate]] the array left by 1 position. Show the result.',
  'Move first element to the end', 20, ['Array','Rotation'], [
  ['[1,2,3,4]','[2,3,4,1]'],['[5,6,7,8]','[6,7,8,5]'],['[3,1,4,1]','[1,4,1,3]'],
  ['[9,0,1,2]','[0,1,2,9]'],['[7,8,9]','[8,9,7]'],['[1,5,3]','[5,3,1]'],
  ['[2,4,6,8]','[4,6,8,2]'],['[10,20,30]','[20,30,10]'],['[0,1,2,3,4]','[1,2,3,4,0]'],
  ['[1,1,1,2]','[1,1,2,1]'],['[3,5,7]','[5,7,3]'],['[4,3,2,1]','[3,2,1,4]'],
  ['[1,0]','[0,1]'],['[8,6,4,2]','[6,4,2,8]'],['[9,7,5,3,1]','[7,5,3,1,9]'],
  ['[2,3,5,7]','[3,5,7,2]'],['[1,2]','[2,1]'],['[5,4,3]','[4,3,5]'],
  ['[6,3,9,1]','[3,9,1,6]'],['[12,6,3]','[6,3,12]'],
]);

const MA_DST = gen('ma-dst', (i) => `Distinct count in ${i}`, 'Medium','Arrays',
  'Return the number of [[distinct]] (unique) elements.',
  'Use a set to count unique values', 20, ['Array','Hashing'], [
  ['[1,2,2,3,3,3]',3],['[1,1,1,1]',1],['[1,2,3,4,5]',5],['[5,5,4,4,3,3]',3],
  ['[1,2,1,2,1]',2],['[7,8,9,7,8]',3],['[1,1,2,2,3,3,4,4]',4],['[10,10,10]',1],
  ['[1,2,3,3,2,1]',3],['[4,4,4,4,4]',1],['[1,3,5,7,9]',5],['[2,4,6,8,2,4]',4],
  ['[0,0,1,1,2,2]',3],['[5,6,7,8,9,5]',5],['[1,2,3,4,4,3]',4],
  ['[10,20,30,10,20]',3],['[1,1,1,2,3]',3],['[7,7,8,8,9,9]',3],
  ['[3,3,3,3,4,5]',3],['[1,2,3,4,5,1]',5],
]);

// ── MEDIUM · STRINGS ─────────────────────────────────────────
const MS_ANA = gen('ms-ana', (i) => `Are ${i} anagrams?`, 'Medium','Strings',
  'Return [[true]] if the two strings are [[anagrams]], else [[false]].',
  'Sort both and compare', 20, ['String','Sorting'], [
  ['"listen","silent"','true'],['"hello","world"','false'],['"anagram","nagaram"','true'],
  ['"rat","car"','false'],['"triangle","integral"','true'],['"abc","cba"','true'],
  ['"node","done"','true'],['"code","coed"','true'],['"cat","bat"','false'],
  ['"cinema","iceman"','true'],['"dog","cat"','false'],['"eat","tea"','true'],
  ['"java","cave"','false'],['"arc","car"','true'],['"pots","stop"','true'],
  ['"race","care"','true'],['"stack","tasks"','false'],
  ['"note","tone"','true'],['"slow","owls"','true'],['"brawl","warbl"','false'],
]);

const MS_CNT = gen('ms-cnt', (i) => `Occurrences in ${i}`, 'Medium','Strings',
  'Count how many times the [[character]] appears in the string.',
  'Iterate and count matches', 20, ['String','Counting'], [
  ['"hello", l',2],['"banana", a',3],['"mississippi", s',4],
  ['"programming", g',2],['"brawl", r',1],['"aabbcc", b',2],
  ['"success", s',3],['"pepper", p',3],['"minimum", m',3],
  ['"character", c',2],['"occurrence", r',2],['"abcabcabc", a',3],
  ['"llll", l',4],['"python", o',1],['"java", a',2],
  ['"coding", i',1],['"level", l',2],['"radar", r',2],
  ['"reference", e',3],['"algorithm", g',1],
]);

const MS_RWD = gen('ms-rwd', (i) => `Reverse words in "${i.replace(/"/g,'')}"`, 'Medium','Strings',
  '[[Reverse]] the order of words (not characters) in the sentence.',
  'Split on spaces, reverse array, join', 20, ['String','Array'], [
  ['"hello world"','"world hello"'],['"the sky is blue"','"blue is sky the"'],
  ['"brawl ai"','"ai brawl"'],['"code is fun"','"fun is code"'],
  ['"a b c"','"c b a"'],['"one two three"','"three two one"'],
  ['"stack overflow"','"overflow stack"'],['"go east"','"east go"'],
  ['"left right"','"right left"'],['"keep coding"','"coding keep"'],
  ['"neural net"','"net neural"'],['"data and code"','"code and data"'],
  ['"fight or flight"','"flight or fight"'],['"up and down"','"down and up"'],
  ['"red blue green"','"green blue red"'],['"first last"','"last first"'],
  ['"abc def ghi"','"ghi def abc"'],['"loop break"','"break loop"'],
  ['"true false"','"false true"'],['"in out"','"out in"'],
]);

const MS_LNG = gen('ms-lng', (i) => `Longest word in "${i.replace(/"/g,'')}"`, 'Medium','Strings',
  'Return the [[longest word]] in the sentence.',
  'Split on spaces, find max length word', 20, ['String','Searching'], [
  ['"code is fun"','"code"'],['"the sky is blue"','"blue"'],['"brawl ai wars"','"brawl"'],
  ['"go east now"','"east"'],['"stack and queue"','"stack"'],['"python rocks"','"python"'],
  ['"a long sentence"','"sentence"'],['"very very important"','"important"'],
  ['"neural networks"','"networks"'],['"data structures"','"structures"'],
  ['"algorithm design"','"algorithm"'],['"binary search"','"binary"'],
  ['"dynamic programming"','"programming"'],['"two pointer"','"pointer"'],
  ['"string builder"','"builder"'],['"merge sort"','"merge"'],
  ['"hash map"','"hash"'],['"recursion base"','"recursion"'],
  ['"one more time"','"time"'],['"find max element"','"element"'],
]);

// ── MEDIUM · STACK / SEARCH / MATH ───────────────────────────
const MM_PAR = gen('mm-par', (i) => `Valid parentheses: ${i}`, 'Medium','Stack',
  'Return [[true]] if all brackets are [[valid]], else [[false]].',
  'Use a stack: push opens, pop and match closes', 20, ['Stack','String'], [
  ['"()"','true'],['"()[]{}"','true'],['"(]"','false'],['"([)]"','false'],
  ['"{[]}"','true'],['"((("','false'],['""','true'],['"(())"','true'],
  ['"([{}])"','true'],['"[(])"','false'],['"((()))"','true'],['"(((("','false'],
  ['"{}{}{}"','true'],['"[{()}]"','true'],['"(["','false'],['"]}{"','false'],
  ['"({})([])"','true'],['"((()))()"','true'],['"([({})])"','true'],['"[[]"','false'],
]);

const MM_BIN = gen('mm-bin', (i) => `Binary search: ${i}`, 'Medium','Searching',
  'Return the [[index]] of the target (binary search), or -1 if not found.',
  'Halve the search space each step', 20, ['Searching','Array'], [
  ['[1,3,5,7,9], t=7',3],['[1,3,5,7,9], t=1',0],['[1,3,5,7,9], t=9',4],
  ['[1,3,5,7,9], t=4',-1],['[2,4,6,8,10], t=6',2],['[2,4,6,8,10], t=2',0],
  ['[2,4,6,8,10], t=10',4],['[2,4,6,8,10], t=5',-1],
  ['[1,2,3,4,5,6,7], t=4',3],['[10,20,30,40,50], t=30',2],
  ['[10,20,30,40,50], t=10',0],['[10,20,30,40,50], t=50',4],
  ['[1,5,10,15,20], t=15',3],['[3,6,9,12,15], t=6',1],
  ['[1,2,3,4,5], t=5',4],['[1,2,3,4,5], t=1',0],
  ['[5,10,15,20,25], t=20',3],['[4,8,12,16,20], t=12',2],
  ['[1,3,5,7,9,11], t=11',5],['[2,6,10,14,18], t=6',1],
]);

const MM_GCD = gen('mm-gcd', (i) => `${i}`, 'Medium','Math',
  'Return the [[GCD]] (Greatest Common Divisor) using the Euclidean algorithm.',
  'gcd(a,b) = gcd(b, a%b)', 20, ['Math','Recursion'], [
  ['gcd(12,8)',4],['gcd(48,18)',6],['gcd(100,75)',25],['gcd(7,3)',1],
  ['gcd(9,6)',3],['gcd(28,21)',7],['gcd(56,98)',14],['gcd(15,5)',5],
  ['gcd(36,24)',12],['gcd(81,27)',27],['gcd(13,7)',1],['gcd(24,16)',8],
  ['gcd(30,45)',15],['gcd(60,40)',20],['gcd(100,60)',20],['gcd(42,28)',14],
  ['gcd(77,11)',11],['gcd(35,14)',7],['gcd(18,12)',6],['gcd(50,25)',25],
]);

const MM_STR = gen('mm-str', i => `Climb stairs: ${i}`, 'Medium','Recursion',
  'Count [[ways]] to climb n stairs taking 1 or 2 steps at a time.',
  'f(n)=f(n-1)+f(n-2); f(1)=1,f(2)=2', 20, ['Recursion','DP'], [
  ['n=1',1],['n=2',2],['n=3',3],['n=4',5],['n=5',8],['n=6',13],
  ['n=7',21],['n=8',34],['n=9',55],['n=10',89],['n=11',144],['n=12',233],
  ['n=13',377],['n=14',610],['n=15',987],['n=16',1597],['n=17',2584],
  ['n=18',4181],['n=19',6765],['n=20',10946],
]);

// ── HARD ─────────────────────────────────────────────────────
const HA_KAD = gen('ha-kad', (i) => `Max subarray sum in ${i}`, 'Hard','Arrays',
  'Find the [[maximum subarray sum]] (Kadane\'s algorithm).',
  'Track running sum, reset when negative', 40, ['Array','DP'], [
  ['[-2,1,-3,4,-1,2,1,-5,4]',6],['[1]',1],['[-2,-3,-4,-1]',-1],
  ['[5,4,-1,7,8]',23],['[1,-2,3,-4,5]',5],['[2,3,-4,5,6]',12],
  ['[-1,-2,-3]',-1],['[8,-2,3,-4,5]',10],['[4,-2,2,3,-5,8]',10],
  ['[3,5,-9,1,3,-2,3,4,-6,1]',9],['[-5,1,2,-3,4,-1]',4],
  ['[1,2,3,4,5]',15],['[6,-3,-2,7,-1]',8],
  ['[1,-1,1,-1,1]',1],['[2,-5,4,-3,5]',6],['[-2,-1,-3,-4]',-1],
  ['[10,-3,5,-2,4]',14],['[3,-2,5,-1,7]',12],['[1,2,-5,4,5]',9],
  ['[-1,3,-2,5,-3,2]',6],
]);

const HA_LNG = gen('ha-lng', (i) => `Longest no-repeat substr in ${i}`, 'Hard','Strings',
  'Find the [[length]] of the longest substring without [[repeating characters]].',
  'Sliding window with a set', 40, ['String','Sliding Window'], [
  ['"abcabcbb"',3],['"bbbbb"',1],['"pwwkew"',3],['"abcde"',5],
  ['"aab"',2],['"dvdf"',3],['"abba"',2],['"tmmzuxt"',5],
  ['"wobgrovw"',6],['"aabaab!bb"',3],['"geeksforgeeks"',7],
  ['"aaaaaa"',1],['"abcdefg"',7],['"au"',2],['"nfpdmpi"',5],
  ['"ohomm"',3],['"anviaj"',5],['"aabc"',3],['"abcdba"',4],['"cdd"',2],
]);

const HA_STR = gen('ha-str', i => `Climb stairs (hard): ${i}`, 'Hard','DP',
  'Count [[unique paths]] from top-left to bottom-right in m×n grid (right/down only).',
  'dp[i][j] = dp[i-1][j] + dp[i][j-1]', 40, ['DP','Math'], [
  ['2×2 grid',2],['2×3 grid',3],['3×2 grid',3],['3×3 grid',6],
  ['3×4 grid',10],['4×3 grid',10],['4×4 grid',20],['2×4 grid',4],
  ['4×2 grid',4],['5×5 grid',70],['2×5 grid',5],['5×2 grid',5],
  ['3×5 grid',15],['5×3 grid',15],['3×6 grid',21],['6×3 grid',21],
  ['4×5 grid',35],['5×4 grid',35],['2×6 grid',6],['6×2 grid',6],
]);

const HA_POW = gen('ha-pow', (i) => `${i} = ?`, 'Hard','Recursion',
  'Compute x raised to power n: [[x^n]] (n≥0). Use fast exponentiation.',
  'Multiply x by itself n times', 40, ['Recursion','Math'], [
  ['2^10',1024],['3^5',243],['5^3',125],['2^8',256],['4^4',256],
  ['7^2',49],['6^3',216],['2^15',32768],['3^7',2187],['10^3',1000],
  ['9^2',81],['2^12',4096],['5^4',625],['3^4',81],['4^3',64],
  ['8^3',512],['2^6',64],['7^3',343],['6^4',1296],['3^6',729],
]);

const HA_COIN = gen('ha-coin', (i) => `Min coins (denominations 1,2,5): ${i}`, 'Hard','DP',
  'Return the [[minimum coins]] to make the amount using denominations [1,2,5].',
  'DP bottom-up: try each coin at each amount', 40, ['DP','Greedy'], [
  ['amount=11',3],['amount=0',0],['amount=1',1],['amount=2',1],
  ['amount=3',2],['amount=4',2],['amount=5',1],['amount=6',2],
  ['amount=7',2],['amount=8',3],['amount=9',3],['amount=10',2],
  ['amount=12',4],['amount=15',3],['amount=20',4],['amount=25',5],
  ['amount=30',6],['amount=14',4],['amount=21',5],['amount=18',5],
]);

// ── ASSEMBLE & SHUFFLE ────────────────────────────────────────
const RAW = [
  ...EA_MAX,...EA_MIN,...EA_SUM,...EA_FST,...EA_LST,...EA_LEN,
  ...EA_IDX,...EA_EVN,...EA_ODD,...EA_2ND,
  ...ES_LEN,...ES_REV,...ES_PAL,...ES_VOW,...ES_UPR,...ES_FST,...ES_LST,
  ...EM_FAC,...EM_FIB,...EM_FZZ,...EM_POW,...EM_EVN,
  ...ES_STK,...ES_SRT,
  ...MA_TWO,...MA_MIS,...MA_DUP,...MA_ROT,...MA_DST,
  ...MS_ANA,...MS_CNT,...MS_RWD,...MS_LNG,
  ...MM_PAR,...MM_BIN,...MM_GCD,...MM_STR,
  ...HA_KAD,...HA_LNG,...HA_STR,...HA_POW,...HA_COIN,
];

export const ALL_QUESTIONS = shuffle(RAW);

export const CATEGORIES  = ['All','Arrays','Strings','Stack','Math','Sorting','Searching','Recursion','DP'];
export const DIFFICULTIES = ['All','Easy','Medium','Hard'];
