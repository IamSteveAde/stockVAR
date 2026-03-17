import { apiFetch } from "./client";
import type { UserRole } from "@/types/auth";

export type AuthUser = {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
};

export type AuthSession = {
  token: string;
  user: AuthUser;
};

type LoginResponse = {
  status?: string;
  message?: string;
  token?: string;
  user?: AuthUser;
  data?: {
    token?: string;
    user?: AuthUser & {
      emailVerified?: boolean;
      email_verified?: boolean;
      isEmailVerified?: boolean;
      verified?: boolean;
    };
    accessType?: string;
    emailVerified?: boolean;
    email_verified?: boolean;
    isEmailVerified?: boolean;
    verified?: boolean;
  };
};

type SignUpPayload = {
  fullName?: string;
  email: string;
  phone?: string;
  phoneNumber?: string;
  password: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

type ForgotPasswordPayload = {
  email: string;
};

type ResetPasswordPayload = {
  token: string;
  password: string;
};

type SetPasswordPayload = {
  password: string;
  token?: string | null;
};

const SESSION_STORAGE_KEY = "stockvar_session";

function normalizeRole(accessType: string | undefined): UserRole {
  if (!accessType) return "owner";
  const normalized = accessType.toLowerCase();
  if (normalized.includes("staff")) return "staff";
  if (normalized.includes("manager")) return "manager";
  return "owner";
}

function decodeJwt(token: string): Record<string, unknown> {
  try {
    const payload = token.split(".")[1];
    if (!payload) return {};
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return {};
  }
}

function isEmailVerifiedFromPayload(payload: Record<string, unknown>): boolean | undefined {
  if (typeof payload.email_verified === "boolean") return payload.email_verified;
  if (typeof payload.emailVerified === "boolean") return payload.emailVerified;
  if (typeof payload.isEmailVerified === "boolean") return payload.isEmailVerified;
  if (typeof payload.verified === "boolean") return payload.verified;
  return undefined;
}

export async function signUp(payload: SignUpPayload): Promise<void> {
  const body: Record<string, unknown> = {
    fullName: payload.fullName,
    email: payload.email,
    password: payload.password,
  };

  const phoneVal = payload.phone ?? payload.phoneNumber;
  if (phoneVal) {
    body.phoneNo = phoneVal.replace(/^\+/, "");
    body.phone = phoneVal;
    body.phoneNumber = phoneVal;
  }

  await apiFetch<unknown>("api/auth/sign-up", {
    method: "POST",
    body,
  });
}

export async function login(payload: LoginPayload): Promise<AuthSession> {
  const res = await apiFetch<LoginResponse>("api/auth/sign-in", {
    method: "POST",
    body: payload,
  });

  if (res.status && res.status !== "success") {
    throw new Error(res.message || "Invalid email or password.");
  }

  const token = res.token ?? res.data?.token;
  if (!token) {
    throw new Error("Login response is missing a token.");
  }

  const jwtPayload = decodeJwt(token);
  const jwtVerified = isEmailVerifiedFromPayload(jwtPayload);

  const emailVerifiedFromData =
    res.data?.emailVerified ??
    res.data?.email_verified ??
    res.data?.isEmailVerified ??
    res.data?.verified ??
    res.data?.user?.emailVerified ??
    res.data?.user?.email_verified ??
    res.data?.user?.isEmailVerified ??
    res.data?.user?.verified;

  const isEmailVerified =
    emailVerifiedFromData ?? jwtVerified;

  if (isEmailVerified === false) {
    throw new Error(
      "Your email is not verified yet. Please verify your email before logging in."
    );
  }

  const role = normalizeRole(res.data?.accessType ?? "owner");

  const user: AuthUser = {
    id: res.user?.id ?? res.data?.user?.id ?? "",
    fullName: res.user?.fullName ?? res.data?.user?.fullName ?? "",
    email: res.user?.email ?? res.data?.user?.email ?? payload.email,
    role,
  };

  const session: AuthSession = { token, user };
  saveSession(session);
  return session;
}

export async function requestPasswordReset(
  payload: ForgotPasswordPayload
): Promise<void> {
  await apiFetch<unknown>("api/auth/reset", {
    method: "POST",
    body: payload,
  });
}

export async function setPassword(
  payload: SetPasswordPayload,
  token?: string | null
): Promise<void> {
  await apiFetch<unknown>("api/auth/set-pwd", {
    method: "POST",
    body: payload,
    token,
  });
}

export function saveSession(session: AuthSession) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

export function getSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

export function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_STORAGE_KEY);
}

