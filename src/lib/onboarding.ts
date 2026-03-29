const SIGNUP_EMAIL_KEY = "stockvar_signup_email";
const SIGNUP_NAME_KEY = "stockvar_signup_name";
const ONBOARDING_DONE_KEY = "stockvar_onboarding_complete";

export function persistSignupEmail(email: string) {
  if (typeof window === "undefined") return;
  const value = email.trim();
  if (!value) return;
  sessionStorage.setItem(SIGNUP_EMAIL_KEY, value);
}

export function persistSignupName(fullName: string) {
  if (typeof window === "undefined") return;
  const value = fullName.trim();
  if (!value) return;
  sessionStorage.setItem(SIGNUP_NAME_KEY, value);
}

export function readSignupEmail(): string {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem(SIGNUP_EMAIL_KEY) ?? "";
}

export function readSignupName(): string {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem(SIGNUP_NAME_KEY) ?? "";
}

export function clearSignupEmail() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SIGNUP_EMAIL_KEY);
}

export function clearSignupName() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SIGNUP_NAME_KEY);
}

export function markOnboardingComplete() {
  if (typeof window === "undefined") return;
  localStorage.setItem(ONBOARDING_DONE_KEY, "true");
}

export function isOnboardingComplete(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(ONBOARDING_DONE_KEY) === "true";
}

export function clearOnboardingComplete() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ONBOARDING_DONE_KEY);
}
