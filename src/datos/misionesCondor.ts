/**
 * Datos del juego del Reino del Cóndor — "El Despertar del Árbol Sagrado"
 *
 * Flujo: Intro → Cóndor presenta problema → Árbol seco → Preguntas reflexivas
 * → Seleccionar símbolos correctos → Preguntas por símbolo → Hojas al árbol
 * → Árbol florece → Victoria
 */

// ---- Tipos ----

export interface Simbolo {
  id: string;
  emoji: string;
  nombre: string;
  categoria: 'natural' | 'cosmico' | 'espiritual';
  /** Pregunta guiada para este símbolo */
  pregunta: string;
  opciones: string[];
  correcta: number;
  /** Explicación al fallar */
  explicacion: string;
  /** Valor asociado */
  valor: string;
  /** Acción de cuidado */
  accion: string;
}

export interface HojaDistractora {
  id: string;
  emoji: string;
  nombre: string;
}

// ---- Los 8 símbolos correctos ----

export const SIMBOLOS_CORRECTOS: Simbolo[] = [
  {
    id: 'sol',
    emoji: '☀️',
    nombre: 'Sol',
    categoria: 'cosmico',
    pregunta: '¿Qué función cumple el Sol?',
    opciones: [
      'Da luz y calor, permitiendo la vida en la Tierra.',
      'Solo sirve para que haga calor.',
      'No tiene ninguna función importante.',
    ],
    correcta: 0,
    explicacion:
      'El Sol es la fuente de luz y energía que permite la vida en nuestro planeta. Sin él, no existirían las plantas, los animales ni las personas.',
    valor: 'Gratitud',
    accion: 'Valorar la vida',
  },
  {
    id: 'luna',
    emoji: '🌙',
    nombre: 'Luna',
    categoria: 'cosmico',
    pregunta: '¿Qué nos enseña la Luna?',
    opciones: [
      'Solo que es de noche.',
      'Que la vida tiene ciclos y cambios.',
      'Nada importante.',
    ],
    correcta: 1,
    explicacion:
      'La Luna nos enseña que todo en la naturaleza tiene ciclos: crece, cambia y se renueva. Sus fases nos recuerdan la importancia de los cambios.',
    valor: 'Paciencia',
    accion: 'Respetar los ciclos de la naturaleza',
  },
  {
    id: 'estrella',
    emoji: '⭐',
    nombre: 'Estrella',
    categoria: 'cosmico',
    pregunta: '¿Qué nos enseñan las estrellas?',
    opciones: [
      'Solo son puntos brillantes en el cielo.',
      'No nos enseñan nada.',
      'Nos guían y orientan en la oscuridad.',
    ],
    correcta: 2,
    explicacion:
      'Las estrellas han sido guías para los pueblos desde tiempos antiguos. Nos orientan, nos inspiran a soñar y nos recuerdan que somos parte del universo.',
    valor: 'Esperanza',
    accion: 'Observar el cielo y aprender',
  },
  {
    id: 'arbol',
    emoji: '🌳',
    nombre: 'Árbol',
    categoria: 'natural',
    pregunta: '¿Qué representa el árbol?',
    opciones: [
      'La vida, protección y conexión con la tierra.',
      'Solo madera para construir cosas.',
      'Un obstáculo en el camino.',
    ],
    correcta: 0,
    explicacion:
      'El árbol representa la vida misma. Sus raíces nos conectan con la tierra, su tronco nos da fortaleza y sus hojas nos dan aire limpio y sombra.',
    valor: 'Responsabilidad',
    accion: 'Plantar árboles',
  },
  {
    id: 'agua',
    emoji: '💧',
    nombre: 'Agua',
    categoria: 'natural',
    pregunta: '¿Por qué el agua es importante para la vida?',
    opciones: [
      'Solo sirve para nadar y jugar.',
      'Porque sin agua no hay vida posible.',
      'No es tan importante.',
    ],
    correcta: 1,
    explicacion:
      'El agua es esencial para todos los seres vivos. Sin ella, las plantas no crecen, los animales no sobreviven y las personas no pueden vivir.',
    valor: 'Respeto',
    accion: 'Ahorrar agua',
  },
  {
    id: 'mariposa',
    emoji: '🦋',
    nombre: 'Mariposa',
    categoria: 'natural',
    pregunta: '¿Qué representa la mariposa?',
    opciones: [
      'Un insecto que no sirve para nada.',
      'Solo un animal bonito para mirar.',
      'La transformación y la belleza de la naturaleza.',
    ],
    correcta: 2,
    explicacion:
      'La mariposa nos enseña sobre la transformación: de oruga se convierte en un ser hermoso con alas. Representa el cambio positivo y la belleza natural.',
    valor: 'Transformación',
    accion: 'Cuidar a los insectos y no dañarlos',
  },
  {
    id: 'montana',
    emoji: '🏔️',
    nombre: 'Montaña',
    categoria: 'natural',
    pregunta: '¿Qué representa la montaña?',
    opciones: [
      'Fortaleza, protección y conexión con el cielo.',
      'Un lugar peligroso donde no debemos ir.',
      'Solo rocas grandes sin importancia.',
    ],
    correcta: 0,
    explicacion:
      'Las montañas representan fortaleza y protección. Para los pueblos andinos, las montañas son seres protectores que cuidan a las comunidades.',
    valor: 'Fortaleza',
    accion: 'Proteger las montañas y no contaminarlas',
  },
  {
    id: 'condor',
    emoji: '🦅',
    nombre: 'Cóndor',
    categoria: 'espiritual',
    pregunta: '¿Por qué el Cóndor es considerado un símbolo importante?',
    opciones: [
      'Porque es el ave más grande del mundo.',
      'Solo porque vuela muy alto.',
      'Representa sabiduría y conexión entre la tierra y el cielo.',
    ],
    correcta: 2,
    explicacion:
      'El Cóndor es considerado el mensajero entre la tierra y el cielo. Representa la sabiduría, la libertad y la conexión espiritual con la naturaleza.',
    valor: 'Sabiduría',
    accion: 'Proteger a los animales en peligro',
  },
];

