export interface IReport {
  id: string;
  user: string;
  report_number: string;
  report_status: string;
  report_submit_date: string | null;
  integration_status: string;
  integration_date: string | null;
  report_amount: string;
  report_date: string;
  expense_type: string;
  purpose: string;
  payment_method: string;
  report_currency: string;
  iexp_report_status?: string;
  iexp_report_number?: string;
  paid_amount?: string;
  error: boolean;
  created_at: string;
  updated_at: string;
}

export interface ICreateReportPayload {
  expense_type: string;
  purpose: string;
  payment_method: string;
  report_currency: string;
  report_amount: number;
  report_date: string;
  error: boolean;
}

export interface IExpense {
  title: string;
  amount: string;
  date: string;
}
