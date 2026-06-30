import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  forgotSellerPassword,
  linkSellerCredential,
  resetSellerPassword,
  loginSeller,
  saveSellerSession,
  getSellerSession,
  clearSellerSession,
} from "../app/_components/seller-api";

// ---------------------------------------------------------------------------
// Mock localStorage for jsdom environment
// ---------------------------------------------------------------------------

beforeEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function mockJsonResponse(data: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
  } as unknown as Response;
}

// ---------------------------------------------------------------------------
// forgotSellerPassword
// ---------------------------------------------------------------------------

describe("forgotSellerPassword", () => {
  it("sends POST to /auth/password/forgot with the given email", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      mockJsonResponse({ data: { email: "seller@example.com" } }),
    );

    await forgotSellerPassword("seller@example.com");

    expect(fetchSpy).toHaveBeenCalledOnce();
    const [url, init] = fetchSpy.mock.calls[0] as [string, RequestInit];
    expect(url).toContain("/auth/password/forgot");
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body as string)).toEqual({ email: "seller@example.com" });
  });

  it("includes X-Client-App: logista header", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      mockJsonResponse({ data: { email: "seller@example.com" } }),
    );

    await forgotSellerPassword("seller@example.com");

    const [, init] = fetchSpy.mock.calls[0] as [string, RequestInit];
    // The header is spread into init.headers from both the sellerRequest defaults and the
    // explicit override passed in the call, so we need to access it correctly.
    const headers = init.headers as Record<string, string>;
    expect(headers["X-Client-App"]).toBe("logista");
  });

  it("returns the data envelope from the API", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      mockJsonResponse({ data: { email: "seller@example.com" } }),
    );

    const result = await forgotSellerPassword("seller@example.com");

    expect(result).toEqual({ email: "seller@example.com" });
  });

  it("throws with the API message on error response", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      mockJsonResponse(
        { error: { message: "E-mail ou WhatsApp não encontrado." } },
        404,
      ),
    );

    await expect(forgotSellerPassword("nobody@example.com")).rejects.toThrow(
      "E-mail ou WhatsApp não encontrado.",
    );
  });

  it("throws a generic fallback message when no API message is present", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      mockJsonResponse(null, 500),
    );

    await expect(forgotSellerPassword("seller@example.com")).rejects.toThrow(
      "Nao foi possivel conectar a API do lojista.",
    );
  });
});

// ---------------------------------------------------------------------------
// resetSellerPassword
// ---------------------------------------------------------------------------

describe("resetSellerPassword", () => {
  it("sends POST to /auth/password/reset with token and password", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      mockJsonResponse({ data: { email: "seller@example.com" } }),
    );

    await resetSellerPassword("abc-token-123", "newpass456");

    expect(fetchSpy).toHaveBeenCalledOnce();
    const [url, init] = fetchSpy.mock.calls[0] as [string, RequestInit];
    expect(url).toContain("/auth/password/reset");
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body as string)).toEqual({ token: "abc-token-123", password: "newpass456" });
  });

  it("includes X-Client-App: logista header", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      mockJsonResponse({ data: { email: "seller@example.com" } }),
    );

    await resetSellerPassword("abc-token-123", "newpass456");

    const [, init] = fetchSpy.mock.calls[0] as [string, RequestInit];
    const headers = init.headers as Record<string, string>;
    expect(headers["X-Client-App"]).toBe("logista");
  });

  it("returns the email from the API on success", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      mockJsonResponse({ data: { email: "seller@example.com" } }),
    );

    const result = await resetSellerPassword("abc-token-123", "newpass456");

    expect(result).toEqual({ email: "seller@example.com" });
  });

  it("throws with the API message on invalid token (404)", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      mockJsonResponse({ message: "Link inválido ou já utilizado." }, 404),
    );

    await expect(resetSellerPassword("bad-token", "pass")).rejects.toThrow(
      "Link inválido ou já utilizado.",
    );
  });

  it("throws with the API message on expired token (410)", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      mockJsonResponse({ message: "Link expirado. Solicite um novo." }, 410),
    );

    await expect(resetSellerPassword("expired-token", "pass")).rejects.toThrow(
      "Link expirado. Solicite um novo.",
    );
  });

  it("throws with the API message on already-used token (409)", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      mockJsonResponse({ message: "Link já utilizado." }, 409),
    );

    await expect(resetSellerPassword("used-token", "pass")).rejects.toThrow(
      "Link já utilizado.",
    );
  });
});

// ---------------------------------------------------------------------------
// loginSeller
// ---------------------------------------------------------------------------

