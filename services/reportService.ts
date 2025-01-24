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

interface ReportStatusPayload {
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

  async createReportItem(payload: any, reportId: string): Promise<any> {
    const accessToken = await authService.getAccessToken();
    try {
      const response = await axios.post(
        `${BASE_URL}/reports/${reportId}/items`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.status !== 201) {
        throw new Error("Failed to create report item");
      }
      return response.data;
    } catch (error) {
      console.error("Error creating report item:", error);
      throw error;
    }
  },

  async updateReportItem(
    reportId: string,
    itemId: string,
    payload: any
  ): Promise<any> {
    const accessToken = await authService.getAccessToken();
    const response = await axios.put(
      `${BASE_URL}/reports/${reportId}/items/${itemId}`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  },

  async deleteReportItem(reportId: string, itemId: string): Promise<void> {
    try {
      const accessToken = await authService.getAccessToken();
      const response = await fetch(
        `${BASE_URL}/reports/${reportId}/items/${itemId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete report item");
      }
    } catch (error) {
      console.error("Error deleting report item:", error);
      throw error;
    }
  },

  async updateReportStatus(reportId: string, payload: ReportStatusPayload): Promise<IReport> {
    const accessToken = await authService.getAccessToken();
    const response = await axios.put(`${BASE_URL}/reports/${reportId}/status/`, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status !== 200) {
      throw new Error("Failed to update report status");
    }

    return response.data;
  },

  async submitReport(reportId: string, payload: ReportStatusPayload): Promise<IReport> {
    const accessToken = await authService.getAccessToken();
    const response = await axios.put(`${BASE_URL}/reports/${reportId}/submit/`, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status !== 200) {
      throw new Error("Failed to submit report");
    }

    return response.data;
  },
};
