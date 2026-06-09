/**
 * Diálogos introductorios por reino.
 * Se muestran como escena estilo cómic antes de empezar el juego.
 */

export interface LineaDialogo {
  texto: string;
}

export interface Introduccion {
  imagenPersonaje: string;
  nombrePersonaje: string;
  tituloMision: string;
  fondoEscena: string;
  dialogos: LineaDialogo[];
}

export const INTRODUCCIONES: Record<string, Introduccion> = {
  puma: {
    imagenPersonaje: '/assets/sprites_individuales/personajes/rey_puma_nuevo.png',
    nombrePersonaje: 'Rey Puma',
    tituloMision: 'El Despertar del Bosque de Neblina',
    fondoEscena: 'url(/assets/ui/forest_bg.jpg) center/cover no-repeat',
    dialogos: [
      { texto: 'Bienvenidos, pequeños guardianes. El calor en nuestro reino está aumentando, las lluvias ya no llegan a tiempo y la tierra de los valles se está secando y agrietando...' },
      { texto: 'Esto pasa porque los árboles antiguos están desapareciendo y la Madre Tierra ha perdido su poncho verde que la protegía del Sol.' },
      { texto: 'Necesito que viajen junto a mi corte para sanar la tierra. Plantar un árbol no es solo meter una semilla... ¡es devolverle el aliento a la vida!' },
      { texto: 'El Oso Jukumari les ayudará a preparar el suelo. La Corzuela les dará la sabiduría de qué árbol nativo sembrar. Y el Tucán y el Guacamayo vigilarán desde las alturas.' },
      { texto: '¡Demuestren sus conocimientos sobre la Vida, la Tierra y el Territorio para sanar nuestro bosque! ¿Están listos, guardianes?' },
    ],
  },
  capibara: {
    imagenPersonaje: '/assets/gemas/llama_yachay.png',
    nombrePersonaje: 'Llama Yachay',
    tituloMision: 'Las Gemas Matemáticas',
    fondoEscena: 'linear-gradient(180deg, #1a0e2e 0%, #2d1b4e 40%, #1a1428 100%)',
    dialogos: [
      { texto: 'Bienvenido, pequeño guardián. Soy la Llama Yachay, guardiana del conocimiento en el Reino de la Capibara.' },
      { texto: 'Nuestro reino vivía en armonía gracias a dos Gemas Matemáticas: la Gema de los Cálculos y la Gema de la Energía.' },
      { texto: 'Pero las gemas desaparecieron. Ahora las luces del reino están apagadas y solo resolviendo ejercicios matemáticos podremos recuperarlas.' },
      { texto: '¿Aceptas convertirte en Guardián Matemático? ¡El destino del reino está en tus manos!' },
      { texto: 'Tu primera misión será encontrar la Gema de los Cálculos. Para ello deberás resolver multiplicaciones de tres cifras. ¡Vamos!' },
    ],
  },
};
