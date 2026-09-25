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
  o `components/services/` (ej. `useLoginHandlers`, `authApi`, `SocialButtons`).

**Regla de oro — código corto siempre.** Odiamos el código largo. Si un `.jsx` se pasa de
~120 líneas o mezcla lógica de negocio + UI, **de una** se vuelve orquestador: la lógica
(estado, efectos, fetch, guardado) baja a `hooks/`, los datos a `services/`, y la UI se parte
en subcomponentes pequeños y reutilizables. El `.jsx` solo compone.

Esto aplica a **todo** JSX, no solo a las rutas:

- **Modales** (`components/Modales/*`) también son orquestadores: su lógica vive en
  `components/Modales/hooks/` (`useFormBancaria`, `useFormDestino`, `useGuardarQR`,
  `useGuardarCuenta`, `useBancos`) y `components/Modales/services/` (`cuentasModalApi`). El
  modal solo lee `const f = useForm...()` y pinta. Piezas repetidas → componente reutilizable
  (ej. `ToggleSwitch`, `BankSelect`). Son "orquestadores" que dependen del orquestador padre
  (ej. `app/(tabs)/Cuentas.jsx`), que les pasa `user` y callbacks (`onCuentaGuardada`).
- Antes de escribir un componente nuevo, revisa si ya existe un hook/subcomponente que reusar.

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
- [ ] En inicio/login/registro: peticiones con `apiFetch` y sin spinner/`loading` local (lo cubre el loader).

---

## 6. Peticiones al backend — loader (solo inicio, login y registro)

El loader global (`LoadingOverlay`, animación Lottie a pantalla completa que **bloquea
todos los toques**) **NO** intercepta todas las peticiones. Se aplica **solo** en los
flujos de **inicio, login y registro**, usando `apiFetch`:

```js
import { apiFetch } from "../services/apiFetch"; // ajustar ruta relativa
const res = await apiFetch(`${API_BASE_URL}/api/...`, { method: "POST", body });
```

- `apiFetch` enciende/apaga el loader (`start`/`done`) alrededor del `fetch`; se apaga
  solo al terminar (éxito o error).
- El overlay ya está montado una vez en `app/_layout.jsx`. No montar otro.
- Petición de fondo que **no** debe bloquear la UI: `apiFetch(url, { silent: true })`.

Dónde está aplicado hoy:

| Flujo    | Archivo                                   |
| -------- | ----------------------------------------- |
| Inicio   | `ContextUser/UserContext.jsx` (`fetchUser`) |
| Login    | `services/authApi.js`                     |
| Registro | `Register/services/registerApi.js`, `CompleteProfile/services/profileApi.js` |

### En esos flujos: sin spinners/`loading` propios

En inicio/login/registro **no** agregar spinner ni estado `loading` local para la
petición (`disabled={loading}`, `ActivityIndicator`): lo cubre el loader global y sobra.
El resto de módulos (aún no migrados) conservan su `loading` local como antes.

## 7. Estado de migración

| Módulo               | Estado      |
| -------------------- | ----------- |
| Base (config + font) | ✅ hecho     |
| Inicio (`app/index`) | ✅ hecho     |
| Login                | ✅ hecho     |
| Register             | ✅ hecho     |
| Home                 | ✅ hecho     |
| Cuentas              | ✅ hecho     |
| Transferencias       | ✅ hecho     |
| TcPuntos             | ✅ hecho     |
| MiCuenta             | ✅ hecho     |
| Chat                 | ✅ hecho     |
| Historial            | ✅ hecho     |
| Políticas / FAQ      | ✅ hecho     |

Leyenda: ⬜ pendiente · 🟨 en progreso · ✅ hecho

---

## 8. Skeleton loading (carga)

**Regla:** todo skeleton loading se construye a partir de `Bone`
(`components/Home/Bone.jsx`). **Prohibido** crear placeholders sueltos con opacidad,
`ActivityIndicator` como "esqueleto", ni animaciones propias por pantalla. Una sola
pieza, un solo estilo.

`Bone` es un bloque con **shimmer tipo "ventana de luz"**: una banda que barre en
horizontal (blanco con halo `primary`) sobre base gris (`colors.border`), en bucle y con
`useNativeDriver`. Recibe solo `className` (tamaño/redondeo) y `style` (medidas dinámicas).

```jsx
import Bone from "../Home/Bone"; // ajustar ruta relativa

<Bone className="w-40 h-5 rounded-md" />
<Bone className="rounded-3xl h-28" style={{ width: cardW }} />
```

Cómo armar el skeleton de un módulo nuevo:

- Un componente `<Feature>Skeleton.jsx` que **solo** compone `Bone`s con la misma
  silueta/medidas que la UI real (mismos alto/ancho/redondeo).
- El componente presentacional decide: `if (loading || !data) return <FeatureSkeleton />`.
- No cambiar la animación dentro del skeleton: si el shimmer debe mejorar, se toca
  **`Bone`** y todos heredan. Ejemplos vivos: `GraficoSkeleton`, `StatsSkeleton`,
  y el placeholder de `BannerCarousel`.

