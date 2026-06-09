'use client';

/* eslint-disable @next/next/no-img-element */

/**
 * Página del Reino — /reino/[reino]
 * 
 * Cada reino tiene su propia ruta. El flujo es:
 * 1. Si tiene introducción cómic → mostrar diálogo
 * 2. Si tiene juego de gemas (quirquincho) → mostrar JuegoGemas
 * 3. Si tiene misión → mostrar tablero de misión
 * 4. Si no → mostrar quiz clásico
 * 5. Al completar → marcar reino y volver al mapa
 * 
 * Este diseño permite que cada reino tenga juegos completamente
 * diferentes en el futuro, sin afectar a los demás.
 */

import { useState, useCallback, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useJuego } from '@/contexto/ProveedorJuego';
import { useSonido } from '@/hooks/useSonido';
import { REINOS, REINOS_VALIDOS, type ReinoValido } from '@/datos/reinos';
import { INTRODUCCIONES } from '@/datos/introducciones';
import { MISIONES } from '@/datos/misiones';
import DialogoComic from '@/componentes/DialogoComic';
import TableroMision from '@/componentes/TableroMision';
import ModalQuiz from '@/componentes/ModalQuiz';
import IntroQuirquincho from '@/componentes/IntroQuirquincho';
import JuegoGemas from '@/componentes/JuegoGemas';
import JuegoMercado from '@/componentes/JuegoMercado';
import JuegoSantuario from '@/componentes/JuegoSantuario';
import ValoracionCapibara from '@/componentes/ValoracionCapibara';
import JuegoQuirquincho from '@/componentes/JuegoQuirquincho';
import JuegoCondor from '@/componentes/JuegoCondor';

/** Fases de la experiencia del reino */
type FaseReino = 'comic' | 'intro-quirquincho' | 'juego-quirquincho' | 'juego-condor' | 'juego' | 'gemas' | 'mercado' | 'santuario' | 'valoracion-capibara' | 'quiz';

/** Reinos que usan el juego de gemas */
const REINOS_CON_GEMAS = ['capibara'];

export default function PaginaReino() {
  const router = useRouter();
  const params = useParams();
  const claveReino = params.reino as string;

  const { completarReino, estaCompletado } = useJuego();
  const { reproducir, iniciarAudio } = useSonido();

  // Determinar la fase inicial según el tipo de juego del reino
  const tieneIntro = INTRODUCCIONES[claveReino] !== undefined;
  const tieneGemas = REINOS_CON_GEMAS.includes(claveReino);
  const tieneMision = MISIONES[claveReino] !== undefined;

  /** Calcular fase inicial */
  const faseInicial = (): FaseReino => {
    if (claveReino === 'quirquincho') return 'intro-quirquincho';
    if (claveReino === 'condor') return 'juego-condor';
    if (tieneIntro) return 'comic';
    if (tieneGemas) return 'gemas';
    if (tieneMision) return 'juego';
    return 'quiz';
  };

  const [fase, setFase] = useState<FaseReino>(faseInicial);

  // Validar que el reino existe
  const reinoValido = REINOS_VALIDOS.includes(claveReino as ReinoValido);
  const datosReino = reinoValido ? REINOS[claveReino] : null;

  // Si el reino ya está completado o no existe, volver al mapa
  useEffect(() => {
    if (!reinoValido || estaCompletado(claveReino)) {
      router.replace('/');
    }
    iniciarAudio();
  }, [reinoValido, claveReino, estaCompletado, router, iniciarAudio]);

  /** El diálogo cómic terminó → pasar al juego correspondiente */
  const alCompletarComic = useCallback(() => {
    if (tieneGemas) setFase('gemas');
    else if (tieneMision) setFase('juego');
    else setFase('quiz');
  }, [tieneGemas, tieneMision]);

  /** Saltaron el diálogo → mismo comportamiento */
  const alSaltarComic = useCallback(() => {
    alCompletarComic();
  }, [alCompletarComic]);

  /** El reino fue completado (desde misión, gemas o quiz) */
  const alCompletarReino = useCallback(() => {
    completarReino(claveReino);
    reproducir('reino');

    // Activar flash del puente
    const win = window as unknown as Record<string, (k: string) => void>;
    if (win.__triggerBridgeFlash) win.__triggerBridgeFlash(claveReino);

    // Volver al mapa tras breve pausa
    setTimeout(() => {
      router.push('/');
    }, 800);
  }, [claveReino, completarReino, reproducir, router]);

  /** Cerrar y volver al mapa */
  const alCerrar = useCallback(() => {
    router.push('/');
  }, [router]);

  // Validación
  if (!reinoValido || !datosReino) return null;

  return (
    <>
      {/* Fase 0: Intro cinemática del Quirquincho */}
      {fase === 'intro-quirquincho' && (
        <IntroQuirquincho
          alCompletar={() => setFase('juego-quirquincho')}
          alSaltar={() => setFase('juego-quirquincho')}
          reproducir={reproducir}
        />
      )}

      {/* Fase 0.5: Prólogo interactivo y Juego 1 del Quirquincho */}
      {fase === 'juego-quirquincho' && (
        <JuegoQuirquincho
          alCompletar={alCompletarReino}
          alCerrar={alCerrar}
          reproducir={reproducir}
        />
      )}

      {/* Fase: Juego interactivo del Cóndor */}
      {fase === 'juego-condor' && (
        <JuegoCondor
          alCompletar={alCompletarReino}
          alCerrar={alCerrar}
          reproducir={reproducir}
        />
      )}

      {/* Fase 1: Diálogo cómic (si existe) */}
      {fase === 'comic' && INTRODUCCIONES[claveReino] && (
        <DialogoComic
          introduccion={INTRODUCCIONES[claveReino]}
          alCompletar={alCompletarComic}
          alSaltar={alSaltarComic}
          reproducir={reproducir}
        />
      )}

      {/* Fase 2a: Misión 1 — Gemas (multiplicación) */}
      {fase === 'gemas' && (
        <JuegoGemas
          alCompletar={() => setFase('mercado')}
          alCerrar={alCerrar}
          reproducir={reproducir}
        />
      )}

      {/* Fase 2b: Misión 2 — Mercado (división) */}
      {fase === 'mercado' && (
        <JuegoMercado
          alCompletar={() => setFase('santuario')}
          alCerrar={alCerrar}
          reproducir={reproducir}
        />
      )}

      {/* Fase 2c: Misión Final — Santuario (operaciones combinadas) */}
      {fase === 'santuario' && (
        <JuegoSantuario
          alCompletar={() => setFase('valoracion-capibara')}
          alCerrar={alCerrar}
          reproducir={reproducir}
        />
      )}

      {/* Fase 3: Valoración + Producción del Capibara */}
      {fase === 'valoracion-capibara' && (
        <ValoracionCapibara
          alCompletar={alCompletarReino}
          alCerrar={alCerrar}
          reproducir={reproducir}
        />
      )}

      {/* Fase 2b: Tablero de misión (puma, etc.) */}
      {fase === 'juego' && MISIONES[claveReino] && (
        <TableroMision
          mision={MISIONES[claveReino]}
          alCompletar={alCompletarReino}
          alCerrar={alCerrar}
          reproducir={reproducir}
        />
      )}

      {/* Fase 3: Quiz clásico (fallback) */}
      {fase === 'quiz' && (
        <ModalQuiz
          reino={claveReino}
          alCompletar={alCompletarReino}
          alCerrar={alCerrar}
          reproducir={reproducir}
        />
      )}
    </>
  );
}
