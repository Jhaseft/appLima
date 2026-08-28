// Un perfil está incompleto si le faltan los datos de operación (KYC).
export function isProfileIncomplete(user) {
  return !user?.nationality || !user?.phone || !user?.document_number;
}

// Ruta destino según el estado del usuario.
// Solo se fuerza CompleteProfile a usuarios de correo (has_password) incompletos:
// están a mitad del alta. Los de Google/Apple entran a Home y el perfil se exige
// al operar (guía Apple 5.1.1: no bloquear la app tras "Sign in with Apple").
export function routeForUser(user) {
  if (user?.has_password && isProfileIncomplete(user)) return "/CompleteProfile";
  return "/Home";
}
