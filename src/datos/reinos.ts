/**
 * Datos de los 4 reinos — preguntas, colores, mascots y posiciones.
 */

// ---- Tipos ----

export interface Pregunta {
  pregunta: string;
  opciones: string[];
  correcta: number;
}

export interface Reino {
  nombre: string;
  tema: string;
  color: string;
  colorAccento: string;
  mascotaSrc: string;
  preguntas: Pregunta[];
}

// ---- Datos de reinos ----

export const REINOS: Record<string, Reino> = {
  condor: {
    nombre: 'Reino del Cóndor',
    tema: 'Cosmos y Pensamiento',
    color: 'blue',
    colorAccento: '#4499ff',
    mascotaSrc: '/assets/sprites_individuales/personajes/rey_condor.png',
    preguntas: [
      {
        pregunta: '¿Qué estudia la cosmología andina?',
        opciones: ['La relación del ser humano con el cosmos', 'Solo las estrellas y planetas', 'Las recetas de cocina'],
        correcta: 0,
      },
      {
        pregunta: '¿Qué significa "pensar críticamente"?',
        opciones: ['Criticar a los demás siempre', 'Analizar la información antes de creer', 'No pensar en nada importante'],
        correcta: 1,
      },
      {
        pregunta: 'El pensamiento y el cosmos nos enseñan a...',
        opciones: ['Nada importante en la vida', 'Entender nuestra relación con el universo', 'Solo aprobar exámenes'],
        correcta: 1,
      },
    ],
  },
  puma: {
    nombre: 'Reino del Puma',
    tema: 'Vida, Tierra y Territorio',
    color: 'green',
    colorAccento: '#44dd44',
    mascotaSrc: '/assets/sprites_individuales/personajes/rey_puma_nuevo.png',
    preguntas: [
      {
        pregunta: '¿Qué es la Pachamama?',
        opciones: ['La Madre Tierra en la cosmovisión andina', 'Un tipo de comida', 'Un instrumento musical'],
        correcta: 0,
      },
      {
        pregunta: '¿Por qué es importante cuidar el territorio?',
        opciones: ['Solo para las plantas', 'Porque es la base de la vida y la comunidad', 'No es importante'],
        correcta: 1,
      },
      {
        pregunta: 'Vida, Tierra y Territorio nos enseña a...',
        opciones: ['Solo memorizar nombres de animales', 'Vivir en armonía con la naturaleza', 'Destruir bosques para construir'],
        correcta: 1,
      },
    ],
  },
  capibara: {
    nombre: 'Reino de la Capibara',
    tema: 'Ciencia, Tecnología y Producción',
    color: 'purple',
    colorAccento: '#bb77ee',
    mascotaSrc: '/assets/sprites_individuales/personajes/rey_capibara.png',
    preguntas: [
      {
        pregunta: '¿Qué es la tecnología?',
        opciones: ['Solo celulares y computadoras', 'Herramientas que resuelven problemas', 'Un tipo de videojuego moderno'],
        correcta: 1,
      },
      {
        pregunta: '¿Para qué sirve la producción comunitaria?',
        opciones: ['Para enriquecerse solo', 'Para crear bienes que beneficien a todos', 'Para nada productivo'],
        correcta: 1,
      },
      {
        pregunta: 'La ciencia y tecnología bien usadas pueden...',
        opciones: ['Solo destruir comunidades', 'Transformar y mejorar vidas', 'Solo servir para entretenerse'],
        correcta: 1,
      },
    ],
  },
  quirquincho: {
    nombre: 'Reino del Quirquincho',
    tema: 'Comunidad y Sociedad',
    color: 'orange',
    colorAccento: '#ffaa33',
    mascotaSrc: '/assets/sprites_individuales/personajes/rey_quirquincho.png',
    preguntas: [
      {
        pregunta: '¿Qué son los saberes comunitarios?',
        opciones: ['Secretos que nadie debe conocer', 'Conocimientos compartidos por la comunidad', 'Leyes del gobierno nacional'],
        correcta: 1,
      },
      {
        pregunta: '¿Qué es el aguayo en la cultura andina?',
        opciones: ['Una comida tradicional picante', 'Un tejido con significado cultural', 'Un instrumento musical de viento'],
        correcta: 1,
      },
      {
        pregunta: 'Los saberes comunitarios nos ayudan a...',
        opciones: ['Ser más individualistas y solitarios', 'Vivir mejor juntos como comunidad', 'Olvidar nuestro pasado y raíces'],
        correcta: 1,
      },
    ],
  },
};

// ---- Colores por reino (para canvas) ----

export const COLORES_REINOS: Record<string, string> = {
  condor: '#4499ff',
  puma: '#44dd44',
  capibara: '#bb77ee',
  quirquincho: '#ffaa33',
};

// ---- Posiciones de islas en el mapa ----

export const POSICIONES_ISLAS = [
  { clave: 'condor', clase: 'island-tl', imagen: '/assets/sprites_individuales/islas/islas_01.png', alt: 'Isla del Cóndor' },
  { clave: 'puma', clase: 'island-tr', imagen: '/assets/sprites_individuales/islas/islas_02.png', alt: 'Isla del Puma' },
  { clave: 'capibara', clase: 'island-bl', imagen: '/assets/sprites_individuales/islas/islas_04.png', alt: 'Isla de la Capibara' },
  { clave: 'quirquincho', clase: 'island-br', imagen: '/assets/sprites_individuales/islas/islas_03.png', alt: 'Isla del Quirquincho' },
] as const;

/** Reinos válidos para validación de rutas */
export const REINOS_VALIDOS = ['condor', 'puma', 'capibara', 'quirquincho'] as const;
export type ReinoValido = typeof REINOS_VALIDOS[number];
