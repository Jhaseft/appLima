# Guía de Estilo y Arquitectura — SDC Transferencias

> Documento vivo. Toda pantalla/módulo nuevo o refactorizado **debe** cumplir estas reglas.
> Avanzamos **módulo por módulo**: cada vez que se toque un módulo, se deja alineado con esta guía.

---

## 1. Principios

1. **Una sola tipografía** en toda la app: **Lemon Milk**.
2. **Fondo blanco** (`#FFFFFF`) como base de todas las pantallas.
3. **Amarillo** como único color de acento (el actual `yellow-400 = #FACC15`).
4. **Colores centralizados** en `tailwind.config.js` y reutilizados por toda la app vía clases NativeWind. Prohibido inventar hex sueltos.
5. **Código corto y legible**: componentes pequeños, una responsabilidad cada uno.
6. **Separación por feature**: `components/ → hooks/ → services/`.

---

## 2. Colores (tokens)

Definidos en `tailwind.config.js` → `theme.extend.colors`. **Siempre** usar el token, nunca el hex directo.

| Token             | Hex       | Uso                                    |
| ----------------- | --------- | -------------------------------------- |
| `primary`         | `#FACC15` | Acento principal (botones, activos)    |
| `primary-dark`    | `#CA8A04` | Íconos/acentos sobre fondo claro       |
| `primary-accent`  | `#EAB308` | Bordes, textos de énfasis amarillo     |
| `primary-light`   | `#FEF9C3` | Fondos suaves (chips, badges)          |
| `background`      | `#FFFFFF` | Fondo de pantallas                     |
| `surface`         | `#F9FAFB` | Tarjetas / secciones                   |
| `text`            | `#111827` | Texto principal                        |
| `text-muted`      | `#6B7280` | Texto secundario / placeholders        |
| `success`         | `#16A34A` | Estados de éxito                       |
| `danger`          | `#DC2626` | Errores / acciones destructivas        |

Config esperada:

```js
// tailwind.config.js → theme.extend
colors: {
  primary: { DEFAULT: "#FACC15", light: "#FEF9C3", accent: "#EAB308", dark: "#CA8A04" },
  background: "#FFFFFF",
  surface: "#F9FAFB",
  text: { DEFAULT: "#111827", muted: "#6B7280" },
  success: "#16A34A",
  danger: "#DC2626",
},
```

Uso en componentes:

```jsx
<View className="bg-background">
  <Text className="text-text">Título</Text>
  <TouchableOpacity className="bg-primary rounded-xl">…</TouchableOpacity>
</View>
```

Para props que piden color en JS (íconos `lucide`, `ActivityIndicator`, SVG) usar el token exportado desde un solo lugar, no el hex:

```js
// theme/colors.js
export const colors = {
  primary: "#FACC15", primaryDark: "#CA8A04", primaryAccent: "#EAB308",
  text: "#111827", textMuted: "#6B7280", success: "#16A34A", danger: "#DC2626",
};
```

```jsx
import { colors } from "@/theme/colors";
<Plus size={20} color={colors.text} />
```

---

## 3. Tipografía — Lemon Milk Pro

Se usa **Lemon Milk Pro** (incluye minúsculas; la gratis es solo mayúsculas).
Archivos en `assets/fonts/` (4 pesos, sin itálicas):
`lemon-milk-pro-ftr-ultralight.otf`, `-regular.otf`, `-medium.otf`, `-bold.otf`.

Cargar **una sola vez** en `app/_layout.jsx` con `expo-font`:

```js
import { useFonts } from "expo-font";

const [fontsLoaded] = useFonts({
  "LemonMilkPro-Light":  require("../assets/fonts/lemon-milk-pro-ftr-ultralight.otf"),
  LemonMilkPro:          require("../assets/fonts/lemon-milk-pro-ftr-regular.otf"),
  "LemonMilkPro-Medium": require("../assets/fonts/lemon-milk-pro-ftr-medium.otf"),
  "LemonMilkPro-Bold":   require("../assets/fonts/lemon-milk-pro-ftr-bold.otf"),
});
if (!fontsLoaded) return null; // el splash sigue visible hasta cargar
```

Mapear a Tailwind para usarlas como clases:

```js
// tailwind.config.js → theme.extend
fontFamily: {
  sans:        ["LemonMilkPro"],        // font-sans      → Regular (cuerpo)
  "lm-light":  ["LemonMilkPro-Light"],  // font-lm-light  → UltraLight
  "lm-medium": ["LemonMilkPro-Medium"], // font-lm-medium → énfasis
  "lm-bold":   ["LemonMilkPro-Bold"],   // font-lm-bold   → títulos/botones
},
```

> Nota: NO se usan claves `light/medium/bold` porque **chocan** con las utilidades
> de peso de Tailwind (`font-bold`, etc.) y el resultado es ambiguo. Por eso el prefijo `lm-`.

Reglas:

- Texto normal: `font-sans`. Énfasis: `font-lm-medium`. Títulos: `font-lm-bold`. Fino: `font-lm-light`.
- **No** usar `font-semibold`/`font-black`/`font-extrabold` de Tailwind (dan peso pero NO cargan Lemon Milk). Usar las clases de arriba.
- Lemon Milk es display (mayúsculas fuertes): mantener tamaños cómodos y evitar párrafos largos.

---

## 4. Estructura por módulo (feature)

Cada feature se organiza así (código corto, cada archivo una responsabilidad):

```
components/<Feature>/
  <Feature>.jsx        # UI compositora (arma la pantalla, poco lógica)
  <SubComponente>.jsx  # piezas pequeñas y reutilizables
  hooks/
    use<Feature>.js    # estado + lógica de UI (sin fetch directo)
  services/
    <feature>Service.js# llamadas API / datos (sin JSX)
```

Responsabilidades:

- **components/**: solo presentación. Reciben datos y callbacks por props.
- **hooks/**: estado, efectos y orquestación. Devuelven datos + handlers.
- **services/**: acceso a datos (API en `components/api.js`), transformaciones. Nada de React aquí.

Regla de tamaño: si un componente pasa de ~120 líneas o mezcla fetch + UI, se parte.

### Comentarios en el JSX

**Prohibido comentar dentro del `return` de un componente.** Nada de:

```jsx
return (
  <View>
    {/* Logo con borde blanco sutil */}   ❌
    <Logo />
  </View>
);
```

El JSX debe leerse solo. Si algo necesita explicación, va en un comentario **arriba
de la función/hook**, o se extrae a un subcomponente con nombre claro (ej. `<Logo />`).

---

## 5. Checklist antes de dar por hecho un módulo

- [ ] Fondo blanco (`bg-background`), sin fondos negros/heredados.
- [ ] Solo `font-*` de Lemon Milk; ningún `fontFamily` suelto.
- [ ] Cero hex hardcodeado: colores vía token (clase Tailwind o `theme/colors.js`).
- [ ] Amarillo = `primary`; nada de amarillos distintos al token.
- [ ] Lógica en `hooks/`, datos en `services/`, UI en `components/`.
- [ ] Componentes pequeños y reutilizables; sin duplicar lo que ya existe.
- [ ] Sin comentarios dentro del `return`/JSX (ej. `{/* ... */}`).

---
