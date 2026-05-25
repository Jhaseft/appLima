import { useEffect, useRef, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUser } from "../ContextUser/UserContext";
import API_BASE_URL from "../api";

const PER_PAGE = 15;

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

  const fetchPage = useCallback(
    async (pageNum, searchTerm, replace = false) => {
      if (!user?.id) return;

      pageNum === 1 ? setLoading(true) : setLoadingMore(true);

      try {
        const token = await AsyncStorage.getItem("token");
        const params = new URLSearchParams({
          user_id: user.id,
          page: pageNum,
          per_page: PER_PAGE,
        });
        if (searchTerm.trim()) params.set("search", searchTerm.trim());

        const res = await fetch(
          `${API_BASE_URL}/api/transfers/historymobile?${params}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = await res.json();
        const incoming = Array.isArray(json.data) ? json.data : [];

        setTransfers((prev) => (replace ? incoming : [...prev, ...incoming]));
        setHasMore(json.current_page < json.last_page);
        setPage(json.current_page);
      } catch (err) {
        console.error("Error cargando transfers:", err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [user]
  );

  // Primera carga y reset cuando cambia el usuario
  useEffect(() => {
    if (!user?.id) return;
    fetchPage(1, search, true);
  }, [user]);

  // Actualiza el texto sin disparar búsqueda
  const onSearch = useCallback((text) => setSearch(text), []);

  // Dispara la búsqueda al presionar el botón o el Enter del teclado
  const triggerSearch = useCallback(() => {
    fetchPage(1, searchRef.current, true);
  }, [fetchPage]);

  // Cargar siguiente página (scroll infinito)
  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    fetchPage(page + 1, searchRef.current, false);
  }, [fetchPage, loadingMore, hasMore, page]);

  return { transfers, loading, loadingMore, hasMore, search, onSearch, triggerSearch, loadMore };
}
