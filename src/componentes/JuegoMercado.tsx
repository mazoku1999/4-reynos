'use client';

/* eslint-disable @next/next/no-img-element */

/**
 * JuegoMercado — Misión 2: El Mercado del Capibara
 * 
 * Mecánica: Resolver divisiones ayudando a los comerciantes
 * a repartir productos (choclos, tomates, papas) en cajas iguales.
 * 
 * Flujo: Teoría → Tablero de canastas → Resolver cada canasta → Victoria
 */

import { useState, useCallback, useEffect } from 'react';
import {
  PROBLEMAS_MISION2,
  REGLA_MISION2,
  TEORIA_DIVISION,
} from '@/datos/misionesCapibara';
import { anunciarSR } from '@/lib/accesibilidad';
import type { TipoSonido } from '@/hooks/useSonido';

interface Props {
  alCompletar: () => void;
  alCerrar: () => void;
  reproducir: (tipo: TipoSonido) => void;
}

export default function JuegoMercado({ alCompletar, alCerrar, reproducir }: Props) {
  const [fase, setFase] = useState<'teoria' | 'tablero' | 'canasta' | 'victoria'>('teoria');
  const [canastaActiva, setCanastaActiva] = useState<number | null>(null);
  const [canastasOk, setCanastasOk] = useState<number[]>([]);
  const [seleccion, setSeleccion] = useState<number | null>(null);
  const [resultado, setResultado] = useState<'correcto' | 'incorrecto' | null>(null);
  const [pista, setPista] = useState(false);

  const total = PROBLEMAS_MISION2.length;

  // ===== ACTIONS =====
  const abrirCanasta = useCallback((idx: number) => {
    if (canastasOk.includes(idx)) return;
    setCanastaActiva(idx);
    setSeleccion(null);
    setResultado(null);
    setPista(false);
    setFase('canasta');
    reproducir('clic');
    anunciarSR(`${PROBLEMAS_MISION2[idx].canasta}: ${PROBLEMAS_MISION2[idx].expresion}`);
  }, [canastasOk, reproducir]);

  const elegir = useCallback((opcion: number) => {
    if (resultado !== null || canastaActiva === null) return;
    const prob = PROBLEMAS_MISION2[canastaActiva];
    const ok = opcion === prob.respuesta;
    setSeleccion(opcion);
    setResultado(ok ? 'correcto' : 'incorrecto');
    reproducir(ok ? 'correcto' : 'incorrecto');

    if (ok) {
      setTimeout(() => {
        const nuevas = [...canastasOk, canastaActiva];
        setCanastasOk(nuevas);
        setCanastaActiva(null);
        if (nuevas.length >= total) {
          setFase('victoria');
          reproducir('reino');
        } else {
          setFase('tablero');
        }
      }, 1200);
    } else {
      setPista(true);
    }
  }, [resultado, canastaActiva, canastasOk, total, reproducir]);

  const reintentar = useCallback(() => {
    setSeleccion(null);
    setResultado(null);
    setPista(false);
  }, []);

  // ===== KEYBOARD =====
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (fase === 'canasta') {
          setFase('tablero');
          setCanastaActiva(null);
        } else {
          alCerrar();
        }
      }
      if (fase === 'canasta' && canastaActiva !== null && resultado === null) {
        const n = parseInt(e.key);
        if (n >= 1 && n <= 3) elegir(PROBLEMAS_MISION2[canastaActiva].opciones[n - 1]);
      }
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [fase, canastaActiva, resultado, alCerrar, elegir]);

  const prob = canastaActiva !== null ? PROBLEMAS_MISION2[canastaActiva] : null;

  // ===== TEORIA =====
  if (fase === 'teoria') {
    return (
      <div className="mc-overlay mc-teoria-bg">
        {/* Pixel floating motes */}
        <div className="mc-dust-motes" aria-hidden="true">
          {Array.from({ length: 20 }, (_, i) => (
            <span key={i} className="mc-dust-mote" style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
            }} />
          ))}
        </div>

        <div className="mc-teoria-container">
          {/* Pixel decorative corners */}
          <span className="mc-corner mc-corner-tl" aria-hidden="true" />
          <span className="mc-corner mc-corner-tr" aria-hidden="true" />
          <span className="mc-corner mc-corner-bl" aria-hidden="true" />
          <span className="mc-corner mc-corner-br" aria-hidden="true" />

          {/* Banner with pixel wooden sign */}
          <div className="mc-banner">
            <span className="mc-banner-nail mc-nail-l" aria-hidden="true" />
            <span className="mc-banner-nail mc-nail-r" aria-hidden="true" />
            <h1 className="mc-banner-title">MISION 2</h1>
            <div className="mc-banner-divider" aria-hidden="true" />
            <h2 className="mc-banner-sub">EL MERCADO DEL CAPIBARA</h2>
          </div>

          <div className="mc-teoria-desc">
            <span className="mc-px-scroll" aria-hidden="true" />
            <p>Ayuda a los comerciantes a repartir sus productos de manera justa resolviendo las divisiones.</p>
          </div>

          {/* Llama Yachay + Explicación */}
          <div className="mc-teoria-help">
            <div className="mc-teoria-llama-side">
              <img src="/assets/gemas/llama_yachay.png" alt="Llama Yachay" />
              <div className="mc-teoria-llama-label">
                <span className="mc-px-star" aria-hidden="true" />
                LLAMA YACHAY
                <span className="mc-px-star" aria-hidden="true" />
              </div>
            </div>
            <div className="mc-teoria-steps">
              <div className="mc-steps-title">
                <span className="mc-px-book" aria-hidden="true" />
                {TEORIA_DIVISION.titulo}
              </div>
              <div className="mc-steps-subtitle">Para dividir seguimos estos pasos:</div>
              <ol>
                {TEORIA_DIVISION.pasos.map((p, i) => (
                  <li key={i}>
                    <span className="mc-step-num">{i + 1}</span>
                    {p}
                  </li>
                ))}
              </ol>
            </div>
            <div className="mc-teoria-ejemplo-box">
              <div className="mc-teoria-ejemplo-label">
                <span className="mc-px-diamond" aria-hidden="true" />
                EJEMPLO
              </div>
              <div className="mc-teoria-ejemplo-expr">
                <span className="mc-ejemplo-num mc-num-dividendo">{TEORIA_DIVISION.ejemplo.dividendo}</span>
                <span className="mc-ejemplo-op">&divide;</span>
                <span className="mc-ejemplo-num mc-num-divisor">{TEORIA_DIVISION.ejemplo.divisor}</span>
                <span className="mc-ejemplo-op">=</span>
                <span className="mc-ejemplo-num mc-num-resultado">{TEORIA_DIVISION.ejemplo.cociente}</span>
              </div>
              <div className="mc-ejemplo-visual">
                {Array.from({ length: TEORIA_DIVISION.ejemplo.divisor }, (_, g) => (
                  <div key={g} className="mc-ejemplo-group">
                    {Array.from({ length: TEORIA_DIVISION.ejemplo.cociente }, (_, j) => (
                      <span key={j} className="mc-ejemplo-dot" style={{
                        background: ['#e6a817','#e63946','#2a9d8f','#7b2cbf','#e67e22','#3498db'][g % 6],
                      }} />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tip */}
          <div className="mc-teoria-tip">
            <span className="dg-px-bulb" />
            <p>{TEORIA_DIVISION.tip}</p>
          </div>

          <button
            className="mc-btn-comenzar"
            onClick={() => { setFase('tablero'); reproducir('clic'); }}
            autoFocus
          >
            <span className="mc-px-arrow-r" aria-hidden="true" />
            Ir al Mercado
            <span className="mc-px-arrow-r" aria-hidden="true" />
          </button>
        </div>
      </div>
    );
  }

  // ===== TABLERO DE CANASTAS =====
  if (fase === 'tablero') {
    return (
      <div className="mc-overlay mc-tablero-bg" style={{ backgroundImage: 'url(/assets/mercado/fondo.png)' }}>
        <div className="mc-fondo-dim" />
        <div className="mc-tablero-container">
          {/* Header */}
          <header className="mc-header">
            <div className="mc-header-left">
              <div className="mc-header-avatar-wrap">
                <img src="/assets/gemas/llama_yachay.png" alt="Llama Yachay" className="mc-header-avatar" />
              </div>
              <div>
                <h2 className="mc-header-title">El Mercado del Capibara</h2>
                <p className="mc-header-rule">{REGLA_MISION2}</p>
              </div>
            </div>
            <div className="mc-header-progress">
              <span className="mc-px-basket" aria-hidden="true" />
              <span>{canastasOk.length}/{total}</span>
            </div>
          </header>

          {/* Banner */}
          <div className="mc-tablero-banner">
            <span className="mc-tablero-banner-deco-l" aria-hidden="true" />
            <h2>DESAFIOS DEL MERCADO</h2>
            <span className="mc-tablero-banner-deco-r" aria-hidden="true" />
          </div>

          {/* Cards */}
          <div className="mc-canastas-grid">
            {PROBLEMAS_MISION2.map((p, i) => {
              const completada = canastasOk.includes(i);
              return (
                <button
                  key={i}
                  className={`mc-canasta-card ${completada ? 'completada' : ''}`}
                  onClick={() => abrirCanasta(i)}
                  disabled={completada}
                  style={{ '--canasta-color': p.color } as React.CSSProperties}
                >
                  {/* Pixel corner nails */}
                  <span className="mc-card-nail mc-card-nail-tl" aria-hidden="true" />
                  <span className="mc-card-nail mc-card-nail-tr" aria-hidden="true" />
                  <span className="mc-card-nail mc-card-nail-bl" aria-hidden="true" />
                  <span className="mc-card-nail mc-card-nail-br" aria-hidden="true" />

                  <div className="mc-canasta-label" style={{ borderColor: p.color }}>
                    <span style={{ color: p.color }}>{p.canasta}</span>
                    <strong>{p.producto}</strong>
                  </div>
                  <div className="mc-canasta-img-wrap">
                    <img src={p.imagen} alt={p.producto} />
                    {completada && (
                      <div className="mc-canasta-check">
                        <span className="mc-px-checkmark" />
                      </div>
                    )}
                    {!completada && (
                      <div className="mc-canasta-glow" aria-hidden="true" />
                    )}
                  </div>
                  <p className="mc-canasta-desc">{p.descripcion}</p>
                  <div className="mc-canasta-expr">
                    <span className="mc-px-quill" aria-hidden="true" />
                    {p.expresion}
                  </div>
                </button>
              );
            })}
          </div>

          <button className="mc-btn-volver" onClick={alCerrar}>
            <span className="mc-px-arrow-l" aria-hidden="true" />
            Volver
          </button>
        </div>
      </div>
    );
  }

  // ===== CANASTA ACTIVA (Resolver problema) =====
  if (fase === 'canasta' && prob) {
    return (
      <div className="mc-overlay mc-tablero-bg" style={{ backgroundImage: 'url(/assets/mercado/fondo.png)' }}>
        <div className="mc-fondo-dim" />
        <div className="mc-resolver-container">
          {/* Header canasta */}
          <div className="mc-resolver-header" style={{ borderColor: prob.color }}>
            <img src={prob.imagen} alt={prob.producto} className="mc-resolver-img" />
            <div>
              <h2 className="mc-resolver-title" style={{ color: prob.color }}>
                <span className="mc-px-basket" aria-hidden="true" />
                {prob.canasta} — {prob.producto}
              </h2>
              <p className="mc-resolver-desc">{prob.descripcion}</p>
            </div>
          </div>

          {/* Expresión */}
          <div className="mc-resolver-expression">
            <span className="mc-expr-deco mc-expr-deco-l" aria-hidden="true" />
            <span className="mc-resolver-expr-text">{prob.expresion}</span>
            <span className="mc-expr-deco mc-expr-deco-r" aria-hidden="true" />
          </div>

          {/* Opciones */}
          <div className="mc-resolver-choices">
            {prob.opciones.map((op, i) => {
              let cls = '';
              if (seleccion !== null) {
                if (op === prob.respuesta) cls = 'correct';
                else if (op === seleccion) cls = 'wrong';
                else cls = 'dim';
              }
              return (
                <button
                  key={i}
                  className={`mc-resolver-choice ${cls}`}
                  onClick={() => elegir(op)}
                  disabled={resultado !== null}
                  style={{ '--canasta-color': prob.color } as React.CSSProperties}
                >
                  <span className="mc-choice-key">{i + 1}</span>
                  <span className="mc-choice-val">{op}</span>
                  <span className="mc-choice-label">en cada caja</span>
                </button>
              );
            })}
          </div>

          {/* Resultado */}
          {resultado && (
            <div className={`mc-resolver-result ${resultado}`}>
              <div className="mc-result-icon">
                {resultado === 'correcto'
                  ? <span className="mc-px-checkmark mc-check-lg" />
                  : <span className="mc-px-cross mc-cross-lg" />}
              </div>
              <p className="mc-result-msg">
                {resultado === 'correcto'
                  ? `Correcto! Cada caja tiene ${prob.respuesta} ${prob.producto.toLowerCase()}.`
                  : 'Incorrecto, intentalo de nuevo!'}
              </p>
              {pista && (
                <div className="mc-result-hint">
                  <span className="dg-px-bulb" />
                  <p>{prob.pista}</p>
                </div>
              )}
              {resultado === 'incorrecto' && (
                <button className="mc-btn-reintentar" onClick={reintentar}>
                  <span className="mc-px-retry" aria-hidden="true" />
                  Reintentar
                </button>
              )}
            </div>
          )}

          <button className="mc-btn-volver" onClick={() => { setFase('tablero'); setCanastaActiva(null); }}>
            <span className="mc-px-arrow-l" aria-hidden="true" />
            Volver al mercado
          </button>
        </div>
      </div>
    );
  }

  // ===== VICTORIA =====
  if (fase === 'victoria') {
    return (
      <div className="mc-victory-overlay">
        <div className="mc-victory-particles" aria-hidden="true">
          {Array.from({ length: 40 }, (_, i) => (
            <span key={i} className="dg-particle" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }} />
          ))}
        </div>
        <div className="mc-victory-body">
          <div className="mc-victory-crown" aria-hidden="true" />
          <img src="/assets/gemas/gema_energia.png" alt="Gema de la Energia" className="mc-victory-gem" />
          <h2 className="mc-victory-title">GEMA DE LA ENERGIA ENCONTRADA!</h2>
          <div className="mc-victory-divider" aria-hidden="true" />
          <p className="mc-victory-desc">
            Felicidades, Guardian Matematico!<br />
            Has ayudado a todos los comerciantes del mercado<br />
            y la Gema de la Energia ha sido restaurada.
          </p>
          <div className="mc-victory-canastas">
            {PROBLEMAS_MISION2.map((p, i) => (
              <div key={i} className="mc-victory-canasta-item" style={{ animationDelay: `${i * 0.2}s` }}>
                <img src={p.imagen} alt={p.producto} className="mc-victory-canasta-img" />
                <span className="mc-px-checkmark" />
              </div>
            ))}
          </div>
          <button className="mc-btn-continuar" onClick={() => { alCompletar(); }} autoFocus>
            <span className="mc-px-arrow-r" aria-hidden="true" />
            Continuar Aventura
            <span className="mc-px-arrow-r" aria-hidden="true" />
          </button>
        </div>
      </div>
    );
  }

  return null;
}
