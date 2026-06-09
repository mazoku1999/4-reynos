'use client';

/**
 * useSonido — Hook para efectos de sonido del juego.
 * Usa Web Audio API (OscillatorNode) para generar sonidos
 * sin necesidad de archivos de audio externos.
 */

import { useRef, useCallback } from 'react';

export type TipoSonido = 'clic' | 'correcto' | 'incorrecto' | 'reino' | 'victoria';

export function useSonido() {
  const ctxRef = useRef<AudioContext | null>(null);

  /** Inicializa el AudioContext (requiere interacción del usuario) */
  const iniciarAudio = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new (
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      )();
    }
  }, []);

  /** Reproduce un efecto de sonido */
  const reproducir = useCallback((tipo: TipoSonido) => {
    iniciarAudio();
    const ctx = ctxRef.current;
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const ganancia = ctx.createGain();
    osc.connect(ganancia);
    ganancia.connect(ctx.destination);

    const ahora = ctx.currentTime;

    switch (tipo) {
      case 'clic':
        osc.frequency.setValueAtTime(600, ahora);
        osc.frequency.exponentialRampToValueAtTime(400, ahora + 0.1);
        ganancia.gain.setValueAtTime(0.08, ahora);
        ganancia.gain.exponentialRampToValueAtTime(0.001, ahora + 0.1);
        osc.start(ahora);
        osc.stop(ahora + 0.1);
        break;

      case 'correcto':
        osc.frequency.setValueAtTime(523, ahora);
        osc.frequency.setValueAtTime(659, ahora + 0.1);
        osc.frequency.setValueAtTime(784, ahora + 0.2);
        ganancia.gain.setValueAtTime(0.1, ahora);
        ganancia.gain.exponentialRampToValueAtTime(0.001, ahora + 0.35);
        osc.start(ahora);
        osc.stop(ahora + 0.35);
        break;

      case 'incorrecto':
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, ahora);
        osc.frequency.exponentialRampToValueAtTime(100, ahora + 0.3);
        ganancia.gain.setValueAtTime(0.06, ahora);
        ganancia.gain.exponentialRampToValueAtTime(0.001, ahora + 0.3);
        osc.start(ahora);
        osc.stop(ahora + 0.3);
        break;

      case 'reino':
        osc.frequency.setValueAtTime(440, ahora);
        osc.frequency.setValueAtTime(554, ahora + 0.15);
        osc.frequency.setValueAtTime(659, ahora + 0.3);
        osc.frequency.setValueAtTime(880, ahora + 0.45);
        ganancia.gain.setValueAtTime(0.1, ahora);
        ganancia.gain.exponentialRampToValueAtTime(0.001, ahora + 0.7);
        osc.start(ahora);
        osc.stop(ahora + 0.7);
        break;

      case 'victoria':
        osc.frequency.setValueAtTime(523, ahora);
        osc.frequency.setValueAtTime(659, ahora + 0.15);
        osc.frequency.setValueAtTime(784, ahora + 0.3);
        osc.frequency.setValueAtTime(1047, ahora + 0.5);
        ganancia.gain.setValueAtTime(0.12, ahora);
        ganancia.gain.exponentialRampToValueAtTime(0.001, ahora + 0.8);
        osc.start(ahora);
        osc.stop(ahora + 0.8);
        break;
    }
  }, [iniciarAudio]);

  return { reproducir, iniciarAudio };
}
