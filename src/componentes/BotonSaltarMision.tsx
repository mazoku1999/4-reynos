'use client';

/**
 * BotonSaltarMision — Botón pixel art reutilizable para saltar/salir de la misión.
 * Se usa en TODAS las pantallas de juego con diseño y posición consistente.
 */

interface Props {
  onClick: () => void;
  texto?: string;
}

export default function BotonSaltarMision({ onClick, texto = 'SALTAR' }: Props) {
  return (
    <button
      className="btn-saltar-mision"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      aria-label="Saltar misión y volver al mapa"
    >
      <span className="bsm-icon" aria-hidden="true" />
      <span className="bsm-text">{texto}</span>
    </button>
  );
}
