import axios from "axios";
import { authService } from "./authService";
import { BASE_URL } from "@/utils/UtilData";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CACHE_EXPIRATION_HOURS = 24;

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
  value: string;
}

export interface MileageRate {
  rate: string;
  value: string;
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
    return this.fetchData("airlines");
  }

  async getCarTypes(): Promise<CommonListItem[]> {
    return this.fetchData("car-types");
  }

  async getCities(): Promise<CommonListItem[]> {
    return this.fetchData("cities");
  }

  async getExchangeRates(): Promise<ExchangeRate[]> {
    return this.fetchData("exchange-rates");
  }

  async getHotelDailyBaseRates(): Promise<HotelDailyBaseRate[]> {
    const baseRates = await this.fetchData("hotel-daily-base-rates");
    console.log(baseRates);
    const realRates = baseRates.map((value) => {
      if (value?.city === "Yokohama, Tokyo") {
        return {
          ...value,
          amount: "16000.00",
          currency: "JPY"
        }
      } else {
        return value
      }
    })
    console.log(realRates);
    return realRates;
  }

  async getMealCategories(): Promise<CommonListItem[]> {
    return this.fetchData("meal-categories");
  }

  async getMileageRates(): Promise<MileageRate[]> {
    return this.fetchData("mileage-rates");
  }

  async getRelationshipsToPai(): Promise<CommonListItem[]> {
    return this.fetchData("relationships-to-pai");
  }

  async getRentalAgencies(): Promise<CommonListItem[]> {
    return this.fetchData("rental-agencies");
  }

  async fetchResource(resource: string): Promise<any[]> {
    const resourceMap: Record<string, () => Promise<any[]>> = {
      "airlines": () => this.getAirlines(),
      "car-types": () => this.getCarTypes(),
      "cities": () => this.getCities(),
      "exchange-rates": () => this.getExchangeRates(),
      "hotel-daily-base-rates": () => this.getHotelDailyBaseRates(),
      "meal-categories": () => this.getMealCategories(),
      "mileage-rates": () => this.getMileageRates(),
      "relationships-to-pai": () => this.getRelationshipsToPai(),
      "rental-agencies": () => this.getRentalAgencies(),
    };

    const fetchFunction = resourceMap[resource];

    if (!fetchFunction) {
      return [];
    }

    let response = [];

    try {
      response = await fetchFunction();
    } catch (error) {
      console.log(error);
    }

    return response;
  }

  private async fetchData(endpoint: string): Promise<any[]> {
    const cacheKey = `common_${endpoint}`;
    
    try {
      const cachedData = await AsyncStorage.getItem(cacheKey);
      if (cachedData) {
        const { timestamp, data } = JSON.parse(cachedData);

        const now = new Date().getTime();
        const ageInHours = (now - timestamp) / (1000 * 60 * 60);
        
        if (ageInHours < CACHE_EXPIRATION_HOURS) {
          return data;
        }
      }

      const response = await axios.get(`${BASE_URL}/common/${endpoint}`, {
        headers: await this.getHeaders(),
      });

      const freshData = response?.data;

      await AsyncStorage.setItem(
        cacheKey,
        JSON.stringify({ timestamp: new Date().getTime(), data: freshData })
      );

      return freshData;
    } catch (error) {
      return [];
    }
  }
}

const commonService = new CommonService();
export default commonService;
