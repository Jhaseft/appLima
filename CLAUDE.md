# Transfer Cash — Guía de Estilo y Arquitectura

App Expo (expo-router) + NativeWind + react-native-svg. Este archivo es la fuente de
verdad de **cómo se construye y se ve la app**. Todo módulo nuevo o refactorizado
**debe** cumplir estas reglas. Avanzamos **módulo por módulo**.

---

## 1. Principios

1. **Una sola tipografía**: Lemon Milk Pro.
2. **Fondo blanco** (`bg-background`) como base de todas las pantallas.
3. **Amarillo** (`primary = #FACC15`) como único color de acento.
4. **Colores centralizados** en `tailwind.config.js` + `theme/colors.js`. Prohibido hex suelto.
5. **Código corto y legible**: componentes pequeños, una responsabilidad cada uno.
6. **Separación por feature**: `components/ → hooks/ → services/`.
7. **Orquestador en la ruta**: el archivo de `app/*.jsx` usa los hooks y compone la UI;
   no es un wrapper que llama a otro "orquestador".
8. **Sin comentarios dentro del JSX** (nada de `{/* ... */}` en el `return`).

---

## 2. Colores (tokens)

Definidos en `tailwind.config.js → theme.extend.colors`. Usar siempre el token.

| Token            | Hex       | Uso                              |
| ---------------- | --------- | -------------------------------- |
| `primary`        | `#FACC15` | Acento (botones, activos)        |
| `primary-dark`   | `#CA8A04` | Íconos/enlaces sobre fondo claro |
| `primary-accent` | `#EAB308` | Bordes/énfasis amarillo          |
| `primary-light`  | `#FEF9C3` | Fondos suaves (chips, dots)      |
| `background`     | `#FFFFFF` | Fondo de pantallas               |
| `surface`        | `#F9FAFB` | Tarjetas / secciones             |
| `text`           | `#111827` | Texto principal                  |
| `text-muted`     | `#6B7280` | Texto secundario / placeholders  |
| `success`        | `#16A34A` | Éxito                            |
| `danger`         | `#DC2626` | Errores / destructivo            |

En clases: `bg-primary`, `text-text`, `text-text-muted`, `border-primary`, `bg-background`…

Para props JS (íconos `lucide`/`@expo/vector-icons`, `ActivityIndicator`, SVG) usar el
token de `theme/colors.js` (**ruta relativa**, no hay alias `@`):

```jsx
import { colors } from "../../theme/colors";
<Ionicons name="eye" size={24} color={colors.textMuted} />
```

---

## 3. Tipografía — Lemon Milk Pro

Archivo en `assets/fonts/`: `lemon-milk-pro-ftr-{ultralight,regular,medium,bold}.otf`.
Se cargan una sola vez en `app/_layout.jsx` con `useFonts` (splash hasta cargar).

Clases (mapeadas en `tailwind.config.js`, con prefijo `lm-` para no chocar con los pesos de Tailwind):

- `font-sans` → Regular (cuerpo, por defecto)
- `font-lm-light` → UltraLight (subtítulos finos)
- `font-lm-medium` → Medium (énfasis)
- `font-lm-bold` → Bold (títulos, botones)

**No** usar `font-semibold`/`font-black`/`font-extrabold` (dan peso pero NO cargan la fuente).

---

## 4. Estructura por módulo (feature)

```
app/<Ruta>.jsx            # orquestador: usa hooks + compone la UI
components/<Feature>/
  <SubComponente>.jsx     # piezas presentacionales pequeñas (props in)
  hooks/use<Algo>.js      # estado, efectos, orquestación (sin fetch directo)
  services/<algo>Api.js   # fetch / datos (sin JSX)
  data/<algo>.js          # constantes/datos estáticos
```

- **components/**: solo presentación. Reciben datos y callbacks por props.
- **hooks/**: estado y orquestación; devuelven datos + handlers.
- **services/**: acceso a datos (API base en `components/api.js`). Nada de React.
- Cosas compartidas entre features viven en `components/` (raíz), `components/hooks/`
  o `components/services/` (ej. `useLoginHandlers`, `authApi`, `GoogleBoton`).

Regla de tamaño: si un archivo pasa de ~120 líneas o mezcla fetch + UI, se parte.

**Comentarios en JSX prohibidos.** Si algo necesita explicación, va en un comentario
arriba de la función/hook, o se extrae a un subcomponente con nombre claro.

---

## 5. Checklist por módulo

- [ ] Orquestador en `app/*.jsx`; lógica en `hooks/`, datos en `services/`.
- [ ] Fondo `bg-background`; sin fondos negros heredados.
- [ ] Solo `font-*` de Lemon Milk; ningún `fontFamily` suelto.
- [ ] Cero hex hardcodeado: tokens (clase Tailwind o `theme/colors.js`).
- [ ] Amarillo = `primary`; nada de azules/negros de acento viejos.
- [ ] Componentes pequeños y reutilizables; sin duplicar lo existente.
- [ ] Sin comentarios dentro del `return`/JSX.

---

## 6. Estado de migración

| Módulo               | Estado      |
| -------------------- | ----------- |
| Base (config + font) | ✅ hecho     |
| Inicio (`app/index`) | ✅ hecho     |
| Login                | ✅ hecho     |
| Register             | ✅ hecho     |
| Home                 | ⬜ pendiente |
| Cuentas              | ⬜ pendiente |
| Transferencias       | ⬜ pendiente |
| TcPuntos             | ⬜ pendiente |
| MiCuenta             | ⬜ pendiente |
| Chat                 | ⬜ pendiente |
| Historial            | ⬜ pendiente |
| Políticas / FAQ      | ⬜ pendiente |

Leyenda: ⬜ pendiente · 🟨 en progreso · ✅ hecho

---

## 7. Notas técnicas

- Rutas en `app/` con extensión `.jsx`; imports sin extensión (expo-router resuelve por nombre).
- SVG como componentes: `react-native-svg-transformer` está configurado en `metro.config.js`.
- Imágenes en `assets/images/` (en uso) y `assets/unused/` (candidatas a borrar); ver `assets/README.md`.
- Tras cambios en `tailwind.config.js`, `metro.config.js` o fuentes: reiniciar con `npx expo start -c`.
