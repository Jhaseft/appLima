import { ClipboardList, FileText, HelpCircle, Instagram, Facebook } from "lucide-react-native";
import TikTokIcon from "../TikTokIcon";
import CasaIcon from "../../../assets/navicons/casa.svg";
import TarjetaIcon from "../../../assets/navicons/tarjeta.svg";
import CambioIcon from "../../../assets/navicons/cambio.svg";
import ChatIcon from "../../../assets/navicons/chat.svg";
import PuntosIcon from "../../../assets/navicons/tc_puntos.svg";

export const NAV_ITEMS = [
  { label: "Inicio", icon: CasaIcon, svg: true, route: "/Home" },
  { label: "Cuentas", icon: TarjetaIcon, svg: true, route: "/Cuentas" },
  { label: "Cambiar", icon: CambioIcon, svg: true, route: "/Cambiar" },
  { label: "Chat", icon: ChatIcon, svg: true, route: "/Chat" },
  { label: "TcPuntos", icon: PuntosIcon, svg: true, route: "/TcPuntos" },
  { label: "Ver Operaciones", icon: ClipboardList, route: "/TransfersHistory" },
];

export const INFO_ITEMS = [
  { label: "Políticas", icon: FileText, url: "https://transfercash.click/politicas" },
  { label: "Preguntas frecuentes", icon: HelpCircle, route: "/PreguntasFrecuentes" },
];

export const REDES = [
  { key: "instagram", icon: Instagram, color: "#E1306C", url: "https://www.instagram.com/transfercash.pe/" },
  { key: "facebook", icon: Facebook, color: "#1877F2", url: "https://www.facebook.com/people/TransferCash/61577711887086/" },
  { key: "tiktok", icon: TikTokIcon, color: "#010101", url: "https://www.tiktok.com/@transfercash.pe?_r=1&_t=ZS-94y1kvv5wzU" },
];
