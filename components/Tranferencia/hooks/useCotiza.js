import { useState } from "react";
import { Linking } from "react-native";
import { useRouter } from "expo-router";
import { useUser } from "../../ContextUser/UserContext";
import { useFeedback } from "../../Feedback/FeedbackContext";
import { useTasas } from "./useTasas";
import { useTransferConfig } from "./useTransferConfig";
import { crearSesionKyc } from "../services/transferenciaApi";

const KYC_DEEP_LINK = process.env.EXPO_PUBLIC_KYC_DEEP_LINK;

// Orquestacion del paso Cotiza: tasa (cache 5 min), config de limites (cache),
// monto/conversion/modo, validaciones (min/max/KYC) y salto al siguiente paso.
export function useCotiza({ onNext, setOperacion }) {
  const { user } = useUser();
  const feedback = useFeedback();
  const router = useRouter();
  const { tasa, loading, refreshing, refrescar } = useTasas();
  const { config, refrescar: refrescarConfig } = useTransferConfig();

  const [monto, setMonto] = useState("");
  const [conversion, setConversion] = useState("");
  const [modo, setModo] = useState("PENtoBOB");
  const [error, setError] = useState("");

  const perfilIncompleto =
    !user?.nationality || !user?.phone || !user?.document_number;

  const tasaCompra = tasa ? parseFloat(tasa.compra) : 0;
  const tasaVenta = tasa ? parseFloat(tasa.venta) : 0;

  const calcularConversion = (valor, tipo) =>
    tipo === "PENtoBOB"
      ? (valor * tasaCompra).toFixed(2)
      : (valor / tasaVenta).toFixed(2);

  const handleCambio = (valorStr) => {
    const valorClean = valorStr.replace(",", ".");
    if (!/^[0-9]*\.?[0-9]*$/.test(valorClean)) return;

    const valor = parseFloat(valorClean);
    if (!isNaN(valor) && valor >= 0) {
      setMonto(valorClean);
      setError("");
      setConversion(calcularConversion(valor, modo));
    } else if (valor < 0) {
      setMonto("");
      setConversion("");
      setError("⚠️ El monto no puede ser negativo.");
    } else {
      setMonto(valorClean);
      setConversion("");
    }
  };

  const toggleModo = () => {
    const nuevoModo = modo === "BOBtoPEN" ? "PENtoBOB" : "BOBtoPEN";
    setModo(nuevoModo);
    const valor = parseFloat(monto.replace(",", "."));
    if (!isNaN(valor)) setConversion(calcularConversion(valor, nuevoModo));
  };

  const openKyc = async () => {
    try {
      const url = await crearSesionKyc(KYC_DEEP_LINK);
      await Linking.openURL(url);
    } catch (_) {
      feedback.error("Hubo un problema al iniciar la verificación KYC.");
    }
  };

  const onRefresh = async () => {
    await Promise.all([refrescar(), refrescarConfig()]);
  };

  const handleNext = () => {
    if (perfilIncompleto) {
      feedback
        .confirm({
          title: "Completa tu perfil",
          message: "Para realizar una operación necesitamos unos datos adicionales.",
          confirmText: "Completar",
        })
        .then((ok) => ok && router.push("/CompleteProfile"));
      return;
    }

    const valor = parseFloat(monto.replace(",", "."));
    const minPEN = config?.min_pen ?? 20;
    const minBOB = config?.min_bob ?? 60;
    const maxPEN = config?.max_pen ?? 100000;
    const maxBOB = config?.max_bob ?? 100000;

    if (modo === "PENtoBOB" && valor < minPEN) return setError(`El monto mínimo es S/ ${minPEN}.`);
    if (modo === "BOBtoPEN" && valor < minBOB) return setError(`El monto mínimo es Bs ${minBOB}.`);
    if (modo === "PENtoBOB" && valor > maxPEN) return setError(`El monto máximo en S/ es ${maxPEN}.`);
    if (modo === "BOBtoPEN" && valor > maxBOB) return setError(`El monto máximo en Bs es ${maxBOB}.`);

    const limitePEN = config?.kyc_limit_pen ?? 0;
    const limiteBOB = config?.kyc_limit_bob ?? 0;
    const requiereKyc =
      (modo === "PENtoBOB" && valor > limitePEN) ||
      (modo === "BOBtoPEN" && valor > limiteBOB);

    if (requiereKyc && user?.kyc_status !== "verified") {
      feedback
        .confirm({
          title: "KYC Requerido",
          message: `Para operar montos mayores a S/${limitePEN} o Bs ${limiteBOB} debes completar tu verificación KYC.`,
          confirmText: "Ir a KYC",
        })
        .then((ok) => ok && openKyc());
      return;
    }

    setOperacion((prev) => ({
      ...prev,
      monto: valor,
      conversion,
      modo,
      tasa: modo === "PENtoBOB" ? tasaCompra : tasaVenta,
      cuentaOrigen: null,
      cuentaDestino: null,
    }));
    onNext();
  };

  return {
    monto,
    conversion,
    modo,
    error,
    tasa,
    tasaCompra,
    tasaVenta,
    loading,
    refreshing,
    onRefresh,
    handleCambio,
    toggleModo,
    handleNext,
  };
}
