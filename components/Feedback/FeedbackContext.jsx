import { createContext, useContext, useCallback, useMemo, useRef, useState } from "react";
import FeedbackModal from "./FeedbackModal";
import ActionOverlay from "../ActionOverlay";

// Sistema unico de feedback de la app: reemplaza a Alert. Overlays absolutos (NO
// Modal nativo) montados una vez en el _layout via <FeedbackProvider>. No se usan
// Modals para esto porque apilar Modals en iOS deja una capa fantasma que bloquea
// el touch. Cambiar el look = tocar FeedbackModal / ActionOverlay y todos heredan.
//
// API (via useFeedback):
//   success(mensaje, { title })  -> Promise (resuelve al cerrar)
//   error(mensaje, { title })    -> Promise
//   info(mensaje, { title })     -> Promise
//   confirm({ title, message, confirmText, cancelText, destructive }) -> Promise<boolean>
//   withLoading(mensaje, task)   -> corre task() con overlay de carga a pantalla completa
const FeedbackContext = createContext(null);

export function useFeedback() {
  const ctx = useContext(FeedbackContext);
  if (!ctx) throw new Error("useFeedback debe usarse dentro de <FeedbackProvider>");
  return ctx;
}

export function FeedbackProvider({ children }) {
  const [dialog, setDialog] = useState(null);
  const [busy, setBusy] = useState(null);
  const resolver = useRef(null);

  const cerrar = useCallback((valor) => {
    setDialog(null);
    if (resolver.current) {
      resolver.current(valor);
      resolver.current = null;
    }
  }, []);

  const notify = useCallback(
    (type, message, opts = {}) =>
      new Promise((resolve) => {
        resolver.current = resolve;
        setDialog({ mode: "notify", type, message, confirmText: "Entendido", ...opts });
      }),
    []
  );

  const api = useMemo(
    () => ({
      notify: (opts) => notify(opts.type ?? "info", opts.message, opts),
      success: (message, opts = {}) => notify("success", message, { title: "Éxito", ...opts }),
      error: (message, opts = {}) => notify("error", message, { title: "Error", ...opts }),
      info: (message, opts = {}) => notify("info", message, { title: "Aviso", ...opts }),
      confirm: (opts = {}) =>
        new Promise((resolve) => {
          resolver.current = resolve;
          setDialog({
            mode: "confirm",
            type: opts.destructive ? "error" : "info",
            confirmText: "Aceptar",
            cancelText: "Cancelar",
            ...opts,
          });
        }),
      withLoading: async (mensaje, task) => {
        setBusy({ mensaje: mensaje || "Procesando..." });
        try {
          return await task();
        } finally {
          setBusy(null);
        }
      },
    }),
    [notify]
  );

  return (
    <FeedbackContext.Provider value={api}>
      {children}
      <ActionOverlay visible={!!busy} mensaje={busy?.mensaje} />
      <FeedbackModal dialog={dialog} onConfirm={() => cerrar(true)} onCancel={() => cerrar(false)} />
    </FeedbackContext.Provider>
  );
}
