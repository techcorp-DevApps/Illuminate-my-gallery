// Minimal frontend auth integration using JWT session from apps/api
export class AuthClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.accessToken = null;
  }

  async login(email, password) {
    const res = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) throw new Error('Login failed');
    const json = await res.json();
    this.accessToken = json.accessToken;
    return json;
  }

  async get(path) {
    const res = await fetch(`${this.baseUrl}${path}`, {
      headers: { Authorization: `Bearer ${this.accessToken}` }
    });
    return res;
  }
}

export function canAccessAdmin(authPayload) {
  return authPayload?.role === 'admin';
}

export function canAccessClientResource(authPayload, clientId) {
  return authPayload?.role === 'admin' || authPayload?.clientId === clientId;
}
