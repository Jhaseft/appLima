// Pasos del alta de cuenta, compartidos por Register y CompleteProfile.
// "Seguridad" solo aplica a usuarios sin contraseña (Google/Apple); los de
// correo la definen en "Configura tus credenciales".
export function buildAccountSteps(requirePassword) {
  const steps = [
    { title: "Configura tus credenciales", desc: "Verifica tu correo y crea tu contraseña." },
    { title: "Información personal", desc: "Tu nombre y apellido." },
    { title: "Información extra", desc: "Teléfono, nacionalidad y documento." },
  ];
  if (requirePassword) {
    steps.push({ title: "Seguridad", desc: "Crea tu contraseña de acceso." });
  }
  return steps;
}