describe("loginSeller", () => {
  it("sends POST to /auth/seller/login with email payload when identifier contains @", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      mockJsonResponse({
        data: {
          access_token: "tok-access",
          refresh_token: "tok-refresh",
          user: { id: "u1", email: "seller@example.com", full_name: "Seller", role: "seller" },
        },
      }),
    );

    await loginSeller("seller@example.com", "secret123");

    const [url, init] = fetchSpy.mock.calls[0] as [string, RequestInit];
    expect(url).toContain("/auth/seller/login");
    expect(JSON.parse(init.body as string)).toEqual({ email: "seller@example.com", password: "secret123" });
  });

  it("sends POST to /auth/seller/login with whatsapp payload when identifier has no @", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      mockJsonResponse({
        data: {
          access_token: "tok-access",
          refresh_token: "tok-refresh",
          user: { id: "u1", email: "seller@example.com", full_name: "Seller", role: "seller" },
        },
      }),
    );

    await loginSeller("66999990001", "secret123");

    const [, init] = fetchSpy.mock.calls[0] as [string, RequestInit];
    expect(JSON.parse(init.body as string)).toEqual({ whatsapp: "66999990001", password: "secret123" });
  });

  it("saves the session in localStorage after successful login", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      mockJsonResponse({
        data: {
          access_token: "tok-access",
          refresh_token: "tok-refresh",
          user: { id: "u1", email: "seller@example.com", full_name: "Seller", role: "seller" },
        },
      }),
    );

    await loginSeller("seller@example.com", "secret123");

    const saved = getSellerSession();
    expect(saved).not.toBeNull();
    expect(saved!.accessToken).toBe("tok-access");
    expect(saved!.refreshToken).toBe("tok-refresh");
    expect(saved!.user?.email).toBe("seller@example.com");
  });

  it("returns the session with access_token mapped to accessToken", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      mockJsonResponse({
        data: {
          access_token: "tok-access",
          refresh_token: "tok-refresh",
          user: { id: "u1", email: "seller@example.com", full_name: "Seller", role: "seller" },
        },
      }),
    );

    const session = await loginSeller("seller@example.com", "secret123");

    expect(session.accessToken).toBe("tok-access");
    expect(session.refreshToken).toBe("tok-refresh");
  });

  it("throws with the API message on invalid credentials (401)", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      mockJsonResponse({ message: "E-mail ou senha inválidos." }, 401),
    );

    await expect(loginSeller("seller@example.com", "wrongpass")).rejects.toThrow(
      "E-mail ou senha inválidos.",
    );
  });
});

// ---------------------------------------------------------------------------
// linkSellerCredential
// ---------------------------------------------------------------------------

describe("linkSellerCredential", () => {
  it("sends POST to /auth/seller/link-credential with email and password", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      mockJsonResponse({
        data: {
          access_token: "tok-access",
          refresh_token: "tok-refresh",
          user: { id: "u1", email: "seller@example.com", full_name: "Seller", role: "seller" },
        },
      }),
    );

    await linkSellerCredential("seller@example.com", "secret123");

    const [url, init] = fetchSpy.mock.calls[0] as [string, RequestInit];
    expect(url).toContain("/auth/seller/link-credential");
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body as string)).toEqual({ email: "seller@example.com", password: "secret123" });
  });

  it("saves the linked seller session", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      mockJsonResponse({
        data: {
          access_token: "tok-access",
          refresh_token: "tok-refresh",
          user: { id: "u1", email: "seller@example.com", full_name: "Seller", role: "seller" },
        },
      }),
    );

    await linkSellerCredential("seller@example.com", "secret123");

    expect(getSellerSession()?.accessToken).toBe("tok-access");
  });
});

// ---------------------------------------------------------------------------
// saveSellerSession / getSellerSession / clearSellerSession
// ---------------------------------------------------------------------------

describe("session helpers", () => {
  it("saveSellerSession persists the session so getSellerSession retrieves it", () => {
    const session = {
      accessToken: "tok-abc",
      refreshToken: "tok-ref",
      user: { id: "u1", email: "s@example.com", full_name: "S", role: "seller" },
    };

    saveSellerSession(session);

    expect(getSellerSession()).toEqual(session);
  });

  it("clearSellerSession removes the persisted session", () => {
    saveSellerSession({ accessToken: "tok-abc" });

    clearSellerSession();

    expect(getSellerSession()).toBeNull();
  });

  it("getSellerSession returns null when nothing is stored", () => {
    expect(getSellerSession()).toBeNull();
  });

  it("getSellerSession returns null for corrupted stored data", () => {
    localStorage.setItem("suwave-logista-auth", "not-valid-json{{{");

    expect(getSellerSession()).toBeNull();
  });
});
