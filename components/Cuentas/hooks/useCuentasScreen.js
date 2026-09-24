import { useState } from "react";
import { useUser } from "../../ContextUser/UserContext";
import { useFeedback } from "../../Feedback/FeedbackContext";
import { useCuentasBancarias } from "./useCuentasBancarias";
import { useCuentasQR } from "./useCuentasQR";

// Orquestacion de la pantalla Cuentas: datos (bancarias/QR), vista activa,
// seleccion, modales y acciones. La ruta solo compone la UI con esto.
export function useCuentasScreen() {
  const { user, loading: loadingUser } = useUser();
  const feedback = useFeedback();

  const [tipoVista, setTipoVista] = useState("bank");
  const bancarias = useCuentasBancarias(user?.id);
  const qr = useCuentasQR(user?.id, tipoVista === "qr");

  const [cuentaOrigen, setCuentaOrigen] = useState(null);
  const [cuentaDestino, setCuentaDestino] = useState(null);
  const [openBanco, setOpenBanco] = useState(false);
  const [tipoAgregar, setTipoAgregar] = useState("origin");
  const [openQR, setOpenQR] = useState(false);
  const [qrCountry, setQrCountry] = useState("PE");
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([bancarias.refrescar(), qr.refrescar()]);
    setRefreshing(false);
  };

  const abrirAgregar = (tipo) => {
    setTipoAgregar(tipo);
    setOpenBanco(true);
  };

  const abrirQR = (country) => {
    setQrCountry(country);
    setOpenQR(true);
  };

  const eliminar = async (cuenta, tipo) => {
    if (!cuenta?.id || bancarias.eliminando) return;
    const ok = await feedback.confirm({
      title: "Eliminar cuenta",
      message: "¿Estás seguro de eliminar esta cuenta?",
      confirmText: "Eliminar",
      destructive: true,
    });
    if (!ok) return;
    try {
      await feedback.withLoading("Eliminando cuenta...", () => bancarias.eliminar(cuenta.id));
      if (tipo === "origin") setCuentaOrigen(null);
      if (tipo === "destination") setCuentaDestino(null);
    } catch (err) {
      feedback.error(err.message || "No se pudo eliminar la cuenta");
    }
  };

  const guardarOrigen = (actualizadas) => {
    bancarias.guardar(actualizadas);
    setCuentaOrigen(actualizadas[actualizadas.length - 1]);
  };

  const guardarDestino = (actualizadas) => {
    bancarias.guardar(actualizadas);
    setCuentaDestino(actualizadas.filter((c) => c.account_type === "destination").pop() || null);
  };

  return {
    user,
    loadingUser,
    tipoVista,
    setTipoVista,
    bancarias,
    qr,
    cuentaOrigen,
    setCuentaOrigen,
    cuentaDestino,
    setCuentaDestino,
    openBanco,
    setOpenBanco,
    tipoAgregar,
    openQR,
    setOpenQR,
    qrCountry,
    refreshing,
    onRefresh,
    abrirAgregar,
    abrirQR,
    eliminar,
    guardarOrigen,
    guardarDestino,
    cuentasOrigen: bancarias.cuentas.filter((c) => c.account_type === "origin"),
    cuentasDestino: bancarias.cuentas.filter((c) => c.account_type === "destination"),
  };
}
