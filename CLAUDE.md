# MercaFit — Instrucciones de proyecto

## Deploy

Cuando el usuario pida aplicar, subir o ejecutar un cambio:

1. Aplicar los cambios en el código
2. `npm run build` — verificar que compila sin errores
3. `git add <archivos modificados>`
4. `git commit -m "..."` con mensaje descriptivo
5. `git push origin main`
6. `npm run deploy` — publica en GitHub Pages

Hacerlo todo en un solo bloque secuencial. No esperar confirmación entre pasos.

## Stack

- React + Vite
- Sin librerías externas salvo la API de Anthropic
- Deploy: GitHub Pages vía `gh-pages`
- Base path: `/BuyingApp/`

## API

- Endpoint: `https://api.anthropic.com/v1/messages`
- Modelo: `claude-haiku-4-5-20251001`
- `max_tokens`: 800
- `tool_choice: { type: 'any' }` — forzar uso de web_search
- La API key vive solo en `localStorage`, nunca en el repo

## Estado global

- `aiResult`, `aiLoading`, `aiError` definidos en `App.jsx` y pasados como props a `ListaIA`
- Nunca definir ese estado dentro de `ListaIA`
