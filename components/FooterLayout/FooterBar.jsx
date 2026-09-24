import { View, TouchableOpacity, useWindowDimensions, Text } from "react-native";
import Svg, { Path } from "react-native-svg";
import { usePathname, useRouter } from "expo-router";
import { colors } from "../../theme/colors";

import CasaIcon from "../../assets/navicons/casa.svg";
import TarjetaIcon from "../../assets/navicons/tarjeta.svg";
import CambioIcon from "../../assets/navicons/cambio.svg";
import CambioActiveIcon from "../../assets/navicons/cambio-active.svg";
import ChatIcon from "../../assets/navicons/chat.svg";
import PuntosIcon from "../../assets/navicons/tc_puntos.svg";

// Barra amarilla (primary) a todo el ancho con borde superior plano y esquinas
// muy redondeadas (ovaladas), más una cuna cóncava suave en el centro donde se
// acuna el botón (Cambiar). Todo lo que queda por encima de la curva es
// transparente. El texto oscuro y el marcador activo resaltan sobre el amarillo.
//
// Se renderiza como `tabBar` del navegador de Tabs: va como overlay fuera del
// flujo (position:absolute) para que la escena ocupe todo el alto y el contenido
// pase por DETRÁS de la cuna transparente. La barra la dibuja el navegador una
// sola vez, así que persiste al cambiar de pestaña; solo cambia el contenido.

const BAR_HEIGHT = 60;     // alto visible de la barra
const BOTTOM_PAD = 8;      // respiro inferior (el root ya aplica el safe-area)
const TOP_EDGE = 8;        // y del borde superior plano de la barra
const CORNER_R = 34;       // radio ovalado de las esquinas superiores
const NOTCH_HALF = 72;     // medio ancho de la cuna central donde se acuna el botón
const NOTCH_DIP = 30;      // profundidad de la cuna respecto al borde plano
const NOTCH_TENSION = 42;  // tensión de las curvas: mayor = cuna más suave/ancha
const BUTTON_SIZE = 58;
const BUTTON_TOP = -30;    // cuánto sube el botón por encima de la barra

// Espacio inferior que cada pantalla debe reservar (paddingBottom del scroll)
// para que su contenido no quede tapado por la barra flotante.
export const FOOTER_CLEARANCE = BAR_HEIGHT + BOTTOM_PAD + 24;

function buildBarPath(w, h) {
  const cx = w / 2;
  const bottom = TOP_EDGE + NOTCH_DIP;
  return [
    `M0,${TOP_EDGE + CORNER_R}`,
    `Q0,${TOP_EDGE} ${CORNER_R},${TOP_EDGE}`,
    `L${cx - NOTCH_HALF},${TOP_EDGE}`,
    `C${cx - NOTCH_HALF + NOTCH_TENSION},${TOP_EDGE} ${cx - NOTCH_TENSION},${bottom} ${cx},${bottom}`,
    `C${cx + NOTCH_TENSION},${bottom} ${cx + NOTCH_HALF - NOTCH_TENSION},${TOP_EDGE} ${cx + NOTCH_HALF},${TOP_EDGE}`,
    `L${w - CORNER_R},${TOP_EDGE}`,
    `Q${w},${TOP_EDGE} ${w},${TOP_EDGE + CORNER_R}`,
    `L${w},${h}`,
    `L0,${h}`,
    "Z",
  ].join(" ");
}

// Ítem lateral: solo el ícono navicon. La posición activa se marca con una
// línea corta debajo del ícono.
function SideItem({ icon: Icon, label, active, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityLabel={label}
      className="flex-1 items-center justify-center"
    >
      <Icon width={27} height={27} />
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        className={`text-[10px] uppercase ${active ? "font-lm-bold text-text" : "font-sans text-text-muted"}`}
      >
        {label}
      </Text>
      <View className="h-[3px] items-center justify-center">
        {active && (
          <View
            className="rounded-full bg-background border border-text"
            style={{ width: 45, height: 3 }}
          />
        )}
      </View>
    </TouchableOpacity>
  );
}

// Slot central (Cambiar): el botón redondo flota arriba (FloatingButton) y aquí,
// en lugar de una etiqueta como los demás ítems, va un punto a la misma altura.
// El hueco superior reserva el espacio del ícono para alinear con los laterales.
function CenterSlot({ active, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityLabel="Cambiar"
      className="flex-1 items-center justify-center py-1"
    >
      <View style={{ width: 30, height: 30 }} />
      <View className="h-[14px] items-center justify-center">
        <View
          className={`rounded-full mt-1 ${active ? "bg-text " : ""}`}
          style={{ width: 15, height: 15 }}
        />
      </View>
    </TouchableOpacity>
  );
}

// Botón redondo flotante centrado en la cuna. `top` negativo lo sube por encima
// de la barra; súbelo más si aumentas NOTCH_DIP.
function FloatingButton({ active, onPress }) {
  const Icon = active ? CambioActiveIcon : CambioIcon;
  return (
    <View className="absolute left-0 right-0 items-center" style={{ top: BUTTON_TOP }} pointerEvents="box-none">
      <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
        <View
          className="rounded-full bg-primary items-center justify-center"
          style={{
            width: BUTTON_SIZE,
            height: BUTTON_SIZE,
            shadowColor: colors.primaryDark,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.4,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <Icon width={30} height={30} />
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default function FooterBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { width } = useWindowDimensions();

  const totalH = BAR_HEIGHT + BOTTOM_PAD;

  const goTab = (route) => {
    if (route !== pathname) router.navigate(route);
  };

  const goChat = () => {
    if (pathname !== "/Chat") router.push("/Chat");
  };

  return (
    <View style={{ position: "absolute", left: 0, right: 0, bottom: 0 }} pointerEvents="box-none">
      <View style={{ width, height: totalH }}>
        <Svg width={width} height={totalH} style={{ position: "absolute", top: 0, left: 0 }}>
          <Path
            d={buildBarPath(width, totalH)}
            fill={colors.primary}
            stroke={colors.primaryAccent}
            strokeWidth={1}
          />
        </Svg>

        <View
          className="flex-row items-end px-2"
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, paddingBottom: BOTTOM_PAD }}
        >
          <SideItem icon={CasaIcon} label="Inicio" active={pathname === "/Home"} onPress={() => goTab("/Home")} />
          <SideItem icon={TarjetaIcon} label="Cuentas" active={pathname === "/Cuentas"} onPress={() => goTab("/Cuentas")} />
          <CenterSlot active={pathname === "/Cambiar"} onPress={() => goTab("/Cambiar")} />
          <SideItem icon={ChatIcon} label="Chat" active={pathname === "/Chat"} onPress={goChat} />
          <SideItem icon={PuntosIcon} label="Puntos" active={pathname === "/TcPuntos"} onPress={() => goTab("/TcPuntos")} />
        </View>

        <FloatingButton active={pathname === "/Cambiar"} onPress={() => goTab("/Cambiar")} />
      </View>
    </View>
  );
}
