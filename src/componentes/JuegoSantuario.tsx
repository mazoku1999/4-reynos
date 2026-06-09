'use client';

/* eslint-disable @next/next/no-img-element */

/**
 * JuegoSantuario — Misión Final del Reino Capibara
 * 
 * Las dos gemas regresan al santuario, pero para reactivar la energía
 * el jugador debe resolver 3 operaciones combinadas.
 * 
 * Fases: teoria → santuario → resolviendo → victoria
 */

import { useState, useCallback } from 'react';
import {
  TEORIA_COMBINADAS,
  PROBLEMAS_MISION_FINAL,
} from '@/datos/misionesCapibara';
import BotonSaltarMision from './BotonSaltarMision';

interface Props {
  alCompletar: () => void;
  alCerrar: () => void;
  reproducir: (s: 'clic' | 'correcto' | 'incorrecto' | 'reino' | 'victoria') => void;
}

type Fase = 'teoria' | 'santuario' | 'resolviendo' | 'victoria';

export default function JuegoSantuario({ alCompletar, alCerrar, reproducir }: Props) {
  const [fase, setFase] = useState<Fase>('teoria');
  const [selloActivo, setSelloActivo] = useState<number | null>(null);
  const [sellosResueltos, setSellosResueltos] = useState<boolean[]>([false, false, false]);
  const [seleccion, setSeleccion] = useState<number | null>(null);
  const [mostrarFeedback, setMostrarFeedback] = useState(false);
  const [esCorrecta, setEsCorrecta] = useState(false);
  const [intentos, setIntentos] = useState(0);
  const [mostrarPista, setMostrarPista] = useState(false);

  const problema = selloActivo !== null ? PROBLEMAS_MISION_FINAL[selloActivo] : null;
  const todosResueltos = sellosResueltos.every(Boolean);

  const abrirSello = useCallback((idx: number) => {
    if (sellosResueltos[idx]) return;
    setSelloActivo(idx);
    setFase('resolviendo');
    setSeleccion(null);
    setMostrarFeedback(false);
    setMostrarPista(false);
    setIntentos(0);
    reproducir('clic');
  }, [sellosResueltos, reproducir]);

  const verificarRespuesta = useCallback(() => {
    if (seleccion === null || !problema) return;
    const correcta = seleccion === problema.respuesta;
    setEsCorrecta(correcta);
    setMostrarFeedback(true);

    if (correcta) {
      reproducir('correcto');
      const nuevos = [...sellosResueltos];
      nuevos[selloActivo!] = true;
      setSellosResueltos(nuevos);

      setTimeout(() => {
        const todosBien = nuevos.every(Boolean);
        if (todosBien) {
          setFase('victoria');
          reproducir('reino');
        } else {
          setFase('santuario');
          setSelloActivo(null);
        }
        setMostrarFeedback(false);
      }, 1800);
    } else {
      reproducir('incorrecto');
      setIntentos(prev => prev + 1);
      if (intentos >= 1) setMostrarPista(true);
      setTimeout(() => {
        setMostrarFeedback(false);
        setSeleccion(null);
      }, 1200);
    }
  }, [seleccion, problema, selloActivo, sellosResueltos, intentos, reproducir]);

  // ===== TEORÍA =====
  if (fase === 'teoria') {
    return (
      <div className="sn-overlay">
        <div className="sn-embers" aria-hidden="true">
          {Array.from({ length: 20 }, (_, i) => (
            <span key={i} className="sn-ember" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }} />
          ))}
        </div>

        <div className="sn-teoria-container">
          {/* Banner */}
          <div className="sn-banner">
            <span className="sn-nail sn-nail-l" aria-hidden="true" />
            <span className="sn-nail sn-nail-r" aria-hidden="true" />
            <h1 className="sn-banner-title">MISION FINAL</h1>
            <div className="sn-banner-divider" aria-hidden="true" />
            <h2 className="sn-banner-sub">EL SANTUARIO</h2>
          </div>

          {/* Descripción */}
          <div className="sn-desc">
            <p>Las dos gemas regresan al santuario, pero para reactivar la energia se necesita resolver 3 operaciones combinadas.</p>
          </div>

          {/* Two columns: Llama + Pizarra */}
          <div className="sn-teoria-body">
            {/* Llama */}
            <div className="sn-teoria-llama">
              <div className="sn-llama-frame">
                <img src="/assets/gemas/llama_yachay.png" alt="Llama Yachay" />
              </div>
              <div className="sn-llama-bubble">
                <strong>LLAMA YACHAY</strong>
                <p>{TEORIA_COMBINADAS.titulo}</p>
              </div>
            </div>

            {/* Pizarra */}
            <div className="sn-pizarra">
              <div className="sn-pizarra-header">ORDEN DE OPERACIONES</div>
              <div className="sn-pizarra-items">
                {TEORIA_COMBINADAS.orden.map((o) => (
                  <div key={o.paso} className="sn-pizarra-item">
                    <span className="sn-pizarra-num" style={{ background: o.color }}>{o.paso}</span>
                    <span className="sn-pizarra-text">{o.nombre}</span>
                  </div>
                ))}
              </div>
              <div className="sn-pizarra-tip">
                <span className="sn-px-bulb" />
                <p>{TEORIA_COMBINADAS.tip}</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <button className="sn-btn-cta" onClick={() => { setFase('santuario'); reproducir('clic'); }} autoFocus>
            Ir al Santuario
          </button>
        </div>
      </div>
    );
  }

  // ===== SANTUARIO + RESOLVIENDO =====
  if (fase === 'santuario' || fase === 'resolviendo') {
    return (
      <div className="sn-overlay sn-santuario-bg">
        {/* Background image */}
        <img src="/assets/santuario/santuario_bg.png" alt="" className="sn-bg-img" aria-hidden="true" />

        {/* Header */}
        <div className="sn-hud">
          <BotonSaltarMision onClick={alCerrar} />
          <div className="sn-hud-title">SANTUARIO</div>
          <div className="sn-hud-progress">
            {sellosResueltos.map((r, i) => (
              <span key={i} className={`sn-hud-seal ${r ? 'sn-hud-seal-done' : ''}`} />
            ))}
          </div>
        </div>

        {/* Sellos / Pedestales */}
        <div className="sn-sellos-row">
          {PROBLEMAS_MISION_FINAL.map((p, i) => (
            <button
              key={i}
              className={`sn-sello ${sellosResueltos[i] ? 'sn-sello-resuelto' : ''} ${selloActivo === i ? 'sn-sello-activo' : ''}`}
              onClick={() => abrirSello(i)}
              disabled={sellosResueltos[i]}
            >
              <div className="sn-sello-pedestal">
                <img src="/assets/santuario/pedestal.png" alt="Pedestal" className="sn-pedestal-img" />
                <div className={`sn-sello-gema ${sellosResueltos[i] ? 'sn-sello-gema-activa' : ''}`}>
                  {sellosResueltos[i] ? (
                    <img src="/assets/gemas/gema_calculos.png" alt="" className="sn-mini-gema" />
                  ) : (
                    <span className="sn-sello-num">{i + 1}</span>
                  )}
                </div>
              </div>
              <span className="sn-sello-label">{sellosResueltos[i] ? 'Resuelto' : `Sello ${i + 1}`}</span>
            </button>
          ))}
        </div>

        {/* Trono central */}
        <div className="sn-trono" aria-hidden="true">
          <img src="/assets/santuario/trono.png" alt="Trono" className="sn-trono-img" />
          <div className="sn-trono-glow" />
        </div>

        {/* Panel de problema activo */}
        {fase === 'resolviendo' && problema && (
          <div className="sn-problema-overlay">
            <div className="sn-problema-panel">
              <div className="sn-problema-header">
                <span className="sn-problema-sello-num">SELLO {selloActivo! + 1}</span>
                <h3 className="sn-problema-titulo">Operacion Combinada</h3>
              </div>

              <div className="sn-problema-expresion">
                {problema.expresion}
              </div>

              {/* Pasos desglosados */}
              <div className="sn-problema-pasos">
                {problema.pasos.map((paso, i) => (
                  <span key={i} className="sn-problema-paso">
                    <span className="sn-paso-arrow">{'>'}</span> {paso}
                  </span>
                ))}
              </div>

              {/* Opciones */}
              <div className="sn-opciones">
                {problema.opciones.map((op) => (
                  <button
                    key={op}
                    className={`sn-opcion ${seleccion === op ? 'sn-opcion-sel' : ''} ${mostrarFeedback && op === problema.respuesta ? 'sn-opcion-correcta' : ''} ${mostrarFeedback && seleccion === op && op !== problema.respuesta ? 'sn-opcion-incorrecta' : ''}`}
                    onClick={() => { if (!mostrarFeedback) { setSeleccion(op); reproducir('clic'); } }}
                    disabled={mostrarFeedback}
                  >
                    {op}
                  </button>
                ))}
              </div>

              {/* Pista */}
              {mostrarPista && (
                <div className="sn-pista">
                  <span className="sn-px-bulb" />
                  <p>{problema.pista}</p>
                </div>
              )}

              {/* Feedback */}
              {mostrarFeedback && (
                <div className={`sn-feedback ${esCorrecta ? 'sn-feedback-ok' : 'sn-feedback-err'}`}>
                  {esCorrecta ? 'Correcto — Sello activado' : 'Incorrecto — Intenta de nuevo'}
                </div>
              )}

              {/* Botones */}
              <div className="sn-problema-btns">
                <button className="sn-btn-secondary" onClick={() => { setFase('santuario'); setSelloActivo(null); }}>
                  Volver
                </button>
                {!mostrarFeedback && seleccion !== null && (
                  <button className="sn-btn-cta" onClick={verificarRespuesta}>
                    Verificar
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ===== VICTORIA =====
  if (fase === 'victoria') {
    return (
      <div className="sn-overlay sn-victoria-bg">
        {/* Background: santuario completo */}
        <img src="/assets/santuario/santuario_completo.png" alt="" className="sn-bg-img" aria-hidden="true" />

        <div className="sn-embers" aria-hidden="true">
          {Array.from({ length: 30 }, (_, i) => (
            <span key={i} className="sn-ember sn-ember-gold" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }} />
          ))}
        </div>

        <div className="sn-victoria-container">
          <div className="sn-banner sn-banner-gold">
            <h1 className="sn-banner-title">SANTUARIO RESTAURADO</h1>
          </div>

          <div className="sn-victoria-gemas">
            <div className="sn-victoria-gema sn-victoria-gema-azul">
              <img src="/assets/gemas/gema_calculos.png" alt="Gema de los Cálculos" />
              <span>Gema de los Calculos</span>
            </div>
            <div className="sn-victoria-trono">
              <img src="/assets/santuario/trono.png" alt="Trono" className="sn-trono-img-victoria" />
            </div>
            <div className="sn-victoria-gema sn-victoria-gema-verde">
              <img src="/assets/gemas/gema_energia.png" alt="Gema de la Energía" />
              <span>Gema de la Energia</span>
            </div>
          </div>

          <div className="sn-victoria-placa">
            <p>Las dos gemas regresan al <strong>Santuario Matematico</strong> y la <strong>Ciudadela del Abaco</strong> vuelve a iluminarse.</p>
          </div>

          <button className="sn-btn-cta sn-btn-gold" onClick={() => { alCompletar(); }} autoFocus>
            Continuar
          </button>
        </div>
      </div>
    );
  }

  return null;
}
