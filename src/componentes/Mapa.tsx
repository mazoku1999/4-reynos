'use client';

/* eslint-disable @next/next/no-img-element */

/**
 * Mapa — Hub central con las 4 islas y el Tinkuy.
 * Accesibilidad: role="list" para islas, aria-label descriptivos,
 * focus-visible, keyboard navigation, scroll-snap mobile.
 */

import { REINOS, POSICIONES_ISLAS } from '@/datos/reinos';
import CanvasPuentes from './CanvasPuentes';

interface Props {
  activa: boolean;
  reinosCompletados: string[];
  alSeleccionarReino: (clave: string) => void;
}

export default function Mapa({ activa, reinosCompletados, alSeleccionarReino }: Props) {
  const todosCompletos = reinosCompletados.length === 4;

  return (
    <section
      className={`screen ${activa ? 'active' : ''}`}
      id="map-screen"
      aria-label="Mapa de los 4 reinos"
      aria-hidden={!activa}
    >
      {/* Canvas de puentes (decorativo) */}
      <CanvasPuentes reinosCompletados={reinosCompletados} />

      {/* Header */}
      <header className="map-header">
        <h1 className="header-title">LOS 4 REINOS</h1>
        <p className="header-sub" aria-hidden="true">APRENDE • CREA • TRANSFORMA</p>
      </header>

      {/* Progreso */}
      <div className="map-progress" role="status" aria-label="Progreso del juego">
        <span>{reinosCompletados.length}/4 reinos completados</span>
      </div>

      {/* Tinkuy Central */}
      <div
        className={`tinkuy-center ${todosCompletos ? 'activated' : ''}`}
        aria-hidden="true"
      >
        <img
          src="/assets/sprites_individuales/islas/islas_05.png"
          alt=""
          className="tinkuy-img"
        />
        <div className="tinkuy-label">
          <strong>TINKUY</strong>
          <small>Unión de los 4 Reinos</small>
        </div>
      </div>

      {/* Islas — navegables con teclado */}
      <div role="list" aria-label="Reinos disponibles" className="sr-only">
        Lista de reinos: {POSICIONES_ISLAS.map(({ clave }) => REINOS[clave].nombre).join(', ')}
      </div>

      {POSICIONES_ISLAS.map(({ clave, clase, imagen, alt }) => {
        const reino = REINOS[clave];
        const completado = reinosCompletados.includes(clave);

        return (
          <div
            key={clave}
            className={`island-card ${clase} ${completado ? 'completed' : ''}`}
            id={`island-${clave}`}
            onClick={() => !completado && alSeleccionarReino(clave)}
            role="button"
            tabIndex={activa && !completado ? 0 : -1}
            aria-label={`${reino.nombre} — ${reino.tema}. ${completado ? 'Completado' : 'Toca para jugar'}`}
            aria-disabled={completado}
            onKeyDown={(e) => {
              if ((e.key === 'Enter' || e.key === ' ') && !completado) {
                e.preventDefault();
                alSeleccionarReino(clave);
              }
            }}
          >
            <img src={imagen} alt={alt} className="island-img" />
            <div className="island-label" aria-hidden="true">
              <span className="label-name">{reino.nombre}</span>
              <span className="label-theme">{reino.tema}</span>
            </div>
            <div className="island-check" aria-hidden="true">✓</div>
          </div>
        );
      })}
    </section>
  );
}
