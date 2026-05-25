export const getStatusColor = (status) => {
  switch (status) {
    case "pending":   return "orange";
    case "verified":  return "blue";
    case "completed": return "green";
    case "rejected":  return "red";
    default:          return "gray";
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
