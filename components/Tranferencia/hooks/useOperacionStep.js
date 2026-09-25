import { useEffect, useMemo, useState } from "react";
import { useUser } from "../../ContextUser/UserContext";
import { useTransferMethods } from "../../hooks/useTransferMethods";
import { useCuentasBancarias } from "../../Cuentas/hooks/useCuentasBancarias";
import { useCuentasQR } from "../../Cuentas/hooks/useCuentasQR";

// Orquestacion del paso Operacion. Reutiliza el MISMO cache de cuentas del modulo
// Cuentas (useCuentasBancarias / useCuentasQR): si ya se visito Cuentas o hay
// cache en disco, entra al instante sin pedir a la red; solo pide la primera vez
// que no hay llave. Al dar de alta una cuenta desde aqui, actualiza ese cache
// compartido (guardar / fijarQR) para no volver a pedir.
export function useOperacionStep({ operacion, setOperacion, onNext }) {
  const { user } = useUser();
  const { modo } = operacion;
  const isOriginBank = modo === "PENtoBOB";
  const isDestinationBank = modo === "BOBtoPEN";

  const [nonBankMethod, setNonBankMethod] = useState(operacion.nonBankMethod ?? null);
  const [juramento, setJuramento] = useState(false);
  const [terminos, setTerminos] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(null);

  const necesitaQrUsuario = modo === "PENtoBOB" && nonBankMethod === "qr";

  const bancarias = useCuentasBancarias(user?.id);
  const qr = useCuentasQR(user?.id, necesitaQrUsuario);
  const qrUserAccount = qr.qr.BO;

  const defaultCountryOrigen = modo === "PENtoBOB" ? "peru" : "bolivia";
  const defaultCountryDestino = modo === "PENtoBOB" ? "bolivia" : "peru";

  const { methods: metodosPago } = useTransferMethods(modo);

  const cuentasOrigen = useMemo(
    () =>
      bancarias.cuentas.filter((c) => {
        if (modo === "PENtoBOB") return c.account_type === "origin" && c.bank_country === "peru";
        if (modo === "BOBtoPEN") return c.account_type === "origin" && c.bank_country === "bolivia";
        return false;
      }),
    [bancarias.cuentas, modo]
  );

  const cuentasDestino = useMemo(
    () =>
      bancarias.cuentas.filter((c) => {
        if (modo === "PENtoBOB") return c.account_type === "destination" && c.bank_country === "bolivia";
        if (modo === "BOBtoPEN") return c.account_type === "destination" && c.bank_country === "peru";
        return false;
      }),
    [bancarias.cuentas, modo]
  );

  const empresaQRBolivia = metodosPago?.find?.((m) => m.type === "qr") ?? null;

  const cuentaOrigen = operacion.cuentaOrigen;
  const cuentaDestino = operacion.cuentaDestino;
  const setCuentaOrigen = (c) => setOperacion((p) => ({ ...p, cuentaOrigen: c }));
  const setCuentaDestino = (c) => setOperacion((p) => ({ ...p, cuentaDestino: c }));

  useEffect(() => {
    setNonBankMethod(null);
    setOperacion((p) => ({ ...p, cuentaOrigen: null, cuentaDestino: null, cuentaQR: null }));
  }, [modo]);

  const sideBancoOk = isOriginBank ? !!cuentaOrigen : !!cuentaDestino;
  const sideNoBancoOk =
    nonBankMethod === "cash" ||
    (nonBankMethod === "qr" && modo === "PENtoBOB" && !!qrUserAccount) ||
    (nonBankMethod === "qr" && modo === "BOBtoPEN" && !!empresaQRBolivia && !!cuentaOrigen);

  const puedeSeguir = juramento && terminos && sideBancoOk && sideNoBancoOk;

  const handleSiguiente = () => {
    if (!puedeSeguir) return;
    setOperacion((p) => ({
      ...p,
      nonBankMethod,
      cuentaQR: qrUserAccount,
      metodo: isOriginBank ? nonBankMethod : "transferencia",
    }));
    onNext();
  };

  const onCuentaGuardada = (lista) => {
    bancarias.guardar(lista);
    setModalAbierto(null);
  };

  const onQRGuardado = (guardada) => {
    if (guardada) qr.fijarQR(guardada);
    setModalAbierto(null);
  };

  return {
    user,
    modo,
    isOriginBank,
    isDestinationBank,
    nonBankMethod,
    setNonBankMethod,
    juramento,
    setJuramento,
    terminos,
    setTerminos,
    loadingCuentas: bancarias.loading,
    qrUserAccount,
    loadingQrUser: qr.loading,
    modalAbierto,
    setModalAbierto,
    defaultCountryOrigen,
    defaultCountryDestino,
    cuentasOrigen,
    cuentasDestino,
    empresaQRBolivia,
    cuentaOrigen,
    cuentaDestino,
    setCuentaOrigen,
    setCuentaDestino,
    puedeSeguir,
    handleSiguiente,
    onCuentaGuardada,
    onQRGuardado,
  };
}
