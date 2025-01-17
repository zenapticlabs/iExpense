type AuthResponse = {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
};

class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthenticationError";
  }
}


const BASE_URL = "https://expense-management-server.vercel.app/api";

export const authService = {
  async verify(email: string, code: string): Promise<AuthResponse> {
    const response = await fetch(`${BASE_URL}/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });

    if (!response.ok) {
      throw new AuthenticationError("Verification failed");
    }

    return response.json();
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new AuthenticationError("Login failed");
    }

    return response.json();
  },
};
