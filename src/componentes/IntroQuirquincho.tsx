'use client';

/* eslint-disable @next/next/no-img-element */

/**
 * IntroQuirquincho — Secuencia cinematográfica para el reino del Quirquincho.
 *
 * 7 slides con imágenes fullscreen, texto narrativo pixel-art,
 * diálogos del Rey Quirquincho, y botón "Aceptar Misión".
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { useMaquinaEscribir } from '@/hooks/useMaquinaEscribir';
import { anunciarSR } from '@/lib/accesibilidad';
import type { TipoSonido } from '@/hooks/useSonido';

interface Props {
  alCompletar: () => void;
  alSaltar: () => void;
  reproducir: (tipo: TipoSonido) => void;
}

/* ── Slide definitions ── */

interface SlideNarrative {
  tipo: 'narrativa';
  fondo: string;
  textos: string[];
}

interface SlideDialogo {
  tipo: 'dialogo';
  fondo: string;
  personaje: string;
  lineas: string[];
}

interface SlideAccept {
  tipo: 'aceptar';
  fondo: string;
  texto: string;
}

interface SlideFinal {
  tipo: 'final';
  fondo: string;
  personaje: string;
  texto: string;
}

type Slide = SlideNarrative | SlideDialogo | SlideAccept | SlideFinal;

const SLIDES: Slide[] = [
  {
    tipo: 'narrativa',
    fondo: '/assets/quirquincho/intro_fogata.png',
    textos: [
      'Hace muchísimo tiempo, cuando el Gran Chaco aún hablaba con el viento, las leyendas vivían en cada fogata, en cada árbol y en cada camino de tierra roja.',
      'Los abuelos contaban historias mientras las estrellas iluminaban la noche:',
    ],
  },
  {
    tipo: 'narrativa',
    fondo: '/assets/quirquincho/intro_estatua_dia_v2.png',
    textos: [
      'Todas las leyendas estaban protegidas por un antiguo guardián...',
    ],
  },
  {
    tipo: 'narrativa',
    fondo: '/assets/quirquincho/intro_estatua_noche_v2.png',
    textos: [
      'Un día las fogatas comenzaron a apagarse. Las placas del caparazón del Rey Quirquincho empezaron a quebrarse una por una.',
      'Con cada grieta, una leyenda desaparecía.',
    ],
  },
  {
    tipo: 'dialogo',
    fondo: '/assets/quirquincho/intro_rey.png',
    personaje: '/assets/sprites_individuales/personajes/rey_quirquincho.png',
    lineas: [
      'Bienvenido, pequeño guardián... Mi caparazón guarda las historias de nuestro pueblo.',
      'Pero las leyendas están desapareciendo. Si las olvidamos... olvidaremos quiénes somos.',
      'La aldea del Chaco ha quedado en silencio. Necesito que viajes por los caminos antiguos.',
      'Escuches las voces del viento y rescates las palabras perdidas.',
    ],
  },
  {
    tipo: 'aceptar',
    fondo: '/assets/quirquincho/intro_aldea.png',
    texto: '¿Aceptas la misión, guardián?',
  },
  {
    tipo: 'final',
    fondo: '/assets/quirquincho/intro_llama.png',
    personaje: '/assets/sprites_individuales/personajes/rey_quirquincho.png',
    texto: 'Esta es la Llama de la Memoria. Mientras permanezca encendida, las leyendas seguirán vivas.',
  },
];

