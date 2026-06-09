/**
 * Utilidades de accesibilidad para el juego.
 */

/**
 * Anuncia un mensaje a lectores de pantalla vía aria-live region.
 * El mensaje aparece brevemente y luego se limpia.
 */
export function anunciarSR(mensaje: string) {
  if (typeof window === 'undefined') return;
  const region = document.getElementById('anuncio-sr');
  if (!region) return;
  region.textContent = '';
  // Forzar re-lectura con setTimeout
  setTimeout(() => {
    region.textContent = mensaje;
  }, 100);
}
