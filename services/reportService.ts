import { ICreateReportPayload, IReport } from "@/constants/types";
import { authService } from "./authService";
import axios from "axios";
const BASE_URL = "https://expense-management-server.vercel.app/api";

interface UpdateReportPayload {
  expense_type: string;
  purpose: string;
  payment_method: string;
  report_currency: string;
  report_amount: string;
  report_date: string;
  error: boolean;
}

export const reportService = {
  async getReports(): Promise<IReport[]> {
    const accessToken = await authService.getAccessToken();
    const response = await axios.get(`${BASE_URL}/reports`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status !== 200) {
      throw new Error("Failed to fetch reports");
    }

    return response.data;
  },

  async createReport(payload: ICreateReportPayload): Promise<IReport> {
    const accessToken = await authService.getAccessToken();
    const response = await axios.post(`${BASE_URL}/reports`, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status !== 201) {
      throw new Error("Failed to create report");
    }

    return response.data;
  },

  async deleteReport(reportId: string): Promise<void> {
    try {
      const accessToken = await authService.getAccessToken();
      const response = await axios.delete(`${BASE_URL}/reports/${reportId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status !== 204) {
        throw new Error("Failed to delete report");
      }
    } catch (error) {
      console.error("Error deleting report:", error);
      throw error;
    }
  },

  async getReportById(reportId: string): Promise<IReport> {
    const accessToken = await authService.getAccessToken();
    const response = await axios.get(`${BASE_URL}/reports/${reportId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status !== 200) {
      throw new Error("Failed to fetch report");
    }

    return response.data;
  },

  async updateReport(
    reportId: string,
    payload: UpdateReportPayload,
    accessToken: string
  ): Promise<Report> {
    const response = await fetch(`${BASE_URL}/reports/${reportId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Failed to update report");
    }

    return response.json();
  },

  async getReportItems(reportId: string): Promise<any> {
    const accessToken = await authService.getAccessToken();
    const response = await axios.get(`${BASE_URL}/reports/${reportId}/items`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status !== 200) {
      throw new Error("Failed to fetch report");
    }

    return response.data;
  },

};
