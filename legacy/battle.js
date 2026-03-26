const API_BASE = window.location.protocol === 'file:' ? 'http://localhost:3000/api' : '/api';
const PISTON_PROXY = window.location.protocol === 'file:' ? 'http://localhost:3000/api/piston/proxy' : '/api/piston/proxy'; // Fixed 401: uses backend proxy with UA header

let currentUser = '';
let currentLevel = 1;
let playerHp = 100;
let aiHp = 100;
let selectedLang = 'python';

// ── LANGUAGE CONFIGS ──────────────────────────────────────────
const LANGUAGES = {
  python:     { label:'Python 3',     version:'3.10.0', ext:'py',  comment:'# ',   tmpl: (fn,p)=>`# Write your solution\ndef ${fn}(${p}):\n    # Your code here\n    pass\n\n# Test\nprint(${fn}(${p.split(',')[0].trim() || 'n'}))` },
  javascript: { label:'JavaScript',   version:'18.15.0',ext:'js',  comment:'// ',  tmpl: (fn,p)=>`// Write your solution\nfunction ${fn}(${p}) {\n    // Your code here\n}\n\n// Test\nconsole.log(${fn}(${p.split(',')[0].trim() || 'n'}));` },
  cpp:        { label:'C++',          version:'10.2.0', ext:'cpp', comment:'// ',  tmpl: (fn,p)=>`#include <iostream>\n#include <vector>\nusing namespace std;\n\n// Write your solution\nint ${fn}(${p||'int n'}) {\n    // Your code here\n    return 0;\n}\n\nint main() {\n    cout << ${fn}(${p.split(',')[0].trim().split(' ').pop()||'n'}) << endl;\n    return 0;\n}` },
  java:       { label:'Java',         version:'15.0.2', ext:'java',comment:'// ',  tmpl: (fn,p)=>`public class Solution {\n    // Write your solution\n    public static int ${fn}(${p||'int n'}) {\n        // Your code here\n        return 0;\n    }\n    public static void main(String[] args) {\n        System.out.println(${fn}(${p.split(',')[0].trim().split(' ').pop()||'n'}));\n    }\n}` },
  c:          { label:'C',            version:'10.2.0', ext:'c',   comment:'// ',  tmpl: (fn,p)=>`#include <stdio.h>\n\n// Write your solution\nint ${fn}(${p||'int n'}) {\n    // Your code here\n    return 0;\n}\n\nint main() {\n    printf("%d\\n", ${fn}(${p.split(',')[0].trim().split(' ').pop()||'n'}));\n    return 0;\n}` },
  go:         { label:'Go',           version:'1.16.2', ext:'go',  comment:'// ',  tmpl: (fn,p)=>`package main\nimport "fmt"\n\n// Write your solution\nfunc ${fn}(${p||'n int'}) int {\n    // Your code here\n    return 0\n}\n\nfunc main() {\n    fmt.Println(${fn}(${p.split(',')[0].trim().split(' ')[0]||'n'}))\n}` },
  rust:       { label:'Rust',         version:'1.50.0', ext:'rs',  comment:'// ',  tmpl: (fn,p)=>`// Write your solution\nfn ${fn}(${p||'n: i32'}) -> i32 {\n    // Your code here\n    0\n}\n\nfn main() {\n    println!("{}", ${fn}(${p.split(',')[0].trim().split(':')[0].trim()||'n'}));\n}` },
  typescript: { label:'TypeScript',   version:'5.0.3',  ext:'ts',  comment:'// ',  tmpl: (fn,p)=>`// Write your solution\nfunction ${fn}(${p||'n: number'}): number {\n    // Your code here\n    return 0;\n}\n\nconsole.log(${fn}(${p.split(',')[0].trim().split(':')[0].trim()||'n'}));` },
  ruby:       { label:'Ruby',         version:'3.0.1',  ext:'rb',  comment:'# ',   tmpl: (fn,p)=>`# Write your solution\ndef ${fn}(${p||'n'})\n  # Your code here\nend\n\nputs ${fn}(${p.split(',')[0].trim()||'n'})` },
  php:        { label:'PHP',          version:'8.0.9',  ext:'php', comment:'// ',  tmpl: (fn,p)=>`<?php\n// Write your solution\nfunction ${fn}(${p.split(',').map(x=>('$'+x.trim())).join(', ')||'$n'}) {\n    // Your code here\n    return 0;\n}\n\necho ${fn}(${p.split(',').map(x=>('$'+x.trim())).join(', ')||'$n'});\n?>` },
  csharp:     { label:'C#',           version:'6.12.0', ext:'cs',  comment:'// ',  tmpl: (fn,p)=>`using System;\n\nclass Solution {\n    static int ${fn}(${p||'int n'}) {\n        // Your code here\n        return 0;\n    }\n    static void Main() {\n        Console.WriteLine(${fn}(${p.split(',')[0].trim().split(' ').pop()||'n'}));\n    }\n}` },
  kotlin:     { label:'Kotlin',       version:'1.6.0',  ext:'kts', comment:'// ',  tmpl: (fn,p)=>`// Write your solution\nfun ${fn}(${p||'n: Int'}): Int {\n    // Your code here\n    return 0\n}\n\nprintln(${fn}(${p.split(',')[0].trim().split(':')[0].trim()||'n'}))` },
  swift:      { label:'Swift',        version:'5.3.3',  ext:'swift',comment:'// ', tmpl: (fn,p)=>`// Write your solution\nfunc ${fn}(_ ${p||'n: Int'}) -> Int {\n    // Your code here\n    return 0\n}\n\nprint(${fn}(${p.split(',')[0].trim().split(':')[0].trim()||'n'}))` },
  bash:       { label:'Bash',         version:'5.1.0',  ext:'sh',  comment:'# ',   tmpl: (fn,p)=>`#!/bin/bash\n# Write your solution\n${fn}() {\n    # Your code here\n    echo "result"\n}\n\n${fn} ${p||'1'}` },
};

