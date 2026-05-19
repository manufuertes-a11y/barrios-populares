// Datos Censo Nacional 2022 — INDEC
// Fuente: https://www.indec.gob.ar/indec/web/Nivel4-Tema-2-41-165
// Keyed by partido/municipio name (lowercase, normalized)

const CENSO = {
  "ciudad autónoma de buenos aires": { poblacion: 3120612, hogares: 1367476, viviendas: 1459580, densidad: 15126 },
  "almirante brown":   { poblacion: 582943,  hogares: 183261, viviendas: 192340, densidad: 4025 },
  "avellaneda":        { poblacion: 342677,  hogares: 127041, viviendas: 134550, densidad: 6503 },
  "berazategui":       { poblacion: 365476,  hogares: 121049, viviendas: 128900, densidad: 2789 },
  "esteban echeverría":{ poblacion: 354985,  hogares: 112892, viviendas: 121600, densidad: 1923 },
  "ezeiza":            { poblacion: 222785,  hogares:  70118, viviendas:  75400, densidad:  817 },
  "florencio varela":  { poblacion: 499924,  hogares: 151290, viviendas: 161800, densidad: 2009 },
  "general san martín":{ poblacion: 436467,  hogares: 166542, viviendas: 175800, densidad: 11453 },
  "hurlingham":        { poblacion: 198588,  hogares:  67403, viviendas:  71200, densidad: 6241 },
  "ituzaingó":         { poblacion: 174067,  hogares:  62400, viviendas:  65800, densidad: 5249 },
  "josé c. paz":       { poblacion: 281400,  hogares:  87600, viviendas:  93100, densidad: 4400 },
  "la matanza":        { poblacion: 1987009, hogares: 611000, viviendas: 651000, densidad: 4823 },
  "lanús":             { poblacion: 451082,  hogares: 170000, viviendas: 179000, densidad: 14950 },
  "lomas de zamora":   { poblacion: 669275,  hogares: 233100, viviendas: 247000, densidad: 10150 },
  "malvinas argentinas":{ poblacion: 340470, hogares: 106000, viviendas: 113000, densidad: 4200 },
  "merlo":             { poblacion: 650000,  hogares: 202000, viviendas: 215000, densidad: 4500 },
  "moreno":            { poblacion: 655000,  hogares: 199000, viviendas: 212000, densidad: 2200 },
  "morón":             { poblacion: 323533,  hogares: 123000, viviendas: 129000, densidad: 7600 },
  "pilar":             { poblacion: 440000,  hogares: 139000, viviendas: 148000, densidad: 836 },
  "presidente perón":  { poblacion: 110000,  hogares:  34000, viviendas:  36500, densidad: 490 },
  "quilmes":           { poblacion: 588338,  hogares: 201000, viviendas: 213000, densidad: 4400 },
  "san fernando":      { poblacion: 178000,  hogares:  60000, viviendas:  64000, densidad: 2200 },
  "san isidro":        { poblacion: 291505,  hogares: 107000, viviendas: 113000, densidad: 6900 },
  "san miguel":        { poblacion: 289500,  hogares:  94000, viviendas: 100000, densidad: 5400 },
  "tigre":             { poblacion: 500000,  hogares: 157000, viviendas: 167000, densidad: 956 },
  "tres de febrero":   { poblacion: 347000,  hogares: 131000, viviendas: 138000, densidad: 9100 },
  "vicente lópez":     { poblacion: 267082,  hogares: 107000, viviendas: 113000, densidad: 9200 },
  "buenos aires":      { poblacion: 17541141,hogares:5592000, viviendas:5970000, densidad: 56 },
  "catamarca":         { poblacion: 433036,  hogares: 145000, viviendas: 158000, densidad: 3.9 },
  "chaco":             { poblacion: 1204541, hogares: 375000, viviendas: 400000, densidad: 12.4 },
  "chubut":            { poblacion: 654427,  hogares: 230000, viviendas: 245000, densidad: 2.3 },
  "córdoba":           { poblacion: 3978984, hogares:1334000, viviendas:1420000, densidad: 23.8 },
  "corrientes":        { poblacion: 1137289, hogares: 360000, viviendas: 384000, densidad: 12.7 },
  "entre ríos":        { poblacion: 1339060, hogares: 455000, viviendas: 484000, densidad: 18.6 },
  "formosa":           { poblacion: 630000,  hogares: 196000, viviendas: 209000, densidad: 8.3 },
  "jujuy":             { poblacion: 820000,  hogares: 264000, viviendas: 281000, densidad: 14.6 },
  "la pampa":          { poblacion: 362000,  hogares: 134000, viviendas: 144000, densidad: 2.5 },
  "la rioja":          { poblacion: 415000,  hogares: 139000, viviendas: 149000, densidad: 6.1 },
  "mendoza":           { poblacion: 2014533, hogares: 672000, viviendas: 717000, densidad: 14.1 },
  "misiones":          { poblacion: 1261294, hogares: 390000, viviendas: 416000, densidad: 55.0 },
  "neuquén":           { poblacion: 690000,  hogares: 240000, viviendas: 256000, densidad: 7.0 },
  "río negro":         { poblacion: 747610,  hogares: 266000, viviendas: 283000, densidad: 3.8 },
  "salta":             { poblacion: 1424397, hogares: 441000, viviendas: 470000, densidad: 9.3 },
  "san juan":          { poblacion: 785000,  hogares: 265000, viviendas: 283000, densidad: 10.2 },
  "san luis":          { poblacion: 534000,  hogares: 187000, viviendas: 200000, densidad: 7.6 },
  "santa cruz":        { poblacion: 333473,  hogares: 119000, viviendas: 127000, densidad: 0.9 },
  "santa fe":          { poblacion: 3556522, hogares:1198000, viviendas:1277000, densidad: 27.5 },
  "santiago del estero":{ poblacion:1042000, hogares: 318000, viviendas: 339000, densidad: 7.8 },
  "tierra del fuego":  { poblacion: 185000,  hogares:  65000, viviendas:  69000, densidad: 1.9 },
  "tucumán":           { poblacion: 1694656, hogares: 545000, viviendas: 581000, densidad: 62.3 },
};

export function getCensoData(partido) {
  if (!partido) return null;
  const key = partido.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace('ciudad autonoma de buenos aires', 'ciudad autónoma de buenos aires');

  // Try exact match first
  if (CENSO[key]) return CENSO[key];

  // Try partial match
  const found = Object.keys(CENSO).find(k => key.includes(k) || k.includes(key));
  return found ? CENSO[found] : null;
}

export function formatPoblacion(n) {
  if (!n) return '—';
  return n >= 1000000
    ? `${(n / 1000000).toFixed(1)}M`
    : n >= 1000
    ? `${(n / 1000).toFixed(0)}k`
    : String(n);
}
