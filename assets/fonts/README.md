# Fuente Lemon Milk Pro

La app usa **Lemon Milk Pro** como tipografía principal (la versión Pro incluye
minúsculas; la gratis de dafont es solo mayúsculas).

## Archivos (4 pesos, sin itálicas)

Nombres EXACTOS que esperan los `require(...)` de `app/_layout.jsx`:

- `lemon-milk-pro-ftr-ultralight.otf`  → clase `font-lm-light`
- `lemon-milk-pro-ftr-regular.otf`     → clase `font-sans` (base)
- `lemon-milk-pro-ftr-medium.otf`      → clase `font-lm-medium`
- `lemon-milk-pro-ftr-bold.otf`        → clase `font-lm-bold`

Si falta alguno, `useFonts` no resolverá y la app quedará en el splash.
