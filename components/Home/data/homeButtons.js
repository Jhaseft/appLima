import { CreditCard, RefreshCw, MessageCircle } from "lucide-react-native";
import { colors } from "../../../theme/colors";

export const HOME_BUTTONS = [
  {
    label1: "Cuentas",
    label2: "Bancarias",
    route: "/Cuentas",
    Icon: CreditCard,
    bg: "bg-surface",
    color: colors.text,
  },
  {
    label1: "Cambiar",
    label2: "Soles",
    route: "/Cambiar",
    Icon: RefreshCw,
    bg: "bg-primary",
    color: colors.text,
  },
  {
    label1: "Recibe",
    label2: "Ayuda",
    route: "",
    Icon: MessageCircle,
    bg: "bg-primary-light",
    color: colors.primaryDark,
    whatsappMessage: "Hola, necesito ayuda con mis transferencias",
    whatsappNumber: "59163892482",
  },
];
