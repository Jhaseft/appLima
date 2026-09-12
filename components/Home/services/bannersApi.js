import API_BASE_URL from "../../api";

// Banners administrados desde el panel: solo activos y ordenados por sort_order.
// Acepta snake_case (Laravel) o camelCase por si cambia el backend.
export async function fetchBanners() {
  const res = await fetch(`${API_BASE_URL}/api/banners`, { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const json = await res.json();
  const list = Array.isArray(json) ? json : json.data ?? [];

  return list
    .filter((b) => b.is_active ?? b.isActive ?? true)
    .sort((a, b) => (a.sort_order ?? a.sortOrder ?? 0) - (b.sort_order ?? b.sortOrder ?? 0))
    .map((b) => ({ id: b.id, image: b.image_url ?? b.imageUrl }));
}
