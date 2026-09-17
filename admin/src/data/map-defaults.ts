import type { DepartmentLink } from "@/domain/entities/site-config.entity";

/*
  Datos predefinidos de puntos oficiales y distribuidores.
  Cada link tiene la coordenada del centro del departamento como valor por defecto.
  El admin puede ajustar lat/lng en el panel Mapa para posicionar exactamente cada punto.
*/

export const DEFAULT_DEPT_COORDS: Record<string, [number, number]> = {
  "Santa Cruz": [-17.78, -63.18],
  "La Paz": [-16.5, -68.15],
  "El Alto": [-16.52, -68.17],
  "Tarija": [-21.53, -64.73],
  "Potosí": [-19.58, -65.75],
  "Oruro": [-17.97, -67.15],
  "Cochabamba": [-17.38, -66.16],
  "Sacaba": [-17.41, -66.04],
  "Chuquisaca": [-19.04, -65.26],
  "Beni": [-14.83, -64.90],
  "Pando": [-11.03, -68.75],
};

export const DEFAULT_DEPARTMENT_LINKS: DepartmentLink[] = [
  // SANTA CRUZ
  { name: "Santa Cruz", googleMapsUrl: "https://maps.app.goo.gl/1SWEEPQH2wfBx7278?g_st=iwb", lat: -17.78, lng: -63.18 },
  { name: "Santa Cruz", googleMapsUrl: "https://maps.app.goo.gl/hskGWSU4EPfW5FHVA?g_st=iwb", lat: -17.78, lng: -63.18 },
  { name: "Santa Cruz", googleMapsUrl: "https://maps.app.goo.gl/gGHv6sN49gyJIMLq7?g_st=iwb", lat: -17.78, lng: -63.18 },
  { name: "Santa Cruz", googleMapsUrl: "https://maps.app.goo.gl/D6DXEbtkYhXJpsYm8", lat: -17.78, lng: -63.18 },
  { name: "Santa Cruz", googleMapsUrl: "https://maps.app.goo.gl/j4rWDzj2iwvEfWTV6", lat: -17.78, lng: -63.18 },
  // LA PAZ
  { name: "La Paz", googleMapsUrl: "https://maps.app.goo.gl/HnDiP17r5EhZ4q7r8", lat: -16.5, lng: -68.15 },
  { name: "La Paz", googleMapsUrl: "https://maps.app.goo.gl/YWhFpScR6pxztrN79_g_st=iwb", lat: -16.5, lng: -68.15 },
  // EL ALTO
  { name: "El Alto", googleMapsUrl: "https://maps.app.goo.gl/1LZI8ooN3BwdUT8f8?g_st=aw", lat: -16.52, lng: -68.17 },
  // TARIJA
  { name: "Tarija", googleMapsUrl: "https://vt.tiktok.com/ZSxtXbAo8/", tiktokUrl: "https://vt.tiktok.com/ZSxtXbAo8/", lat: -21.53, lng: -64.73 },
  // POTOSÍ - VILLAZÓN
  { name: "Potosí", googleMapsUrl: "https://maps.app.goo.gl/wFcDHpD48xbokCLv9?g_st=iwb", lat: -19.58, lng: -65.75 },
  { name: "Potosí", googleMapsUrl: "https://maps.app.goo.gl/JVzJbACHC5ziIAzd9?g_st=ic", lat: -19.58, lng: -65.75 },
  // ORURO
  { name: "Oruro", googleMapsUrl: "https://maps.app.goo.gl/Fc6MGN3Qu85WrTqf8?g_st=iwb", lat: -17.97, lng: -67.15 },
  // CBBA
  { name: "Cochabamba", googleMapsUrl: "https://maps.app.goo.gl/Fc6MGN3Qu85WrTqf8?g_st=iwb", lat: -17.38, lng: -66.16 },
  { name: "Cochabamba", googleMapsUrl: "https://maps.app.goo.gl/7LQ3iCZlUFc8Xwpm9?g_st=iwb", lat: -17.38, lng: -66.16 },
  // CBBA - SACABA
  { name: "Sacaba", googleMapsUrl: "https://maps.app.goo.gl/ynVhJ1kRnDcUhDHf9?g_st=iwb", lat: -17.41, lng: -66.04 },
  // CHUQUISACA
  { name: "Chuquisaca", googleMapsUrl: "https://maps.app.goo.gl/1SWEEPQH2wfBx7278?g_st=iwb", lat: -19.04, lng: -65.26 },
  // BENI
  { name: "Beni", googleMapsUrl: "https://maps.app.goo.gl/hskGWSU4EPfW5FHVA?g_st=iwb", lat: -14.83, lng: -64.90 },
  // PANDO
  { name: "Pando", googleMapsUrl: "https://maps.app.goo.gl/gGHv6sN49gyJIMLq7?g_st=iwb", lat: -11.03, lng: -68.75 },
];

export const DEFAULT_OTHER_COUNTRY_LINKS: DepartmentLink[] = [
  // ARGENTINA - JUJUY
  { name: "Argentina - Jujuy", googleMapsUrl: "https://maps.app.goo.gl/VyqrEFBglKnKMvgD79_g_st=iwb", lat: -24.19, lng: -65.29 },
  // CHILE - IQUIQUE
  { name: "Chile - Iquique", googleMapsUrl: "https://maps.app.goo.gl/ytSVwrcf1Shpd5Qi8?g_st=iwb", lat: -20.22, lng: -70.15 },
  // DISTRIBUIDOR OFICIAL - TARIJA - BERMEJO
  { name: "Tarija - Bermejo", googleMapsUrl: "", tiktokUrl: "https://www.tiktok.com/@modacaty_?_r=1&_t=ZS-96naAGlsdR2", lat: -22.73, lng: -64.34 },
];
