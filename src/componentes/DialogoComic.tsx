'use client';

/* eslint-disable @next/next/no-img-element */

/**
 * DialogoComic — Escena narrativa estilo cómic con máquina de escribir.
 * Accesibilidad: role="dialog", aria-live para texto dinámico,
 * Escape para saltar, foco atrapado en el diálogo.
 */

import { useEffect, useCallback, useState, useRef } from 'react';
import { useMaquinaEscribir } from '@/hooks/useMaquinaEscribir';
import { anunciarSR } from '@/lib/accesibilidad';
import type { Introduccion } from '@/datos/introducciones';
import type { TipoSonido } from '@/hooks/useSonido';

interface Props {
  introduccion: Introduccion;
  alCompletar: () => void;
  alSaltar: () => void;
  reproducir: (tipo: TipoSonido) => void;
}

export default function DialogoComic({ introduccion, alCompletar, alSaltar, reproducir }: Props) {
  const [paso, setPaso] = useState(0);
  const { textoVisible, escribiendo, iniciarEscritura, saltarAlFinal, limpiar } = useMaquinaEscribir();
  const contenedorRef = useRef<HTMLDivElement>(null);

  // Iniciar escritura del primer diálogo
  useEffect(() => {
    setPaso(0);
    iniciarEscritura(introduccion.dialogos[0].texto);
    anunciarSR(`Diálogo con ${introduccion.nombrePersonaje}. ${introduccion.tituloMision}`);
    return () => limpiar();
  }, [introduccion, iniciarEscritura, limpiar]);

  // Teclado: Escape para saltar, Enter/Space para avanzar
  useEffect(() => {
    const manejar = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        limpiar();
        alSaltar();
        reproducir('clic');
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        avanzar();
      }
    };
    window.addEventListener('keydown', manejar);
    return () => window.removeEventListener('keydown', manejar);
  });

  /** Avanzar al siguiente diálogo o completar */
  const avanzar = useCallback(() => {
    if (escribiendo) {
      saltarAlFinal();
      return;
    }

    const siguientePaso = paso + 1;
    if (siguientePaso < introduccion.dialogos.length) {
      setPaso(siguientePaso);
      iniciarEscritura(introduccion.dialogos[siguientePaso].texto);
      reproducir('clic');
    } else {
      alCompletar();
      reproducir('reino');
    }
  }, [escribiendo, paso, introduccion, saltarAlFinal, iniciarEscritura, reproducir, alCompletar]);

  /** Saltar toda la escena */
  const manejarSaltar = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    limpiar();
    alSaltar();
    reproducir('clic');
  }, [limpiar, alSaltar, reproducir]);

  return (
    <div
      className="overlay active"
      onClick={avanzar}
      ref={contenedorRef}
      role="dialog"
      aria-label={`Diálogo: ${introduccion.tituloMision}`}
      aria-modal="true"
    >
      <div className="comic-scene">
        <div className="comic-bg" style={{ background: introduccion.fondoEscena }} aria-hidden="true" />
        <div className="comic-particles" aria-hidden="true" />

        {/* Personaje */}
        <div className="comic-character" aria-hidden="true">
          <img src={introduccion.imagenPersonaje} alt="" />
          <div className="comic-char-name">{introduccion.nombrePersonaje}</div>
        </div>

        {/* Pergamino con diálogo */}
        <div className="comic-bubble" role="log" aria-label="Diálogo del personaje">
          <div className="comic-bubble-glow" aria-hidden="true" />
          <div className="comic-mission-title">{introduccion.tituloMision}</div>
          <div className="comic-text-area">
            <p className="comic-text" aria-live="polite">{textoVisible}</p>
          </div>
          <div className="comic-indicator" aria-hidden="true">▼</div>
        </div>

        {/* Indicador de paso (solo visual) */}
        <div className="comic-step-badge" aria-hidden="true">
          {paso + 1} / {introduccion.dialogos.length}
        </div>
        <span className="sr-only">
          Diálogo {paso + 1} de {introduccion.dialogos.length}
        </span>

        {/* Progreso visual */}
        <div className="comic-progress" aria-hidden="true">
          <div className="comic-dots">
            {introduccion.dialogos.map((_, i) => (
              <div
                key={i}
                className={`comic-dot ${i < paso ? 'done' : ''} ${i === paso ? 'active' : ''}`}
              />
            ))}
          </div>
        </div>

        {/* Botón saltar */}
        <button
          className="comic-skip"
          onClick={manejarSaltar}
          aria-label="Saltar diálogo completo (Escape)"
        >
          Saltar <span className="px-icon px-skip" />
        </button>
      </div>
    </div>
  );
}
