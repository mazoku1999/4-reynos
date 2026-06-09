'use client';

import { useState, useCallback, useEffect } from 'react';
import { useMaquinaEscribir } from '@/hooks/useMaquinaEscribir';
import { anunciarSR } from '@/lib/accesibilidad';
import type { TipoSonido } from '@/hooks/useSonido';
import './ValoracionQuirquincho.css';

interface Props {
  alCompletar: () => void;
  reproducir: (tipo: TipoSonido) => void;
}

type Fase = 'intro' | 'p1' | 'fb1' | 'p2' | 'fb2' | 'p3' | 'fb3' | 'final';

const TEXTOS: Record<Fase, string> = {
  intro: '\u00a1Lo lograste, guardi\u00e1n! Mira mi caparaz\u00f3n. Cada placa guarda un recuerdo de tu aventura. Antes de despedirnos, recordemos lo que aprendiste.',
  p1: 'Guardi\u00e1n, \u00bfcu\u00e1l parte de la misi\u00f3n te cost\u00f3 m\u00e1s?',
  fb1: 'No te preocupes. Cuando algo nos cuesta, tambi\u00e9n aprendemos m\u00e1s. \u00a1Cada error es una oportunidad para crecer!',
  p2: '\u00bfQu\u00e9 aprendiste durante esta aventura?',
  fb2: 'Los art\u00edculos son peque\u00f1os, pero ayudan a que las historias tengan sentido.',
  p3: '\u00bfCu\u00e1l fue el orden de los pasos que seguiste?',
  fb3: 'Primero completaste el pergamino, despu\u00e9s aprendiste los art\u00edculos y finalmente reparaste el caparaz\u00f3n.',
  final: 'A\u00f1ay, peque\u00f1o guardi\u00e1n. La leyenda del Toborochi vivir\u00e1 para siempre gracias a ti. \u00a1Kawsachun toborochi!',
};

const TITULOS: Record<Fase, string> = {
  intro: 'MOMENTO 4 \u2014 VALORACI\u00d3N',
  p1: 'PREGUNTA 1', fb1: '\u00a1MUY BIEN!',
  p2: 'PREGUNTA 2', fb2: '\u00a1ESO ES!',
  p3: 'PREGUNTA 3', fb3: '\u00a1PERFECTO!',
  final: '\u00a1MISI\u00d3N COMPLETADA!',
};

const ICO = '/assets/quirquincho/icons';
const CHR = '/assets/quirquincho/px_quirquincho.png';

function bgClass(f: Fase) {
  if (f === 'intro') return 'vq-bg-sunset';
  if (f === 'final') return 'vq-bg-toborochi';
  if (f === 'fb3') return 'vq-bg-fireworks';
  return 'vq-bg-night';
}

const NEXT: Partial<Record<Fase, Fase>> = {
  intro: 'p1', fb1: 'p2', fb2: 'p3', fb3: 'final',
};