// ---- Distractores (hojas incorrectas) ----

export const DISTRACTORES: HojaDistractora[] = [
  { id: 'llama', emoji: '🦙', nombre: 'Llama' },
  { id: 'corazon', emoji: '❤️', nombre: 'Corazón' },
  { id: 'fuego', emoji: '🔥', nombre: 'Fuego' },
  { id: 'viento', emoji: '🌬️', nombre: 'Viento' },
  { id: 'maiz', emoji: '🌽', nombre: 'Maíz' },
  { id: 'comunidad', emoji: '👨‍👩‍👧‍👦', nombre: 'Comunidad' },
];

// ---- IDs de los símbolos correctos (para validación rápida) ----

export const IDS_CORRECTOS = new Set(SIMBOLOS_CORRECTOS.map((s) => s.id));

// ---- Diálogos ----

/** Texto introductorio del docente */
export const TEXTO_INTRO =
  'Hoy no estamos en el aula. Hemos sido transportados al Reino de los Símbolos de la Vida y el Universo. Nuestro mundo ha perdido la conexión con los mensajes que la naturaleza y el cosmos nos enseñan.';

/** Diálogos del Rey Cóndor presentando el problema */
export const DIALOGOS_PROBLEMA: string[] = [
  'Bienvenidos pequeños guardianes. Desde las alturas he observado que muchas personas están olvidando el significado de los símbolos que nos enseñan a respetar la vida.',
  'Los árboles ya no son valorados, el agua es desperdiciada y pocos observan el cielo para aprender de él.',
  'Si olvidamos estos símbolos, olvidaremos también nuestra relación con la Madre Tierra.',
];

/** Preguntas reflexivas sobre el árbol seco */
export const PREGUNTAS_REFLEXION: string[] = [
  '¿Qué observan en el Árbol Sagrado?',
  '¿Por qué creen que perdió sus hojas?',
  '¿Cómo podríamos ayudarlo?',
];

/** Instrucción para seleccionar hojas */
export const TEXTO_SELECCION =
  'Antes de recuperar el Árbol Sagrado debemos encontrar los símbolos que nuestros antepasados nos dejaron como enseñanzas. Selecciona los 8 símbolos correctos de entre todas las hojas.';

/** Mensajes de error al seleccionar mal */
export const MENSAJES_ERROR_SELECCION: string[] = [
  '¡Observa bien, pequeño guardián! Busca los símbolos de la naturaleza, el cosmos y lo espiritual.',
  'Recuerda: los símbolos naturales son elementos de la tierra, los cósmicos vienen del cielo, y el espiritual nos conecta con la sabiduría.',
  '¡No te rindas! El Árbol Sagrado necesita exactamente 8 símbolos para renacer.',
];

/** Mensaje al completar la selección correctamente */
export const TEXTO_SELECCION_CORRECTA =
  '¡Excelente, guardián! Has encontrado los 8 símbolos sagrados. Ahora debemos aprender su significado para devolverle la vida al Árbol Sagrado.';

/** Mensaje de victoria final */
export const TEXTO_VICTORIA =
  '¡Han cumplido la misión! Gracias a ustedes el Árbol Sagrado ha vuelto a florecer. Los símbolos han recuperado su significado y ahora forman parte de sus enseñanzas.';

// ---- Utilidades de progreso del árbol ----

/** Obtener el stage visual del árbol (0–3) según hojas colocadas */
export function getStageArbol(hojasColocadas: number): number {
  if (hojasColocadas >= 7) return 3;
  if (hojasColocadas >= 4) return 2;
  if (hojasColocadas >= 1) return 1;
  return 0;
}

/** Generar la mezcla aleatoria de todas las hojas (correctas + distractores) */
export function generarHojasBarajadas(): { id: string; emoji: string; nombre: string; esCorrecta: boolean }[] {
  const correctas = SIMBOLOS_CORRECTOS.map((s) => ({
    id: s.id,
    emoji: s.emoji,
    nombre: s.nombre,
    esCorrecta: true,
  }));
  const distractoras = DISTRACTORES.map((d) => ({
    id: d.id,
    emoji: d.emoji,
    nombre: d.nombre,
    esCorrecta: false,
  }));
  const todas = [...correctas, ...distractoras];
  // Fisher-Yates shuffle
  for (let i = todas.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [todas[i], todas[j]] = [todas[j], todas[i]];
  }
  return todas;
}
