"use client";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_LOGISTA_API_BASE_URL ??
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "https://99dev.pro/suwave-api/api/v1"
).replace(/\/$/, "");

const AUTH_STORAGE_KEY = "suwave-logista-auth";

export type SellerApiItem = {
  meta: string;
  status: string;
  title: string;
  value: string;
};

export type SellerApiCard = {
  eyebrow: string;
  title: string;
  value: string;
};

export type SellerSummary = {
  active_products: number;
  draft_products: number;
  orders_pending: number;
  orders_total: number;
  products_total: number;
  recent_orders: SellerOrder[];
  revenue_total: string;
  sold_products: number;
  store_name: string;
  quick_metrics: Array<{ label: string; value: string }>;
};

export type SellerProfile = {
  avatar_url: string | null;
  city: string | null;
  complement: string | null;
  district: string | null;
  description: string | null;
  email: string;
  full_name: string;
  id: string;
  role: string;
  state: string | null;
  status: string;
  street: string | null;
  store_name: string;
  whatsapp: string | null;
  zip_code: string | null;
};

export type SellerProduct = {
  attributes?: Record<string, unknown>;
  category_id: string;
  city: string;
  description?: string;
  id: string;
  media?: Array<{
    alt_text?: string | null;
    is_cover: boolean;
    position: number;
    thumbnail_url?: string | null;
    type: "image" | "video";
    url: string;
  }>;
  price: string;
  state?: string;
  status: string;
  stock_quantity: number | null;
  subcategory_id?: string;
  title: string;
  type: string;
};

export type SellerOrder = {
  id: string;
  payment_method: string;
  placed_at: string;
  short_id: string;
  status: string;
  status_label: string;
  total: string;
};

export type SellerSession = {
  accessToken: string;
  refreshToken?: string;
  user?: {
    email: string;
    full_name: string;
    id: string;
    role: string;
    roles?: string[];
  };
};

export type SellerWallet = {
  affiliate: {
    available_commission: string;
    available_commission_cents: number;
    min_withdrawal: string;
    min_withdrawal_cents: number;
    status: string;
    status_label: string;
    withdrawal_options: Array<{
      description: string;
      id: "wallet" | "bank";
      label: string;
    }>;
  };
  available_balance: string;
  cashback_balance: string;
  commission_balance: string;
};

export type SellerWithdrawal = {
  amount_cents: number;
  destination: "wallet" | "bank";
  id: string;
  requested_at: string;
  status: string;
  user_id: string;
};

export type SellerHour = {
  closes_at: string;
  day: string;
  enabled: boolean;
  opens_at: string;
};

export type SellerDeliverySettings = {
  average_time_minutes: number;
  delivery_fee: string;
  enabled: boolean;
  minimum_order: string;
  pickup_enabled: boolean;
  radius_km: number;
};

export type SellerSettings = {
  delivery: SellerDeliverySettings;
  hours: SellerHour[];
  id: string;
  updated_at: string;
  user_id: string;
};

type ApiEnvelope<T> = {
  data: T;
  error?: { message?: string };
  message?: string;
};

export function getSellerSession(): SellerSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const rawSession = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (rawSession) {
    try {
      const session = JSON.parse(rawSession) as SellerSession;
      if (session.accessToken) {
        return session;
      }
    } catch {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }

  return null;
}

export function saveSellerSession(session: SellerSession) {
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

export function clearSellerSession() {
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}

async function sellerRequest<T>(path: string, init: RequestInit = {}, token?: string) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });

  const body = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;

  if (!response.ok) {
    throw new Error(body?.message ?? body?.error?.message ?? "Nao foi possivel conectar a API do lojista.");
  }

  return body?.data as T;
}

type ConflictDetail = {
  can_link_seller?: boolean | null;
  exists: boolean;
  has_driver_profile?: boolean | null;
  has_seller_role?: boolean | null;
  message?: string | null;
  same_account: boolean;
};

export type SellerAccountAvailability = {
  available: boolean;
  conflicts: Partial<Record<"email" | "cpf" | "whatsapp", ConflictDetail>>;
};

export async function checkSellerAccountAvailability(input: { email?: string; whatsapp?: string }) {
  const data = await sellerRequest<SellerAccountAvailability>("/auth/account/availability", {
    body: JSON.stringify({ ...input, target_role: "seller" }),
    method: "POST",
    headers: { "X-Client-App": "logista" },
  });

  return data;
}

export async function registerSeller(input: {
  email: string;
  full_name: string;
  password: string;
  whatsapp: string;
}) {
  const data = await sellerRequest<{
    access_token: string;
    refresh_token: string;
    user: SellerSession["user"];
  }>("/auth/register", {
    body: JSON.stringify({ ...input, accepted_terms: true }),
    method: "POST",
  });

  const session: SellerSession = {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    user: data.user,
  };
  saveSellerSession(session);
  return session;
}

