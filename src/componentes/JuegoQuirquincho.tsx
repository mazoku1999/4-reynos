'use client';

/* eslint-disable @next/next/no-img-element */

import { useState, useCallback, useEffect, useRef } from 'react';
import { useMaquinaEscribir } from '@/hooks/useMaquinaEscribir';
import ValoracionQuirquincho from './ValoracionQuirquincho';
import BotonSaltarMision from './BotonSaltarMision';
import { anunciarSR } from '@/lib/accesibilidad';
import type { TipoSonido } from '@/hooks/useSonido';

interface Props {
  alCompletar: () => void;
  alCerrar: () => void;
  reproducir: (tipo: TipoSonido) => void;
}

type SubFase = 
  | 'arbol' 
  | 'aparicion' 
  | 'dialogo-1' 
  | 'pregunta-guardian' 
  | 'dialogo-2'
  | 'video'
  | 'leyenda-intro'
  | 'leyenda-part'
  | 'leyenda-feedback'
  | 'victoria-final';

const VIDEO_SRC = '/assets/video/WhatsApp Video 2026-06-08 at 18.25.33.mp4';

interface DialogoStep {
  texto: string;
  sprite: string;
}

interface ParteLeyenda {
  titulo: string;
  fondo: string;
  plantilla: string[];
  correctas: string[];
  opciones: string[];
}

const DIALOGOS_1: DialogoStep[] = [
  {
    texto: '¡ALLINMI! (¡MUY BIEN!) LA PRIMERA LEYENDA QUE DEBEMOS RESCATAR ES LA DEL TOBOROCHI, EL ÁRBOL SAGRADO DEL CHACO.',
    sprite: '/assets/quirquincho/quirquincho_thumbs_up_v2.png',
  },
  {
    texto: 'EL TEXTO HA PERDIDO PALABRAS IMPORTANTES.',
    sprite: '/assets/quirquincho/quirquincho_explaining_v2.png',
  },
  {
    texto: 'TU MISIÓN ES ENCONTRAR LAS PALABRAS QUE FALTAN. ¿ESTÁS LISTO, GUARDIÁN?',
    sprite: '/assets/quirquincho/quirquincho_motivation_v2.png',
  },
];

const DIALOGOS_2: DialogoStep[] = [
  {
    texto: '¡AQUÍ ESTÁ LA LEYENDA DEL TOBOROCHI! PERO ALGUNAS PALABRAS HAN DESAPARECIDO.',
    sprite: '/assets/quirquincho/quirquincho_explaining_v2.png',
  },
  {
    texto: 'ESCUCHA BIEN EL CUENTO Y COMPLETA LOS ESPACIOS DEL PERGAMINO.',
    sprite: '/assets/quirquincho/quirquincho_thumbs_up_v2.png',
  },
  {
    texto: '¿SUENA BIEN O SUENA RARO? TÚ DECIDES.',
    sprite: '/assets/quirquincho/quirquincho_motivation_v2.png',
  },
];

const ENCOURAGING_DIALOGUES = [
  '¡El Chaco necesita tu ayuda, pequeño guardián! ¡Sé que tienes el valor de tu pueblo!',
  '¡Sin ti, las leyendas del monte chaqueño desaparecerán para siempre! ¿Cambias de opinión?',
  '¡El caparazón del Quirquincho confía en tu sabiduría! ¡Acepta la misión!',
];

