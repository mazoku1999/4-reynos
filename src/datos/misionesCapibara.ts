/**
 * Datos de las misiones del Reino de la Capibara.
 * 
 * Misión 1: "El Laberinto del Saber"
 *   → Encontrar la Gema de los Cálculos
 *   → Ejercicios de multiplicación de tres cifras
 * 
 * Misión 2: "El Mercado del Capibara"
 *   → Encontrar la Gema de la Energía
 *   → Ejercicios de división (repartir productos en canastas)
 */

// ---- Tipos ----

export interface ProblemaMultiplicacion {
  /** Expresión a resolver, ej: "352 × 23 = ?" */
  expresion: string;
  /** Respuesta correcta numérica */
  respuesta: number;
  /** Opciones de selección múltiple */
  opciones: number[];
  /** Pista que aparece si falla — desglose paso a paso */
  pista: string;
}

export interface TeoriaMultiplicacion {
  titulo: string;
  conceptos: {
    icono: string;
    nombre: string;
    color: string;
    descripcion: string;
  }[];
  tip: string;
  ejemplo: {
    multiplicando: number;
    multiplicador: number;
    producto: number;
  };
}

export interface ProblemaDivision {
  /** Nombre de la canasta, ej: "Canasta 1 — Choclos" */
  canasta: string;
  /** Nombre del producto */
  producto: string;
  /** Imagen de la canasta con el producto */
  imagen: string;
  /** Color temático de la canasta */
  color: string;
  /** Descripción del problema en texto */
  descripcion: string;
  /** Expresión a resolver, ej: "24 ÷ 6 = ?" */
  expresion: string;
  /** Dividendo (total de productos) */
  dividendo: number;
  /** Divisor (cantidad de cajas) */
  divisor: number;
  /** Respuesta correcta */
  respuesta: number;
  /** Opciones de selección múltiple */
  opciones: number[];
  /** Pista */
  pista: string;
}

export interface TeoriaDivision {
  titulo: string;
  pasos: string[];
  tip: string;
  ejemplo: {
    dividendo: number;
    divisor: number;
    cociente: number;
  };
}

// ---- Teoría: Términos de la multiplicación ----

export const TEORIA_MULTIPLICACION: TeoriaMultiplicacion = {
  titulo: 'Recuerda que los términos de la multiplicación:',
  conceptos: [
    {
      icono: '✕',
      nombre: 'FACTORES',
      color: '#e63946',
      descripcion: 'son los números que se multiplican.',
    },
    {
      icono: '💎',
      nombre: 'PRODUCTO',
      color: '#2a9d8f',
      descripcion: 'es el resultado de la multiplicación.',
    },
    {
      icono: '⬆',
      nombre: 'MULTIPLICANDO',
      color: '#7b2cbf',
      descripcion: 'es el factor que se encuentra arriba en la multiplicación.',
    },
    {
      icono: '⬇',
      nombre: 'MULTIPLICADOR',
      color: '#1d3557',
      descripcion: 'es el factor que se encuentra debajo del multiplicando.',
    },
  ],
  tip: 'La multiplicación es una suma repetida que nos ayuda a calcular cantidades grandes más rápido.',
  ejemplo: {
    multiplicando: 352,
    multiplicador: 23,
    producto: 8096,
  },
};

// ---- Regla general para el header ----

export const REGLA_MISION1 = 'Misión 1: Encuentra la Gema de los Cálculos resolviendo multiplicaciones de tres cifras.';

// ---- Problemas de la Misión 1: Multiplicaciones de tres cifras ----

