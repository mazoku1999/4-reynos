'use client';

/**
 * CanvasPuentes — Dibuja los puentes animados entre islas y Tinkuy.
 * Usa requestAnimationFrame para animación continua.
 */

import { useRef, useEffect, useCallback } from 'react';
import { COLORES_REINOS } from '@/datos/reinos';

interface Props {
  reinosCompletados: string[];
}

// ---- Utilidades de curvas Bézier ----

interface Punto { x: number; y: number }

/** Punto en curva Bézier cuadrática */
function puntoEnCurva(a: Punto, c: Punto, b: Punto, t: number): Punto {
  const i = 1 - t;
  return { x: i*i*a.x + 2*i*t*c.x + t*t*b.x, y: i*i*a.y + 2*i*t*c.y + t*t*b.y };
}

/** Ángulo tangente en curva Bézier */
function anguloEnCurva(a: Punto, c: Punto, b: Punto, t: number): number {
  const i = 1 - t;
  return Math.atan2(
    2 * (i*(c.y-a.y) + t*(b.y-c.y)),
    2 * (i*(c.x-a.x) + t*(b.x-c.x))
  );
}

/** Centro visual de un elemento DOM */
function centroDeElemento(el: HTMLElement | null): Punto | null {
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}

// ---- Componente ----