// ── LOCAL CHALLENGES ──────────────────────────────────────────
const LOCAL_CHALLENGES = [
  { id:1, title:'Two Sum',         fn:'twoSum',     params:'nums, target', desc:'Given an array and a target, return the indices of two numbers that add up to target.\nExample: twoSum([2,7,11,15], 9) → [0,1]',      testInput:'[2,7,11,15]\n9', expected:'0 1' },
  { id:2, title:'Reverse String',  fn:'reverseStr', params:'s',            desc:'Reverse a string without using .reverse().\nExample: reverseStr("hello") → "olleh"',                testInput:'hello',     expected:'olleh' },
  { id:3, title:'Find Maximum',    fn:'findMax',    params:'arr',          desc:'Return the maximum value in an array without using Math.max().\nExample: findMax([3,1,9,2]) → 9',              testInput:'3 1 9 2',  expected:'9' },
  { id:4, title:'FizzBuzz',        fn:'fizzBuzz',   params:'n',            desc:'Print numbers 1 to n. Multiples of 3 → Fizz, 5 → Buzz, both → FizzBuzz.\nExample: fizzBuzz(5) → 1 2 Fizz 4 Buzz', testInput:'5',        expected:'1\n2\nFizz\n4\nBuzz' },
  { id:5, title:'Palindrome Check',fn:'isPalin',    params:'s',            desc:'Return true if string is palindrome, false otherwise.\nExample: isPalin("racecar") → true',               testInput:'racecar',  expected:'true' },
];

let currentChallenge = LOCAL_CHALLENGES[0];

// ── DOM READY ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  currentUser = localStorage.getItem('brawl_current_user');
  if (!currentUser) { window.location.href = 'login.html'; return; }

  document.getElementById('player-name').textContent = currentUser.toUpperCase();
  document.getElementById('retreat-btn').addEventListener('click', () => window.location.href = 'lobby.html');

  buildLanguageSelector();
  buildLineNumbers();

  document.getElementById('code-input').addEventListener('input', buildLineNumbers);
  document.getElementById('lang-select').addEventListener('change', onLangChange);
  document.getElementById('attack-btn').addEventListener('click', executeCode);
  document.getElementById('run-btn').addEventListener('click', runCodeOnly);

  await initBattle();
});

