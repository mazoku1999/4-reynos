'use client';

/**
 * Página principal — Hub del juego.
 * Gestiona las pantallas: Carga → Título → Mapa → Victoria.
 * Al seleccionar un reino, navega a /reino/[nombre].
 */

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useJuego } from '@/contexto/ProveedorJuego';
import { useSonido } from '@/hooks/useSonido';
import PantallaCarga from '@/componentes/PantallaCarga';
import PantallaTitulo from '@/componentes/PantallaTitulo';
import Mapa from '@/componentes/Mapa';
import PantallaVictoria from '@/componentes/PantallaVictoria';


export default function PaginaPrincipal() {
  const router = useRouter();
  const {
    pantalla, reinosCompletados,
    cambiarPantalla, reiniciarJuego,
  } = useJuego();
  const { reproducir, iniciarAudio } = useSonido();

  // ---- Acciones ----

  /** Carga completada → mostrar título */
  const alCargar = useCallback(() => {
    cambiarPantalla('titulo');
  }, [cambiarPantalla]);

  /** Iniciar aventura → mostrar mapa */
  const alIniciar = useCallback(() => {
    iniciarAudio();
    reproducir('clic');
    cambiarPantalla('mapa');
  }, [iniciarAudio, reproducir, cambiarPantalla]);

  /** Reiniciar progreso */
  const alReiniciar = useCallback(() => {
    reproducir('clic');
    reiniciarJuego();
  }, [reproducir, reiniciarJuego]);

  /** Seleccionar reino → navegar a /reino/[nombre] */
  const alSeleccionarReino = useCallback((clave: string) => {
    iniciarAudio();
    if (reinosCompletados.includes(clave)) {
      reproducir('clic');
      return;
    }
    reproducir('clic');

    // Navegar a la página del reino
    router.push(`/reino/${clave}`);
  }, [reinosCompletados, iniciarAudio, reproducir, router]);

  /** Volver al mapa desde victoria */
  const alVolverAlMapa = useCallback(() => {
    cambiarPantalla('mapa');
  }, [cambiarPantalla]);

  // ---- Verificar victoria ----
  // Si hay 4 reinos completados y estamos en el mapa, ir a victoria
  if (pantalla === 'mapa' && reinosCompletados.length >= 4) {
    setTimeout(() => {
      reproducir('victoria');
      cambiarPantalla('victoria');
    }, 500);
  }

  return (
    <>
      {/* Pantalla de carga */}
      {pantalla === 'carga' && <PantallaCarga alCompletar={alCargar} />}

      {/* Pantalla de título */}
      <PantallaTitulo
        activa={pantalla === 'titulo'}
        alIniciar={alIniciar}
        alReiniciar={alReiniciar}
      />

      {/* Mapa principal */}
      <Mapa
        activa={pantalla === 'mapa'}
        reinosCompletados={reinosCompletados}
        alSeleccionarReino={alSeleccionarReino}
      />

      {/* Pantalla de victoria */}
      <PantallaVictoria
        activa={pantalla === 'victoria'}
        alVolverAlMapa={alVolverAlMapa}
        alReiniciar={alReiniciar}
      />
    </>
  );
}