---

## 9. Loading de mutaciones (crear / eliminar / actualizar)

**Regla:** toda acción que **muta** datos (crear, eliminar, actualizar, subir) usa el
overlay estándar `ActionOverlay` (`components/ActionOverlay.jsx`). **Prohibido** poner
spinners por botón (`ActivityIndicator` dentro del botón) o estados de carga inline: eso
provoca que se "activen" varios botones a la vez y da un feedback pobre. Una sola pieza.

`ActionOverlay` es un **View absoluto (NO Modal)** con velo oscuro, spinner y mensaje, que
**bloquea los toques** mientras dura la acción. **Importante:** no se usa `Modal` nativo para
esto — apilar Modals en iOS deja una capa fantasma que bloquea todo el touch. Es distinto de:

- `Bone` / skeleton → **lectura** de datos (carga inicial y pull-to-refresh). Ver sección 8.
- `LoadingOverlay` global (Lottie) → solo **inicio / login / registro** vía `apiFetch`. Ver
  sección 6.

Dos formas de usarlo:

- **A nivel de pantalla** (cubrir header + tabs): usar `feedback.withLoading(mensaje, task)`,
  que monta el overlay desde la raíz (por encima del navegador). Ver sección 10.

  ```jsx
  await feedback.withLoading("Eliminando cuenta...", () => bancarias.eliminar(id));
  ```

- **Dentro de un Modal** (los overlays de raíz no tapan una ventana Modal nativa): montar
  `ActionOverlay` como hijo del Modal y cubrirlo:

  ```jsx
  import ActionOverlay from "../ActionOverlay"; // ajustar ruta relativa
  <ActionOverlay visible={loading} mensaje="Guardando cuenta..." />
  ```

Ejemplos vivos: borrado en `app/(tabs)/Cuentas.jsx` (`withLoading`) y el guardado de
`ModalCuentaBancaria`, `ModalCuentaDestino`, `ModalCuentaQR` (`ActionOverlay` dentro del modal).

---

## 10. Feedback: mensajes y confirmaciones (nada de `Alert`)

**Regla:** **prohibido** usar `Alert` de React Native. Todo mensaje (éxito / error / info)
y toda confirmación usan el sistema único `useFeedback` (`components/Feedback/`), montado
una vez en `app/_layout.jsx` con `<FeedbackProvider>`. Un solo modal (`FeedbackModal`) con
tokens; cambiar el look = tocar `FeedbackModal` y todos heredan.

```jsx
import { useFeedback } from "../Feedback/FeedbackContext"; // ajustar ruta relativa
const feedback = useFeedback();

feedback.success("Cuenta guardada correctamente");
feedback.error("No se pudo eliminar la cuenta");
feedback.info("TransferCash estará disponible en varios idiomas.", { title: "Muy pronto" });

// Confirmación: devuelve Promise<boolean>
const ok = await feedback.confirm({
  title: "Eliminar cuenta",
  message: "¿Estás seguro de eliminar esta cuenta?",
  confirmText: "Eliminar",
  destructive: true,
});
if (ok) { /* ... */ }
```

- `success` / `error` / `info` reciben `(mensaje, { title })` y devuelven `Promise` (resuelve
  al cerrar) — útil para navegar después: `await feedback.success(...); router.replace(...)`.
- `confirm({ title, message, confirmText, cancelText, destructive })` → `Promise<boolean>`.
- `withLoading(mensaje, task)` → corre `task()` mostrando el overlay de carga a pantalla
  completa (sección 9). Ej.: `await feedback.withLoading("Eliminando...", () => api())`.
- Se usa igual desde componentes, hooks (login/registro/preferencias) y handlers async.
- No confundir con `ActionOverlay` (sección 9, carga de mutaciones) ni con skeletons
  (sección 8, lectura). Feedback = resultado/decisión; overlay = progreso.

---

## 11. Notas técnicas

- Rutas en `app/` con extensión `.jsx`; imports sin extensión (expo-router resuelve por nombre).
- Modales tipo **hoja inferior**: usar `components/BottomSheet.jsx` (entra deslizando y se
  cierra arrastrando el asa hacia abajo o tocando el velo). Contenido como hijo (un `ScrollView`
  con `max-h-[...]`); overlays a pantalla completa (ej. `ActionOverlay`) via prop `overlay`.
- SVG como componentes: `react-native-svg-transformer` está configurado en `metro.config.js`.
- Imágenes en `assets/images/` (en uso) y `assets/unused/` (candidatas a borrar); ver `assets/README.md`.
- Tras cambios en `tailwind.config.js`, `metro.config.js` o fuentes: reiniciar con `npx expo start -c`.
- El loader global usa `lottie-react-native` (módulo nativo) + `assets/animations/loader.json`.
  Al agregarlo hubo que **reconstruir el dev client** (`npx expo run:android`/`run:ios`), no basta `expo start -c`.
