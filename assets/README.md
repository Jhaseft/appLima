# Assets

```
assets/
  fonts/    → tipografía Lemon Milk Pro (ver fonts/README.md)
  images/   → imágenes EN USO
```

## images/ — en uso

| Archivo                          | Formato | Dónde se usa                                                        |
| -------------------------------- | ------- | ------------------------------------------------------------------ |
| `Logo_web_03.webp`               | WebP    | `Login/LoginHeader`, `UserDropdown/HeaderUser`                     |
| `logo.webp`                      | WebP    | `VersionGuard`                                                      |
| `logopro2.webp`                  | WebP    | Avatar del bot en `Chat`                                           |
| `logopro2nobg.webp`              | WebP    | `AnimatedSplash` (splash animado en runtime)                      |
| `logopro2.png`                   | PNG     | Ícono de la app (`app.json`) — las stores exigen PNG 1024²         |
| `logopro2nobg.png`               | PNG     | Splash nativo y favicon web (`app.json`) — Expo exige PNG          |
| `notificationiconnobgorig.png`   | PNG     | Ícono de notificaciones (`app.json`, plugin expo-notifications)    |

## Reglas

- Toda imagen **de UI** (usada con `require()`/`import` dentro de componentes) va en
  WebP. Solo se usan PNG donde Expo lo exige: `icon`, `splash.image` y el ícono de
  notificaciones en `app.json`.
- Toda imagen nueva va en `images/` y se referencia como `assets/images/<archivo>`.
- Para optimizar/convertir imágenes hay un script: `node scripts/optimize-assets.mjs`
  (usa `sharp`, devDependency). Ajusta anchos/calidad ahí si agregas assets.
