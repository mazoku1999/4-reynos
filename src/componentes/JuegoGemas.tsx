'use client';

/* eslint-disable @next/next/no-img-element */

/**
 * JuegoGemas v7 — Pixel-Art Canvas Engine + Teoría de Multiplicación
 * 
 * Misión 1: El Laberinto del Saber
 * - Sección de teoría con Llama Yachay (Factores, Producto, Multiplicando, Multiplicador)
 * - Ejercicios de multiplicación de tres cifras
 * - Mazmorra pixel-art con cofres
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { PROBLEMAS_MISION1, REGLA_MISION1, TEORIA_MULTIPLICACION } from '@/datos/misionesCapibara';
import BotonSaltarMision from './BotonSaltarMision';
import { anunciarSR } from '@/lib/accesibilidad';
import type { TipoSonido } from '@/hooks/useSonido';

interface Props {
  alCompletar: () => void;
  alCerrar: () => void;
  reproducir: (tipo: TipoSonido) => void;
}

// ===== CONSTANTS =====
const T = 16; // tile size in pixels (low res pixel art)
const COLS = 21;
const ROWS = 13;
const MAP_W = COLS * T; // 336px
const MAP_H = ROWS * T; // 208px

// 0=wall, 1=floor, 2=path, 3=wall_top_face
const DUNGEON_MAP = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,1,1,2,2,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,1,1,2,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,1,1,2,1,1,2,2,2,2,2,2,1,1,1,1,1,1,1,1,0],
  [0,1,1,2,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,0],
  [0,1,1,2,1,1,1,1,1,1,1,2,2,2,2,2,2,1,1,1,0],
  [0,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,1,0],
  [0,1,1,2,2,2,2,2,1,1,1,1,1,1,1,1,2,1,1,1,0],
  [0,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,2,1,1,1,0],
  [0,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,1,1,1,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

const WAYPOINTS: [number, number][] = [
  [3,1],[3,3],[6,3],[11,3],[11,5],[16,5],[16,7],[16,9],[7,9],[7,7],[4,7],[3,7],[3,4],
];
const COFRE_WPS = [1, 3, 5, 7, 9, 11];
const TORCHES: [number,number][] = [[1,1],[19,1],[1,11],[19,11],[10,1],[10,11],[1,6],[19,6]];

// Decorations (col, row, type)
const DECOR: { c: number; r: number; t: 'skull'|'bones'|'puddle'|'cracks'|'cobweb'|'mushroom' }[] = [
  {c:5,r:1,t:'skull'},{c:14,r:2,t:'bones'},{c:8,r:6,t:'puddle'},{c:13,r:8,t:'cracks'},
  {c:2,r:10,t:'bones'},{c:18,r:3,t:'cobweb'},{c:15,r:10,t:'mushroom'},{c:9,r:4,t:'cracks'},
  {c:17,r:1,t:'skull'},{c:6,r:10,t:'puddle'},{c:12,r:6,t:'mushroom'},{c:4,r:9,t:'bones'},
];

// Seeded pseudo-random for consistent tile variation
function hash(x: number, y: number) { return ((x * 374761393 + y * 668265263) >>> 0) / 4294967296; }

export default function JuegoGemas({ alCompletar, alCerrar, reproducir }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mostrarTeoria, setMostrarTeoria] = useState(true);
  const [gemasOk, setGemasOk] = useState<number[]>([]);
  const [cofreActivo, setCofreActivo] = useState<number | null>(null);
  const [seleccion, setSeleccion] = useState<number | null>(null);
  const [resultado, setResultado] = useState<'correcto' | 'incorrecto' | null>(null);
  const [pista, setPista] = useState(false);
  const [victoria, setVictoria] = useState(false);

  const gameRef = useRef({
    playerWP: 0, playerX: 0, playerY: 0, targetX: 0, targetY: 0,
    moving: false, frame: 0,
    particles: [] as { x:number;y:number;vx:number;vy:number;life:number;maxLife:number;color:string;size:number }[],
    dustMotes: [] as { x:number;y:number;vx:number;vy:number;alpha:number;phase:number }[],
    embers: [] as { x:number;y:number;vx:number;vy:number;life:number }[],
  });

  const total = PROBLEMAS_MISION1.length;

  // ===== CANVAS GAME LOOP =====
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false })!;
    if (!ctx) return;

    // LOW-RES render: canvas is MAP_W x MAP_H, CSS scales it up
    canvas.width = MAP_W;
    canvas.height = MAP_H;
    ctx.imageSmoothingEnabled = false;

    const g = gameRef.current;
    // Start player AT the first chest (COFRE_WPS[0] -> WAYPOINTS[1])
    const startWP = COFRE_WPS[0];
    const [sx, sy] = WAYPOINTS[startWP];
    if (g.frame === 0) {
      g.playerX = sx * T + T / 2;
      g.playerY = sy * T + T / 2;
      g.targetX = g.playerX;
      g.targetY = g.playerY;
      g.playerWP = startWP;
    }

    // Init dust motes
    if (g.dustMotes.length === 0) {
      for (let i = 0; i < 30; i++) {
        g.dustMotes.push({
          x: Math.random() * MAP_W, y: Math.random() * MAP_H,
          vx: (Math.random() - 0.5) * 0.15, vy: -Math.random() * 0.1 - 0.02,
          alpha: Math.random() * 0.4, phase: Math.random() * Math.PI * 2,
        });
      }
    }

    let animId: number;
    let running = true;

    // === DRAW FUNCTIONS ===

    function pixel(x: number, y: number, color?: string) {
      if (color) ctx.fillStyle = color;
      ctx.fillRect(Math.floor(x), Math.floor(y), 1, 1);
    }

    function drawWall(c: number, r: number) {
      const x = c * T, y = r * T;
      const h = hash(c, r);

      // Base dark stone
      ctx.fillStyle = h > 0.5 ? '#2c2136' : '#261c30';
      ctx.fillRect(x, y, T, T);

      // Stone bricks pattern
      const brickH = 5;
      const offset = (r % 2) * 4;
      for (let by = 0; by < T; by += brickH) {
        for (let bx = offset; bx < T; bx += 8) {
          // Brick outline
          ctx.fillStyle = 'rgba(60,45,70,0.4)';
          ctx.fillRect(x + bx, y + by, 7, brickH - 1);
          // Brick highlight top
          ctx.fillStyle = 'rgba(80,60,90,0.3)';
          ctx.fillRect(x + bx, y + by, 7, 1);
          // Mortar line
          ctx.fillStyle = 'rgba(20,14,28,0.6)';
          ctx.fillRect(x + bx, y + by + brickH - 1, 8, 1);
        }
      }

      // Moss on some bricks
      if (h > 0.7) {
        ctx.fillStyle = '#1a3a1a';
        ctx.fillRect(x + 2, y + T - 3, 3, 2);
        pixel(x + 1, y + T - 4, '#224422');
      }

      // Edge highlight (adjacent to floor)
      if (r < ROWS - 1 && DUNGEON_MAP[r + 1]?.[c] !== 0) {
        ctx.fillStyle = 'rgba(90,70,100,0.4)';
        ctx.fillRect(x, y + T - 1, T, 1);
      }
      if (c < COLS - 1 && DUNGEON_MAP[r]?.[c + 1] !== 0) {
        ctx.fillStyle = 'rgba(80,60,90,0.25)';
        ctx.fillRect(x + T - 1, y, 1, T);
      }
    }

    function drawFloor(c: number, r: number) {
      const x = c * T, y = r * T;
      const h = hash(c, r);

      // Base color with slight variation
      const base = h > 0.6 ? '#1e1832' : h > 0.3 ? '#1c1630' : '#1a142e';
      ctx.fillStyle = base;
      ctx.fillRect(x, y, T, T);

      // Stone tile pattern
      ctx.fillStyle = 'rgba(40,30,55,0.2)';
      ctx.fillRect(x, y, T, 1);      // top edge
      ctx.fillRect(x, y, 1, T);      // left edge
      ctx.fillStyle = 'rgba(15,10,25,0.3)';
      ctx.fillRect(x, y + T - 1, T, 1); // bottom
      ctx.fillRect(x + T - 1, y, 1, T); // right

      // Random small details
      if (h > 0.8) {
        pixel(x + 4, y + 7, 'rgba(30,22,45,0.5)');
        pixel(x + 11, y + 3, 'rgba(30,22,45,0.4)');
      }
      if (h > 0.85) {
        // Tiny crack
        ctx.fillStyle = 'rgba(10,6,18,0.4)';
        ctx.fillRect(x + 6, y + 4, 4, 1);
        ctx.fillRect(x + 9, y + 5, 1, 3);
      }
    }

    function drawPath(c: number, r: number) {
      const x = c * T, y = r * T;
      const h = hash(c, r);

      // Lighter cobblestone
      ctx.fillStyle = h > 0.5 ? '#2e2545' : '#302748';
      ctx.fillRect(x, y, T, T);

      // Cobblestone pattern (varied stones)
      const stones = [
        [1,1,6,5], [8,1,7,5], [2,7,5,4], [8,7,7,4], [1,12,6,3], [8,12,7,3],
      ];
      for (const [sx, sy, sw, sh] of stones) {
        const sh2 = hash(c + sx, r + sy);
        ctx.fillStyle = sh2 > 0.5 ? '#352c50' : '#2d2542';
        ctx.fillRect(x + sx, y + sy, sw, sh);
        // Highlight
        ctx.fillStyle = 'rgba(60,48,80,0.3)';
        ctx.fillRect(x + sx, y + sy, sw, 1);
        ctx.fillRect(x + sx, y + sy, 1, sh);
        // Shadow
        ctx.fillStyle = 'rgba(15,10,25,0.3)';
        ctx.fillRect(x + sx, y + sy + sh - 1, sw, 1);
      }

      // Golden glow subtle
      ctx.fillStyle = 'rgba(240,192,64,0.02)';
      ctx.fillRect(x, y, T, T);
    }

    function drawDecoration(d: typeof DECOR[0], frame: number) {
      const x = d.c * T, y = d.r * T;
      ctx.globalAlpha = 0.5;
      switch (d.t) {
        case 'skull':
          ctx.fillStyle = '#8a7a6a';
          ctx.fillRect(x+5, y+6, 6, 5); // head
          ctx.fillStyle = '#1a1222';
          pixel(x+6, y+8); pixel(x+9, y+8); // eyes
          ctx.fillStyle = '#6a5a4a';
          ctx.fillRect(x+6, y+11, 4, 2); // jaw
          break;
        case 'bones':
          ctx.fillStyle = '#7a6a5a';
          ctx.fillRect(x+2, y+10, 8, 1);
          ctx.fillRect(x+5, y+8, 1, 5);
          pixel(x+1, y+9); pixel(x+10, y+11);
          break;
        case 'puddle':
          ctx.fillStyle = '#1a2040';
          ctx.fillRect(x+3, y+8, 10, 4);
          ctx.fillStyle = 'rgba(40,50,90,0.4)';
          ctx.fillRect(x+4, y+9, 8, 2);
          // Ripple
          if (Math.sin(frame * 0.03 + d.c) > 0.7) {
            ctx.fillStyle = 'rgba(60,70,120,0.3)';
            pixel(x + 7, y + 9);
          }
          break;
        case 'cracks':
          ctx.fillStyle = 'rgba(10,6,18,0.5)';
          ctx.fillRect(x+3, y+5, 1, 6);
          ctx.fillRect(x+4, y+8, 5, 1);
          ctx.fillRect(x+8, y+6, 1, 3);
          break;
        case 'cobweb':
          ctx.fillStyle = 'rgba(200,200,220,0.15)';
          for (let i = 0; i < 5; i++) {
            pixel(x + i, y + i);
            pixel(x + i + 1, y + i);
          }
          pixel(x + 3, y + 1); pixel(x + 1, y + 3);
          break;
        case 'mushroom':
          ctx.fillStyle = '#553366';
          ctx.fillRect(x+7, y+11, 2, 3);
          ctx.fillStyle = '#7744aa';
          ctx.fillRect(x+5, y+9, 6, 3);
          ctx.fillStyle = '#9966cc';
          pixel(x+6, y+10); pixel(x+9, y+10);
          break;
      }
      ctx.globalAlpha = 1;
    }

    function drawTorch(c: number, r: number, frame: number) {
      const cx = c * T + T / 2, cy = r * T + T / 2;
      const flicker = Math.sin(frame * 0.2 + c * 3) * 0.3;

      // Light radius
      const radius = T * 3 + flicker * T;
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      gradient.addColorStop(0, `rgba(255,150,50,${0.12 + flicker * 0.04})`);
      gradient.addColorStop(0.3, `rgba(255,100,30,${0.06 + flicker * 0.02})`);
      gradient.addColorStop(0.6, `rgba(200,60,10,${0.02})`);
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      // Bracket
      ctx.fillStyle = '#5a4a3a';
      ctx.fillRect(cx - 1, cy + 1, 3, 5);
      ctx.fillStyle = '#7a6a5a';
      ctx.fillRect(cx - 2, cy, 5, 2);

      // Flame core
      const fh = 4 + Math.sin(frame * 0.25 + c) * 1.5;
      ctx.fillStyle = '#ff8820';
      ctx.fillRect(cx - 2, cy - fh, 4, fh);
      ctx.fillStyle = '#ffcc44';
      ctx.fillRect(cx - 1, cy - fh + 1, 2, fh - 2);
      ctx.fillStyle = '#ffffaa';
      pixel(cx, cy - fh / 2);

      // Tip
      ctx.fillStyle = '#ff6600';
      pixel(cx - 1, cy - fh - 1);
      pixel(cx + 1, cy - fh - 1);
      ctx.fillStyle = '#ff4400';
      pixel(cx, cy - fh - 2);

      // Ember particles
      if (frame % 8 === 0 && hash(frame, c) > 0.5) {
        g.embers.push({
          x: cx + (Math.random() - 0.5) * 4,
          y: cy - fh,
          vx: (Math.random() - 0.5) * 0.3,
          vy: -Math.random() * 0.4 - 0.1,
          life: 30 + Math.random() * 20,
        });
      }
    }

    function drawChest(c: number, r: number, index: number, solved: boolean, isActive: boolean, frame: number) {
      const x = c * T + 2, y = r * T + 3;
      const w = 12, h = 9;

      if (isActive) {
        // Glow halo
        const glow = Math.sin(frame * 0.06) * 0.15 + 0.25;
        const grad = ctx.createRadialGradient(x + w/2, y + h/2, 0, x + w/2, y + h/2, T);
        grad.addColorStop(0, `rgba(240,192,64,${glow})`);
        grad.addColorStop(1, 'rgba(240,192,64,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x + w/2, y + h/2, T, 0, Math.PI * 2);
        ctx.fill();

        // Sparkles
        const sparkT = (frame * 0.05) % (Math.PI * 2);
        for (let i = 0; i < 4; i++) {
          const a = sparkT + i * Math.PI / 2;
          const sx = x + w/2 + Math.cos(a) * 10;
          const sy = y + h/2 + Math.sin(a) * 8;
          if (Math.sin(frame * 0.1 + i) > 0) {
            pixel(sx, sy, '#ffe080');
          }
        }
      }

      if (solved) {
        // Gem floating
        const gy = y - 4 + Math.sin(frame * 0.04) * 2;
        // Gem glow
        const gg = ctx.createRadialGradient(x+w/2, gy+3, 0, x+w/2, gy+3, 8);
        gg.addColorStop(0, 'rgba(120,80,220,0.25)');
        gg.addColorStop(1, 'rgba(120,80,220,0)');
        ctx.fillStyle = gg;
        ctx.beginPath();
        ctx.arc(x+w/2, gy+3, 8, 0, Math.PI * 2);
        ctx.fill();
        // Diamond
        ctx.fillStyle = '#7744cc';
        ctx.beginPath();
        ctx.moveTo(x+w/2, gy); ctx.lineTo(x+w/2+4, gy+3); ctx.lineTo(x+w/2, gy+6); ctx.lineTo(x+w/2-4, gy+3);
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#9966ee';
        ctx.beginPath();
        ctx.moveTo(x+w/2, gy); ctx.lineTo(x+w/2+4, gy+3); ctx.lineTo(x+w/2, gy+2); ctx.lineTo(x+w/2-2, gy+1);
        ctx.closePath(); ctx.fill();
        // Highlight
        pixel(x+w/2-1, gy+1, '#ccaaff');
      } else {
        // Chest body
        const alpha = isActive ? 1 : 0.35;
        ctx.globalAlpha = alpha;

        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.fillRect(x+1, y+h, w, 2);

        // Body
        ctx.fillStyle = '#6b4a2a';
        ctx.fillRect(x, y+3, w, h-3);
        // Lid
        ctx.fillStyle = '#7a5a3a';
        ctx.fillRect(x, y, w, 4);
        ctx.fillStyle = '#8a6a4a';
        ctx.fillRect(x+1, y+1, w-2, 2); // lid highlight

        // Gold bands
        ctx.fillStyle = '#d4a030';
        ctx.fillRect(x, y+3, w, 1);
        ctx.fillRect(x+w/2-1, y, 2, h);
        // Lock
        ctx.fillStyle = '#f0c040';
        pixel(x+w/2, y+5);
        pixel(x+w/2-1, y+5);

        // Edge highlights
        ctx.fillStyle = '#8a6a3a';
        ctx.fillRect(x, y, w, 1); // top
        ctx.fillStyle = '#4a3018';
        ctx.fillRect(x, y+h-1, w, 1); // bottom

        ctx.globalAlpha = 1;
      }

      // Number label
      ctx.fillStyle = solved ? '#9966ee' : (isActive ? '#f0c040' : 'rgba(255,255,255,0.15)');
      ctx.font = '5px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${index + 1}`, x + w/2, y + h + 8);
    }

    function drawPlayer(frame: number) {
      const px = Math.floor(g.playerX), py = Math.floor(g.playerY);
      const bob = g.moving ? Math.sin(frame * 0.3) * 2 : Math.sin(frame * 0.06) * 0.8;

      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.fillRect(px - 5, py + 6, 10, 3);

      const by = py + bob;

      // Body (white llama)
      ctx.fillStyle = '#f0e8d8';
      ctx.fillRect(px - 4, by - 4, 8, 10); // torso

      // Neck
      ctx.fillStyle = '#ece0d0';
      ctx.fillRect(px - 1, by - 10, 4, 7);

      // Head
      ctx.fillStyle = '#f0e8d8';
      ctx.fillRect(px - 2, by - 14, 6, 5);

      // Ears
      ctx.fillStyle = '#e0d0c0';
      ctx.fillRect(px - 2, by - 17, 2, 4);
      ctx.fillRect(px + 3, by - 17, 2, 4);
      // Inner ear
      ctx.fillStyle = '#daa';
      pixel(px - 1, by - 16);
      pixel(px + 3, by - 16);

      // Eyes
      ctx.fillStyle = '#221122';
      pixel(px - 1, by - 12);
      pixel(px + 2, by - 12);
      // Eye shine
      ctx.fillStyle = '#ffffff';
      pixel(px - 1, by - 13);

      // Mouth
      ctx.fillStyle = '#c0a090';
      pixel(px, by - 10);
      pixel(px + 1, by - 10);

      // Legs
      ctx.fillStyle = '#d8d0c0';
      const legOff = g.moving ? Math.sin(frame * 0.4) * 1.5 : 0;
      ctx.fillRect(px - 3, by + 5 + legOff, 2, 4);
      ctx.fillRect(px + 2, by + 5 - legOff, 2, 4);
      // Hooves
      ctx.fillStyle = '#8a7a6a';
      ctx.fillRect(px - 3, by + 8 + legOff, 2, 1);
      ctx.fillRect(px + 2, by + 8 - legOff, 2, 1);

      // Cape (purple, flowing)
      const capeWave = Math.sin(frame * 0.08) * 1;
      ctx.fillStyle = '#6633aa';
      ctx.fillRect(px + 3, by - 6, 3, 8 + capeWave);
      ctx.fillStyle = '#7744bb';
      ctx.fillRect(px + 3, by - 6, 3, 1); // cape top highlight
      ctx.fillStyle = '#5522aa';
      pixel(px + 5, by + 1 + capeWave); // cape tip

      // Crown
      ctx.fillStyle = '#f0c040';
      ctx.fillRect(px - 2, by - 18, 6, 2);
      ctx.fillStyle = '#ffe060';
      pixel(px - 1, by - 19);
      pixel(px + 1, by - 20);
      pixel(px + 3, by - 19);
      // Jewel
      ctx.fillStyle = '#ff3333';
      pixel(px + 1, by - 18);
    }

    function drawDustMotes(frame: number) {
      for (const m of g.dustMotes) {
        m.x += m.vx + Math.sin(frame * 0.01 + m.phase) * 0.05;
        m.y += m.vy;
        m.alpha = 0.15 + Math.sin(frame * 0.02 + m.phase) * 0.1;
        if (m.y < 0) { m.y = MAP_H; m.x = Math.random() * MAP_W; }
        if (m.x < 0) m.x = MAP_W;
        if (m.x > MAP_W) m.x = 0;
        ctx.globalAlpha = Math.max(0, m.alpha);
        ctx.fillStyle = '#ffe8c0';
        pixel(Math.floor(m.x), Math.floor(m.y), '#ffe8c0');
      }
      ctx.globalAlpha = 1;
    }

    function drawEmbers() {
      g.embers = g.embers.filter(e => e.life > 0);
      for (const e of g.embers) {
        e.x += e.vx; e.y += e.vy; e.life--;
        ctx.globalAlpha = e.life / 50;
        const col = e.life > 20 ? '#ff8830' : '#ff4400';
        pixel(Math.floor(e.x), Math.floor(e.y), col);
      }
      ctx.globalAlpha = 1;
    }

    function drawParticles() {
      g.particles = g.particles.filter(p => p.life > 0);
      for (const p of g.particles) {
        p.x += p.vx; p.y += p.vy; p.vy += 0.03; p.life--;
        ctx.globalAlpha = p.life / p.maxLife;
        ctx.fillStyle = p.color;
        const s = p.size * (p.life / p.maxLife);
        ctx.fillRect(Math.floor(p.x) - s/2, Math.floor(p.y) - s/2, Math.ceil(s), Math.ceil(s));
      }
      ctx.globalAlpha = 1;
    }

    function drawMinimap() {
      const mx = MAP_W - 46, my = 4, ms = 2;
      // Background
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(mx - 2, my - 2, COLS * ms + 4, ROWS * ms + 4);
      ctx.strokeStyle = 'rgba(240,192,64,0.2)';
      ctx.lineWidth = 0.5;
      ctx.strokeRect(mx - 2, my - 2, COLS * ms + 4, ROWS * ms + 4);

      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const tile = DUNGEON_MAP[r][c];
          if (tile === 0) ctx.fillStyle = '#2a2030';
          else if (tile === 2) ctx.fillStyle = '#3a3050';
          else ctx.fillStyle = '#1c1628';
          ctx.fillRect(mx + c * ms, my + r * ms, ms, ms);
        }
      }

      // Player dot
      const pcx = mx + (g.playerX / T) * ms;
      const pcy = my + (g.playerY / T) * ms;
      ctx.fillStyle = '#f0c040';
      ctx.fillRect(Math.floor(pcx) - 1, Math.floor(pcy) - 1, 2, 2);
    }

    function drawVignette() {
      const gradient = ctx.createRadialGradient(MAP_W/2, MAP_H/2, MAP_W * 0.25, MAP_W/2, MAP_H/2, MAP_W * 0.55);
      gradient.addColorStop(0, 'rgba(0,0,0,0)');
      gradient.addColorStop(1, 'rgba(0,0,0,0.45)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, MAP_W, MAP_H);
    }

    // === MAIN GAME LOOP ===
    function loop() {
      if (!running) return;
      g.frame++;

      // Clear
      ctx.fillStyle = '#0a0710';
      ctx.fillRect(0, 0, MAP_W, MAP_H);

      // 1. Draw floor & walls
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const tile = DUNGEON_MAP[r][c];
          if (tile === 0) drawWall(c, r);
          else if (tile === 1) drawFloor(c, r);
          else drawPath(c, r);
        }
      }

      // 2. Decorations
      for (const d of DECOR) {
        if (DUNGEON_MAP[d.r]?.[d.c] !== 0) drawDecoration(d, g.frame);
      }

      // 3. Torches (light pass)
      for (const [tc, tr] of TORCHES) drawTorch(tc, tr, g.frame);

      // 4. Chests
      COFRE_WPS.forEach((wpIdx, i) => {
        const [cc, cr] = WAYPOINTS[wpIdx];
        drawChest(cc, cr, i, gemasOk.includes(i), i === gemasOk.length && !victoria, g.frame);
      });

      // 5. Smooth movement
      if (g.moving) {
        const dx = g.targetX - g.playerX, dy = g.targetY - g.playerY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 1.5) {
          g.playerX = g.targetX; g.playerY = g.targetY; g.moving = false;
        } else {
          g.playerX += (dx / dist) * 1.5;
          g.playerY += (dy / dist) * 1.5;
        }
      }

      // 6. Player
      drawPlayer(g.frame);

      // 7. Effects
      drawDustMotes(g.frame);
      drawEmbers();
      drawParticles();

      // 8. Vignette
      drawVignette();

      // 9. Minimap
      drawMinimap();

      animId = requestAnimationFrame(loop);
    }

    animId = requestAnimationFrame(loop);

    return () => { running = false; cancelAnimationFrame(animId); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gemasOk, victoria, mostrarTeoria]);

  // ===== MOVEMENT =====
  const moverAWaypoint = useCallback((wpIdx: number) => {
    const g = gameRef.current;
    const [col, row] = WAYPOINTS[wpIdx];
    g.targetX = col * T + T / 2; g.targetY = row * T + T / 2;
    g.moving = true; g.playerWP = wpIdx;
  }, []);

  // ===== GAME ACTIONS =====
  const abrirCofre = useCallback(() => {
    const idx = gemasOk.length;
    if (idx >= total) return;
    setCofreActivo(idx); setSeleccion(null); setResultado(null); setPista(false);
    reproducir('clic');
    anunciarSR(`Cofre ${idx + 1}: ${PROBLEMAS_MISION1[idx].expresion}`);
  }, [gemasOk.length, total, reproducir]);

  const elegir = useCallback((opcion: number) => {
    if (resultado !== null || cofreActivo === null) return;
    const prob = PROBLEMAS_MISION1[cofreActivo];
    const ok = opcion === prob.respuesta;
    setSeleccion(opcion); setResultado(ok ? 'correcto' : 'incorrecto');
    reproducir(ok ? 'correcto' : 'incorrecto');

    if (ok) {
      // Particles
      const wpIdx = COFRE_WPS[cofreActivo];
      const [cc, cr] = WAYPOINTS[wpIdx];
      const cx = cc * T + T / 2, cy = cr * T + T / 2;
      for (let i = 0; i < 25; i++) {
        gameRef.current.particles.push({
          x: cx, y: cy,
          vx: (Math.random() - 0.5) * 2, vy: -Math.random() * 1.5 - 0.5,
          life: 40 + Math.random() * 30, maxLife: 70,
          color: ['#f0c040', '#ffe060', '#8855dd', '#aa77ff', '#ffffff'][Math.floor(Math.random() * 5)],
          size: 1 + Math.random() * 2,
        });
      }

      setTimeout(() => {
        const nuevas = [...gemasOk, cofreActivo];
        setGemasOk(nuevas); setCofreActivo(null);
        if (nuevas.length < total) {
          const nextWP = COFRE_WPS[nuevas.length];
          const curWP = COFRE_WPS[cofreActivo];
          let wp = curWP + 1;
          const step = () => {
            if (wp <= nextWP) { moverAWaypoint(wp); wp++; setTimeout(step, 350); }
          };
          setTimeout(step, 200);
        } else {
          setVictoria(true); reproducir('reino');
        }
      }, 1000);
    } else { setPista(true); }
  }, [resultado, cofreActivo, gemasOk, total, reproducir, moverAWaypoint]);

  const reintentar = useCallback(() => { setSeleccion(null); setResultado(null); setPista(false); }, []);

  // ===== KEYBOARD =====
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { cofreActivo !== null ? setCofreActivo(null) : alCerrar(); }
      if (cofreActivo !== null && resultado === null) {
        const n = parseInt(e.key);
        if (n >= 1 && n <= 3) elegir(PROBLEMAS_MISION1[cofreActivo].opciones[n - 1]);
      }
      if ((e.key === ' ' || e.key === 'Enter') && cofreActivo === null && !victoria) {
        e.preventDefault(); abrirCofre();
      }
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [cofreActivo, resultado, alCerrar, elegir, victoria, abrirCofre]);

  const handleCanvasClick = useCallback(() => {
    if (cofreActivo === null && !victoria) abrirCofre();
  }, [cofreActivo, victoria, abrirCofre]);

  const prob = cofreActivo !== null ? PROBLEMAS_MISION1[cofreActivo] : null;


  // ===== THEORY SECTION =====
  if (mostrarTeoria) {
    return (
      <div className="dg-teoria-overlay">
        {/* Ambient embers */}
        <div className="dg-teoria-embers" aria-hidden="true">
          {Array.from({ length: 24 }, (_, i) => (
            <span key={i} className="dg-teoria-ember" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }} />
          ))}
        </div>

        {/* Torches on sides */}
        <div className="dg-t-torch dg-t-torch-l" aria-hidden="true">
          <div className="dg-t-flame" /><div className="dg-t-torch-body" />
        </div>
        <div className="dg-t-torch dg-t-torch-r" aria-hidden="true">
          <div className="dg-t-flame" /><div className="dg-t-torch-body" />
        </div>

        <div className="dg-teoria-container">
          {/* Corner rivets */}
          <span className="dg-t-rivet dg-t-rivet-tl" aria-hidden="true" />
          <span className="dg-t-rivet dg-t-rivet-tr" aria-hidden="true" />
          <span className="dg-t-rivet dg-t-rivet-bl" aria-hidden="true" />
          <span className="dg-t-rivet dg-t-rivet-br" aria-hidden="true" />

          {/* TOP: Banner */}
          <div className="dg-teoria-banner">
            <span className="dg-t-nail dg-t-nail-l" aria-hidden="true" />
            <span className="dg-t-nail dg-t-nail-r" aria-hidden="true" />
            <h1 className="dg-teoria-banner-title">MISION 1</h1>
            <div className="dg-t-banner-divider" aria-hidden="true" />
            <h2 className="dg-teoria-banner-sub">EL LABERINTO DEL SABER</h2>
          </div>

          {/* MIDDLE: Two columns */}
          <div className="dg-teoria-body">
            {/* LEFT: Llama + bubble + tip */}
            <div className="dg-teoria-col-left">
              <div className="dg-t-llama-frame">
                <img src="/assets/gemas/llama_yachay.png" alt="Llama Yachay" />
              </div>
              <div className="dg-teoria-llama-bubble">
                <div className="dg-t-bubble-header">
                  <span className="mc-px-star" aria-hidden="true" />
                  LLAMA YACHAY
                  <span className="mc-px-star" aria-hidden="true" />
                </div>
                <p>{TEORIA_MULTIPLICACION.titulo}</p>
              </div>
              <div className="dg-teoria-tip">
                <span className="dg-px-bulb" />
                <p>{TEORIA_MULTIPLICACION.tip}</p>
              </div>
            </div>

            {/* RIGHT: Concepts + Example */}
            <div className="dg-teoria-col-right">
              <div className="dg-teoria-desc-box">
                <p>Resuelve los enigmas del laberinto para encontrar la Gema de los Calculos</p>
              </div>

              <div className="dg-teoria-conceptos">
                {TEORIA_MULTIPLICACION.conceptos.map((c, i) => (
                  <div key={i} className="dg-teoria-concepto">
                    <div className="dg-t-concept-icon" style={{ background: c.color }}>
                      {i === 0 && <span className="dg-t-icon-x" />}
                      {i === 1 && <span className="dg-px-gem" />}
                      {i === 2 && <span className="dg-t-icon-up" />}
                      {i === 3 && <span className="dg-t-icon-down" />}
                    </div>
                    <div className="dg-t-concept-text">
                      <strong style={{ color: c.color }}>{c.nombre}</strong>
                      <span>{c.descripcion}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="dg-t-ejemplo-panel">
                <div className="dg-t-ejemplo-label">
                  <span className="mc-px-diamond" aria-hidden="true" />
                  EJEMPLO
                </div>
                <div className="dg-t-ejemplo-operation">
                  <div className="dg-t-op-row">
                    <span className="dg-t-op-label" style={{ color: '#7b2cbf' }}>Multiplicando</span>
                    <span className="dg-t-op-num">{TEORIA_MULTIPLICACION.ejemplo.multiplicando}</span>
                  </div>
                  <div className="dg-t-op-row">
                    <span className="dg-t-op-label" style={{ color: '#1d3557' }}>Multiplicador</span>
                    <span className="dg-t-op-num">x {TEORIA_MULTIPLICACION.ejemplo.multiplicador}</span>
                  </div>
                  <div className="dg-t-op-line" />
                  <div className="dg-t-op-row dg-t-op-result">
                    <span className="dg-t-op-label" style={{ color: '#2a9d8f' }}>Producto</span>
                    <span className="dg-t-op-num dg-t-op-num-result">{TEORIA_MULTIPLICACION.ejemplo.producto.toLocaleString('es-BO')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM: CTA */}
          <button
            className="dg-teoria-btn"
            onClick={() => { setMostrarTeoria(false); reproducir('clic'); }}
            autoFocus
          >
            <span className="mc-px-arrow-r" aria-hidden="true" />
            Comenzar Mision
            <span className="mc-px-arrow-r" aria-hidden="true" />
          </button>
        </div>
      </div>
    );
  }



  return (
    <div className="dg-escena">
      <header className="dg-header">
        <div className="dg-header-left">
          <div className="dg-avatar"><img src="/assets/gemas/llama_yachay.png" alt="Llama Yachay" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} /></div>
          <div>
            <h2 className="dg-title">El Laberinto del Saber</h2>
            <p className="dg-rule">{REGLA_MISION1}</p>
          </div>
        </div>
        <div className="dg-gems-bar">
          {Array.from({ length: total }, (_, i) => (
            <div key={i} className={`dg-gem-dot ${gemasOk.includes(i) ? 'filled' : ''}`}>
              <span className="dg-px-gem" />
            </div>
          ))}
          <span className="dg-gem-count">{gemasOk.length}/{total}</span>
        </div>
      </header>

      <div className="dg-game-area" onClick={handleCanvasClick}>
        <canvas ref={canvasRef} className="dg-canvas" />
        {cofreActivo === null && !victoria && gemasOk.length < total && (
          <div className="dg-hint-bar">
            <span className="dg-px-key" /> Toca el cofre brillante o presiona <kbd>ESPACIO</kbd>
          </div>
        )}
      </div>

      {cofreActivo !== null && prob && (
        <div className="dg-modal-overlay" role="dialog" aria-modal="true">
          <div className="dg-modal" tabIndex={-1}>
            <button className="dg-modal-close" onClick={() => setCofreActivo(null)}>✕</button>
            <div className="dg-modal-top">
              <span className="dg-px-chest-icon" />
              <span className="dg-modal-label">Cofre {cofreActivo + 1} de {total}</span>
            </div>
            <div className="dg-expression"><span className="dg-expr-text">{prob.expresion}</span></div>
            <div className="dg-choices">
              {prob.opciones.map((op, i) => {
                let cls = '';
                if (seleccion !== null) {
                  if (op === prob.respuesta) cls = 'correct';
                  else if (op === seleccion) cls = 'wrong';
                  else cls = 'dim';
                }
                return (
                  <button key={i} className={`dg-choice ${cls}`} onClick={() => elegir(op)} disabled={resultado !== null}>
                    <span className="dg-choice-key">{i + 1}</span>
                    <span className="dg-choice-val">{op}</span>
                  </button>
                );
              })}
            </div>
            {resultado && (
              <div className={`dg-result ${resultado}`} role="alert">
                <p className="dg-result-msg">{resultado === 'correcto' ? '¡Gema obtenida!' : 'Incorrecto'}</p>
                {pista && <div className="dg-hint"><span className="dg-px-bulb" /><p>{prob.pista}</p></div>}
                {resultado === 'incorrecto' && <button className="dg-retry-btn" onClick={reintentar}>Reintentar</button>}
              </div>
            )}
          </div>
        </div>
      )}

      {victoria && (
        <div className="dg-victory" role="alert">
          <div className="dg-vic-particles" aria-hidden="true">
            {Array.from({ length: 30 }, (_, i) => (
              <span key={i} className="dg-particle" style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }} />
            ))}
          </div>
          <div className="dg-vic-body">
            <img src="/assets/gemas/gema_calculos.png" alt="Gema de los Cálculos" className="dg-vic-gema-img" />
            <h2 className="dg-vic-title">¡GEMA DE LOS CÁLCULOS ENCONTRADA!</h2>
            <p className="dg-vic-desc">¡Felicidades, Guardián Matemático!<br/>Has dominado las multiplicaciones de tres cifras<br/>y la Gema de los Cálculos ha sido restaurada.</p>
            <div className="dg-vic-gems">
              {Array.from({ length: total }, (_, i) => (
                <span key={i} className="dg-vic-gem" style={{ animationDelay: `${i * 0.15}s` }}><span className="dg-px-gem large" /></span>
              ))}
            </div>
            <button className="dg-vic-btn" onClick={() => { alCompletar(); }} autoFocus>Continuar Aventura</button>
          </div>
        </div>
      )}

      <BotonSaltarMision onClick={alCerrar} />
    </div>
  );
}