export default function IntroQuirquincho({ alCompletar, alSaltar, reproducir }: Props) {
  const [slideIdx, setSlideIdx] = useState(0);
  const [subIdx, setSubIdx] = useState(0); // sub-index for multi-text slides
  const [transitioning, setTransitioning] = useState(false);
  const [visible, setVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const { textoVisible, escribiendo, iniciarEscritura, saltarAlFinal, limpiar } = useMaquinaEscribir();

  const slide = SLIDES[slideIdx];

  /* ── Get the current text to type ── */
  const getCurrentText = useCallback((): string => {
    if (!slide) return '';
    switch (slide.tipo) {
      case 'narrativa': return slide.textos[subIdx] || '';
      case 'dialogo': return slide.lineas[subIdx] || '';
      case 'aceptar': return slide.texto;
      case 'final': return slide.texto;
    }
  }, [slide, subIdx]);

  /* ── Start typing on mount / slide change ── */
  useEffect(() => {
    const txt = getCurrentText();
    if (txt) iniciarEscritura(txt);
    return () => limpiar();
  }, [slideIdx, subIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Announce for SR ── */
  useEffect(() => {
    anunciarSR('Introducción al Reino del Quirquincho');
  }, []);

  /* ── Transition helper ── */
  const goToSlide = useCallback((next: number) => {
    setVisible(false);
    setTransitioning(true);
    setTimeout(() => {
      setSlideIdx(next);
      setSubIdx(0);
      setVisible(true);
      setTransitioning(false);
    }, 500);
  }, []);

  /* ── Advance logic ── */
  const avanzar = useCallback(() => {
    if (transitioning) return;

    // If still typing, skip to end
    if (escribiendo) {
      saltarAlFinal();
      return;
    }

    reproducir('clic');

    // Check if there are more sub-texts in current slide
    if (slide.tipo === 'narrativa' && subIdx < slide.textos.length - 1) {
      setSubIdx(subIdx + 1);
      return;
    }
    if (slide.tipo === 'dialogo' && subIdx < slide.lineas.length - 1) {
      setSubIdx(subIdx + 1);
      return;
    }

    // Don't auto-advance on "aceptar" slide (needs button click)
    if (slide.tipo === 'aceptar') return;

    // Next slide
    const next = slideIdx + 1;
    if (next < SLIDES.length) {
      goToSlide(next);
    } else {
      // Done
      alCompletar();
    }
  }, [transitioning, escribiendo, saltarAlFinal, reproducir, slide, subIdx, slideIdx, goToSlide, alCompletar]);

  /* ── Accept mission ── */
  const aceptarMision = useCallback(() => {
    reproducir('clic');
    const next = slideIdx + 1;
    if (next < SLIDES.length) {
      goToSlide(next);
    } else {
      alCompletar();
    }
  }, [reproducir, slideIdx, goToSlide, alCompletar]);

  /* ── Complete final slide ── */
  const completarFinal = useCallback(() => {
    if (escribiendo) {
      saltarAlFinal();
      return;
    }
    reproducir('reino');
    alCompletar();
  }, [escribiendo, saltarAlFinal, reproducir, alCompletar]);

  /* ── Keyboard ── */
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        limpiar();
        alSaltar();
        reproducir('clic');
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (slide.tipo === 'aceptar') aceptarMision();
        else if (slide.tipo === 'final') completarFinal();
        else avanzar();
      }
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  });

  if (!slide) return null;

  /* ── Get sub-progress for dialogue slides ── */
  const getSubTotal = () => {
    if (slide.tipo === 'narrativa') return slide.textos.length;
    if (slide.tipo === 'dialogo') return slide.lineas.length;
    return 1;
  };

  return (
    <div
      className="qi-overlay"
      ref={containerRef}
      onClick={slide.tipo === 'aceptar' ? undefined : (slide.tipo === 'final' ? completarFinal : avanzar)}
      role="dialog"
      aria-label="Introducción al Reino del Quirquincho"
      aria-modal="true"
    >
      {/* Background image with transition */}
      <div
        className={`qi-bg ${visible ? 'qi-visible' : 'qi-hidden'}`}
        style={{ backgroundImage: `url(${slide.fondo})` }}
        aria-hidden="true"
      />
      <div className="qi-bg-overlay" aria-hidden="true" />

      {/* Content */}
      <div className={`qi-content ${visible ? 'qi-visible' : 'qi-hidden'}`}>

        {/* ── Narrative slides ── */}
        {slide.tipo === 'narrativa' && (
          <div className="qi-narr-box">
            <p className="qi-narr-text">{textoVisible}</p>
            {!escribiendo && (
              <div className="qi-narr-indicator">Toca para continuar</div>
            )}
          </div>
        )}

        {/* ── Dialogue slides ── */}
        {slide.tipo === 'dialogo' && (
          <div className="qi-dial-wrap">
            <div className="qi-dial-bubble">
              <div className="qi-dial-name">Rey Quirquincho</div>
              <p className="qi-dial-text">{textoVisible}</p>
              <div className="qi-dial-counter">{subIdx + 1}/{getSubTotal()}</div>
              {!escribiendo && (
                <div className="qi-narr-indicator">Toca para continuar</div>
              )}
            </div>
          </div>
        )}

        {/* ── Accept mission slide ── */}
        {slide.tipo === 'aceptar' && (
          <div className="qi-accept-wrap">
            <div className="qi-accept-box">
              <p className="qi-accept-text">{textoVisible}</p>
              {!escribiendo && (
                <button className="qi-accept-btn" onClick={aceptarMision}>
                  Aceptar Misión
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── Final slide ── */}
        {slide.tipo === 'final' && (
          <div className="qi-final-wrap">
            <div className="qi-dial-bubble">
              <div className="qi-dial-name">Rey Quirquincho</div>
              <p className="qi-dial-text">{textoVisible}</p>
              {!escribiendo && (
                <div className="qi-narr-indicator">Toca para comenzar la aventura</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Progress dots */}
      <div className="qi-progress" aria-hidden="true">
        {SLIDES.map((_, i) => (
          <div
            key={i}
            className={`qi-dot ${i < slideIdx ? 'done' : ''} ${i === slideIdx ? 'active' : ''}`}
          />
        ))}
      </div>

      {/* Skip button */}
      <button
        className="qi-skip"
        onClick={(e) => {
          e.stopPropagation();
          limpiar();
          alSaltar();
          reproducir('clic');
        }}
        aria-label="Saltar introducción"
      >
        Saltar
      </button>
    </div>
  );
}
