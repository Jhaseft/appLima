import { colors } from "../../theme/colors";

// Color por estado usando tokens (nada de nombres de color sueltos):
// pending → amarillo (en curso), verified → texto (confirmado), completed →
// success, rejected → danger, otro → text-muted.
export const getStatusColor = (status) => {
  switch (status) {
    case "pending":   return colors.primaryDark;
    case "verified":  return colors.text;
    case "completed": return colors.success;
    case "rejected":  return colors.danger;
    default:          return colors.textMuted;
  }
};

export const getTypeLabel = (slug) => {
  switch (slug) {
    case "cash":          return "Efectivo";
    case "qr":            return "QR";
    case "bank_transfer": return "Transferencia bancaria";
    default:              return slug ? slug.replace(/_/g, " ") : "Transferencia";
  }
};
