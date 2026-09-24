import { useState } from "react";
import { useFeedback } from "../../Feedback/FeedbackContext";
import { useTcPuntos } from "../TcPuntosContext";
import { useCatalogo } from "./useCatalogo";
import { invalidarHistorial } from "./useHistorial";
import { canjearProducto } from "../services/tcPuntosApi";

// Orquestacion de la pantalla TC Puntos: saldo (context cacheado), catalogo
// (cache stale-while-revalidate), estado de modales y el canje (mutacion). La
// ruta solo compone la UI con lo que devuelve este hook.
export function useTcPuntosScreen() {
  const { balance, valorPunto, moneda, umbral, refrescar, fijarBalance } = useTcPuntos();
  const feedback = useFeedback();
  const catalogo = useCatalogo();

  const [producto, setProducto] = useState(null);
  const [canjeVisible, setCanjeVisible] = useState(false);
  const [canjeando, setCanjeando] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);

  const onRefresh = async () => {
    await Promise.all([refrescar(), catalogo.refrescar()]);
  };

  const abrirCanje = (p) => {
    setProducto(p);
    setCanjeVisible(true);
  };

  const confirmarCanje = async () => {
    if (!producto) return;
    setCanjeando(true);
    try {
      const data = await canjearProducto(producto.id);
      fijarBalance(data.balance);
      invalidarHistorial();
      setCanjeVisible(false);
      feedback.success(
        `Canjeaste "${data.producto}" por ${Number(producto.costo_puntos).toLocaleString()} TC Puntos. Recibirás un correo con más información`,
        { title: "¡Canje exitoso!" }
      );
    } catch (err) {
      feedback.error(err.message, { title: err.title });
    } finally {
      setCanjeando(false);
    }
  };

  const hayProductos = catalogo.categorias.some((c) => c.productos?.length > 0);

  return {
    balance,
    valorPunto,
    moneda,
    umbral,
    categorias: catalogo.categorias,
    loading: catalogo.loading,
    refreshing: catalogo.refreshing,
    hayProductos,
    producto,
    canjeVisible,
    canjeando,
    infoVisible,
    setInfoVisible,
    setCanjeVisible,
    onRefresh,
    abrirCanje,
    confirmarCanje,
  };
}