const PARTES_LEYENDA: ParteLeyenda[] = [
  {
    titulo: '1. La sequía',
    fondo: '/assets/quirquincho/leyenda_bg_1.png',
    plantilla: ['Según ', ' leyenda, cuando ', ' tierra era joven, ', ' sequía terrible azotaba ', ' monte chaqueño.'],
    correctas: ['la', 'la', 'una', 'el'],
    opciones: ['la', 'la', 'una', 'el', 'un', 'los'],
  },
  {
    titulo: '2. La oración del chamán',
    fondo: '/assets/quirquincho/leyenda_bg_2.png',
    plantilla: ['Para salvar a ', ' comunidad, ', ' chamán pidió ayuda a ', ' dioses...'],
    correctas: ['la', 'el', 'los'],
    opciones: ['la', 'el', 'los', 'las', 'un'],
  },
  {
    titulo: '3. El chamán se transforma',
    fondo: '/assets/quirquincho/leyenda_bg_3.png',
    plantilla: ['...y se transformó en ', ' árbol protector: ', ' Toborochi. En su interior, ', ' árbol almacena ', ' agua pura de ', ' lluvias.'],
    correctas: ['un', 'el', 'el', 'el', 'las'],
    opciones: ['un', 'el', 'el', 'el', 'las', 'la', 'una'],
  },
  {
    titulo: '4. El regalo del Toborochi',
    fondo: '/assets/quirquincho/leyenda_bg_4.png',
    plantilla: ['Se dice que durante ', ' temporada seca, ', ' Toborochi libera ', ' líquido vital y florece para recordar a ', ' hombres ', ' generosidad de ', ' naturaleza.'],
    correctas: ['la', 'el', 'el', 'los', 'la', 'la'],
    opciones: ['la', 'el', 'el', 'los', 'la', 'la', 'las', 'un'],
  },
];

