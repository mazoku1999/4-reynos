'use client';

/**
 * PantallaCarga — Precarga TODOS los assets del juego y muestra progreso.
 * Al cargar todo de golpe se evita lag al navegar entre reinos.
 * Accesibilidad: role="progressbar", aria-live, anuncio al completar.
 */

import { useEffect, useState } from 'react';
import { anunciarSR } from '@/lib/accesibilidad';
import { TODOS_LOS_ASSETS, MUSICA_MAPA } from '@/datos/assetsPreload';

interface Props {
  alCompletar: () => void;
}

export default function PantallaCarga({ alCompletar }: Props) {
  const [cargadas, setCargadas] = useState(0);
  const total = TODOS_LOS_ASSETS.length + 1; // +1 for audio
  const porcentaje = Math.round((cargadas / total) * 100);

  useEffect(() => {
    let cuenta = 0;
    const marcar = () => {
      cuenta++;
      setCargadas(cuenta);
      if (cuenta >= total) {
        anunciarSR('Carga completa. El juego está listo.');
        setTimeout(alCompletar, 400);
      }
    };

    // Preload images
    TODOS_LOS_ASSETS.forEach(src => {
      const img = new Image();
      img.onload = img.onerror = marcar;
      img.src = src;
    });

    // Preload background music
    const audio = new Audio();
    audio.preload = 'auto';
    audio.oncanplaythrough = marcar;
    audio.onerror = marcar;
    audio.src = MUSICA_MAPA;
  }, [alCompletar, total]);

  return (
    <section
      className="screen active"
      id="loading-screen"
      role="alert"
      aria-label="Pantalla de carga"
    >
      <div className="loading-content">
        <div
          className="loading-bar-container"
          role="progressbar"
          aria-valuenow={porcentaje}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Cargando: ${porcentaje}%`}
        >
          <div className="loading-bar" style={{ width: `${porcentaje}%` }} />
        </div>
        <p className="loading-text" aria-live="polite">
          {cargadas >= total ? '¡Listo!' : `Cargando... ${cargadas}/${total}`}
        </p>
      </div>
    </section>
  );
}
