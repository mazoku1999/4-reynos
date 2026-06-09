'use client';

/* eslint-disable @next/next/no-img-element */

/**
 * PantallaVictoria — Pantalla de celebración al completar los 4 reinos.
 * Accesibilidad: role="alert", auto-focus en botón, aria-labels.
 */

import { useEffect, useRef } from 'react';
import { anunciarSR } from '@/lib/accesibilidad';

interface Props {
  activa: boolean;
  alVolverAlMapa: () => void;
  alReiniciar: () => void;
}

const COLORES_PARTICULAS = ['#f0c040', '#ffe060', '#ffaa33', '#44ff44', '#4499ff', '#bb77ee'];

export default function PantallaVictoria({ activa, alVolverAlMapa, alReiniciar }: Props) {
  const contenedorParticulasRef = useRef<HTMLDivElement>(null);
  const botonMapaRef = useRef<HTMLButtonElement>(null);

  // Crear partículas y anunciar victoria
  useEffect(() => {
    if (!activa) return;

    anunciarSR('¡Felicitaciones! Has completado los 4 reinos y activado el Tinkuy.');
    setTimeout(() => botonMapaRef.current?.focus(), 500);

    const contenedor = contenedorParticulasRef.current;
    if (!contenedor) return;
    contenedor.innerHTML = '';

    for (let i = 0; i < 60; i++) {
      const particula = document.createElement('div');
      particula.className = 'particle';
      particula.style.left = `${Math.random() * 100}%`;
      particula.style.animationDuration = `${2 + Math.random() * 4}s`;
      particula.style.animationDelay = `${Math.random() * 3}s`;
      const tamaño = `${2 + Math.random() * 4}px`;
      particula.style.width = tamaño;
      particula.style.height = tamaño;
      particula.style.opacity = `${0.3 + Math.random() * 0.7}`;
      particula.style.background = COLORES_PARTICULAS[Math.floor(Math.random() * COLORES_PARTICULAS.length)];
      contenedor.appendChild(particula);
    }
  }, [activa]);

  return (
    <section
      className={`screen ${activa ? 'active' : ''}`}
      id="victory-screen"
      aria-label="Pantalla de victoria"
      aria-hidden={!activa}
      role="alert"
    >
      <div className="victory-content">
        <div className="victory-glow" aria-hidden="true" />
        <img
          src="/assets/sprites_individuales/islas/islas_05.png"
          alt="Tinkuy activado — la unión de los 4 reinos"
          className="victory-tinkuy"
        />
        <h1 className="victory-title">¡TINKUY ACTIVADO!</h1>
        <p className="victory-sub">
          Has unido los 4 reinos para<br />transformar tu comunidad.
        </p>

        <div className="victory-mascots" aria-hidden="true">
          {['rey_condor', 'rey_puma_nuevo', 'rey_capibara', 'rey_quirquincho'].map((nombre, i) => (
            <img
              key={nombre}
              src={`/assets/sprites_individuales/personajes/${nombre}.png`}
              alt=""
              className="mascot mascot-float"
              style={{ '--delay': `${i * 0.3}s` } as React.CSSProperties}
            />
          ))}
        </div>

        <nav className="victory-buttons" aria-label="Opciones tras la victoria">
          <button
            ref={botonMapaRef}
            className="btn btn-gold"
            onClick={alVolverAlMapa}
            aria-label="Volver al mapa de los reinos"
          >
            <span className="px-icon px-map" /> Volver al Mapa
          </button>
          <button
            className="btn btn-ghost"
            onClick={alReiniciar}
            aria-label="Reiniciar todo el progreso"
          >
            <span className="px-icon px-retry" /> Reiniciar
          </button>
        </nav>
      </div>
      <div className="victory-particles" ref={contenedorParticulasRef} aria-hidden="true" />
    </section>
  );
}
