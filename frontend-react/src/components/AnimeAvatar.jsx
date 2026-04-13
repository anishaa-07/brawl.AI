/**
 * AnimeAvatar.jsx
 * Generates a unique cyberpunk-styled avatar locally via inline SVG.
 * Zero external API calls. Works offline. Seeded by username.
 */
import React, { useMemo } from 'react';

/* ── Palette pools ── */
const CYBER_PALETTES = [
  { bg: ['#0d1f2d', '#0a3d4a'], accent: '#00f2ff', secondary: '#a855f7' },
  { bg: ['#1a0d2e', '#2d0a4a'], accent: '#a855f7', secondary: '#00f2ff' },
  { bg: ['#0d2d1a', '#0a4a2d'], accent: '#00ff88', secondary: '#00f2ff' },
  { bg: ['#2d1a0d', '#4a2d0a'], accent: '#ffbd2e', secondary: '#ff6b35' },
  { bg: ['#2d0a1a', '#4a0a2d'], accent: '#ff4060', secondary: '#a855f7' },
  { bg: ['#0a1a2d', '#0a2d4a'], accent: '#00f2ff', secondary: '#00ff88' },
];

const FEMALE_SHAPES = ['♀', '✦', '◈', '⬡', '✧'];
const MALE_SHAPES   = ['♂', '◆', '⬢', '▲', '✦'];

/* ── Deterministic hash from string ── */
const hashStr = (str) => {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) + h) + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
};

/* ── Gender detection ── */
const detectGender = (name = '') =>
  /aa$|[ai]$/i.test(name.trim()) ? 'female' : 'male';

/* ── Generate avatar data from username + seed ── */
const genAvatar = (username, seed) => {
  const combined = `${username}_${seed}`;
  const h        = hashStr(combined);
  const gender   = detectGender(username);
  const palette  = CYBER_PALETTES[h % CYBER_PALETTES.length];
  const shapes   = gender === 'female' ? FEMALE_SHAPES : MALE_SHAPES;
  const symbol   = shapes[h % shapes.length];
  const initials = username.slice(0, 2).toUpperCase();
  const rotation = (h % 360);
  return { palette, symbol, initials, rotation, gender };
};

const AnimeAvatar = ({ username = 'ANON', seed = '0', size = 120 }) => {
  const av = useMemo(() => genAvatar(username, seed), [username, seed]);
  const { palette, symbol, initials, rotation } = av;
  const r = size / 2;
  const id = `av_${hashStr(username + seed)}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ borderRadius: '50%', display: 'block' }}
    >
      <defs>
        {/* Background gradient */}
        <radialGradient id={`bg_${id}`} cx="40%" cy="35%" r="70%">
          <stop offset="0%"   stopColor={palette.bg[0]} />
          <stop offset="100%" stopColor={palette.bg[1]} />
        </radialGradient>

        {/* Accent ring gradient */}
        <linearGradient id={`ring_${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor={palette.accent} />
          <stop offset="100%" stopColor={palette.secondary} />
        </linearGradient>

        {/* Clip to circle */}
        <clipPath id={`clip_${id}`}>
          <circle cx={r} cy={r} r={r} />
        </clipPath>

        {/* Glow filter */}
        <filter id={`glow_${id}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Base circle */}
      <circle cx={r} cy={r} r={r} fill={`url(#bg_${id})`} />

      {/* Hex grid overlay */}
      <g clipPath={`url(#clip_${id})`} opacity="0.15">
        {Array.from({ length: 6 }, (_, row) =>
          Array.from({ length: 6 }, (_, col) => {
            const x = col * 22 - 5 + (row % 2 === 0 ? 11 : 0);
            const y = row * 19 - 5;
            return (
              <polygon
                key={`${row}-${col}`}
                points={[
                  [x + 11, y],
                  [x + 22, y + 5],
                  [x + 22, y + 14],
                  [x + 11, y + 19],
                  [x, y + 14],
                  [x, y + 5],
                ].map(p => p.join(',')).join(' ')}
                fill="none"
                stroke={palette.accent}
                strokeWidth="0.5"
              />
            );
          })
        )}
      </g>

      {/* Scan line overlay */}
      <g clipPath={`url(#clip_${id})`} opacity="0.07">
        {Array.from({ length: 30 }, (_, i) => (
          <line
            key={i}
            x1="0" y1={i * 4}
            x2={size} y2={i * 4}
            stroke={palette.accent}
            strokeWidth="1"
          />
        ))}
      </g>

      {/* Inner glow circle */}
      <circle
        cx={r} cy={r} r={r * 0.55}
        fill="none"
        stroke={palette.accent}
        strokeWidth="0.5"
        opacity="0.25"
        filter={`url(#glow_${id})`}
      />

      {/* Corner accent marks */}
      {[[r, r * 0.22], [r, r * 1.78], [r * 0.22, r], [r * 1.78, r]].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="2" fill={palette.accent} opacity="0.5" />
      ))}

      {/* Symbol (gender indicator) */}
      <text
        x={r} y={r * 0.52}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={size * 0.18}
        fill={palette.accent}
        opacity="0.35"
        filter={`url(#glow_${id})`}
        style={{ userSelect: 'none' }}
      >
        {symbol}
      </text>

      {/* Initials — main text */}
      <text
        x={r} y={r * 1.12}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={size * 0.32}
        fontWeight="900"
        fontFamily="'Orbitron', monospace"
        letterSpacing="2"
        fill="white"
        filter={`url(#glow_${id})`}
        style={{ userSelect: 'none' }}
      >
        {initials}
      </text>

      {/* Neon underline */}
      <line
        x1={r - size * 0.2} y1={r * 1.45}
        x2={r + size * 0.2} y2={r * 1.45}
        stroke={`url(#ring_${id})`}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.7"
      />

      {/* Outer ring accent */}
      <circle
        cx={r} cy={r} r={r - 2}
        fill="none"
        stroke={`url(#ring_${id})`}
        strokeWidth="1.5"
        opacity="0.4"
        strokeDasharray={`${r * 0.4} ${r * 0.2}`}
        strokeDashoffset={rotation}
      />
    </svg>
  );
};

export default AnimeAvatar;