export default function CanvasPuentes({ reinosCompletados }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagenPuenteRef = useRef<HTMLImageElement | null>(null);
  const frameRef = useRef(0);
  const flashRef = useRef<Record<string, number>>({});
  const completadosRef = useRef(reinosCompletados);
  completadosRef.current = reinosCompletados;

  // Exponer función de flash para uso externo
  useEffect(() => {
    (window as unknown as Record<string, unknown>).__triggerBridgeFlash = (clave: string) => {
      flashRef.current[clave] = Date.now();
    };
  }, []);

  const dibujar = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) { requestAnimationFrame(dibujar); return; }
    const ctx = canvas.getContext('2d');
    if (!ctx) { requestAnimationFrame(dibujar); return; }

    // Solo dibujar si el mapa está activo
    const mapa = document.getElementById('map-screen');
    if (!mapa?.classList.contains('active')) {
      requestAnimationFrame(dibujar);
      return;
    }

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const tinkuy = centroDeElemento(document.querySelector('.tinkuy-center') as HTMLElement);
    if (!tinkuy) { requestAnimationFrame(dibujar); return; }

    frameRef.current++;
    const tiempo = frameRef.current * 0.02;
    const ahora = Date.now();
    const imgPuente = imagenPuenteRef.current;

    const islas = [
      { id: 'island-condor', clave: 'condor' },
      { id: 'island-puma', clave: 'puma' },
      { id: 'island-capibara', clave: 'capibara' },
      { id: 'island-quirquincho', clave: 'quirquincho' },
    ];

    islas.forEach(({ id, clave }) => {
      const isla = centroDeElemento(document.getElementById(id));
      if (!isla) return;

      const completado = completadosRef.current.includes(clave);
      const color = COLORES_REINOS[clave];
      const p0 = isla, p1 = tinkuy;
      const cp = { x: (p0.x+p1.x)/2, y: (p0.y+p1.y)/2 + (p1.y > p0.y ? -60 : 60) };

      // Dibujar puente con sprites
      if (imgPuente?.complete) {
        const altoTile = imgPuente.naturalHeight;
        const altoDibujo = 42;
        const anchoDibujo = imgPuente.naturalWidth * (altoDibujo / altoTile);
        const solapamiento = anchoDibujo * 0.65;

        // Calcular longitud del camino
        let longitudTotal = 0;
        let previo = puntoEnCurva(p0, cp, p1, 0);
        for (let i = 1; i <= 80; i++) {
          const pt = puntoEnCurva(p0, cp, p1, i/80);
          longitudTotal += Math.hypot(pt.x-previo.x, pt.y-previo.y);
          previo = pt;
        }
        const numTiles = Math.ceil(longitudTotal / solapamiento);

        // Sombras
        ctx.globalAlpha = 0.25;
        for (let i = 0; i < numTiles; i++) {
          const t = i / numTiles;
          const pt = puntoEnCurva(p0, cp, p1, t);
          const angulo = anguloEnCurva(p0, cp, p1, t);
          ctx.save();
          ctx.translate(pt.x+3, pt.y+4);
          ctx.rotate(angulo);
          ctx.fillStyle = '#000';
          ctx.fillRect(-anchoDibujo/2, -altoDibujo/2, anchoDibujo, altoDibujo);
          ctx.restore();
        }
        ctx.globalAlpha = 1;

        // Tiles del puente
        for (let i = 0; i < numTiles; i++) {
          const t = i / numTiles;
          const pt = puntoEnCurva(p0, cp, p1, t);
          const angulo = anguloEnCurva(p0, cp, p1, t);
          ctx.save();
          ctx.translate(pt.x, pt.y);
          ctx.rotate(angulo);
          if (!completado) { ctx.globalAlpha = 0.45; ctx.filter = 'brightness(0.4) saturate(0.2)'; }
          ctx.drawImage(imgPuente, -anchoDibujo/2, -altoDibujo/2, anchoDibujo, altoDibujo);
          ctx.filter = 'none';
          ctx.globalAlpha = 1;
          ctx.restore();
        }

        // Tinte de color cuando está completado
        if (completado) {
          ctx.globalCompositeOperation = 'screen';
          for (let i = 0; i < numTiles; i++) {
            const t = i / numTiles;
            const pt = puntoEnCurva(p0, cp, p1, t);
            const angulo = anguloEnCurva(p0, cp, p1, t);
            ctx.save();
            ctx.translate(pt.x, pt.y);
            ctx.rotate(angulo);
            ctx.fillStyle = `${color}18`;
            ctx.fillRect(-anchoDibujo/2, -altoDibujo/2, anchoDibujo, altoDibujo);
            ctx.restore();
          }
          ctx.globalCompositeOperation = 'source-over';
        }
      }

      // Animación flash al completar
      if (flashRef.current[clave]) {
        const progFlash = Math.min(1, (ahora - flashRef.current[clave]) / 2000);
        if (progFlash >= 1) delete flashRef.current[clave];
        else {
          const onda = progFlash * 1.4;
          for (let s = 0; s <= 50; s++) {
            const t = s / 50;
            const dist = Math.abs(t - onda);
            if (dist > 0.12) continue;
            const intensidad = 1 - dist / 0.12;
            const pt = puntoEnCurva(p0, cp, p1, Math.min(1, t));
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 25*intensidad, 0, Math.PI*2);
            const grad = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, 25*intensidad);
            grad.addColorStop(0, '#ffffff');
            grad.addColorStop(0.4, color);
            grad.addColorStop(1, `${color}00`);
            ctx.fillStyle = grad;
            ctx.globalAlpha = intensidad * 0.8 * (1 - progFlash * 0.5);
            ctx.fill();
            ctx.globalAlpha = 1;
          }
        }
      }

      // Orbes de energía en puentes completados
      if (completado) {
        for (let i = 0; i < 3; i++) {
          const prog = ((tiempo * 0.2 + i * 0.33) % 1);
          const pt = puntoEnCurva(p0, cp, p1, prog);
          const alfa = Math.sin(prog * Math.PI) * 0.8;
          if (alfa < 0.05) continue;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 10, 0, Math.PI*2);
          const grad = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, 10);
          grad.addColorStop(0, `${color}aa`);
          grad.addColorStop(1, `${color}00`);
          ctx.fillStyle = grad;
          ctx.globalAlpha = alfa * 0.5;
          ctx.fill();
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 3, 0, Math.PI*2);
          ctx.fillStyle = '#fff';
          ctx.globalAlpha = alfa;
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      }
    });

    // Brillo del Tinkuy
    const numCompletados = completadosRef.current.length;
    if (numCompletados > 0 && tinkuy) {
      const tam = 30 + numCompletados * 12 + Math.sin(tiempo) * 6;
      const grad = ctx.createRadialGradient(tinkuy.x, tinkuy.y, 0, tinkuy.x, tinkuy.y, tam);
      grad.addColorStop(0, `rgba(240,192,64,${0.3+numCompletados*0.12})`);
      grad.addColorStop(0.4, `rgba(240,192,64,${0.1+numCompletados*0.05})`);
      grad.addColorStop(1, 'rgba(240,192,64,0)');
      ctx.beginPath();
      ctx.arc(tinkuy.x, tinkuy.y, tam, 0, Math.PI*2);
      ctx.fillStyle = grad;
      ctx.fill();
    }

    requestAnimationFrame(dibujar);
  }, []);

  useEffect(() => {
    const img = new Image();
    img.src = '/assets/bridge_tile.png';
    img.onload = () => { imagenPuenteRef.current = img; };

    const frame = requestAnimationFrame(dibujar);
    return () => cancelAnimationFrame(frame);
  }, [dibujar]);

  return <canvas ref={canvasRef} className="connections-canvas" />;
}
