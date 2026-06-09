/**
 * assetsPreload.ts — Lista completa de todos los assets del juego.
 * Se usa en PantallaCarga para precargar TODAS las imágenes y audio
 * y evitar lag al navegar entre reinos.
 */

/** Assets globales: UI, mapa, islas, personajes */
const ASSETS_GLOBALES = [
  '/assets/title_banner.png',
  '/assets/bridge_tile.png',
  '/assets/ui/cosmos_bg.jpg',
  '/assets/ui/forest_bg.jpg',
  '/assets/ui/dialog_scroll.png',
  '/assets/ui/mission_bg.png',
  '/assets/ui/tile_alive.png',
  '/assets/ui/tile_dead.png',
  // Islas del mapa
  '/assets/isla_capibara.png',
  '/assets/isla_condor.png',
  '/assets/isla_jaguar.png',
  '/assets/isla_quirquincho.png',
  '/assets/isla_tinkuy.png',
  // Islas sprites
  '/assets/sprites_individuales/islas/islas_01.png',
  '/assets/sprites_individuales/islas/islas_02.png',
  '/assets/sprites_individuales/islas/islas_03.png',
  '/assets/sprites_individuales/islas/islas_04.png',
  '/assets/sprites_individuales/islas/islas_05.png',
  // Personajes principales
  '/assets/sprites_individuales/personajes/rey_capibara.png',
  '/assets/sprites_individuales/personajes/rey_condor.png',
  '/assets/sprites_individuales/personajes/rey_puma.png',
  '/assets/sprites_individuales/personajes/rey_puma_nuevo.png',
  '/assets/sprites_individuales/personajes/rey_puma_dialog.png',
  '/assets/sprites_individuales/personajes/rey_quirquincho.png',
];

/** Assets del Reino Quirquincho */
const ASSETS_QUIRQUINCHO = [
  // Intro cinemática
  '/assets/quirquincho/intro_fogata.png',
  '/assets/quirquincho/intro_estatua_dia_v2.png',
  '/assets/quirquincho/intro_estatua_noche_v2.png',
  '/assets/quirquincho/intro_rey.png',
  '/assets/quirquincho/intro_aldea.png',
  '/assets/quirquincho/intro_llama.png',
  // Sprites del quirquincho
  '/assets/quirquincho/quirquincho_explaining_v2.png',
  '/assets/quirquincho/quirquincho_idle_v2.png',
  '/assets/quirquincho/quirquincho_motivation_v2.png',
  '/assets/quirquincho/quirquincho_thumbs_up_v2.png',
  '/assets/quirquincho/quirquincho_celebrating.png',
  '/assets/quirquincho/quirquincho_pointing_up.png',
  '/assets/quirquincho/quirquincho_presenting.png',
  '/assets/quirquincho/quirquincho_thinking.png',
  // Fondos del juego
  '/assets/quirquincho/toborochi_bg_no_tree.png',
  '/assets/quirquincho/toborochi_tree_sprite_v2.png',
  '/assets/quirquincho/aparicion_bg.png',
  '/assets/quirquincho/fin.png',
  '/assets/quirquincho/leyenda_bg_1.png',
  '/assets/quirquincho/leyenda_bg_2.png',
  '/assets/quirquincho/leyenda_bg_3.png',
  '/assets/quirquincho/leyenda_bg_4.png',
  // Valoración fondos pixel art
  '/assets/quirquincho/px_bg_fireworks.png',
  '/assets/quirquincho/px_bg_night.png',
  '/assets/quirquincho/px_bg_sunset.png',
  '/assets/quirquincho/px_bg_toborochi.png',
  '/assets/quirquincho/px_quirquincho.png',
  // Fondos originales (usados como fallback)
  '/assets/quirquincho/bg_fireworks.png',
  '/assets/quirquincho/bg_night_forest.png',
  '/assets/quirquincho/bg_sunset_forest.png',
  '/assets/quirquincho/bg_toborochi_sunset.png',
  // Iconos pixel
  '/assets/quirquincho/icons/book.png',
  '/assets/quirquincho/icons/check.png',
  '/assets/quirquincho/icons/crown.png',
  '/assets/quirquincho/icons/scroll.png',
  '/assets/quirquincho/icons/shield.png',
  '/assets/quirquincho/icons/star.png',
  '/assets/quirquincho/icons/sun.png',
];

