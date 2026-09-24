import { useEffect, useState } from "react";
import { useBancos } from "./useBancos";
import { useGuardarCuenta } from "./useGuardarCuenta";

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
  const canSave =
    juramento && terminos && banco && numeroCuenta && nombre && documento && contacto;

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
    setNumeroCuenta,
    nombre,
    setNombre,
    documento,
    setDocumento,
    contacto,
    setContacto,
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