export async function linkSellerRole(token: string) {
  const data = await sellerRequest<{
    access_token: string;
    refresh_token: string;
    user: SellerSession["user"];
  }>("/auth/link-role", {
    body: JSON.stringify({ role: "seller" }),
    method: "POST",
  }, token);

  const session: SellerSession = {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    user: data.user,
  };
  saveSellerSession(session);
  return session;
}

export async function linkSellerCredential(email: string, password: string) {
  const data = await sellerRequest<{
    access_token: string;
    refresh_token: string;
    user: SellerSession["user"];
  }>("/auth/seller/link-credential", {
    body: JSON.stringify({ email, password }),
    method: "POST",
    headers: { "X-Client-App": "logista" },
  });

  const session: SellerSession = {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    user: data.user,
  };
  saveSellerSession(session);
  return session;
}

export async function loginSeller(identifier: string, password: string) {
  const payload = identifier.includes("@")
    ? { email: identifier.trim(), password }
    : { password, whatsapp: identifier.trim() };

  const data = await sellerRequest<{
    access_token: string;
    refresh_token: string;
    user: SellerSession["user"];
  }>("/auth/seller/login", {
    body: JSON.stringify(payload),
    method: "POST",
    headers: { "X-Client-App": "logista" },
  });

  const session = {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    user: data.user,
  };
  saveSellerSession(session);
  return session;
}

export async function getSellerBundle(token: string) {
  const [summary, profile, products, orders] = await Promise.all([
    sellerRequest<SellerSummary>("/seller/summary", {}, token),
    sellerRequest<SellerProfile>("/seller/profile", {}, token),
    sellerRequest<SellerProduct[]>("/products/me", {}, token),
    sellerRequest<SellerOrder[]>("/orders/seller", {}, token),
  ]);

  return { orders, products, profile, summary };
}

export type SellerProductPayload = {
  attributes?: Record<string, unknown>;
  category_id: string;
  city: string;
  currency?: string;
  description: string;
  media?: SellerProduct["media"];
  price: string;
  state: string;
  status: "draft" | "pending_review" | "published" | "paused";
  stock_quantity: number | null;
  subcategory_id: string;
  title: string;
  type: "fashion" | "food" | "real_estate" | "service" | "vehicle";
};

export async function createSellerProduct(token: string, payload: SellerProductPayload) {
  return sellerRequest<SellerProduct>("/products", {
    body: JSON.stringify({ currency: "BRL", media: [], ...payload }),
    method: "POST",
  }, token);
}

export async function getSellerProduct(productId: string) {
  return sellerRequest<SellerProduct>(`/products/${encodeURIComponent(productId)}`);
}

export async function updateSellerProduct(token: string, productId: string, payload: Partial<SellerProductPayload>) {
  return sellerRequest<SellerProduct>(`/products/${encodeURIComponent(productId)}`, {
    body: JSON.stringify(payload),
    method: "PUT",
  }, token);
}

export async function updateSellerProfile(
  token: string,
  payload: Partial<
    Pick<
      SellerProfile,
      | "avatar_url"
      | "city"
      | "complement"
      | "description"
      | "district"
      | "full_name"
      | "state"
      | "store_name"
      | "street"
      | "whatsapp"
      | "zip_code"
    >
  > & { cep?: string },
) {
  return sellerRequest<SellerProfile>("/seller/profile", {
    body: JSON.stringify(payload),
    method: "PUT",
  }, token);
}

export async function getSellerWallet(token: string) {
  return sellerRequest<SellerWallet>("/finance/wallet", {}, token);
}

export async function listSellerWithdrawals(token: string) {
  return sellerRequest<SellerWithdrawal[]>("/finance/affiliate/withdrawals", {}, token);
}

export async function requestSellerWithdrawal(
  token: string,
  payload: { amount_cents: number; destination: "wallet" | "bank" },
) {
  return sellerRequest<SellerWithdrawal>("/finance/affiliate/withdrawals", {
    body: JSON.stringify(payload),
    method: "POST",
  }, token);
}

export async function forgotSellerPassword(email: string) {
  return sellerRequest<{ email: string }>("/auth/password/forgot", {
    body: JSON.stringify({ email }),
    method: "POST",
    headers: { "X-Client-App": "logista" },
  });
}

export async function resetSellerPassword(token: string, password: string) {
  return sellerRequest<{ email: string }>("/auth/password/reset", {
    body: JSON.stringify({ token, password }),
    method: "POST",
    headers: { "X-Client-App": "logista" },
  });
}

export async function getSellerSettings(token: string) {
  return sellerRequest<SellerSettings>("/seller/settings", {}, token);
}

export async function updateSellerSettings(token: string, payload: Partial<Pick<SellerSettings, "delivery" | "hours">>) {
  return sellerRequest<SellerSettings>("/seller/settings", {
    body: JSON.stringify(payload),
    method: "PUT",
  }, token);
}