export const PROBLEMAS_MISION1: ProblemaMultiplicacion[] = [
  {
    expresion: '352 × 23 = ?',
    respuesta: 8096,
    opciones: [8096, 7956, 8196],
    pista: 'Paso a paso: 352 × 3 = 1.056 y 352 × 20 = 7.040. Luego suma: 1.056 + 7.040 = 8.096.',
  },
  {
    expresion: '145 × 36 = ?',
    respuesta: 5220,
    opciones: [5120, 5220, 5320],
    pista: 'Paso a paso: 145 × 6 = 870 y 145 × 30 = 4.350. Luego suma: 870 + 4.350 = 5.220.',
  },
  {
    expresion: '278 × 14 = ?',
    respuesta: 3892,
    opciones: [3892, 3792, 3992],
    pista: 'Paso a paso: 278 × 4 = 1.112 y 278 × 10 = 2.780. Luego suma: 1.112 + 2.780 = 3.892.',
  },
  {
    expresion: '463 × 52 = ?',
    respuesta: 24076,
    opciones: [23076, 24076, 25076],
    pista: 'Paso a paso: 463 × 2 = 926 y 463 × 50 = 23.150. Luego suma: 926 + 23.150 = 24.076.',
  },
  {
    expresion: '521 × 18 = ?',
    respuesta: 9378,
    opciones: [9478, 9278, 9378],
    pista: 'Paso a paso: 521 × 8 = 4.168 y 521 × 10 = 5.210. Luego suma: 4.168 + 5.210 = 9.378.',
  },
  {
    expresion: '189 × 47 = ?',
    respuesta: 8883,
    opciones: [8883, 8783, 8983],
    pista: 'Paso a paso: 189 × 7 = 1.323 y 189 × 40 = 7.560. Luego suma: 1.323 + 7.560 = 8.883.',
  },
];

// ============================================================
// MISIÓN 2: EL MERCADO DEL CAPIBARA — División
// ============================================================

export const REGLA_MISION2 = 'Misión 2: Ayuda a los comerciantes a repartir sus productos resolviendo divisiones.';

// ---- Teoría: División ----

export const TEORIA_DIVISION: TeoriaDivision = {
  titulo: 'Recuerda que la división significa repartir una cantidad en partes iguales.',
  pasos: [
    'Miramos la cantidad total (dividendo).',
    'Miramos entre cuántos repartiremos (divisor).',
    'Repartimos en partes iguales.',
  ],
  tip: 'La división es la operación inversa de la multiplicación. Si 24 ÷ 6 = 4, entonces 4 × 6 = 24.',
  ejemplo: {
    dividendo: 24,
    divisor: 6,
    cociente: 4,
  },
};

// ---- Problemas de la Misión 2: Divisiones con canastas ----

export const PROBLEMAS_MISION2: ProblemaDivision[] = [
  {
    canasta: 'CANASTA 1',
    producto: 'CHOCLOS',
    imagen: '/assets/mercado/canasta_choclos.png',
    color: '#e6a817',
    descripcion: '24 choclos se deben repartir en 6 cajas.',
    expresion: '24 ÷ 6 = ?',
    dividendo: 24,
    divisor: 6,
    respuesta: 4,
    opciones: [3, 4, 6],
    pista: 'Si repartimos 24 choclos en 6 cajas iguales: 24 ÷ 6 = 4 choclos en cada caja.',
  },
  {
    canasta: 'CANASTA 2',
    producto: 'TOMATES',
    imagen: '/assets/mercado/canasta_tomates.png',
    color: '#e63946',
    descripcion: '60 tomates se deben repartir en 12 cajas.',
    expresion: '60 ÷ 12 = ?',
    dividendo: 60,
    divisor: 12,
    respuesta: 5,
    opciones: [4, 5, 6],
    pista: 'Si repartimos 60 tomates en 12 cajas iguales: 60 ÷ 12 = 5 tomates en cada caja.',
  },
  {
    canasta: 'CANASTA 3',
    producto: 'PAPAS',
    imagen: '/assets/mercado/canasta_papas.png',
    color: '#8b6914',
    descripcion: '120 papas se deben repartir en 10 cajas.',
    expresion: '120 ÷ 10 = ?',
    dividendo: 120,
    divisor: 10,
    respuesta: 12,
    opciones: [10, 12, 15],
    pista: 'Si repartimos 120 papas en 10 cajas iguales: 120 ÷ 10 = 12 papas en cada caja.',
  },
];

// ============================================================
// MISIÓN FINAL: EL SANTUARIO — Operaciones Combinadas
// ============================================================

export interface ProblemaCombinada {
  /** Expresión a resolver */
  expresion: string;
  /** Desglose paso a paso */
  pasos: string[];
  /** Respuesta correcta */
  respuesta: number;
  /** Opciones de selección múltiple */
  opciones: number[];
  /** Pista si falla */
  pista: string;
}

