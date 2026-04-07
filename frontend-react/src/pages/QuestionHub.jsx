import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Search, Zap, ChevronLeft, Shuffle, Book, Tag,
  ChevronRight, BarChart2, Filter, Star,
} from 'lucide-react';
import { ALL_QUESTIONS, CATEGORIES, DIFFICULTIES } from '../data/questionsDB';
import './QuestionHub.css';

const PAGE_SIZE = 20;

const diffColor = { Easy: '#00ff73', Medium: '#a238ff', Hard: '#ff3c8d' };
const diffBg    = { Easy: 'rgba(0,255,115,0.08)', Medium: 'rgba(162,56,255,0.08)', Hard: 'rgba(255,60,141,0.08)' };

// ── Question Card ────────────────────────────────────────────
const QCard = React.memo(({ q, isSelected, onClick }) => {
  if (!q) return null;
  return (
    <div
      className={`q-card ${isSelected ? 'q-card-active' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        if (onClick) onClick(q);
      }}
      role="button"
      tabIndex={0}
      id={`q-${q.id || 'unknown'}`}
      style={{ cursor: 'pointer', position: 'relative', zIndex: 100, pointerEvents: 'auto' }}
    >
      <div className="qc-left">
        <span className="qc-title font-orbitron">{q.title || 'Untitled'}</span>
        <div className="qc-tags">
          {Array.isArray(q.tags) && q.tags.slice(0, 2).map((t, idx) => (
            <span key={t || idx} className="qc-tag">{t}</span>
          ))}
        </div>
      </div>
      <div className="qc-right">
        <span
          className="qc-diff font-orbitron"
          style={{ color: diffColor[q.difficulty || 'Easy'], background: diffBg[q.difficulty || 'Easy'] }}
        >
          {q.difficulty || 'Unknown'}
        </span>
        <span className="qc-xp font-orbitron">+{q.xp || 0}xp</span>
      </div>
    </div>
  );
});

// ── Preview Panel ────────────────────────────────────────────
const PreviewPanel = ({ q, onStart, onRandom }) => {
  return (
    <div className="preview-panel animate-fade-in">
      {!q ? (
        <div className="preview-empty">
          <Book size={40} className="pe-icon" />
          <p className="font-orbitron">SELECT A QUESTION</p>
          <span>Click any question from the list to view details.</span>
        </div>
      ) : (
        <>
          <div className="pp-diff-banner" style={{ background: diffBg[q.difficulty || 'Easy'], borderColor: diffColor[q.difficulty || 'Easy'] }}>
            <span className="pp-diff font-orbitron" style={{ color: diffColor[q.difficulty || 'Easy'] }}>
              {(q.difficulty || 'Unknown').toUpperCase()}
            </span>
            <span className="pp-cat font-orbitron">{q.category || 'Uncategorized'}</span>
            <span className="pp-xp font-orbitron"><Zap size={11} /> {q.xp || 0} XP</span>
          </div>

          <h2 className="pp-title font-orbitron">{q.title || 'Untitled'}</h2>

          <p className="pp-desc">{(q.description || '').replace(/\[\[|\]\]/g, '')}</p>

          {q.example && (
            <div className="pp-example">
              <div className="pp-ex-row">
                <span className="pp-ex-label font-orbitron">INPUT</span>
                <span className="pp-ex-val font-orbitron">{q.example.input}</span>
              </div>
              <div className="pp-ex-div"></div>
              <div className="pp-ex-row">
                <span className="pp-ex-label font-orbitron">OUTPUT</span>
                <span className="pp-ex-val font-orbitron" style={{ color: '#00ff73' }}>{q.example.output}</span>
              </div>
            </div>
          )}

          <div className="pp-tags">
            {Array.isArray(q.tags) && q.tags.map((t, idx) => (
              <span key={t || idx} className="pp-tag font-orbitron"><Tag size={9} />{t}</span>
            ))}
          </div>

          <div className="pp-hint font-orbitron">💡 {q.hint || 'No hint available'}</div>
        </>
      )}

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {!q && (
          <button className="pr-random-btn font-orbitron" onClick={onRandom} id="random-btn">
            <Shuffle size={15} /> RANDOM BATTLE
          </button>
        )}
        <button
          className="start-battle-btn font-orbitron"
          disabled={!q}
          onClick={() => q && onStart && onStart(q)}
          id="start-battle-btn"
          style={{ opacity: q ? 1 : 0.4, cursor: q ? 'pointer' : 'not-allowed' }}
        >
          <Zap size={18} /> START BATTLE ⚡
        </button>
      </div>
    </div>
  );
};

// ── Pagination Bar ───────────────────────────────────────────
const Pagination = ({ page, totalPages, onChange }) => {
  if (!totalPages || totalPages <= 1) return null;
  const pages = [];
  const start = Math.max(1, page - 2);
  const end   = Math.min(totalPages, start + 4);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="pagination font-orbitron">
      <button className="pg-btn" onClick={() => onChange(page - 1)} disabled={page <= 1}>
        <ChevronLeft size={14} />
      </button>
      {start > 1 && <><button className="pg-btn" onClick={() => onChange(1)}>1</button><span className="pg-dots">…</span></>}
      {pages.map(p => (
        <button key={p} className={`pg-btn ${p === page ? 'pg-active' : ''}`} onClick={() => onChange(p)}>{p}</button>
      ))}
      {end < totalPages && <><span className="pg-dots">…</span><button className="pg-btn" onClick={() => onChange(totalPages)}>{totalPages}</button></>}
      <button className="pg-btn" onClick={() => onChange(page + 1)} disabled={page >= totalPages}>
        <ChevronRight size={14} />
      </button>
    </div>
  );
};

// ── MAIN PAGE ────────────────────────────────────────────────
const QuestionHub = () => {
  const navigate  = useNavigate();
  const { user }  = useAuth();

  const initDiff = 'All';
  const [difficulty,  setDifficulty]  = useState(initDiff);
  const [category,    setCategory]    = useState('All');
  const [search,      setSearch]      = useState('');
  const [page,        setPage]        = useState(1);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  // ── Filter + Search ─────────────────────────────────────
  const filtered = useMemo(() => {
    if (!ALL_QUESTIONS || !Array.isArray(ALL_QUESTIONS)) return [];
    
    const s = (search || '').trim().toLowerCase();
    return ALL_QUESTIONS.filter(q => {
      if (!q) return false;
      const qDiff = q.difficulty || 'Easy';
      const qCat = q.category || 'Uncategorized';
      const qTitle = q.title || '';
      
      if (difficulty !== 'All' && qDiff !== difficulty) return false;
      if (category   !== 'All' && qCat   !== category)   return false;
      if (s && !qTitle.toLowerCase().includes(s) && !qCat.toLowerCase().includes(s)) return false;
      return true;
    });
  }, [difficulty, category, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const updateFilter = useCallback((setter) => (val) => {
    setter(val);
    setPage(1);
    setSelectedQuestion(null);
  }, []);

  const handleSelect = useCallback((q) => {
    setSelectedQuestion(q);
  }, []);

  const handleStart = useCallback((q) => {
    navigate('/battle', {
      state: {
        difficulty: q.difficulty,
        selectedQuestion: q,
      },
    });
  }, [navigate]);

  const handleRandom = useCallback(() => {
    const pool = filtered.length ? filtered : ALL_QUESTIONS;
    const q = pool[Math.floor(Math.random() * pool.length)];
    handleStart(q);
  }, [filtered, handleStart]);

  // Stats
  const counts = useMemo(() => {
    if (!ALL_QUESTIONS || !Array.isArray(ALL_QUESTIONS)) return { Easy: 0, Medium: 0, Hard: 0 };
    return {
      Easy:   ALL_QUESTIONS.filter(q => q?.difficulty === 'Easy').length,
      Medium: ALL_QUESTIONS.filter(q => q?.difficulty === 'Medium').length,
      Hard:   ALL_QUESTIONS.filter(q => q?.difficulty === 'Hard').length,
    };
  }, []);

  if (!ALL_QUESTIONS || !Array.isArray(ALL_QUESTIONS) || ALL_QUESTIONS.length === 0) {
    return (
      <div className="hub-screen">
        <div className="hub-bg">
          <div className="hub-grid"></div>
          <div className="hub-orb hub-orb-1"></div>
          <div className="hub-orb hub-orb-2"></div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', position: 'relative', zIndex: 10, color: '#fff' }}>
          <Book size={48} style={{ color: '#a238ff', marginBottom: '20px' }} />
          <h2 className="font-orbitron" style={{ fontSize: '1.2rem', letterSpacing: '4px' }}>Loading questions...</h2>
          <p className="font-orbitron" style={{ color: '#aaa', marginTop: '10px', fontSize: '0.6rem', letterSpacing: '2px' }}>Securely fetching battle data from the mainframe.</p>
          <button className="hub-back-btn font-orbitron" style={{ marginTop: '30px' }} onClick={() => navigate('/lobby')}>
            <ChevronLeft size={16} /> RETURN TO LOBBY
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="hub-screen">
      {/* ── ANIMATED BG ── */}
      <div className="hub-bg">
        <div className="hub-grid"></div>
        <div className="hub-orb hub-orb-1"></div>
        <div className="hub-orb hub-orb-2"></div>
      </div>

      {/* ── HEADER ── */}
      <header className="hub-header glass-panel">
        <button className="hub-back-btn font-orbitron" onClick={() => navigate('/lobby')} id="back-lobby-btn">
          <ChevronLeft size={16} /> LOBBY
        </button>

        <div className="hub-title-group">
          <Book size={22} className="hub-title-icon" />
          <div>
            <h1 className="hub-title font-orbitron">QUESTION HUB</h1>
            <p className="hub-subtitle font-orbitron">{ALL_QUESTIONS.length}+ CODING CHALLENGES</p>
          </div>
        </div>

        <div className="hub-stat-pills">
          {Object.entries(counts).map(([diff, cnt]) => (
            <div key={diff} className="hub-stat-pill font-orbitron" style={{ color: diffColor[diff] }}>
              <BarChart2 size={11} /> {cnt} {diff}
            </div>
          ))}
        </div>
      </header>

      {/* ── SEARCH BAR ── */}
      <div className="hub-search-bar">
        <div className="hub-search-wrap">
          <Search size={16} className="search-icon" />
          <input
            id="question-search"
            className="hub-search-input font-orbitron"
            type="text"
            placeholder="SEARCH QUESTIONS..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); setSelectedQuestion(null); }}
          />
        </div>
        <div className="hub-result-count font-orbitron">
          {filtered.length} RESULTS
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="hub-body">

        {/* ── LEFT: FILTERS ── */}
        <aside className="hub-filters glass-panel">
          <div className="filt-section">
            <div className="filt-label font-orbitron"><Filter size={12} /> DIFFICULTY</div>
            <div className="filt-chips">
              {DIFFICULTIES.map(d => (
                <button
                  key={d}
                  className={`filt-chip font-orbitron ${difficulty === d ? 'filt-active' : ''}`}
                  style={difficulty === d && d !== 'All' ? { color: diffColor[d], borderColor: diffColor[d], background: diffBg[d] } : {}}
                  onClick={() => updateFilter(setDifficulty)(d)}
                  id={`diff-${d}`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="filt-section">
            <div className="filt-label font-orbitron"><Tag size={12} /> CATEGORY</div>
            <div className="filt-cat-list">
              {CATEGORIES.map(c => (
                <button
                  key={c}
                  className={`filt-cat-btn font-orbitron ${category === c ? 'filt-cat-active' : ''}`}
                  onClick={() => updateFilter(setCategory)(c)}
                  id={`cat-${c.replace(/\s/g,'-')}`}
                >
                  {c}
                  <span className="filt-cat-count">
                    {c === 'All' ? ALL_QUESTIONS.length : ALL_QUESTIONS.filter(q => q.category === c).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <button className="hub-random-btn font-orbitron" onClick={handleRandom} id="sidebar-random-btn">
            <Shuffle size={14} /> RANDOM BATTLE
          </button>
        </aside>

        {/* ── CENTER: QUESTION LIST ── */}
        <main className="hub-list">
          <div className="hub-list-inner">
            {currentPage.length === 0 ? (
              <div className="hub-empty font-orbitron">
                <Star size={32} />
                <p>NO QUESTIONS FOUND</p>
                <span>Try a different filter or search term.</span>
              </div>
            ) : (
              currentPage.map(q => (
                <QCard
                  key={q.id}
                  q={q}
                  isSelected={selectedQuestion?.id === q.id}
                  onClick={handleSelect}
                />
              ))
            )}
          </div>

          {totalPages > 1 && (
            <Pagination page={page} totalPages={totalPages} onChange={p => { setPage(p); setSelectedQuestion(null); }} />
          )}
        </main>

        {/* ── RIGHT: PREVIEW ── */}
        <aside className="hub-preview">
          <PreviewPanel q={selectedQuestion} onStart={handleStart} onRandom={handleRandom} />
        </aside>

      </div>
    </div>
  );
};

export default QuestionHub;
