import { useEffect, useRef, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUser } from "../ContextUser/UserContext";
import { obtenerTransfers } from "./services/transfersApi";

const PER_PAGE = 15;
const CACHE_KEY = "transfersHistorial";
const TTL_MS = 2 * 60 * 1000;

// Cache de la PRIMERA pagina (sin busqueda) del historial: se muestra al instante
// y se revalida en silencio si vencio el TTL, para no ver "cargando" cada vez que
// se entra. La paginacion (scroll) y la busqueda piden fresco, no tocan el cache.
// Se invalida al crear una operacion nueva (invalidarTransfers) para reflejarla.
let memoria = null;
let memoriaUserId = null;
let memoriaTs = 0;

const cacheValido = (userId) => memoria !== null && memoriaUserId === userId;
const vencido = () => Date.now() - memoriaTs > TTL_MS;

export function invalidarTransfers() {
  memoria = null;
  memoriaUserId = null;
  memoriaTs = 0;
  AsyncStorage.removeItem(CACHE_KEY);
}

export function useTransfers() {
  const { user } = useUser();

  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const searchRef = useRef(search);
  searchRef.current = search;

  const guardarCache = useCallback((lista, userId) => {
    memoria = lista;
    memoriaUserId = userId;
    memoriaTs = Date.now();
    AsyncStorage.setItem(CACHE_KEY, JSON.stringify(lista));
  }, []);

  const fetchPage = useCallback(
    async (pageNum, searchTerm, replace = false, silent = false) => {
      if (!user?.id) return;
      if (!silent) (pageNum === 1 ? setLoading(true) : setLoadingMore(true));

      try {
        const json = await obtenerTransfers(user.id, pageNum, PER_PAGE, searchTerm);
        const incoming = Array.isArray(json.data) ? json.data : [];

        setTransfers((prev) => (replace ? incoming : [...prev, ...incoming]));
        setHasMore(json.current_page < json.last_page);
        setPage(json.current_page);

        if (pageNum === 1 && !searchTerm.trim()) guardarCache(incoming, user.id);
      } catch (err) {
        console.error("Error cargando transfers:", err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [user, guardarCache]
  );

  useEffect(() => {
    if (!user?.id) return;
    let vivo = true;

    if (cacheValido(user.id)) {
      setTransfers(memoria);
      setLoading(false);
      if (vencido()) fetchPage(1, "", true, true);
      return () => { vivo = false; };
    }

    (async () => {
      try {
        const cache = await AsyncStorage.getItem(CACHE_KEY);
        if (cache) {
          const lista = JSON.parse(cache);
          memoria = lista;
          memoriaUserId = user.id;
          if (vivo) { setTransfers(lista); setLoading(false); }
          fetchPage(1, "", true, true);
          return;
        }
        fetchPage(1, "", true);
      } catch {
        fetchPage(1, "", true);
      }
    })();

    return () => { vivo = false; };
  }, [user?.id, fetchPage]);

  const onSearch = useCallback((text) => setSearch(text), []);
  const triggerSearch = useCallback(() => fetchPage(1, searchRef.current, true), [fetchPage]);
  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    fetchPage(page + 1, searchRef.current, false);
  }, [fetchPage, loadingMore, hasMore, page]);

  return { transfers, loading, loadingMore, hasMore, search, onSearch, triggerSearch, loadMore };
}
