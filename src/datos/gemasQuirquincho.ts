/**
 * Datos del juego de gemas — Reino del Quirquincho.
 * 
 * Cada "cofre" contiene un problema matemático de orden de operaciones.
 * El jugador debe resolverlo para abrir el cofre y recolectar la gema.
 */

export interface ProblemaMatematico {
  /** Expresión a resolver, ej: "(3 × 4) + 2" */
  expresion: string;
  /** Respuesta correcta numérica */
  respuesta: number;
  /** Opciones de selección múltiple */
  opciones: number[];
  /** Pista que aparece si falla */
  pista: string;
}

export const PROBLEMAS_GEMAS: ProblemaMatematico[] = [
  {
    expresion: '(3 × 4) + 2 = ?',
    respuesta: 14,
    opciones: [14, 18, 10],
    pista: 'Primero resuelve la multiplicación: 3 × 4 = 12. Luego suma 2.',
  },
  {
    expresion: '10 − (21 ÷ 7) = ?',
    respuesta: 7,
    opciones: [7, 3, 5],
    pista: 'Primero resuelve la división: 21 ÷ 7 = 3. Luego resta.',
  },
  {
    expresion: '(5 + 3) × 2 = ?',
    respuesta: 16,
    opciones: [11, 16, 13],
    pista: 'Primero resuelve lo que está entre paréntesis: 5 + 3 = 8.',
  },
  {
    expresion: '20 ÷ (2 + 3) = ?',
    respuesta: 4,
    opciones: [4, 10, 7],
    pista: 'Primero resuelve el paréntesis: 2 + 3 = 5. Luego divide.',
  },
  {
    expresion: '(6 × 3) − 8 = ?',
    respuesta: 10,
    opciones: [12, 10, 8],
    pista: 'Primero multiplica: 6 × 3 = 18. Luego resta 8.',
  },
  {
    expresion: '15 + (4 × 5) = ?',
    respuesta: 35,
    opciones: [95, 35, 25],
    pista: 'Primero la multiplicación: 4 × 5 = 20. Luego suma 15.',
  },
];

/** Regla general que la llama puede mostrar */
export const REGLA_MATEMATICA = 'Recuerda: Primero resolvemos multiplicaciones y divisiones, luego sumas y restas. ¡Los paréntesis siempre van primero!';
