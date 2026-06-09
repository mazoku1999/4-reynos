'use client';

/* eslint-disable @next/next/no-img-element */

/**
 * ModalQuiz — Quiz de 3 preguntas para reinos sin tablero de misión.
 * Accesibilidad: role="dialog", radiogroup, aria-live feedback,
 * atajos de teclado (1,2,3, Enter, Escape), anuncios en SR.
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { REINOS } from '@/datos/reinos';
import { anunciarSR } from '@/lib/accesibilidad';
import type { TipoSonido } from '@/hooks/useSonido';

interface Props {
  reino: string;
  alCompletar: () => void;
  alCerrar: () => void;
  reproducir: (tipo: TipoSonido) => void;
}

export default function ModalQuiz({ reino, alCompletar, alCerrar, reproducir }: Props) {
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [respondida, setRespondida] = useState(false);
  const [resultado, setResultado] = useState<'correcto' | 'incorrecto' | null>(null);
  const [estadosOpciones, setEstadosOpciones] = useState<string[]>([]);
  const modalRef = useRef<HTMLDivElement>(null);

  const datosReino = REINOS[reino];

  // Reiniciar al abrir y anunciar
  useEffect(() => {
    setPreguntaActual(0);
    setRespondida(false);
    setResultado(null);
    setEstadosOpciones([]);
    if (datosReino) {
      anunciarSR(`Quiz: ${datosReino.nombre}. ${datosReino.tema}. Pregunta 1 de ${datosReino.preguntas.length}.`);
    }
  }, [reino, datosReino]);

  // Enfocar modal al abrir
  useEffect(() => {
    modalRef.current?.focus();
  }, []);

  /** Seleccionar una opción */
  const seleccionarOpcion = useCallback((indice: number) => {
    if (respondida || !datosReino) return;
    setRespondida(true);

    const pregunta = datosReino.preguntas[preguntaActual];
    const esCorrecta = indice === pregunta.correcta;

    const estados = pregunta.opciones.map((_, i) => {
      if (i === pregunta.correcta) return 'correct';
      if (i === indice && !esCorrecta) return 'wrong';
      if (i !== indice) return 'disabled';
      return '';
    });

    setEstadosOpciones(estados);
    setResultado(esCorrecta ? 'correcto' : 'incorrecto');
    reproducir(esCorrecta ? 'correcto' : 'incorrecto');
    anunciarSR(esCorrecta ? 'Respuesta correcta.' : 'Respuesta incorrecta. Inténtalo de nuevo.');
  }, [respondida, datosReino, preguntaActual, reproducir]);

  /** Pasar a la siguiente pregunta */
  const siguientePregunta = useCallback(() => {
    if (!datosReino) return;

    if (resultado === 'incorrecto') {
      setRespondida(false);
      setResultado(null);
      setEstadosOpciones([]);
      return;
    }

    if (preguntaActual < datosReino.preguntas.length - 1) {
      const siguiente = preguntaActual + 1;
      setPreguntaActual(siguiente);
      setRespondida(false);
      setResultado(null);
      setEstadosOpciones([]);
      reproducir('clic');
      anunciarSR(`Pregunta ${siguiente + 1} de ${datosReino.preguntas.length}.`);
    } else {
      alCompletar();
    }
  }, [datosReino, resultado, preguntaActual, reproducir, alCompletar]);

  // Atajos de teclado
  useEffect(() => {
    const manejarTecla = (e: KeyboardEvent) => {
      if (e.key === 'Escape') alCerrar();
      if (e.key === '1') seleccionarOpcion(0);
      if (e.key === '2') seleccionarOpcion(1);
      if (e.key === '3') seleccionarOpcion(2);
      if (e.key === 'Enter' && respondida) siguientePregunta();
    };
    window.addEventListener('keydown', manejarTecla);
    return () => window.removeEventListener('keydown', manejarTecla);
  }, [alCerrar, seleccionarOpcion, siguientePregunta, respondida]);

  if (!datosReino) return null;

  const pregunta = datosReino.preguntas[preguntaActual];
  const progreso = ((preguntaActual + 1) / datosReino.preguntas.length) * 100;

  return (
    <div
      className="overlay active"
      onClick={(e) => { if (e.target === e.currentTarget) alCerrar(); }}
      role="dialog"
      aria-label={`Quiz: ${datosReino.nombre}`}
      aria-modal="true"
    >
      <div className="quiz-modal" ref={modalRef} tabIndex={-1}>
        {/* Encabezado */}
        <div className="quiz-header" data-color={datosReino.color}>
          <div className="quiz-mascot" aria-hidden="true">
            <img src={datosReino.mascotaSrc} alt="" />
          </div>
          <div className="quiz-title-area">
            <h2>{datosReino.nombre}</h2>
            <p>{datosReino.tema}</p>
          </div>
          <button
            className="quiz-close"
            onClick={alCerrar}
            aria-label="Cerrar quiz y volver al mapa (Escape)"
          >
            <span className="px-icon px-close" />
          </button>
        </div>

        {/* Barra de progreso */}
        <div
          className="quiz-progress-bar"
          role="progressbar"
          aria-valuenow={preguntaActual + 1}
          aria-valuemin={1}
          aria-valuemax={datosReino.preguntas.length}
          aria-label={`Pregunta ${preguntaActual + 1} de ${datosReino.preguntas.length}`}
        >
          <div className="quiz-progress-fill" style={{ width: `${progreso}%` }} />
          <span className="quiz-progress-text" aria-hidden="true">
            {preguntaActual + 1}/{datosReino.preguntas.length}
          </span>
        </div>

        {/* Pregunta */}
        <div className="quiz-body">
          <p className="quiz-question" id="quiz-pregunta-actual">{pregunta.pregunta}</p>
          <div
            className="quiz-options"
            role="radiogroup"
            aria-labelledby="quiz-pregunta-actual"
            aria-label="Opciones de respuesta"
          >
            {pregunta.opciones.map((opcion, i) => (
              <div
                key={i}
                className={`quiz-option ${estadosOpciones[i] || ''}`}
                onClick={() => seleccionarOpcion(i)}
                style={{ pointerEvents: respondida ? 'none' : 'auto' }}
                role="radio"
                tabIndex={respondida ? -1 : 0}
                aria-checked={estadosOpciones[i] === 'correct'}
                aria-label={`Opción ${i + 1}: ${opcion}. Atajo: tecla ${i + 1}`}
                onKeyDown={(e) => {
                  if ((e.key === 'Enter' || e.key === ' ') && !respondida) {
                    e.preventDefault();
                    seleccionarOpcion(i);
                  }
                }}
              >
                {i + 1}. {opcion}
              </div>
            ))}
          </div>
        </div>

        {/* Retroalimentación */}
        {resultado && (
          <div
            className={`quiz-feedback active ${resultado === 'correcto' ? 'correct' : 'wrong'}`}
            role="alert"
            aria-live="assertive"
          >
            <div className="feedback-icon" aria-hidden="true">
              {resultado === 'correcto' ? <span className="px-icon px-check" /> : <span className="px-icon px-cross" />}
            </div>
            <p className="feedback-text">
              {resultado === 'correcto'
                ? '¡Respuesta correcta!'
                : 'Respuesta incorrecta. ¡Inténtalo de nuevo!'}
            </p>
            <button
              className="btn btn-gold btn-sm"
              onClick={siguientePregunta}
              aria-label={
                resultado === 'correcto'
                  ? (preguntaActual < datosReino.preguntas.length - 1 ? 'Ir a siguiente pregunta' : 'Completar reino')
                  : 'Reintentar esta pregunta'
              }
            >
              {resultado === 'correcto'
                ? (preguntaActual < datosReino.preguntas.length - 1 ? 'Siguiente pregunta' : '¡Completar reino!')
                : 'Reintentar'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