/** Assets del Reino Cóndor */
const ASSETS_CONDOR = [
  '/assets/condor/arbol_seco_bg.png',
  '/assets/condor/arbol_brotando_bg.png',
  '/assets/condor/arbol_creciendo_bg.png',
  '/assets/condor/arbol_florecido_bg.png',
  // Hojas sagradas
  '/assets/condor/hoja_agua.png',
  '/assets/condor/hoja_arbol.png',
  '/assets/condor/hoja_comunidad.png',
  '/assets/condor/hoja_condor.png',
  '/assets/condor/hoja_corazon.png',
  '/assets/condor/hoja_estrella.png',
  '/assets/condor/hoja_fuego.png',
  '/assets/condor/hoja_llama.png',
  '/assets/condor/hoja_luna.png',
  '/assets/condor/hoja_maiz.png',
  '/assets/condor/hoja_mariposa.png',
  '/assets/condor/hoja_montana.png',
  '/assets/condor/hoja_sol.png',
  '/assets/condor/hoja_viento.png',
];

/** Assets del Reino Capibara (Gemas + Mercado + Santuario) */
const ASSETS_CAPIBARA = [
  // Gemas / Laberinto
  '/assets/gemas/llama_yachay.png',
  '/assets/gemas/llama_hero.png',
  '/assets/gemas/llama.png',
  '/assets/gemas/gema.png',
  '/assets/gemas/gema_calculos.png',
  '/assets/gemas/gema_energia.png',
  '/assets/gemas/gemas.png',
  '/assets/gemas/cofre.png',
  '/assets/gemas/cofre_cerrado.png',
  '/assets/gemas/dungeon_bg.png',
  '/assets/gemas/dungeon_floor.png',
  '/assets/gemas/dungeon_wall.png',
  '/assets/gemas/estrella.png',
  '/assets/gemas/panel_inventario.png',
  '/assets/gemas/pergamino.png',
  '/assets/gemas/tablilla.png',
  '/assets/gemas/tablilla_oscura.png',
  // Mercado
  '/assets/mercado/fondo.png',
  '/assets/mercado/canasta_choclos.png',
  '/assets/mercado/canasta_papas.png',
  '/assets/mercado/canasta_tomates.png',
  // Santuario
  '/assets/santuario/santuario_bg.png',
  '/assets/santuario/santuario_completo.png',
  '/assets/santuario/pedestal.png',
  '/assets/santuario/trono.png',
  '/assets/santuario/rey_capiwara.png',
  '/assets/santuario/mosaico_gemas.png',
];

/** Assets del Reino Puma (parcelas) */
const ASSETS_PUMA = [
  '/assets/parcelas/seca.png',
  '/assets/parcelas/claro_seco.png',
  '/assets/parcelas/claro_verde.png',
  '/assets/parcelas/colina_seca.png',
  '/assets/parcelas/colina_verde.png',
  '/assets/parcelas/jardin_seco.png',
  '/assets/parcelas/jardin_verde.png',
  '/assets/parcelas/laguna_seca.png',
  '/assets/parcelas/laguna_verde.png',
  '/assets/parcelas/pradera_seca.png',
  '/assets/parcelas/pradera_verde.png',
  '/assets/parcelas/rio_seco.png',
  '/assets/parcelas/rio_verde.png',
  '/assets/parcelas/selva_seca.png',
  '/assets/parcelas/selva_verde.png',
  '/assets/parcelas/valle_seco.png',
  '/assets/parcelas/valle_verde.png',
  '/assets/parcelas/viva_1.png',
  '/assets/parcelas/viva_2.png',
  '/assets/parcelas/viva_3.png',
  '/assets/parcelas/viva_4.png',
  '/assets/parcelas/viva_5.png',
  '/assets/parcelas/viva_6.png',
  '/assets/parcelas/viva_7.png',
  '/assets/parcelas/viva_8.png',
];

/** Música de fondo del mapa */
export const MUSICA_MAPA = '/assets/musica/Telef%C3%A9rico_del_Sol.mp3';

/** Todos los assets de imágenes combinados */
export const TODOS_LOS_ASSETS: string[] = [
  ...ASSETS_GLOBALES,
  ...ASSETS_QUIRQUINCHO,
  ...ASSETS_CONDOR,
  ...ASSETS_CAPIBARA,
  ...ASSETS_PUMA,
];
