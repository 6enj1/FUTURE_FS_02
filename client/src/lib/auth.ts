let token: string | null = null;

export function getToken(): string | null {
  if (token) return token;
  return localStorage.getItem("crm_token");
}

export function setToken(newToken: string) {
  token = newToken;
  localStorage.setItem("crm_token", newToken);
}

export function clearToken() {
  token = null;
  localStorage.removeItem("crm_token");
}

export function isAuthenticated(): boolean {
  return !!getToken();
}
