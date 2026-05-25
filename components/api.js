// config/api.js
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
export const HORARIOS = [
  { dia: "Lunes - Sábado", hora: "08:00 AM - 5:00 PM" },
  { dia: "Domingos", hora: "Solo por transferencia o QR (no efectivo)" },
];

export const HORARIOS_TEXTO =
  "Lunes a Sábado: 08:00 AM – 5:00 PM\nDomingos: Solo por transferencia o QR (no efectivo)";

export default API_BASE_URL;
 