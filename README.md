# Barrios Populares · ReNaBaP

Mapa interactivo de barrios populares (asentamientos informales) de Argentina, usando datos oficiales del [Registro Nacional de Barrios Populares (ReNaBaP)](https://www.argentina.gob.ar/habitat/integracion-socio-urbana/renabap).

## Stack

- React 19 + Vite 8
- Leaflet / react-leaflet — mapa con polígonos reales
- CartoDB Dark Matter — tiles oscuros
- Nominatim (OSM) — geocodificación sin API key
- GitHub Pages — hosting

## Funcionalidades

- ~6.000 barrios populares como polígonos sobre el mapa
- Buscador de dirección + botón GPS para ubicarte
- Info detallada al tocar un polígono (drawer desde abajo)
- Acceso a servicios: agua, luz, cloacas con indicadores visuales
- Capas opcionales: hospitales y comisarías (datos OSM)
- Caché offline en localStorage

## Datos

Fuente: **ReNaBaP · Secretaría de Integración Socio Urbana · SISU Argentina**

## Desarrollo

```bash
npm install
npm run dev
```

## Deploy en GitHub Pages

1. Crear el repositorio en GitHub
2. En `vite.config.js`, cambiar `/REPO_NAME/` por el nombre real del repo
3. Agregar el remote: `git remote add origin https://github.com/TU_USUARIO/REPO_NAME.git`
4. `npm run deploy`