// ── LANGUAGE SELECTOR ─────────────────────────────────────────
function buildLanguageSelector() {
  const sel = document.getElementById('lang-select');
  sel.innerHTML = '';
  Object.entries(LANGUAGES).forEach(([key, cfg]) => {
    const opt = document.createElement('option');
    opt.value = key;
    opt.textContent = cfg.label;
    if (key === selectedLang) opt.selected = true;
    sel.appendChild(opt);
  });
}

function onLangChange() {
  selectedLang = document.getElementById('lang-select').value;
  const cfg = LANGUAGES[selectedLang];
  const ch = currentChallenge;
  document.getElementById('code-input').value = cfg.tmpl(ch.fn, ch.params);
  buildLineNumbers();
  showBattleMessage(`🔄 Switched to ${cfg.label}`, false);
}

// ── LINE NUMBERS ──────────────────────────────────────────────
function buildLineNumbers() {
  const ta = document.getElementById('code-input');
  const lines = ta.value.split('\n').length;
  const el = document.querySelector('.editor-lines');
  if (el) el.innerHTML = Array.from({length: Math.max(lines, 6)}, (_, i) => i+1).join('<br>');
}

// ── INIT BATTLE ───────────────────────────────────────────────
async function initBattle() {
  // Pick challenge by level
  try {
    const ctrl = new AbortController();
    const to = setTimeout(() => ctrl.abort(), 4000);
    const r = await fetch(`${API_BASE}/user/profile/${currentUser}`, { signal: ctrl.signal });
    clearTimeout(to);
    if (r.ok) {
      const d = await r.json();
      currentLevel = Math.min(d.level || 1, 5);
    }
  } catch(e) { currentLevel = 1; }

  currentChallenge = LOCAL_CHALLENGES[currentLevel - 1] || LOCAL_CHALLENGES[0];
  showChallenge(currentChallenge);
}

function showChallenge(ch) {
  document.getElementById('challenge-level').textContent = currentLevel;
  document.getElementById('ai-name').textContent = `NEURAL_NET_V${currentLevel}`;
  document.getElementById('challenge-title').textContent = ch.title;
  document.getElementById('challenge-desc').textContent = ch.desc;
  // Set boilerplate for selected language
  const cfg = LANGUAGES[selectedLang];
  document.getElementById('code-input').value = cfg.tmpl(ch.fn, ch.params);
  buildLineNumbers();
  document.getElementById('loading-overlay').style.display = 'none';
  document.getElementById('challenge-content').style.display = 'block';
}

// ── PISTON API EXECUTION ──────────────────────────────────────
async function runWithPiston(code, lang) {
  const cfg = LANGUAGES[lang];
  const body = {
    language: lang,
    version: cfg.version || '*', // Backend will auto-resolve if this fails
    files: [{ name: `solution.${cfg.ext}`, content: code }],
    compile_timeout: 10000,
    run_timeout: 5000,
  };

  const resp = await fetch(PISTON_PROXY, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!resp.ok) {
    const errData = await resp.json().catch(() => ({}));
    throw new Error(`Piston Proxy Error: ${resp.status} ${errData.error || ''}`);
  }
  return await resp.json();
}

// ── RUN ONLY (Test without submitting) ───────────────────────
async function runCodeOnly() {
  const code = document.getElementById('code-input').value.trim();
  if (!code) return showBattleMessage('⚠ Write some code first!', true);

  const btn = document.getElementById('run-btn');
  btn.textContent = '⏳ Running...';
  btn.disabled = true;

  const output = document.getElementById('code-output');
  output.style.display = 'block';
  output.textContent = 'Running...';

  try {
    const result = await runWithPiston(code, selectedLang);
    const out = result.run?.stdout || '';
    const err = result.run?.stderr || result.compile?.stderr || '';
    if (err && !out) {
      output.style.color = '#ff6060';
      output.textContent = '❌ Error:\n' + err;
    } else {
      output.style.color = '#00ff73';
      output.textContent = '✅ Output:\n' + (out || '(no output)') + (err ? '\n⚠ Stderr:\n' + err : '');
    }
  } catch(e) {
    output.style.color = '#ff6060';
    output.textContent = '❌ Execution failed: ' + e.message + '\n(Check internet connection)';
  }
  btn.textContent = '▶ RUN';
  btn.disabled = false;
}

