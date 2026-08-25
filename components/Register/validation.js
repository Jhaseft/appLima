export function validateStep(step, form) {
  const e = {};

  if (step === 1) {
    if (!form.first_name.trim()) e.first_name = "Requerido";
    else if (form.first_name.length > 20) e.first_name = "Máximo 20 caracteres";
    else if (/[^a-zA-ZÀ-ÿ\s]/.test(form.first_name)) e.first_name = "Solo letras y espacios";

    if (!form.last_name.trim()) e.last_name = "Requerido";
    else if (form.last_name.length > 20) e.last_name = "Máximo 20 caracteres";
    else if (/[^a-zA-ZÀ-ÿ\s]/.test(form.last_name)) e.last_name = "Solo letras y espacios";

    if (!form.email.trim()) e.email = "Requerido";
    else if (form.email.length > 50) e.email = "Máximo 50 caracteres";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Email inválido";
  }

  if (step === 2) {
    if (!form.phone || form.phone.trim().length < 8) e.phone = "Teléfono inválido";
    else if (form.phone.length > 15) e.phone = "Máximo 15 dígitos";
    else if (!/^\+?[0-9]+$/.test(form.phone)) e.phone = "Solo números y + al inicio";

    if (!form.nationality.trim()) e.nationality = "Seleccione una nacionalidad";

    if (!form.document_number.trim()) e.document_number = "Documento requerido";
    else if (form.document_number.length > 20) e.document_number = "Máximo 20 caracteres";
  }

  if (step === 3) {
    if (!form.password) e.password = "Contraseña requerida";
    if (!form.password_confirmation) e.password_confirmation = "Confirmación requerida";
    if (!form.accepted_terms) e.accepted_terms = "Debes aceptar los términos";
  }

  return e;
}
