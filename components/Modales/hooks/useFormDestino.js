import { useEffect, useState } from "react";
import { useBancos } from "./useBancos";
import { useGuardarCuenta } from "./useGuardarCuenta";
import { soloDigitos, soloLetras, soloTelefono } from "../../../utils/sanitize";

const BILLETERAS = ["yape", "plin"];

// Orquesta el modal de cuenta destino (tercero): igual que la bancaria pero con
// los datos del propietario.
export function useFormDestino({ isOpen, bancosProp, user, onCuentaGuardada, onClose }) {
  const bancos = useBancos(isOpen, bancosProp);
  const { loading, guardar } = useGuardarCuenta({ user, onCuentaGuardada, onClose });

  const [banco, setBanco] = useState(null);
  const [numeroCuenta, setNumeroCuenta] = useState("");
  const [nombre, setNombre] = useState("");
  const [documento, setDocumento] = useState("");
  const [contacto, setContacto] = useState("");
  const [juramento, setJuramento] = useState(false);
  const [terminos, setTerminos] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setBanco(null);
    setNumeroCuenta("");
    setNombre("");
    setDocumento("");
    setContacto("");
    setJuramento(false);
    setTerminos(false);
  }, [isOpen]);

  const esBilletera = BILLETERAS.includes(banco?.name?.toLowerCase());
  const minDigitos = esBilletera ? 8 : 6;
  const canSave =
    juramento &&
    terminos &&
    banco &&
    numeroCuenta.length >= minDigitos &&
    nombre.trim().length >= 3 &&
    documento.length >= 5 &&
    contacto.length >= 7;

  const submit = () => {
    if (!canSave) return;
    guardar({
      bank_id: banco.id,
      account_number: numeroCuenta,
      account_type: "destination",
      owner_full_name: nombre,
      owner_document: documento,
      owner_phone: contacto,
    });
  };

  return {
    bancos,
    banco,
    setBanco,
    numeroCuenta,
    setNumeroCuenta: (v) => setNumeroCuenta(soloDigitos(v)),
    nombre,
    setNombre: (v) => setNombre(soloLetras(v)),
    documento,
    setDocumento: (v) => setDocumento(soloDigitos(v)),
    contacto,
    setContacto: (v) => setContacto(soloTelefono(v)),
    juramento,
    setJuramento,
    terminos,
    setTerminos,
    cuentaPlaceholder: esBilletera ? "Número de teléfono" : "Número de cuenta",
    cuentaType: esBilletera ? "phone-pad" : "number-pad",
    canSave,
    loading,
    submit,
  };
}
