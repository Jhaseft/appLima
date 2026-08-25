# Assets

```
assets/
  fonts/    → tipografía Lemon Milk Pro (ver fonts/README.md)
  images/   → imágenes EN USO
  unused/   → imágenes sin referencias (candidatas a borrar)
```

## images/ — en uso

| Archivo                          | Dónde se usa                                                                 |
| -------------------------------- | --------------------------------------------------------------------------- |
| `Logo_web_03.png`                | Inicio (`WelcomeHero`), `Login`, `Register`, `UserDropdown/HeaderUser`       |
| `logo.png`                       | `VersionGuard`                                                               |
| `logopro2.png`                   | Ícono de la app (`app.json`) y avatar del bot en `Chat`                      |
| `logopro2nobg.png`               | Splash y favicon web (`app.json`)                                            |
| `notificationiconnobgorig.png`   | Ícono de notificaciones (`app.json`, plugin expo-notifications)              |

## unused/ — sin referencias

`Logo_Web_02.png`, `Logo_Web_cjmgei.png`, `Portada_Web_dojpcy.png`, `TCpunto.svg`
(el ícono TC se dibuja inline en `TcPuntoIcon.jsx`), `Texto_logo_2.png`,
`cuadrado.png`, `logo-splash.png`, `logopro.png`, `notificationiconnobg.png`.

Se pueden borrar cuando confirmes que no las necesitas.

## Regla

Toda imagen nueva va en `images/` y se referencia como `assets/images/<archivo>`.
Si deja de usarse, se mueve a `unused/`.
