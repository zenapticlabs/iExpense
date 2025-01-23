import axios from "axios";
import { authService } from "./authService";

const BASE_URL = "https://expense-management-server.vercel.app/api";

export interface CommonListItem {
  value: string;
  description?: string;
}

export interface ExchangeRate {
  target_currency: string;
  rate: string;
  id: number;
  date_fetched: string;
}

export interface HotelDailyBaseRate {
  country: string;
  city: string;
  amount: string;
  currency: string;
  id: number;
}

export interface MileageRate {
  rate: string;
  title: string;
  id: number;
}

class CommonService {
  private async getHeaders() {
    const accessToken = await authService.getAccessToken();
    return {
      Authorization: `Bearer ${accessToken}`,
    };
  }

  async getAirlines(): Promise<CommonListItem[]> {
    const response = await axios.get(`${BASE_URL}/common/airlines`, {
      headers: await this.getHeaders(),
    });
    return response.data;
  }

  async getCarTypes(): Promise<CommonListItem[]> {
    const response = await axios.get(`${BASE_URL}/common/car-types`, {
      headers: await this.getHeaders(),
    });
    return response.data;
  }

  async getCities(): Promise<CommonListItem[]> {
    const response = await axios.get(`${BASE_URL}/common/cities`, {
      headers: await this.getHeaders(),
    });
    return response.data;
  }

  async getExchangeRates(): Promise<ExchangeRate[]> {
    const response = await axios.get(`${BASE_URL}/common/exchange-rates`, {
      headers: await this.getHeaders(),
    });
    return response.data;
  }

  async getHotelDailyBaseRates(): Promise<HotelDailyBaseRate[]> {
    const response = await axios.get(
      `${BASE_URL}/common/hotel-daily-base-rates`,
      {
        headers: await this.getHeaders(),
      }
    );
    return response.data;
  }

  async getMealCategories(): Promise<CommonListItem[]> {
    const response = await axios.get(`${BASE_URL}/common/meal-categories`, {
      headers: await this.getHeaders(),
    });
    return response.data;
  }

  async getMileageRates(): Promise<MileageRate[]> {
    const response = await axios.get(`${BASE_URL}/common/mileage-rates`, {
      headers: await this.getHeaders(),
    });
    return response.data;
  }

  async getRelationshipsToPai(): Promise<CommonListItem[]> {
    const response = await axios.get(
      `${BASE_URL}/common/relationships-to-pai`,
      {
        headers: await this.getHeaders(),
      }
    );
    return response.data;
  }

  async getRentalAgencies(): Promise<CommonListItem[]> {
    const response = await axios.get(`${BASE_URL}/common/rental-agencies`, {
      headers: await this.getHeaders(),
    });
    return response.data;
  }
}

export const commonService = new CommonService();
export default commonService;
