'use client';

/* eslint-disable @next/next/no-img-element */

/**
 * TableroMision v3 — Scroll modal + in-place card restoration
 *
 * - 8 pixel-art cards in a 2x4 grid (4x2 on desktop)
 * - Clicking a card opens the old-style scroll/parchment question modal
 * - Correct answer: modal closes → card transforms dry→green in-place
 * - Wrong answer: Duolingo-style feedback with explanation inside the scroll
 * - Progress bar + completion celebration
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { anunciarSR } from '@/lib/accesibilidad';
import type { Mision } from '@/datos/misiones';
import type { TipoSonido } from '@/hooks/useSonido';

interface Props {
  mision: Mision;
  alCompletar: () => void;
  alCerrar: () => void;
  reproducir: (tipo: TipoSonido) => void;
}

export default function TableroMision({ mision, alCompletar, alCerrar, reproducir }: Props) {
  const [resueltas, setResueltas] = useState<number[]>([]);
  const [activa, setActiva] = useState<number | null>(null);
  const [respondida, setRespondida] = useState(false);
  const [esCorrecta, setEsCorrecta] = useState(false);
  const [seleccion, setSeleccion] = useState<number | null>(null);
  const [mostrarExplicacion, setMostrarExplicacion] = useState(false);
  const [animandoIdx, setAnimandoIdx] = useState<number | null>(null);
  const [completado, setCompletado] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const total = mision.parcelas.length;
  const progreso = (resueltas.length / total) * 100;

  /** Open scroll modal for a parcela */
  const abrirParcela = useCallback((idx: number) => {
    if (resueltas.includes(idx)) return;
    setActiva(idx);
    setRespondida(false);
    setEsCorrecta(false);
    setSeleccion(null);
    setMostrarExplicacion(false);
    reproducir('clic');
    anunciarSR(`Parcela ${idx + 1}: ${mision.parcelas[idx].lugar}. ${mision.parcelas[idx].pregunta}`);
    setTimeout(() => scrollRef.current?.focus(), 100);
  }, [resueltas, mision, reproducir]);

  /** Answer a question */
  const responder = useCallback((opIdx: number) => {
    if (respondida || activa === null) return;
    const parcela = mision.parcelas[activa];
    const ok = opIdx === parcela.correcta;

    setRespondida(true);
    setSeleccion(opIdx);
    setEsCorrecta(ok);
    reproducir(ok ? 'correcto' : 'incorrecto');

    if (ok) {
      anunciarSR('¡Correcto! La tierra renace.');
      // Close modal, then animate the card in-place
      const idxToRestore = activa;
      setTimeout(() => {
        setActiva(null);
        setAnimandoIdx(idxToRestore);
        // After animation, mark as solved
        setTimeout(() => {
          const nuevas = [...resueltas, idxToRestore];
          setResueltas(nuevas);
          setAnimandoIdx(null);
          if (nuevas.length === total) {
            setTimeout(() => {
              setCompletado(true);
              reproducir('reino');
              anunciarSR('¡Bosque restaurado! Has devuelto la vida a la tierra.');
            }, 600);
          }
        }, 800);
      }, 800);
    } else {
      anunciarSR('Incorrecto. Lee la explicación para aprender.');
      setTimeout(() => setMostrarExplicacion(true), 400);
    }
  }, [respondida, activa, mision, resueltas, total, reproducir]);

  /** Retry after wrong */
  const reintentar = useCallback(() => {
    setRespondida(false);
    setSeleccion(null);
    setMostrarExplicacion(false);
    setEsCorrecta(false);
  }, []);

  // Keyboard
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activa !== null) setActiva(null);
        else alCerrar();
      }
      if (activa !== null && !respondida) {
        if (e.key === '1') responder(0);
        if (e.key === '2') responder(1);
      }
      if (e.key === 'Enter' && respondida && !esCorrecta) reintentar();
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [activa, respondida, esCorrecta, alCerrar, responder, reintentar]);

  const parcela = activa !== null ? mision.parcelas[activa] : null;

  return (
    <div className="ms-escena">
      {/* Header */}
      <header className="ms-header">
        <button className="ms-back" onClick={alCerrar} aria-label="Volver al mapa">
          <span className="px-icon px-close" /> Volver
        </button>
        <div className="ms-header-center">
          <h2 className="ms-title">{mision.titulo}</h2>
          <p className="ms-subtitle">Restaura cada lugar respondiendo correctamente</p>
        </div>
        <div className="ms-progress-wrap">
          <div className="ms-progress-bar" role="progressbar" aria-valuenow={resueltas.length} aria-valuemax={total}>
            <div className="ms-progress-fill" style={{ width: `${progreso}%` }} />
          </div>
          <span className="ms-progress-text">{resueltas.length}/{total}</span>
        </div>
      </header>

      {/* Card Grid */}
      <div className="ms-grid" role="grid" aria-label="Parcelas del bosque">
        {mision.parcelas.map((p, i) => {
          const resuelta = resueltas.includes(i);
          const animando = animandoIdx === i;
          return (
            <button
              key={i}
              className={`ms-card ${resuelta ? 'solved' : ''} ${animando ? 'restoring' : ''}`}
              onClick={() => abrirParcela(i)}
              disabled={resuelta || animando}
              aria-label={`${p.lugar} — ${resuelta ? 'Restaurado' : 'Pendiente'}`}
            >
              <div className="ms-card-img-wrap">
                {/* Both images stacked: dry on top, green below */}
                <img src={p.imgVerde} alt="" className="ms-card-img ms-card-green" />
                <img src={p.imgSeca} alt="" className="ms-card-img ms-card-dry" />
                {resuelta && <div className="ms-card-sparkle" />}
                {!resuelta && !animando && i === resueltas.length && (
                  <div className="ms-card-pulse" />
                )}
              </div>
              <div className="ms-card-footer">
                <span className="ms-card-num">{i + 1}</span>
                <span className="ms-card-name">{p.lugar}</span>
                {resuelta && <span className="px-icon px-check ms-card-check" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Scroll Question Modal */}
      {activa !== null && parcela && (
        <div className="ms-scroll-overlay" onClick={(e) => { if (e.target === e.currentTarget && !respondida) setActiva(null); }}>
          <div className="ms-scroll" ref={scrollRef} tabIndex={-1} role="dialog" aria-modal="true">
            <button className="ms-scroll-close" onClick={() => setActiva(null)}>✕</button>

            {/* Place name badge */}
            <div className="ms-scroll-badge">
              <span className="ms-scroll-badge-num">{activa + 1}/{total}</span>
              <span className="ms-scroll-badge-name">{parcela.lugar}</span>
            </div>

            {/* Question */}
            <p className="ms-scroll-question">{parcela.pregunta}</p>

            {/* Options */}
            <div className="ms-scroll-options">
              {parcela.opciones.map((op, i) => {
                let cls = '';
                if (seleccion !== null) {
                  if (i === parcela.correcta) cls = 'correct';
                  else if (i === seleccion && !esCorrecta) cls = 'wrong';
                  else cls = 'dim';
                }
                return (
                  <button
                    key={i}
                    className={`ms-scroll-option ${cls}`}
                    onClick={() => responder(i)}
                    disabled={respondida}
                  >
                    <span>{op}</span>
                  </button>
                );
              })}
            </div>

            {/* Correct feedback */}
            {respondida && esCorrecta && (
              <div className="ms-scroll-fb correct" role="alert">
                <p>La tierra renace en <strong>{parcela.lugar}</strong>.</p>
              </div>
            )}

            {/* Wrong feedback */}
            {respondida && !esCorrecta && (
              <div className="ms-scroll-fb wrong" role="alert">
                {mostrarExplicacion && (
                  <div className="ms-scroll-explicacion">
                    <p>{parcela.explicacion}</p>
                  </div>
                )}
                <button className="ms-scroll-retry" onClick={reintentar}>
                  Intentar de nuevo
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Completion */}
      {completado && (
        <div className="ms-complete" role="alert">
          <div className="ms-complete-particles" aria-hidden="true">
            {Array.from({ length: 40 }, (_, i) => (
              <span key={i} className="dg-particle" style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }} />
            ))}
          </div>
          <div className="ms-complete-body">
            <div className="dg-vic-crown" />
            <h2 className="ms-complete-title">BOSQUE RESTAURADO</h2>
            <p className="ms-complete-desc">Has devuelto la vida a los 8 lugares del bosque.<br />La Madre Tierra te lo agradece.</p>
            <div className="ms-complete-imgs">
              {mision.parcelas.map((p, i) => (
                <img key={i} src={p.imgVerde} alt={p.lugar} className="ms-complete-thumb" style={{ animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
            <button className="ms-complete-btn" onClick={() => { alCompletar(); alCerrar(); }} autoFocus>Continuar Aventura</button>
          </div>
        </div>
      )}
    </div>
  );
}