// ── EXECUTE & SUBMIT ─────────────────────────────────────────
async function executeCode() {
  const code = document.getElementById('code-input').value.trim();
  if (!code) return showBattleMessage('⚠ Write some code first!', true);

  const btn = document.getElementById('attack-btn');
  btn.classList.add('loading');
  btn.disabled = true;
  showBattleMessage('⚡ Executing your code...', false);

  const output = document.getElementById('code-output');
  output.style.display = 'block';
  output.style.color = '#aaa';
  output.textContent = 'Running against test cases...';

  try {
    const result = await runWithPiston(code, selectedLang);
    const stdout = (result.run?.stdout || '').trim();
    const stderr = result.run?.stderr || result.compile?.stderr || '';

    if (stderr && !stdout) {
      // Compilation/runtime error
      output.style.color = '#ff6060';
      output.textContent = '❌ ERROR:\n' + stderr;
      showBattleMessage('💥 Compilation/Runtime Error!', true);
      takeDamage(25, 'Syntax/Runtime Error');
    } else {
      output.style.color = '#888';
      output.textContent = `📤 Your Output:\n${stdout || '(empty)'}\n\n📋 Expected:\n${currentChallenge.expected}`;

      // Smart check: normalize whitespace and compare
      const normalize = s => s.replace(/\r/g,'').trim().replace(/\s+/g,' ');
      const isCorrect = normalize(stdout).includes(normalize(currentChallenge.expected)) ||
                        normalize(stdout) === normalize(currentChallenge.expected);

      if (isCorrect) {
        output.style.color = '#00ff73';
        output.textContent = `✅ CORRECT!\n📤 Output: ${stdout}\n🎯 Expected: ${currentChallenge.expected}`;
        showBattleMessage('⚔ Code accepted! Neural link established — entering arena!', false);
        updateHpBar('ai', 0);
        localStorage.setItem('brawl_coding_bonus', playerHp);
        setTimeout(() => window.location.href = 'arena.html', 1400);
      } else {
        output.style.color = '#ff9900';
        output.textContent = `❌ Wrong Answer!\n📤 Got:      "${stdout}"\n🎯 Expected: "${currentChallenge.expected}"`;
        showBattleMessage('Wrong output! AI counterattacks!', true);
        takeDamage(25, 'Wrong Answer');
      }
    }
  } catch(e) {
    output.style.color = '#ff6060';
    output.textContent = '❌ Connection Error: ' + e.message;
    showBattleMessage('⚠ Piston API unreachable. Check internet!', true);
  }

  btn.classList.remove('loading');
  btn.disabled = false;
}

// ── DAMAGE / HUD ──────────────────────────────────────────────
function takeDamage(amount, reason) {
  playerHp = Math.max(0, playerHp - amount);
  updateHpBar('player', playerHp);
  if (window.BrawlAudio) window.BrawlAudio.playDamageSound();
  if (playerHp <= 0) {
    setTimeout(() => showResultModal(false, 0), 800);
  }
}

function showBattleMessage(msg, isError = false) {
  const el = document.getElementById('battle-message');
  el.textContent = msg;
  el.style.color = isError ? '#ff6060' : '#00ff73';
}

function updateHpBar(side, amount) {
  const bar = document.getElementById(`${side}-hp-bar`);
  const num = document.getElementById(`${side}-hp-num`);
  if (!bar || !num) return;
  bar.style.width = Math.max(0, amount) + '%';
  num.textContent = Math.max(0, amount);
}

function showResultModal(isVictory, xpGained) {
  const modal = document.getElementById('result-modal');
  const title = document.getElementById('result-title');
  const msg   = document.getElementById('result-message');
  const xpSpan= document.getElementById('xp-gained');
  modal.classList.add('show');
  if (isVictory) {
    title.textContent = 'VICTORY'; title.style.color = '#00ff73';
    msg.textContent = 'Code accepted. Entering Fight Arena...';
    xpSpan.textContent = xpGained;
  } else {
    title.textContent = 'SYSTEM FAILURE'; title.style.color = '#ff1a1a';
    msg.textContent = 'Your HP reached zero. Retreat and try again.';
    if (xpSpan.parentElement) xpSpan.parentElement.style.display = 'none';
  }
  document.getElementById('next-level-btn').onclick = () => window.location.href = 'lobby.html';
}