export default function JuegoQuirquincho({ alCompletar, alCerrar, reproducir }: Props) {
  // Machine states
  const [subFase, setSubFase] = useState<SubFase>('arbol');
  const [dialogIdx, setDialogIdx] = useState(0);
  const [encouragingIdx, setEncouragingIdx] = useState(0);
  const [showEncouragement, setShowEncouragement] = useState(false);
  const [isTreeClicked, setIsTreeClicked] = useState(false);

  // Gameplay states
  const [partIdx, setPartIdx] = useState(0);
  const [respuestas, setRespuestas] = useState<string[]>([]);
  const [opcionesDisponibles, setOpcionesDisponibles] = useState<string[]>([]);
  const [feedbackStatus, setFeedbackStatus] = useState<'exito' | 'error' | null>(null);

  const { textoVisible, escribiendo, iniciarEscritura, saltarAlFinal, limpiar } = useMaquinaEscribir();

  // Announce current state for screen readers
  useEffect(() => {
    anunciarSR('Juego 1 del Quirquincho: Prólogo del Toborochi');
  }, []);

  // Control write effect based on subFase and progress index
  useEffect(() => {
    limpiar();
    if (subFase === 'dialogo-1') {
      const text = DIALOGOS_1[dialogIdx]?.texto;
      if (text) iniciarEscritura(text);
    } else if (subFase === 'pregunta-guardian') {
      if (showEncouragement) {
        const text = ENCOURAGING_DIALOGUES[encouragingIdx % ENCOURAGING_DIALOGUES.length];
        iniciarEscritura(text);
      } else {
        iniciarEscritura('¿aceptas ser el guardian de las leyendas ?');
      }
    } else if (subFase === 'dialogo-2') {
      const text = DIALOGOS_2[dialogIdx]?.texto;
      if (text) iniciarEscritura(text);
    } else if (subFase === 'leyenda-intro') {
      iniciarEscritura('¡EXCELENTE! EL PERGAMINO SAGRADO DE LA LEYENDA SE ESTÁ DESPLEGANDO. LEAMOS JUNTOS EL CUENTO.');
    } else if (subFase === 'leyenda-feedback') {
      if (feedbackStatus === 'exito') {
        const partNum = partIdx + 1;
        iniciarEscritura(`¡ALLINMI! (¡MUY BIEN!) LA PARTE ${partNum} DE LA LEYENDA SE HA RESTAURADO. ¡MIRA CÓMO BRILLA UNA PLACA EN MI CAPARAZÓN!`);
      } else if (feedbackStatus === 'error') {
        iniciarEscritura('Mmm... ¿esa oración suena bien o suena raro? Escúchala de nuevo. Fíjate en la palabra que viene después del espacio.\n\nTe doy una pista: ¿la palabra que sigue es como el chamán o como la tierra? ¿Es una sola cosa o son varias?');
      }
    } else if (subFase === 'victoria-final') {
      iniciarEscritura('¡FELICITACIONES, GUARDIÁN! HAS COMPLETADO LA LEYENDA DEL TOBOROCHI. LAS HISTORIAS DEL CHACO ESTÁN A SALVO Y MI CAPARAZÓN HA SIDO TOTALMENTE RESTAURADO.');
    }
    return () => limpiar();
  }, [subFase, dialogIdx, showEncouragement, encouragingIdx, feedbackStatus, partIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle tree touch interaction
  const tocarArbol = useCallback(() => {
    if (isTreeClicked || subFase !== 'arbol') return;
    setIsTreeClicked(true);
    reproducir('clic');
    setSubFase('aparicion');
    
    // Auto advance after animation duration (1.2s)
    setTimeout(() => {
      setSubFase('dialogo-1');
      setDialogIdx(0);
    }, 1200);
  }, [isTreeClicked, subFase, reproducir]);

  // Start active gameplay part
  const iniciarParte = useCallback((idx: number) => {
    const part = PARTES_LEYENDA[idx];
    setRespuestas(Array(part.correctas.length).fill(''));
    // Shuffle options
    const shuffled = [...part.opciones].sort(() => Math.random() - 0.5);
    setOpcionesDisponibles(shuffled);
    setPartIdx(idx);
    setFeedbackStatus(null);
    setSubFase('leyenda-part');
  }, []);

  // General click anywhere advance logic
  const avanzar = useCallback(() => {
    if (escribiendo) {
      saltarAlFinal();
      return;
    }

    reproducir('clic');

    if (subFase === 'dialogo-1') {
      if (dialogIdx < DIALOGOS_1.length - 1) {
        setDialogIdx(dialogIdx + 1);
      } else {
        setSubFase('pregunta-guardian');
        setShowEncouragement(false);
      }
    } else if (subFase === 'dialogo-2') {
      if (dialogIdx < DIALOGOS_2.length - 1) {
        setDialogIdx(dialogIdx + 1);
      } else {
        setSubFase('video');
      }
    } else if (subFase === 'video') {
      setSubFase('leyenda-intro');
    } else if (subFase === 'leyenda-intro') {
      iniciarParte(0);
    } else if (subFase === 'leyenda-feedback') {
      if (feedbackStatus === 'exito') {
        const nuevoPartIdx = partIdx + 1;
        if (nuevoPartIdx >= PARTES_LEYENDA.length) {
          setSubFase('victoria-final');
        } else {
          iniciarParte(nuevoPartIdx);
        }
      } else {
        // Fallback or retry
        setFeedbackStatus(null);
        setSubFase('leyenda-part');
      }
    }
  }, [escribiendo, saltarAlFinal, subFase, dialogIdx, feedbackStatus, partIdx, iniciarParte, reproducir]);

  const saltarMision = useCallback(() => {
    reproducir('clic');
    setSubFase('victoria-final');
  }, [reproducir]);

  // Decision buttons
  const responderSi = useCallback(() => {
    reproducir('clic');
    setSubFase('dialogo-2');
    setDialogIdx(0);
  }, [reproducir]);

  const responderNo = useCallback(() => {
    reproducir('clic');
    setEncouragingIdx((prev) => prev + 1);
    setShowEncouragement(true);
  }, [reproducir]);

  // Click-to-fill gameplay interactions
  const colocarPalabra = useCallback((palabra: string, optIdx: number) => {
    const firstEmpty = respuestas.findIndex((r) => r === '');
    if (firstEmpty === -1) return; // All blanks are filled

    reproducir('clic');
    const nuevasRespuestas = [...respuestas];
    nuevasRespuestas[firstEmpty] = palabra;
    setRespuestas(nuevasRespuestas);

    const nuevasOpciones = [...opcionesDisponibles];
    nuevasOpciones.splice(optIdx, 1);
    setOpcionesDisponibles(nuevasOpciones);
  }, [respuestas, opcionesDisponibles, reproducir]);

  const devolverPalabra = useCallback((blankIdx: number) => {
    const palabra = respuestas[blankIdx];
    if (!palabra) return; // Slot is empty

    reproducir('clic');
    const nuevasRespuestas = [...respuestas];
    nuevasRespuestas[blankIdx] = '';
    setRespuestas(nuevasRespuestas);

    setOpcionesDisponibles((prev) => [...prev, palabra]);
  }, [respuestas, reproducir]);

  // Drag and Drop support
  const handleDragStart = (e: React.DragEvent, palabra: string, index: number) => {
    e.dataTransfer.setData('palabra', palabra);
    e.dataTransfer.setData('index', index.toString());
  };

  const handleDrop = (e: React.DragEvent, blankIdx: number) => {
    e.preventDefault();
    const palabra = e.dataTransfer.getData('palabra');
    const fromIdxStr = e.dataTransfer.getData('index');
    if (!palabra) return;

    reproducir('clic');

    const existingWord = respuestas[blankIdx];
    let nuevasOpciones = [...opcionesDisponibles];
    if (existingWord) {
      nuevasOpciones.push(existingWord);
    }

    const nuevasRespuestas = [...respuestas];
    nuevasRespuestas[blankIdx] = palabra;
    setRespuestas(nuevasRespuestas);

    const fromIdx = parseInt(fromIdxStr, 10);
    if (!isNaN(fromIdx)) {
      nuevasOpciones.splice(fromIdx, 1);
    } else {
      const pos = nuevasOpciones.indexOf(palabra);
      if (pos !== -1) nuevasOpciones.splice(pos, 1);
    }

    setOpcionesDisponibles(nuevasOpciones);
  };

  // Answer verification logic
  const verificarRespuestas = useCallback(() => {
    const part = PARTES_LEYENDA[partIdx];
    const correctas = part.correctas;
    const esCorrecto = respuestas.every((r, idx) => r === correctas[idx]);

    if (esCorrecto) {
      reproducir('correcto');
      setFeedbackStatus('exito');
    } else {
      reproducir('incorrecto');
      setFeedbackStatus('error');
    }
    setSubFase('leyenda-feedback');
  }, [respuestas, partIdx, reproducir]);

  const reiniciarParteActual = useCallback(() => {
    reproducir('clic');
    iniciarParte(partIdx);
  }, [partIdx, iniciarParte, reproducir]);

  // Keyboard navigation
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        reproducir('clic');
        alCerrar();
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (subFase === 'arbol') {
          tocarArbol();
        } else if (subFase === 'pregunta-guardian') {
          responderSi();
        } else if (subFase === 'leyenda-part') {
          // If all filled, verify
          if (respuestas.every((r) => r !== '')) {
            verificarRespuestas();
          }
        } else if (subFase === 'victoria-final') {
          alCompletar();
        } else {
          avanzar();
        }
      }
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [subFase, tocarArbol, responderSi, avanzar, alCerrar, respuestas, verificarRespuestas, alCompletar, reproducir]);

  // Active backgrounds and sprites helper
  const getFondo = () => {
    if (subFase === 'leyenda-part' || subFase === 'leyenda-feedback') {
      return PARTES_LEYENDA[partIdx]?.fondo || '/assets/quirquincho/leyenda_bg_4.png';
    }
    if (subFase === 'victoria-final') {
      return '/assets/quirquincho/fin.png';
    }
    return '/assets/quirquincho/toborochi_bg_no_tree.png';
  };

  const getActiveSprite = () => {
    if (subFase === 'aparicion') {
      return '/assets/quirquincho/quirquincho_explaining_v2.png';
    }
    if (subFase === 'dialogo-1') {
      return DIALOGOS_1[dialogIdx]?.sprite || '/assets/quirquincho/quirquincho_explaining_v2.png';
    }
    if (subFase === 'pregunta-guardian') {
      return '/assets/quirquincho/quirquincho_explaining_v2.png';
    }
    if (subFase === 'dialogo-2') {
      return DIALOGOS_2[dialogIdx]?.sprite || '/assets/quirquincho/quirquincho_explaining_v2.png';
    }
    if (subFase === 'leyenda-intro') {
      return '/assets/quirquincho/quirquincho_thumbs_up_v2.png';
    }
    if (subFase === 'leyenda-part') {
      // In gameplay, show explaining pose
      return '/assets/quirquincho/quirquincho_explaining_v2.png';
    }
    if (subFase === 'leyenda-feedback') {
      return feedbackStatus === 'exito'
        ? '/assets/quirquincho/quirquincho_motivation_v2.png'
        : '/assets/quirquincho/quirquincho_explaining_v2.png';
    }
    return '';
  };

  // Helper to render text paragraph with inputs
  const renderTextoConEspacios = () => {
    const part = PARTES_LEYENDA[partIdx];
    if (!part) return null;

    const elements = [];
    for (let i = 0; i < part.plantilla.length; i++) {
      elements.push(<span key={`txt-${i}`}>{part.plantilla[i]}</span>);
      if (i < part.correctas.length) {
        const val = respuestas[i];
        elements.push(
          <span
            key={`blank-${i}`}
            className={`jq-blank-space ${val ? 'filled' : 'empty'}`}
            onClick={() => devolverPalabra(i)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, i)}
            role="button"
            tabIndex={0}
            aria-label={`Espacio en blanco ${i + 1}. ${val ? `Contiene la palabra ${val}` : 'Vacío. Haz clic para devolver la palabra.'}`}
          >
            {val || '___'}
          </span>
        );
      }
    }
    return elements;
  };

  const isAllBlanksFilled = respuestas.length > 0 && respuestas.every((r) => r !== '');

  return (
    <div className="jq-overlay" role="dialog" aria-label="Juego Quirquincho: Leyenda del Toborochi">
      {/* Background scene */}
      <div 
        className="jq-bg" 
        style={{ backgroundImage: `url('${getFondo()}')` }}
      />
      <div className="jq-bg-darkener" />

      {/* Botón Saltar Misión */}
      {subFase !== 'victoria-final' && (
        <BotonSaltarMision onClick={saltarMision} />
      )}

      {/* Absolute positioned Toborochi Tree Sprite (Prologue phases) */}
      {(subFase === 'arbol' || subFase === 'aparicion' || subFase === 'dialogo-1' || subFase === 'pregunta-guardian' || subFase === 'dialogo-2') && (
        <div 
          className={`jq-tree-sprite-container ${subFase === 'arbol' ? 'jq-clickable' : ''}`}
          onClick={subFase === 'arbol' ? tocarArbol : undefined}
          role={subFase === 'arbol' ? 'button' : undefined}
          tabIndex={subFase === 'arbol' ? 0 : undefined}
          aria-label={subFase === 'arbol' ? 'Tocar el árbol sagrado Toborochi' : undefined}
        >
          <img 
            src="/assets/quirquincho/toborochi_tree_sprite_v2.png?v=4" 
            alt="Árbol Toborochi" 
            className="jq-tree-sprite-img"
          />
          {subFase === 'arbol' && (
            <div className="jq-tree-indicator">
              <span className="jq-ripple" />
              <div className="jq-indicator-hand-v2">
                <span className="jq-hand-emoji">👇</span>
                <span className="jq-indicator-text">¡Toca el Toborochi!</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Character sprites */}
      {(subFase === 'aparicion' || subFase === 'dialogo-1' || subFase === 'pregunta-guardian' || 
        subFase === 'dialogo-2' || subFase === 'leyenda-intro' || subFase === 'leyenda-part' || 
        subFase === 'leyenda-feedback') && (
        <div 
          className={`jq-character-wrap ${subFase === 'aparicion' ? 'jq-anim-bounce' : 'jq-anim-float'} ${
            subFase === 'leyenda-part' || subFase === 'leyenda-feedback' ? 'jq-gameplay-pos' : ''
          }`}
        >
          <img 
            src={getActiveSprite()} 
            alt="Rey Quirquincho" 
            className="jq-quirquincho-sprite"
          />
        </div>
      )}

      {/* Visual Glowing Caparazón shell plate celebration */}
      {subFase === 'leyenda-feedback' && feedbackStatus === 'exito' && (
        <div className="jq-glow-shell-effect" aria-hidden="true">
          <div className="jq-sparkle" />
          <div className="jq-shell-plate" />
        </div>
      )}

      {/* Prologue dialogue frames */}
      {(subFase === 'dialogo-1' || subFase === 'dialogo-2' || subFase === 'leyenda-intro') && (
        <div className="jq-ui-wrap" onClick={avanzar}>
          <div className="jq-bubble">
            <span className="jq-speaker-name">Rey Quirquincho</span>
            <p className="jq-text">{textoVisible}</p>
            {subFase === 'dialogo-1' && (
              <div className="jq-step-indicator">{dialogIdx + 1}/{DIALOGOS_1.length}</div>
            )}
            {subFase === 'dialogo-2' && (
              <div className="jq-step-indicator">{dialogIdx + 1}/{DIALOGOS_2.length}</div>
            )}
            {!escribiendo && (
              <span className="jq-next-prompt">Toca para continuar</span>
            )}
          </div>
        </div>
      )}

      {/* Prologue question (Sí / No) */}
      {subFase === 'pregunta-guardian' && (
        <div className="jq-ui-wrap">
          <div className="jq-parchment-box">
            {showEncouragement && (
              <span className="jq-speaker-name small">Rey Quirquincho</span>
            )}
            <p className="jq-parchment-text">{textoVisible}</p>
            
            {!escribiendo && (
              <div className="jq-buttons-container">
                <button className="jq-btn jq-btn-yes" onClick={responderSi}>
                  SÍ
                </button>
                <button className="jq-btn jq-btn-no" onClick={responderNo}>
                  NO
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Video interlude — after dialogo-2, before leyenda */}
      {subFase === 'video' && (
        <div className="jq-video-overlay" onClick={avanzar}>
          <div className="jq-video-container">
            <video
              src={VIDEO_SRC}
              className="jq-video-player"
              autoPlay
              playsInline
              onEnded={() => { setSubFase('leyenda-intro'); }}
              controls={false}
            />
          </div>
          <div className="jq-video-skip-hint">
            Toca para saltar
          </div>
        </div>
      )}

      {/* Gameplay phase (Scroll fill in the blanks) */}
      {subFase === 'leyenda-part' && (
        <div className="jq-gameplay-wrap">
          {/* Legend Title */}
          <div className="jq-header">
            <span className="jq-mission-title">La Leyenda del Toborochi</span>
            <span className="jq-part-title">{PARTES_LEYENDA[partIdx]?.titulo}</span>
          </div>

          {/* Parchment Scroll */}
          <div className="jq-scroll-box">
            <div className="jq-scroll-content">
              <p className="jq-legend-paragraph">
                {renderTextoConEspacios()}
              </p>
            </div>
          </div>

          {/* Option card deck */}
          <div className="jq-deck-box">
            <span className="jq-deck-title">Toca o arrastra los artículos:</span>
            <div className="jq-cards-container">
              {opcionesDisponibles.map((palabra, idx) => (
                <div
                  key={`card-${idx}-${palabra}`}
                  className="jq-word-card"
                  onClick={() => colocarPalabra(palabra, idx)}
                  draggable
                  onDragStart={(e) => handleDragStart(e, palabra, idx)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Palabra ${palabra}. Haz clic para rellenar en el primer espacio vacío.`}
                >
                  {palabra}
                </div>
              ))}
            </div>
          </div>

          {/* Verification / Action bar */}
          <div className="jq-action-bar">
            <button
              className="jq-btn-verify"
              disabled={!isAllBlanksFilled}
              onClick={verificarRespuestas}
            >
              Verificar
            </button>
          </div>
        </div>
      )}

      {/* Feedback panel */}
      {subFase === 'leyenda-feedback' && (
        <div className="jq-ui-wrap">
          <div className={`jq-feedback-box ${feedbackStatus}`}>
            <span className="jq-speaker-name">Rey Quirquincho</span>
            <p className="jq-feedback-text">{textoVisible}</p>
            
            {!escribiendo && (
              <div className="jq-feedback-actions">
                {feedbackStatus === 'exito' ? (
                  <button className="jq-btn-success" onClick={avanzar}>
                    {partIdx === PARTES_LEYENDA.length - 1 ? 'Terminar Leyenda' : 'Siguiente Parte'}
                  </button>
                ) : (
                  <button className="jq-btn-retry" onClick={reiniciarParteActual}>
                    Intentar de nuevo
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Final Victory Screen (Momento 4: Valoración) */}
      {subFase === 'victoria-final' && (
        <ValoracionQuirquincho alCompletar={alCompletar} reproducir={reproducir} />
      )}

      {/* Bottom Progress indicators for the 4 parts */}
      {(subFase === 'leyenda-part' || subFase === 'leyenda-feedback') && (
        <div className="jq-game-progress" aria-hidden="true">
          {PARTES_LEYENDA.map((_, i) => (
            <div
              key={`dot-${i}`}
              className={`jq-progress-node ${i < partIdx ? 'done' : ''} ${i === partIdx ? 'active' : ''}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
