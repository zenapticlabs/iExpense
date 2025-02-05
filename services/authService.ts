import { storage } from "@/utils/storage";
import axios from "axios";

type AuthResponse = {
  access: string;
  refresh: string;
};

class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthenticationError";
  }
}

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const authService = {
  async getMe(): Promise<any> {
    const { access } = await storage.getAuthData();
    const response = await axios.get(`${BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    });
    return response.data;
  },

  async getAccessToken(): Promise<string> {
    const { access } = await storage.getAuthData();
    return access;
  },

  async refreshToken(): Promise<AuthResponse> {
    try {
      const { refresh } = await storage.getAuthData();
      const response = await axios.post(`${BASE_URL}/auth/refresh`, {
        refresh,
      });
      return response.data;
    } catch (error) {
      throw new AuthenticationError("Refresh token failed");
    }
  },

  async verify(email: string, code: string): Promise<AuthResponse> {
    const response = await axios.post(`${BASE_URL}/auth/verify-mfa`, {
      email,
      code,
    });

    if (response.status !== 200) {
      throw new AuthenticationError("Verification failed");
    }

    return response.data;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, {
        email,
        password,
      });

      return response.data;
    } catch (error: any) {
      if (error.response.data.code == "second_factor_required") {
        throw "second_factor_required";
      }
      throw "Invalid login credentials";
    }
  },

  async addCreditCard(
    cardNumber: string,
    expirationDate: string
  ): Promise<any> {
    const { access } = await storage.getAuthData();
    const response = await axios.post(
      `${BASE_URL}/auth/credit-card`,
      {
        card_number: cardNumber,
        expiration_date: expirationDate,
      },
      {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      }
    );
    return response.data;
  },
  async getCreditCard(): Promise<any> {
    const { access } = await storage.getAuthData();
    const response = await axios.get(`${BASE_URL}/auth/credit-card`, {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    });
    return response.data;
  },
  async deleteCreditCard(): Promise<any> {
    const { access } = await storage.getAuthData();
    const response = await axios.delete(`${BASE_URL}/auth/credit-card`, {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    });
    return response.data;
  },
  async changeCurrency(currency: string): Promise<any> {
    const { access } = await storage.getAuthData();
    const response = await axios.patch(
      `${BASE_URL}/auth/me`,
      {
        currency,
      },
      {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      }
    );
    return response.data;
  },
  async changePassword(oldPassword: string, newPassword: string): Promise<any> {
    try {
      const { access } = await storage.getAuthData();
      const response = await axios.patch(
        `${BASE_URL}/auth/reset-password`,

        {
          current_password: oldPassword,
          new_password: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },
};
