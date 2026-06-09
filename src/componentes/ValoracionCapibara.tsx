'use client';

/* eslint-disable @next/next/no-img-element */

/**
 * ValoracionCapibara — Valoración + Producción del Reino Capibara
 * 
 * Fases:
 * 1. intro — Llama Yachay introduce la reflexión
 * 2. preguntas — 5 preguntas de reflexión con Rey Capiwara
 * 3. produccion — El Mosaico de las Gemas Perdidas
 * 4. final — Rey Capiwara agradece
 */

import { useState, useCallback } from 'react';
import {
  VALORACION_CAPIBARA,
  PRODUCCION_CAPIBARA,
} from '@/datos/misionesCapibara';
import BotonSaltarMision from './BotonSaltarMision';

interface Props {
  alCompletar: () => void;
  alCerrar: () => void;
  reproducir: (s: 'clic' | 'correcto' | 'incorrecto' | 'reino' | 'victoria') => void;
}

type Fase = 'intro' | 'preguntas' | 'produccion' | 'final';

export default function ValoracionCapibara({ alCompletar, alCerrar, reproducir }: Props) {
  const [fase, setFase] = useState<Fase>('intro');

  const avanzar = useCallback((siguiente: Fase) => {
    reproducir('clic');
    setFase(siguiente);
  }, [reproducir]);

  // ===== INTRO — Llama Yachay =====
  if (fase === 'intro') {
    return (
      <div className="vc-overlay">
        <div className="vc-container">
          <div className="vc-banner vc-banner-heart">
            <span className="vc-heart" aria-hidden="true" />
            <h1>VALORACION</h1>
          </div>

          <div className="vc-intro-body">
            <div className="vc-llama-section">
              <img src="/assets/gemas/llama_yachay.png" alt="Llama Yachay" className="vc-llama-img" />
            </div>
            <div className="vc-intro-bubble">
              <strong>Llama Yachay:</strong>
              <p>&ldquo;{VALORACION_CAPIBARA.introLlama}&rdquo;</p>
            </div>
          </div>

          <button className="vc-btn-cta" onClick={() => avanzar('preguntas')} autoFocus>
            Continuar
          </button>
        </div>
        <BotonSaltarMision onClick={alCerrar} />
      </div>
    );
  }

  // ===== PREGUNTAS DE REFLEXIÓN =====
  if (fase === 'preguntas') {
    return (
      <div className="vc-overlay">
        <div className="vc-container">
          <div className="vc-preguntas-body">
            {/* Rey Capiwara */}
            <div className="vc-rey-section">
              <img src="/assets/santuario/rey_capiwara.png" alt="Rey Capiwara" className="vc-rey-img" />
              <span className="vc-rey-name">Rey Capiwara</span>
            </div>

            {/* Preguntas */}
            <div className="vc-preguntas-panel">
              <h2 className="vc-preguntas-title">PREGUNTAS DE REFLEXION</h2>
              <ul className="vc-preguntas-list">
                {VALORACION_CAPIBARA.preguntas.map((p, i) => (
                  <li key={i} className="vc-pregunta-item">
                    <span className="vc-pregunta-bullet" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <button className="vc-btn-cta" onClick={() => avanzar('produccion')} autoFocus>
            Continuar
          </button>
        </div>
        <BotonSaltarMision onClick={alCerrar} />
      </div>
    );
  }

  // ===== PRODUCCIÓN — Mosaico de Gemas =====
  if (fase === 'produccion') {
    return (
      <div className="vc-overlay">
        <div className="vc-container">
          <div className="vc-banner vc-banner-star">
            <span className="vc-star" aria-hidden="true" />
            <h1>PRODUCCION</h1>
          </div>
          <h2 className="vc-prod-titulo">{PRODUCCION_CAPIBARA.titulo}</h2>

          <div className="vc-prod-body">
            {/* Instrucciones */}
            <div className="vc-prod-instrucciones">
              <p className="vc-prod-desc">{PRODUCCION_CAPIBARA.instrucciones}</p>
              <ul className="vc-prod-pasos">
                {PRODUCCION_CAPIBARA.pasos.map((p, i) => (
                  <li key={i}><span className="vc-prod-dot" />{p}</li>
                ))}
              </ul>
            </div>

            {/* Mosaico de gemas imagen */}
            <div className="vc-prod-mosaico">
              <img src="/assets/santuario/mosaico_gemas.png" alt="Mosaico de Gemas" className="vc-mosaico-img" />
            </div>
          </div>

          {/* Producto grupal */}
          <div className="vc-prod-grupal">
            <strong>Producto grupal:</strong>
            <p>{PRODUCCION_CAPIBARA.productoGrupal}</p>
          </div>

          <button className="vc-btn-cta" onClick={() => avanzar('final')} autoFocus>
            Continuar
          </button>
        </div>
        <BotonSaltarMision onClick={alCerrar} />
      </div>
    );
  }

  // ===== FINAL — Rey Capiwara =====
  if (fase === 'final') {
    return (
      <div className="vc-overlay vc-final-bg">
        <div className="vc-embers" aria-hidden="true">
          {Array.from({ length: 20 }, (_, i) => (
            <span key={i} className="sn-ember sn-ember-gold" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }} />
          ))}
        </div>

        <div className="vc-final-container">
          <div className="vc-final-rey">
            <img src="/assets/santuario/rey_capiwara.png" alt="Rey Capiwara" className="vc-rey-img vc-rey-img-lg" />
          </div>

          <div className="vc-final-placa">
            <strong>Rey Capiwara:</strong>
            <p>&ldquo;{VALORACION_CAPIBARA.finalRey}&rdquo;</p>
          </div>

          <button className="vc-btn-cta vc-btn-gold" onClick={() => { alCompletar(); }} autoFocus>
            Finalizar Aventura
          </button>
        </div>
      </div>
    );
  }

  return null;
}
