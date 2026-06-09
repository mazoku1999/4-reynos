'use client';

/**
 * ProveedorJuego — Contexto global del juego "Los 4 Reinos".
 * 
 * Gestiona el estado persistente (reinos completados) y lo comparte
 * entre todas las rutas/páginas sin perder datos al navegar.
 */

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';

// ---- Tipos ----

/** Pantallas principales del juego */
export type Pantalla = 'carga' | 'titulo' | 'mapa' | 'victoria';

/** Estado global del juego */
interface EstadoJuego {
  pantalla: Pantalla;
  reinosCompletados: string[];
}

/** Acciones disponibles desde cualquier componente */
interface AccionesJuego {
  cambiarPantalla: (pantalla: Pantalla) => void;
  completarReino: (reino: string) => void;
  reiniciarJuego: () => void;
  estaCompletado: (reino: string) => boolean;
}

type ContextoJuego = EstadoJuego & AccionesJuego;

// ---- Constantes ----

const CLAVE_GUARDADO = 'los4reinos_v3';

const ESTADO_INICIAL: EstadoJuego = {
  pantalla: 'carga',
  reinosCompletados: [],
};

// ---- Contexto ----

const Contexto = createContext<ContextoJuego | null>(null);

// ---- Funciones de persistencia ----

function cargarProgreso(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const datos = JSON.parse(localStorage.getItem(CLAVE_GUARDADO) || '{}');
    return datos?.completed || [];
  } catch {
    return [];
  }
}

function guardarProgreso(reinosCompletados: string[]) {
  try {
    localStorage.setItem(CLAVE_GUARDADO, JSON.stringify({ completed: reinosCompletados }));
  } catch { /* ignorar en incógnito */ }
}

// ---- Proveedor ----

export function ProveedorJuego({ children }: { children: ReactNode }) {
  const [estado, setEstado] = useState<EstadoJuego>(ESTADO_INICIAL);

  // Cargar progreso guardado al montar
  useEffect(() => {
    const guardados = cargarProgreso();
    if (guardados.length > 0) {
      setEstado(prev => ({ ...prev, reinosCompletados: guardados }));
    }
  }, []);

  const cambiarPantalla = useCallback((pantalla: Pantalla) => {
    setEstado(prev => ({ ...prev, pantalla }));
  }, []);

  const completarReino = useCallback((reino: string) => {
    setEstado(prev => {
      if (prev.reinosCompletados.includes(reino)) return prev;
      const nuevosCompletados = [...prev.reinosCompletados, reino];
      guardarProgreso(nuevosCompletados);
      return { ...prev, reinosCompletados: nuevosCompletados };
    });
  }, []);

  const reiniciarJuego = useCallback(() => {
    guardarProgreso([]);
    setEstado({ ...ESTADO_INICIAL, pantalla: 'titulo' });
  }, []);

  const estaCompletado = useCallback((reino: string) => {
    return estado.reinosCompletados.includes(reino);
  }, [estado.reinosCompletados]);

  const valor: ContextoJuego = {
    ...estado,
    cambiarPantalla,
    completarReino,
    reiniciarJuego,
    estaCompletado,
  };

  return <Contexto value={valor}>{children}</Contexto>;
}

// ---- Hook de acceso ----

/**
 * useJuego — Accede al estado global del juego.
 * Debe usarse dentro de <ProveedorJuego>.
 */
export function useJuego(): ContextoJuego {
  const contexto = useContext(Contexto);
  if (!contexto) {
    throw new Error('useJuego debe usarse dentro de <ProveedorJuego>');
  }
  return contexto;
}
