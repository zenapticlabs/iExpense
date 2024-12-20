export type IReport = {
  title: string;
  id: string;
  submission?: string;
  approval: string | null;
  state: "submitted" | "approved" | "paid";
  amount: number;
};

export interface IExpense {
  title: string;
  amount: string;
  date: string;
}
