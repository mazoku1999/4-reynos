'use client';

/* eslint-disable @next/next/no-img-element */

/**
 * JuegoCondor — Juego interactivo del Reino del Cóndor
 * "El Despertar del Árbol Sagrado"
 *
 * Flujo:
 * 1. Intro docente → 2. Aparición Cóndor → 3. Diálogo problema
 * 4. Árbol seco → 5. Preguntas reflexión → 6. Seleccionar hojas
 * 7. Pregunta por hoja → 8. Hoja vuela al árbol → 9. Victoria
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import './JuegoCondor.css';
import { useMaquinaEscribir } from '@/hooks/useMaquinaEscribir';
import BotonSaltarMision from './BotonSaltarMision';
import { anunciarSR } from '@/lib/accesibilidad';
import type { TipoSonido } from '@/hooks/useSonido';
import {
  SIMBOLOS_CORRECTOS,
  IDS_CORRECTOS,
  TEXTO_INTRO,
  DIALOGOS_PROBLEMA,
  PREGUNTAS_REFLEXION,
  TEXTO_SELECCION,
  MENSAJES_ERROR_SELECCION,
  TEXTO_SELECCION_CORRECTA,
  TEXTO_VICTORIA,
  getStageArbol,
  generarHojasBarajadas,
} from '@/datos/misionesCondor';

// ---- Tipos ----

interface Props {
  alCompletar: () => void;
  alCerrar: () => void;
  reproducir: (tipo: TipoSonido) => void;
}

type SubFase =
  | 'intro'
  | 'aparicion'
  | 'dialogo-problema'
  | 'arbol-seco'
  | 'preguntas-reflexion'
  | 'seleccionar-hojas'
  | 'feedback-seleccion'
  | 'pregunta-hoja'
  | 'feedback-pregunta'
  | 'hoja-al-arbol'
  | 'victoria';

// ---- Posiciones de hojas en el árbol (porcentajes del contenedor) ----
const POSICIONES_HOJAS = [
  { top: '12%', left: '42%' },  // top center
  { top: '18%', left: '22%' },  // top-left
  { top: '18%', left: '62%' },  // top-right
  { top: '32%', left: '15%' },  // mid-left
  { top: '32%', left: '68%' },  // mid-right
  { top: '42%', left: '30%' },  // lower-left
  { top: '42%', left: '55%' },  // lower-right
  { top: '25%', left: '42%' },  // center
];

// ---- Componente ----

export default function JuegoCondor({ alCompletar, alCerrar, reproducir }: Props) {
  // Machine states
  const [subFase, setSubFase] = useState<SubFase>('intro');
  const [dialogIdx, setDialogIdx] = useState(0);
  const [reflexionIdx, setReflexionIdx] = useState(0);
  const [errorSeleccionIdx, setErrorSeleccionIdx] = useState(0);

  // Leaf selection
  const hojasBarajadas = useMemo(() => generarHojasBarajadas(), []);
  const [seleccionadas, setSeleccionadas] = useState<Set<string>>(new Set());

  // Per-leaf question flow
  const [hojaActualIdx, setHojaActualIdx] = useState(0);
  const [respuestaElegida, setRespuestaElegida] = useState<number | null>(null);
  const [feedbackPregunta, setFeedbackPregunta] = useState<'correcto' | 'incorrecto' | null>(null);

  // Tree progression
  const [hojasColocadas, setHojasColocadas] = useState<string[]>([]);
  const [animandoHoja, setAnimandoHoja] = useState(false);

  // Typewriter
  const { textoVisible, escribiendo, iniciarEscritura, saltarAlFinal, limpiar } =
    useMaquinaEscribir();

  // Announce for screen readers
  useEffect(() => {
    anunciarSR('Juego del Cóndor: El Despertar del Árbol Sagrado');
  }, []);

  // ---- Typewriter effect management per phase ----
  useEffect(() => {
    limpiar();
    switch (subFase) {
      case 'intro':
        iniciarEscritura(TEXTO_INTRO);
        break;
      case 'dialogo-problema':
        iniciarEscritura(DIALOGOS_PROBLEMA[dialogIdx] || '');
        break;
      case 'arbol-seco':
        iniciarEscritura(
          'Observen... el Árbol Sagrado ha perdido toda su vida. Sus ramas están secas y sus hojas han desaparecido.'
        );
        break;
      case 'preguntas-reflexion':
        iniciarEscritura(PREGUNTAS_REFLEXION[reflexionIdx] || '');
        break;
      case 'seleccionar-hojas':
        iniciarEscritura(TEXTO_SELECCION);
        break;
      case 'feedback-seleccion':
        iniciarEscritura(MENSAJES_ERROR_SELECCION[errorSeleccionIdx % MENSAJES_ERROR_SELECCION.length]);
        break;
      case 'pregunta-hoja': {
        const s = SIMBOLOS_CORRECTOS[hojaActualIdx];
        if (s) iniciarEscritura(s.pregunta);
        break;
      }
      case 'feedback-pregunta': {
        const s = SIMBOLOS_CORRECTOS[hojaActualIdx];
        if (feedbackPregunta === 'correcto') {
          iniciarEscritura(
            `¡Correcto! ${s?.explicacion || ''}`
          );
        } else {
          iniciarEscritura(
            `No es la respuesta correcta. ${s?.explicacion || ''} ¡Inténtalo de nuevo!`
          );
        }
        break;
      }
      case 'victoria':
        iniciarEscritura(TEXTO_VICTORIA);
        break;
      default:
        break;
    }
    return () => limpiar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subFase, dialogIdx, reflexionIdx, errorSeleccionIdx, hojaActualIdx, feedbackPregunta]);

  // ---- Phase transition helpers ----

  const saltarIntro = useCallback(() => {
    reproducir('clic');
    setSubFase('seleccionar-hojas');
  }, [reproducir]);

  /** Generic advance: skip typewriter or advance dialog */
  const avanzar = useCallback(() => {
    if (escribiendo) {
      saltarAlFinal();
      return;
    }
    reproducir('clic');

    switch (subFase) {
      case 'intro':
        setSubFase('aparicion');
        setTimeout(() => {
          setSubFase('dialogo-problema');
          setDialogIdx(0);
        }, 1200);
        break;

      case 'dialogo-problema':
        if (dialogIdx < DIALOGOS_PROBLEMA.length - 1) {
          setDialogIdx((i) => i + 1);
        } else {
          setSubFase('arbol-seco');
        }
        break;

      case 'arbol-seco':
        setSubFase('preguntas-reflexion');
        setReflexionIdx(0);
        break;

      case 'preguntas-reflexion':
        if (reflexionIdx < PREGUNTAS_REFLEXION.length - 1) {
          setReflexionIdx((i) => i + 1);
        } else {
          setSubFase('seleccionar-hojas');
        }
        break;

      case 'feedback-seleccion':
        setSubFase('seleccionar-hojas');
        break;

      case 'feedback-pregunta':
        if (feedbackPregunta === 'correcto') {
          // Animate leaf to tree
          setAnimandoHoja(true);
          setSubFase('hoja-al-arbol');
          setTimeout(() => {
            setHojasColocadas((prev) => [
              ...prev,
              SIMBOLOS_CORRECTOS[hojaActualIdx].id,
            ]);
            setAnimandoHoja(false);

            const nextIdx = hojaActualIdx + 1;
            if (nextIdx >= SIMBOLOS_CORRECTOS.length) {
              // All 8 leaves placed
              setSubFase('victoria');
            } else {
              setHojaActualIdx(nextIdx);
              setRespuestaElegida(null);
              setFeedbackPregunta(null);
              setSubFase('pregunta-hoja');
            }
          }, 1500);
        } else {
          // Let them retry
          setRespuestaElegida(null);
          setFeedbackPregunta(null);
          setSubFase('pregunta-hoja');
        }
        break;

      case 'victoria':
        // Proceed to quiz
        break;

      default:
        break;
    }
  }, [
    escribiendo,
    saltarAlFinal,
    subFase,
    dialogIdx,
    reflexionIdx,
    feedbackPregunta,
    hojaActualIdx,
    reproducir,
  ]);

  // ---- Leaf selection logic ----

  const toggleHoja = useCallback(
    (id: string) => {
      reproducir('clic');
      setSeleccionadas((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          if (next.size < 8) {
            next.add(id);
          }
        }
        return next;
      });
    },
    [reproducir]
  );

  const verificarSeleccion = useCallback(() => {
    if (seleccionadas.size !== 8) return;

    // Check if all selected are correct
    let todasCorrectas = true;
    seleccionadas.forEach((id) => {
      if (!IDS_CORRECTOS.has(id)) todasCorrectas = false;
    });

    if (todasCorrectas) {
      reproducir('correcto');
      // Start the per-leaf question flow
      setHojaActualIdx(0);
      setRespuestaElegida(null);
      setFeedbackPregunta(null);
      setSubFase('pregunta-hoja');
    } else {
      reproducir('incorrecto');
      setErrorSeleccionIdx((i) => i + 1);
      setSubFase('feedback-seleccion');
    }
  }, [seleccionadas, reproducir]);

  // ---- Per-leaf question answer ----

  const elegirRespuesta = useCallback(
    (idx: number) => {
      if (respuestaElegida !== null) return; // Already answered
      setRespuestaElegida(idx);

      const simbolo = SIMBOLOS_CORRECTOS[hojaActualIdx];
      if (idx === simbolo.correcta) {
        reproducir('correcto');
        setFeedbackPregunta('correcto');
      } else {
        reproducir('incorrecto');
        setFeedbackPregunta('incorrecto');
      }
      setSubFase('feedback-pregunta');
    },
    [respuestaElegida, hojaActualIdx, reproducir]
  );

  // ---- Keyboard navigation ----
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const isIntro = subFase === 'intro' || subFase === 'aparicion' || subFase === 'dialogo-problema' || subFase === 'arbol-seco' || subFase === 'preguntas-reflexion';
        if (isIntro) {
          saltarIntro();
        } else {
          reproducir('clic');
          alCerrar();
        }
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (subFase === 'seleccionar-hojas') {
          if (seleccionadas.size === 8) verificarSeleccion();
        } else if (subFase === 'victoria') {
          alCompletar();
        } else if (subFase === 'hoja-al-arbol') {
          // Wait for animation
        } else {
          avanzar();
        }
      }
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [
    subFase,
    avanzar,
    alCerrar,
    saltarIntro,
    alCompletar,
    seleccionadas,
    verificarSeleccion,
    reproducir,
  ]);

  // ---- Visual helpers ----

  const treeStage = getStageArbol(hojasColocadas.length);

  const showCondor =
    subFase === 'aparicion' ||
    subFase === 'dialogo-problema' ||
    subFase === 'arbol-seco' ||
    subFase === 'preguntas-reflexion' ||
    subFase === 'feedback-seleccion' ||
    subFase === 'pregunta-hoja' ||
    subFase === 'feedback-pregunta' ||
    subFase === 'victoria';

  const showTree =
    subFase === 'arbol-seco' ||
    subFase === 'preguntas-reflexion' ||
    subFase === 'pregunta-hoja' ||
    subFase === 'feedback-pregunta' ||
    subFase === 'hoja-al-arbol' ||
    subFase === 'victoria';

  // ---- Render ----

  return (
    <div
      className="jc-overlay"
      role="dialog"
      aria-label="Juego del Cóndor: El Despertar del Árbol Sagrado"
    >
      {/* Background */}
      <div
        className={`jc-bg jc-bg-stage-${treeStage}`}
        style={
          showTree || subFase === 'seleccionar-hojas' || subFase === 'feedback-seleccion'
            ? undefined
            : undefined
        }
      />
      <div className="jc-bg-darkener" />

      {/* Stars particle overlay for cosmic theme */}
      <div className="jc-stars" aria-hidden="true">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="jc-star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 60}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: 0.3 + Math.random() * 0.7,
              width: `${2 + Math.random() * 3}px`,
              height: `${2 + Math.random() * 3}px`,
            }}
          />
        ))}
      </div>

      {/* Botón Saltar Misión */}
      {subFase !== 'victoria' && (
        <BotonSaltarMision onClick={subFase === 'intro' || subFase === 'aparicion' || subFase === 'dialogo-problema' || subFase === 'arbol-seco' || subFase === 'preguntas-reflexion' ? saltarIntro : alCerrar} />
      )}

      {/* ── Sacred Tree (CSS art) ── */}
      {showTree && (
        <div className={`jc-tree-container jc-tree-stage-${treeStage}`}>
          {/* Trunk */}
          <div className="jc-tree-trunk" />
          {/* Branches */}
          <div className="jc-tree-branch jc-branch-l1" />
          <div className="jc-tree-branch jc-branch-r1" />
          <div className="jc-tree-branch jc-branch-l2" />
          <div className="jc-tree-branch jc-branch-r2" />
          {/* Crown (foliage) */}
          <div className="jc-tree-crown" />
          {/* Placed leaf symbols */}
          {hojasColocadas.map((id, i) => {
            const simbolo = SIMBOLOS_CORRECTOS.find((s) => s.id === id);
            if (!simbolo) return null;
            const pos = POSICIONES_HOJAS[i % POSICIONES_HOJAS.length];
            return (
              <div
                key={id}
                className="jc-tree-leaf-placed"
                style={{ top: pos.top, left: pos.left }}
              >
                <img src={`/assets/condor/hoja_${simbolo.id}.png`} alt={simbolo.nombre} className="jc-leaf-img" />
              </div>
            );
          })}
          {/* Animating leaf (flying to tree) */}
          {animandoHoja && (
            <div className="jc-leaf-flying">
              <img src={`/assets/condor/hoja_${SIMBOLOS_CORRECTOS[hojaActualIdx]?.id}.png`} alt="" className="jc-leaf-img" />
            </div>
          )}
          {/* Glow effect when tree is fully alive */}
          {treeStage >= 3 && (
            <div className="jc-tree-glow" aria-hidden="true" />
          )}
        </div>
      )}

      {/* ── Condor sprite ── */}
      {showCondor && (
        <div
          className={`jc-character-wrap ${
            subFase === 'aparicion' ? 'jc-anim-swoop' : 'jc-anim-float'
          } ${
            subFase === 'pregunta-hoja' || subFase === 'feedback-pregunta' || subFase === 'victoria'
              ? 'jc-char-side'
              : ''
          }`}
        >
          <img
            src="/assets/sprites_individuales/personajes/rey_condor.png"
            alt="Rey Cóndor"
            className="jc-condor-sprite"
          />
        </div>
      )}

      {/* ═══════════════════════ FASE: INTRO ═══════════════════════ */}
      {subFase === 'intro' && (
        <div className="jc-intro-overlay" onClick={avanzar}>
          <div className="jc-intro-box">
            <div className="jc-intro-ornament">✦</div>
            <p className="jc-intro-text">{textoVisible}</p>
            {!escribiendo && (
              <span className="jc-next-prompt">Toca para continuar</span>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════ FASE: DIÁLOGOS ═══════════════════════ */}
      {(subFase === 'dialogo-problema' ||
        subFase === 'arbol-seco' ||
        subFase === 'preguntas-reflexion') && (
        <div className="jc-ui-wrap" onClick={avanzar}>
          <div className="jc-bubble">
            <span className="jc-speaker-name">Rey Cóndor</span>
            <p className="jc-text">{textoVisible}</p>
            {subFase === 'dialogo-problema' && (
              <div className="jc-step-indicator">
                {dialogIdx + 1}/{DIALOGOS_PROBLEMA.length}
              </div>
            )}
            {subFase === 'preguntas-reflexion' && (
              <div className="jc-step-indicator">
                {reflexionIdx + 1}/{PREGUNTAS_REFLEXION.length}
              </div>
            )}
            {!escribiendo && (
              <span className="jc-next-prompt">Toca para continuar</span>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════ FASE: SELECCIONAR HOJAS ═══════════════════════ */}
      {(subFase === 'seleccionar-hojas' || subFase === 'feedback-seleccion') && (
        <div className="jc-selection-wrap">
          {/* Header */}
          <div className="jc-sel-header">
            <span className="jc-sel-title">🌿 Selecciona los 8 Símbolos Sagrados</span>
            <span className="jc-sel-counter">
              {seleccionadas.size} / 8 seleccionados
            </span>
          </div>

          {/* Instruction bubble */}
          {subFase === 'feedback-seleccion' && (
            <div className="jc-sel-feedback" onClick={avanzar}>
              <img
                src="/assets/sprites_individuales/personajes/rey_condor.png"
                alt="Rey Cóndor"
                className="jc-sel-condor-mini"
              />
              <p className="jc-sel-feedback-text">{textoVisible}</p>
              {!escribiendo && (
                <span className="jc-next-prompt">Toca para reintentar</span>
              )}
            </div>
          )}

          {/* Leaf grid */}
          <div className="jc-leaves-grid">
            {hojasBarajadas.map((hoja) => {
              const isSelected = seleccionadas.has(hoja.id);
              return (
                <button
                  key={hoja.id}
                  className={`jc-leaf-card ${isSelected ? 'selected' : ''}`}
                  onClick={() =>
                    subFase === 'seleccionar-hojas'
                      ? toggleHoja(hoja.id)
                      : undefined
                  }
                  aria-pressed={isSelected}
                  aria-label={`${hoja.nombre}. ${isSelected ? 'Seleccionado' : 'No seleccionado'}`}
                >
                  <span className="jc-leaf-card-emoji">
                    <img src={`/assets/condor/hoja_${hoja.id}.png`} alt="" className="jc-leaf-img" />
                  </span>
                  <span className="jc-leaf-card-name">{hoja.nombre}</span>
                </button>
              );
            })}
          </div>

          {/* Verify button */}
          {subFase === 'seleccionar-hojas' && (
            <div className="jc-sel-action">
              <button
                className="jc-btn-verify"
                disabled={seleccionadas.size !== 8}
                onClick={verificarSeleccion}
              >
                Verificar Selección
              </button>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════ FASE: PREGUNTA POR HOJA ═══════════════════════ */}
      {subFase === 'pregunta-hoja' && (
        <div className="jc-question-wrap">
          {/* Current leaf info */}
          <div className="jc-question-leaf-info">
            <span className="jc-question-leaf-emoji">
              <img src={`/assets/condor/hoja_${SIMBOLOS_CORRECTOS[hojaActualIdx]?.id}.png`} alt="" className="jc-leaf-img" />
            </span>
            <span className="jc-question-leaf-name">
              {SIMBOLOS_CORRECTOS[hojaActualIdx]?.nombre}
            </span>
            <span className="jc-question-leaf-cat">
              {SIMBOLOS_CORRECTOS[hojaActualIdx]?.categoria === 'natural'
                ? '🌿 Natural'
                : SIMBOLOS_CORRECTOS[hojaActualIdx]?.categoria === 'cosmico'
                ? '✨ Cósmico'
                : '🦅 Espiritual'}
            </span>
          </div>

          {/* Question */}
          <div className="jc-question-box">
            <p className="jc-question-text">{textoVisible}</p>
          </div>

          {/* Options */}
          {!escribiendo && (
            <div className="jc-options-grid">
              {SIMBOLOS_CORRECTOS[hojaActualIdx]?.opciones.map((opcion, idx) => (
                <button
                  key={idx}
                  className={`jc-option-btn ${
                    respuestaElegida === idx
                      ? idx === SIMBOLOS_CORRECTOS[hojaActualIdx].correcta
                        ? 'correct'
                        : 'wrong'
                      : ''
                  }`}
                  onClick={() => elegirRespuesta(idx)}
                  disabled={respuestaElegida !== null}
                >
                  <span className="jc-option-letter">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="jc-option-text">{opcion}</span>
                </button>
              ))}
            </div>
          )}

          {/* Progress */}
          <div className="jc-question-progress">
            {SIMBOLOS_CORRECTOS.map((_, i) => (
              <div
                key={i}
                className={`jc-progress-dot ${
                  i < hojaActualIdx ? 'done' : ''
                } ${i === hojaActualIdx ? 'active' : ''}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════════ FASE: FEEDBACK PREGUNTA ═══════════════════════ */}
      {subFase === 'feedback-pregunta' && (
        <div className="jc-ui-wrap" onClick={avanzar}>
          <div
            className={`jc-feedback-box ${
              feedbackPregunta === 'correcto' ? 'exito' : 'error'
            }`}
          >
            <span className="jc-speaker-name">Rey Cóndor</span>
            <div className="jc-feedback-header">
              {feedbackPregunta === 'correcto' ? (
                <span className="jc-feedback-icon">✨</span>
              ) : (
                <span className="jc-feedback-icon">🔄</span>
              )}
            </div>
            <p className="jc-feedback-text">{textoVisible}</p>
            {feedbackPregunta === 'correcto' && (
              <div className="jc-feedback-meta">
                <span>
                  💎 Valor: <strong>{SIMBOLOS_CORRECTOS[hojaActualIdx]?.valor}</strong>
                </span>
                <span>
                  🌱 Acción: <strong>{SIMBOLOS_CORRECTOS[hojaActualIdx]?.accion}</strong>
                </span>
              </div>
            )}
            {!escribiendo && (
              <span className="jc-next-prompt">
                {feedbackPregunta === 'correcto'
                  ? 'Toca para colocar la hoja en el árbol'
                  : 'Toca para intentar de nuevo'}
              </span>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════ FASE: HOJA VOLANDO AL ÁRBOL ═══════════════════════ */}
      {subFase === 'hoja-al-arbol' && (
        <div className="jc-flying-overlay" aria-live="polite">
          <p className="jc-flying-text">
            🌿 La hoja de{' '}
            <strong>{SIMBOLOS_CORRECTOS[hojaActualIdx]?.nombre}</strong> se une
            al Árbol Sagrado...
          </p>
        </div>
      )}

      {/* ═══════════════════════ FASE: VICTORIA ═══════════════════════ */}
      {subFase === 'victoria' && (
        <div className="jc-victory-overlay">
          <div className="jc-victory-scroll">
            <h1 className="jc-victory-title">
              ¡EL ÁRBOL SAGRADO HA RENACIDO!
            </h1>
            <p className="jc-victory-text">{textoVisible}</p>
            {!escribiendo && (
              <button
                className="jc-victory-btn"
                onClick={() => {
                  reproducir('clic');
                  alCompletar();
                }}
              >
                Completar Reino
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
