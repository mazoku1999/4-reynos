import type { Metadata } from "next";
import { ProveedorJuego } from "@/contexto/ProveedorJuego";
import "./globals.css";

/**
 * Layout raíz — Envuelve toda la app con:
 * - ProveedorJuego (estado global persistente)
 * - Google Fonts (Press Start 2P, MedievalSharp, Crimson Text)
 * - Metadata SEO
 * - Skip link y live region para accesibilidad
 */

export const metadata: Metadata = {
  title: "Los 4 Reinos — Juego Educativo",
  description: "Aprende sobre los saberes de la cosmovisión andina a través de 4 reinos: Cóndor, Puma, Capibara y Quirquincho.",
  keywords: ["educación", "cosmovisión andina", "juego educativo", "Bolivia", "4 reinos"],
};

export default function LayoutRaiz({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400&family=MedievalSharp&family=Press+Start+2P&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {/* Skip link — primera parada con Tab */}
        <a href="#contenido-principal" className="saltar-contenido">
          Saltar al contenido principal
        </a>

        {/* Región de anuncios para lectores de pantalla */}
        <div
          id="anuncio-sr"
          className="anuncio-sr"
          aria-live="polite"
          aria-atomic="true"
          role="status"
        />

        <ProveedorJuego>
          <main id="contenido-principal" role="main">
            {children}
          </main>
        </ProveedorJuego>
      </body>
    </html>
  );
}
