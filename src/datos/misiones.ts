/**
 * Datos de misiones por reino.
 * Cada misión tiene un título y un conjunto de "parcelas"
 * que el jugador debe resolver para restaurar la tierra.
 *
 * v2: Incluye explicaciones Duolingo-style, 8 tarjetas,
 * nombres de lugar y imágenes seca/restaurada por parcela.
 */

export interface Parcela {
  pregunta: string;
  opciones: string[];
  correcta: number;
  /** Explicación que se muestra al fallar (estilo Duolingo) */
  explicacion: string;
  /** Nombre del lugar de esta parcela */
  lugar: string;
  /** Ruta imagen seca (antes de restaurar) */
  imgSeca: string;
  /** Ruta imagen restaurada (después de resolver) */
  imgVerde: string;
}

export interface Mision {
  titulo: string;
  /** Mensaje de ánimo al fallar */
  mensajeAnimo: string;
  parcelas: Parcela[];
}

export const MISIONES: Record<string, Mision> = {
  puma: {
    titulo: 'El Despertar del Bosque de Neblina',
    mensajeAnimo: '¡No te preocupes, pequeño guardián! Aprender también es parte de la aventura.',
    parcelas: [
      {
        pregunta: '¿Para qué sirve plantar árboles?',
        opciones: ['Para producir más basura.', 'Para dar sombra y aire limpio.'],
        correcta: 1,
        explicacion: 'Los árboles no producen basura. Al contrario, ayudan a mantener limpio el ambiente, producen oxígeno y brindan sombra para las personas y los animales.',
        lugar: 'Río del Valle',
        imgSeca: '/assets/parcelas/rio_seco.png',
        imgVerde: '/assets/parcelas/rio_verde.png',
      },
      {
        pregunta: '¿Qué necesitan los árboles para crecer?',
        opciones: ['Agua.', 'Humo.'],
        correcta: 0,
        explicacion: 'El humo puede contaminar el aire y dañar a las plantas. Los árboles necesitan agua, luz del sol, aire y nutrientes del suelo para crecer sanos.',
        lugar: 'Pradera de la Montaña',
        imgSeca: '/assets/parcelas/pradera_seca.png',
        imgVerde: '/assets/parcelas/pradera_verde.png',
      },
      {
        pregunta: '¿Qué pasa cuando se cortan muchos árboles?',
        opciones: ['La tierra pierde protección.', 'Llueven caramelos.'],
        correcta: 0,
        explicacion: 'Los caramelos no caen del cielo. Cuando desaparecen los árboles, el suelo queda expuesto al sol, al viento y a la lluvia, por lo que se deteriora más fácilmente.',
        lugar: 'Claro del Bosque',
        imgSeca: '/assets/parcelas/claro_seco.png',
        imgVerde: '/assets/parcelas/claro_verde.png',
      },
      {
        pregunta: '¿Quiénes viven en los árboles?',
        opciones: ['Muchos animales.', 'Los automóviles.'],
        correcta: 0,
        explicacion: 'Los automóviles circulan por caminos y carreteras. Los árboles son el hogar de aves, insectos, ardillas y muchos otros animales.',
        lugar: 'Valle Escondido',
        imgSeca: '/assets/parcelas/valle_seco.png',
        imgVerde: '/assets/parcelas/valle_verde.png',
      },
      {
        pregunta: '¿Qué ayuda a mantener limpio el aire que respiramos?',
        opciones: ['Los árboles y las plantas.', 'La basura en el suelo.'],
        correcta: 0,
        explicacion: 'La basura no limpia el aire. Si se acumula, puede contaminar el ambiente. Los árboles ayudan a purificar el aire y producen oxígeno.',
        lugar: 'Colina del Viento',
        imgSeca: '/assets/parcelas/colina_seca.png',
        imgVerde: '/assets/parcelas/colina_verde.png',
      },
      {
        pregunta: 'Después de plantar un árbol, ¿qué debemos hacer?',
        opciones: ['Cuidarlo para que crezca fuerte.', 'Olvidarnos de él.'],
        correcta: 0,
        explicacion: 'Si dejamos de cuidar un árbol recién plantado, puede secarse o morir. Necesita agua, protección y atención para crecer saludable.',
        lugar: 'Laguna del Puma',
        imgSeca: '/assets/parcelas/laguna_seca.png',
        imgVerde: '/assets/parcelas/laguna_verde.png',
      },
      {
        pregunta: '¿Qué podemos hacer con la basura para cuidar la naturaleza?',
        opciones: ['Colocarla en los basureros o reciclarla.', 'Dejarla en el bosque.'],
        correcta: 0,
        explicacion: 'La basura abandonada puede contaminar el suelo y el agua, además de perjudicar a los animales. Por eso debemos depositarla en lugares adecuados o reciclarla.',
        lugar: 'Selva de Neblina',
        imgSeca: '/assets/parcelas/selva_seca.png',
        imgVerde: '/assets/parcelas/selva_verde.png',
      },
      {
        pregunta: '¿Quiénes pueden ayudar a cuidar la Madre Tierra?',
        opciones: ['Todas las personas.', 'Solo los animales.'],
        correcta: 0,
        explicacion: 'Los animales forman parte de la naturaleza, pero las personas también tienen la responsabilidad de cuidarla mediante acciones como plantar árboles, ahorrar agua y no contaminar.',
        lugar: 'Jardín del Pueblo',
        imgSeca: '/assets/parcelas/jardin_seco.png',
        imgVerde: '/assets/parcelas/jardin_verde.png',
      },
    ],
  },
};
