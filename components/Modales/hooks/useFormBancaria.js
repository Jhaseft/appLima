import { useEffect, useState } from "react";
import { useBancos } from "./useBancos";
import { useGuardarCuenta } from "./useGuardarCuenta";

const BILLETERAS = ["yape", "plin"];

// Orquesta el modal de cuenta bancaria (origen): estado del formulario + bancos
// + guardado. El modal solo compone la UI con lo que devuelve este hook.
export function useFormBancaria({ isOpen, bancosProp, user, accountType, onCuentaGuardada, onClose }) {
  const bancos = useBancos(isOpen, bancosProp);
  const { loading, guardar } = useGuardarCuenta({ user, onCuentaGuardada, onClose });

  const [banco, setBanco] = useState(null);
  const [numeroCuenta, setNumeroCuenta] = useState("");
  const [juramento, setJuramento] = useState(false);
  const [terminos, setTerminos] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setBanco(null);
    setNumeroCuenta("");
    setJuramento(false);
    setTerminos(false);
  }, [isOpen]);

  const esBilletera = BILLETERAS.includes(banco?.name?.toLowerCase());
  const canSave = juramento && terminos && banco && numeroCuenta;

  const submit = () => {
    if (canSave) guardar({ bank_id: banco.id, account_number: numeroCuenta, account_type: accountType });
  };

  return {
    bancos,
    banco,
    setBanco,
    numeroCuenta,
    setNumeroCuenta,
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
