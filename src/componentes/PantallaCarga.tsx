'use client';

/**
 * PantallaCarga — Precarga imágenes críticas y muestra progreso.
 * Accesibilidad: role="progressbar", aria-live, anuncio al completar.
 */

import { useEffect, useState } from 'react';
import { anunciarSR } from '@/lib/accesibilidad';

const IMAGENES_CRITICAS = [
  '/assets/title_banner.png',
  '/assets/sprites_individuales/islas/islas_01.png',
  '/assets/sprites_individuales/islas/islas_02.png',
  '/assets/sprites_individuales/islas/islas_03.png',
  '/assets/sprites_individuales/islas/islas_04.png',
  '/assets/sprites_individuales/islas/islas_05.png',
  '/assets/sprites_individuales/personajes/rey_condor.png',
  '/assets/sprites_individuales/personajes/rey_puma_nuevo.png',
  '/assets/sprites_individuales/personajes/rey_capibara.png',
  '/assets/sprites_individuales/personajes/rey_quirquincho.png',
  '/assets/sprites_individuales/personajes/rey_puma_nuevo.png',
  '/assets/ui/forest_bg.jpg',
  '/assets/ui/dialog_scroll.png',
  '/assets/ui/tile_dead.png',
  '/assets/ui/tile_alive.png',
  '/assets/ui/cosmos_bg.jpg',
];

interface Props {
  alCompletar: () => void;
}

export default function PantallaCarga({ alCompletar }: Props) {
  const [cargadas, setCargadas] = useState(0);
  const total = IMAGENES_CRITICAS.length;
  const porcentaje = Math.round((cargadas / total) * 100);

  useEffect(() => {
    let cuenta = 0;
    IMAGENES_CRITICAS.forEach(src => {
      const img = new Image();
      img.onload = img.onerror = () => {
        cuenta++;
        setCargadas(cuenta);
        if (cuenta >= total) {
          anunciarSR('Carga completa. El juego está listo.');
          setTimeout(alCompletar, 400);
        }
      };
      img.src = src;
    });
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
