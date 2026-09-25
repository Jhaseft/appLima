// Sanitizadores de entrada para evitar basura en la BD (defensa ante pegado,
// teclado fisico y autocompletar; el keyboardType solo sugiere el teclado).
// Los nombres permiten Ñ/ñ, tildes y ü.

export const soloLetras = (v = "") =>
  v.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'’-]/g, "");

export const soloDigitos = (v = "") => v.replace(/\D/g, "");

// Telefono: digitos y un unico "+" inicial.
export const soloTelefono = (v = "") =>
  v.replace(/[^\d+]/g, "").replace(/(?!^)\+/g, "");
