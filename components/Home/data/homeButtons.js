import { CreditCard, RefreshCw, MessageCircle } from "lucide-react-native";
import { colors } from "../../../theme/colors";
import WhatsapIcon from "../../../assets/HomeIcons/AccesosRapidos/ico_whatsapp.svg";
import CambioIcon from "../../../assets/navicons/cambio.svg";
import TarjetaIcon from "../../../assets/navicons/tarjeta.svg";

export const HOME_BUTTONS = [
  {
    label1: "Cuentas",
    label2: "Bancarias",
    route: "/Cuentas",
    Icon: TarjetaIcon,
    bg: "bg-primary-light",
    color: colors.text,
  },
  {
    label1: "Cambiar",
    label2: "Soles",
    route: "/Cambiar",
    Icon: CambioIcon,
    bg: "bg-primary",
    color: colors.text,
  },
  {
    label1: "Recibe",
    label2: "Ayuda",
    route: "",
    Icon: WhatsapIcon,
    bg: "bg-primary-light",
    color: colors.primaryDark,
    whatsappMessage: "Hola, necesito ayuda con mis transferencias",
    whatsappNumber: "59163892482",
  },
];