/* Pixel icon component */
function PxIco({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' | 'lg' }) {
  return (
    <img
      src={`${ICO}/${name}.png`}
      alt={name}
      className={`px-ico px-ico-${size}`}
      draggable={false}
    />
  );
}

export default function ValoracionQuirquincho({ alCompletar, reproducir }: Props) {
  const [fase, setFase] = useState<Fase>('intro');
  const { textoVisible, escribiendo, iniciarEscritura, saltarAlFinal, limpiar } = useMaquinaEscribir(30);

  useEffect(() => { anunciarSR('Momento 4: Valoraci\u00f3n'); }, []);

  useEffect(() => {
    limpiar();
    iniciarEscritura(TEXTOS[fase]);
    return () => limpiar();
  }, [fase, iniciarEscritura, limpiar]);

  const avanzar = useCallback(() => {
    if (escribiendo) { saltarAlFinal(); return; }
    reproducir('clic');
    if (fase === 'final') { alCompletar(); return; }
    const next = NEXT[fase];
    if (next) setFase(next);
  }, [escribiendo, saltarAlFinal, reproducir, fase, alCompletar]);

  const responder = useCallback((idx: number) => {
    if (escribiendo) saltarAlFinal();
    reproducir('clic');
    if (fase === 'p1') setFase('fb1');
    else if (fase === 'p2') setFase('fb2');
    else if (fase === 'p3') setFase('fb3');
  }, [escribiendo, saltarAlFinal, reproducir, fase]);

  const esFb = fase === 'intro' || fase.startsWith('fb');
  const esQ = fase.startsWith('p');

  return (
    <div className="vq-root" onClick={esFb ? avanzar : undefined}>
      <div className={`vq-bg ${bgClass(fase)}`} />
      <div className="vq-vignette" />

      {/* Title */}
      <div className={`vq-plaque ${fase === 'final' ? 'vq-plaque-gold' : ''}`}>
        {TITULOS[fase]}
      </div>

      {/* Scene */}
      <div className="vq-scene">
        <div className="vq-char-col">
          <img src={CHR} alt="Rey Quirquincho" className="vq-char" />
        </div>

        <div className="vq-content-col">
          {fase === 'intro' && (
            <div className="vq-speaker-tag">
              <PxIco name="crown" size="sm" /> REY QUIRQUINCHO
            </div>
          )}

          <div className="vq-parchment">
            <div className="vq-parchment-inner">
              <p className="vq-dialog-text">{textoVisible}</p>
            </div>
          </div>

          {/* P1 */}
          {fase === 'p1' && (
            <div className="vq-options">
              <button className="vq-opt vq-green" onClick={() => responder(0)}>
                <PxIco name="scroll" /> El pergamino
              </button>
              <button className="vq-opt vq-blue" onClick={() => responder(1)}>
                <PxIco name="book" /> Elegir el art&iacute;culo
              </button>
              <button className="vq-opt vq-purple" onClick={() => responder(2)}>
                <PxIco name="shield" /> Reparar las placas
              </button>
              <button className="vq-opt vq-orange" onClick={() => responder(3)}>
                <PxIco name="sun" /> Todo fue f&aacute;cil
              </button>
            </div>
          )}

          {/* P2 */}
          {fase === 'p2' && (
            <div className="vq-options vq-options-grid">
              <button className="vq-opt vq-green" onClick={() => responder(0)}>
                <PxIco name="book" /> Qu&eacute; son los art&iacute;culos
              </button>
              <button className="vq-opt vq-blue" onClick={() => responder(1)}>
                <PxIco name="shield" /> Diferencia entre el y la
              </button>
              <button className="vq-opt vq-purple" onClick={() => responder(2)}>
                <PxIco name="sun" /> Cu&aacute;ndo usar un o una
              </button>
              <button className="vq-opt vq-orange" onClick={() => responder(3)}>
                <PxIco name="crown" /> Todav&iacute;a no estoy seguro
              </button>
            </div>
          )}

          {/* P3 */}
          {fase === 'p3' && (
            <div className="vq-options">
              <button className="vq-opt vq-green" onClick={() => responder(0)}>
                <PxIco name="scroll" size="sm" /> Pergamino, Art&iacute;culos, Caparaz&oacute;n
              </button>
              <button className="vq-opt vq-blue" onClick={() => responder(1)}>
                <PxIco name="shield" size="sm" /> Caparaz&oacute;n, Art&iacute;culos, Pergamino
              </button>
              <button className="vq-opt vq-purple" onClick={() => responder(2)}>
                <PxIco name="book" size="sm" /> Art&iacute;culos, Caparaz&oacute;n, Pergamino
              </button>
              <button className="vq-opt vq-orange" onClick={() => responder(3)}>
                <PxIco name="scroll" size="sm" /> Pergamino, Caparaz&oacute;n, Art&iacute;culos
              </button>
            </div>
          )}

          {/* Steps fb3 */}
          {fase === 'fb3' && (
            <div className="vq-steps-bar">
              <div className="vq-step-chip">
                <PxIco name="scroll" size="lg" />
                <span>Pergamino</span>
                <PxIco name="check" size="sm" />
              </div>
              <span className="vq-arrow-sep">{'\u25B6'}</span>
              <div className="vq-step-chip">
                <PxIco name="book" size="lg" />
                <span>Art&iacute;culos</span>
                <PxIco name="check" size="sm" />
              </div>
              <span className="vq-arrow-sep">{'\u25B6'}</span>
              <div className="vq-step-chip">
                <PxIco name="shield" size="lg" />
                <span>Caparaz&oacute;n</span>
                <PxIco name="check" size="sm" />
              </div>
            </div>
          )}

          {/* Stats final */}
          {fase === 'final' && (
            <div className="vq-final-stats">
              <div className="vq-stat-card">
                <div className="vq-stat-label">TU PUNTUACI&Oacute;N</div>
                <div className="vq-star-row">
                  <PxIco name="star" size="lg" />
                  <PxIco name="star" size="lg" />
                  <PxIco name="star" size="lg" />
                </div>
                <div className="vq-score">3000</div>
                <div className="vq-score-rank">&iexcl;EXCELENTE!</div>
              </div>
              <div className="vq-stat-card">
                <div className="vq-stat-label">TUS RESPUESTAS</div>
                <div className="vq-answer-row">
                  <div className="vq-answer-chip"><span>P1</span><PxIco name="check" size="sm" /></div>
                  <div className="vq-answer-chip"><span>P2</span><PxIco name="check" size="sm" /></div>
                  <div className="vq-answer-chip"><span>P3</span><PxIco name="check" size="sm" /></div>
                </div>
              </div>
            </div>
          )}

          {/* Buttons */}
          {!esQ && !escribiendo && (
            <button className={`vq-btn-go ${fase === 'final' ? 'vq-btn-finish' : ''}`} onClick={avanzar}>
              {fase === 'final' ? 'A\u00d1AY' : 'Continuar \u25B6'}
            </button>
          )}
        </div>
      </div>

      {/* Intro hex bar */}
      {fase === 'intro' && (
        <div className="vq-hex-bar">
          <div className="vq-hex"><PxIco name="scroll" size="lg" /></div>
          <div className="vq-hex"><PxIco name="book" size="lg" /></div>
          <div className="vq-hex"><PxIco name="shield" size="lg" /></div>
          <div className="vq-hex"><PxIco name="sun" size="lg" /></div>
          <div className="vq-hex"><PxIco name="star" size="lg" /></div>
          <div className="vq-hex"><PxIco name="crown" size="lg" /></div>
        </div>
      )}
    </div>
  );
}
