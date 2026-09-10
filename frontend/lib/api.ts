const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Error desconocido" }));
    throw new Error(error.detail || "Error en la petición");
  }

  return res.json();
}

export const api = {
  // Productos
  getProducts: (params?: string) => fetchAPI(`/products/${params ? `?${params}` : ""}`),
  getProduct: (slug: string) => fetchAPI(`/products/${slug}`),

  // Auth
  register: (data: object) => fetchAPI("/auth/register", { method: "POST", body: JSON.stringify(data) }),
  login: (data: object) => fetchAPI("/auth/login", { method: "POST", body: JSON.stringify(data) }),
  getMe: () => fetchAPI("/auth/me"),

  // Carrito
  getCart: () => fetchAPI("/cart/"),
  addToCart: (data: object) => fetchAPI("/cart/", { method: "POST", body: JSON.stringify(data) }),
  updateCartItem: (id: string, data: object) => fetchAPI(`/cart/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  removeCartItem: (id: string) => fetchAPI(`/cart/${id}`, { method: "DELETE" }),
  clearCart: () => fetchAPI("/cart/", { method: "DELETE" }),

  // Órdenes
  checkout: (data: object) => fetchAPI("/orders/checkout", { method: "POST", body: JSON.stringify(data) }),
  getOrders: () => fetchAPI("/orders/"),
  getOrder: (id: string) => fetchAPI(`/orders/${id}`),

  // Steam
  getInventory: () => fetchAPI("/steam/inventory"),
};