export interface TeoriaCombinadas {
  titulo: string;
  orden: { paso: number; nombre: string; color: string }[];
  tip: string;
}

export const REGLA_MISION_FINAL = 'Misión Final: Resuelve 3 operaciones combinadas para reactivar la energía del santuario.';

export const TEORIA_COMBINADAS: TeoriaCombinadas = {
  titulo: 'Para resolver operaciones combinadas, debemos seguir este orden:',
  orden: [
    { paso: 1, nombre: 'Paréntesis, corchetes y llaves', color: '#e63946' },
    { paso: 2, nombre: 'Multiplicación y división', color: '#f4a261' },
    { paso: 3, nombre: 'Suma y resta', color: '#2a9d8f' },
  ],
  tip: 'Siempre resolvemos primero lo que está dentro de los paréntesis, luego multiplicaciones y divisiones, y por último sumas y restas.',
};

export const PROBLEMAS_MISION_FINAL: ProblemaCombinada[] = [
  {
    expresion: '(4 + 15 ÷ 3) × 4 − 7 = ?',
    pasos: [
      '15 ÷ 3 = 5',
      '4 + 5 = 9',
      '9 × 4 = 36',
      '36 − 7 = 29',
    ],
    respuesta: 29,
    opciones: [25, 29, 33],
    pista: 'Primero resolvemos dentro del paréntesis: 15 ÷ 3 = 5, luego 4 + 5 = 9. Después 9 × 4 = 36. Finalmente 36 − 7 = 29.',
  },
  {
    expresion: '(58 − 30) × 6 − 20 = ?',
    pasos: [
      '58 − 30 = 28',
      '28 × 6 = 168',
      '168 − 20 = 148',
    ],
    respuesta: 148,
    opciones: [148, 158, 138],
    pista: 'Primero el paréntesis: 58 − 30 = 28. Luego 28 × 6 = 168. Finalmente 168 − 20 = 148.',
  },
  {
    expresion: '(69 − 43) × 4 − 35 = ?',
    pasos: [
      '69 − 43 = 26',
      '26 × 4 = 104',
      '104 − 35 = 69',
    ],
    respuesta: 69,
    opciones: [59, 69, 79],
    pista: 'Primero el paréntesis: 69 − 43 = 26. Luego 26 × 4 = 104. Finalmente 104 − 35 = 69.',
  },
];

// ============================================================
// VALORACIÓN — Reflexión
// ============================================================

export interface ValoracionCapibaraData {
  introLlama: string;
  preguntas: string[];
  finalRey: string;
}

export const VALORACION_CAPIBARA: ValoracionCapibaraData = {
  introLlama: 'Las matemáticas ayudaron a recuperar las gemas, pero también nos enseñaron algo más importante.',
  preguntas: [
    '¿Qué aprendimos durante la aventura?',
    '¿Por qué es importante trabajar en equipo?',
    '¿Para qué sirven las matemáticas en un mercado?',
    '¿Por qué es importante repartir los recursos de manera justa?',
    '¿Cómo utilizamos las matemáticas en la vida diaria?',
  ],
  finalRey: 'Gracias, Guardianes Matemáticos, gracias a ustedes, nuestro reino vuelve a brillar.',
};

// ============================================================
// PRODUCCIÓN — El Mosaico de las Gemas Perdidas
// ============================================================

export interface ProduccionCapibaraData {
  titulo: string;
  instrucciones: string;
  pasos: string[];
  productoGrupal: string;
}

export const PRODUCCION_CAPIBARA: ProduccionCapibaraData = {
  titulo: 'El Mosaico de las Gemas Perdidas',
  instrucciones: 'Cada estudiante recibe una gema de cartulina. Dentro coloca:',
  pasos: [
    'Su nombre.',
    'Una operación creada por el mismo.',
    'Una frase sobre por qué las matemáticas son importantes.',
  ],
  productoGrupal: 'Todas las gemas forman una gran gema gigante que se colocará en el centro del Reino de la Capiwara como fuente de energía para los demás reinos.',
};
