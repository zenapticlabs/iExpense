import { IReport } from "@/constants/types";
import { authService } from "./authService";
import axios from "axios";
const BASE_URL = "https://expense-management-server.vercel.app/api";

interface CreateReportPayload {
  expense_type: string;
  purpose: string;
  payment_method: string;
  report_currency: string;
  report_amount: number;
  report_date: string;
  error: boolean;
}

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

  async createReport(
    payload: CreateReportPayload,
    accessToken: string
  ): Promise<Report> {
    const response = await fetch(`${BASE_URL}/reports`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Failed to create report");
    }

    return response.json();
  },

  async deleteReport(reportId: string, accessToken: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/reports/${reportId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete report");
    }
  },

  async getReport(reportId: string, accessToken: string): Promise<Report> {
    const response = await fetch(`${BASE_URL}/reports/${reportId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch report");
    }

    return response.json();
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
};
