'use client';

/* eslint-disable @next/next/no-img-element */

/**
 * PantallaTitulo — Pantalla inicial con logo, mascotas y botones.
 * Accesibilidad: navegación por teclado, roles, autoFocus.
 */

import { useEffect, useRef } from 'react';

interface Props {
  activa: boolean;
  alIniciar: () => void;
  alReiniciar: () => void;
}

export default function PantallaTitulo({ activa, alIniciar, alReiniciar }: Props) {
  const botonIniciarRef = useRef<HTMLButtonElement>(null);

  // Enfocar botón principal cuando se activa
  useEffect(() => {
    if (activa) {
      setTimeout(() => botonIniciarRef.current?.focus(), 300);
    }
  }, [activa]);

  // Teclado: Enter o Espacio para iniciar
  useEffect(() => {
    if (!activa) return;
    const manejar = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        alIniciar();
      }
    };
    window.addEventListener('keydown', manejar);
    return () => window.removeEventListener('keydown', manejar);
  }, [activa, alIniciar]);

  return (
    <section
      className={`screen ${activa ? 'active' : ''}`}
      id="title-screen"
      aria-label="Pantalla de título"
      aria-hidden={!activa}
    >
      <div className="title-content">
        <img
          src="/assets/title_banner.png"
          alt="Los 4 Reinos — Juego Educativo"
          className="title-logo"
        />

        <div className="title-mascots" aria-hidden="true">
          <img src="/assets/sprites_individuales/personajes/rey_condor.png" alt="" className="mascot mascot-float" style={{ '--delay': '0s' } as React.CSSProperties} />
          <img src="/assets/sprites_individuales/personajes/rey_puma_nuevo.png" alt="" className="mascot mascot-float" style={{ '--delay': '0.4s' } as React.CSSProperties} />
          <img src="/assets/sprites_individuales/personajes/rey_capibara.png" alt="" className="mascot mascot-player mascot-float" style={{ '--delay': '0.8s' } as React.CSSProperties} />
          <img src="/assets/sprites_individuales/personajes/rey_quirquincho.png" alt="" className="mascot mascot-float" style={{ '--delay': '1.2s' } as React.CSSProperties} />
        </div>

        <nav className="title-buttons" aria-label="Opciones del juego">
          <button
            ref={botonIniciarRef}
            className="btn btn-gold"
            onClick={alIniciar}
            aria-label="Iniciar aventura"
          >
            <span><span className="px-icon px-sword" /> Iniciar Aventura</span>
          </button>
          <button
            className="btn btn-ghost"
            onClick={alReiniciar}
            aria-label="Reiniciar todo el progreso del juego"
          >
            <span><span className="px-icon px-retry" /> Reiniciar Progreso</span>
          </button>
        </nav>

        <p className="title-version" aria-hidden="true">
          v3.0 — Los 4 Reinos Educativo
        </p>
      </div>
    </section>
  );
}
