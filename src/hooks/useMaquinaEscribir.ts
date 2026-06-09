'use client';

/**
 * useMaquinaEscribir — Efecto de escritura letra por letra.
 * Usado en los diálogos de cómic para crear tensión narrativa.
 */

import { useState, useRef, useCallback } from 'react';

export function useMaquinaEscribir(velocidad: number = 22) {
  const [textoVisible, setTextoVisible] = useState('');
  const [escribiendo, setEscribiendo] = useState(false);
  const temporizadorRef = useRef<NodeJS.Timeout | null>(null);
  const textoCompletoRef = useRef('');

  /** Inicia la escritura de un nuevo texto */
  const iniciarEscritura = useCallback((texto: string) => {
    // Limpiar escritura anterior
    if (temporizadorRef.current) clearTimeout(temporizadorRef.current);

    textoCompletoRef.current = texto;
    setEscribiendo(true);
    setTextoVisible('');

    let indice = 0;
    function escribirLetra() {
      if (indice < texto.length) {
        setTextoVisible(texto.slice(0, indice + 1));
        indice++;
        // Pausa natural: más lento en puntos y comas
        const pausa = texto[indice - 1] === '.' || texto[indice - 1] === ',' ? 80 : velocidad;
        temporizadorRef.current = setTimeout(escribirLetra, pausa);
      } else {
        setEscribiendo(false);
      }
    }
    escribirLetra();
  }, []);

  /** Salta al final — muestra todo el texto de golpe */
  const saltarAlFinal = useCallback(() => {
    if (temporizadorRef.current) clearTimeout(temporizadorRef.current);
    setTextoVisible(textoCompletoRef.current);
    setEscribiendo(false);
  }, []);

  /** Limpia el texto y detiene la escritura */
  const limpiar = useCallback(() => {
    if (temporizadorRef.current) clearTimeout(temporizadorRef.current);
    setTextoVisible('');
    setEscribiendo(false);
  }, []);

  return { textoVisible, escribiendo, iniciarEscritura, saltarAlFinal, limpiar };
}
