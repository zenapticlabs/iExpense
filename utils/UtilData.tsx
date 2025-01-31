export const BASE_URL = "https://expense-management-server.vercel.app/api";

export const ReportStatusBgColor = (status: string): string => {
  const colors = {
    Submitted: "#eae4c7",
    Approved: "#c7e3ea",
    Paid: "#d7e3d0",
    Open: "#E4E4E4",
  };
  return colors[status as keyof typeof colors] || colors.Submitted;
};

export const ReportStatusTextColor = (status: string) => {
  const colors = {
    Submitted: "#4f440f",
    Approved: "#0f404c",
    Paid: "#1b350d",
    Open: "#1E1E1E",
  };
  return colors[status as keyof typeof colors] || colors.Submitted;
};

export const ReportTypes = [
  { label: "Domestic", value: "Domestic" },
  { label: "International", value: "International" },
];

export const ReportPreferences = [
  { label: "Cash", value: "Cash" },
  { label: "Credit Card", value: "Credit Card" },
  { label: "Debit Card", value: "Debit Card" },
];

export enum ExpenseType {
  airFare = "AirFare",
  airlineClubMembershipDues = "Airline Club Membership Dues",
  airlineFees = "Airline Fees",
  autoRental = "Auto Rental",
  automobile = "Automobile",
  businessMeals = "Business Meals",
  companySponsorCDFO = "Company Sponsor - CDFO",
  companySponsorVPDF = "Company Sponsor - VPDF",
  customerGifts = "Customer Gifts",
  dataProcessingDisksManual = "Data Processing-Disks, Manual",
  duesSubscriptions = "Dues & Subscriptions",
  entertainment = "Entertainment",
  entertainmentLevi = "Entertainment - Levi",
  fieldEngineerSupplies = "Field Engineer Supplies",
  gas = "GAS",
  hotel = "Hotel",
  internetHome = "Internet - Home",
  internetHotelAirplane = "Internet - Hotel/Airplane",
  laundry = "Laundry",
  mileage = "Mileage",
  officeSupplies = "Office Supplies",
  otherMarketingExpenses = "Other Marketing Expenses",
  otherTaxiTrainLimoToll = "Other-TaxiTrainLimoToll",
  parkingAndToll = "Parking and Toll",
  otherEmployeeExpenses = "Other Employee Expenses",
  postageShippingCharges = "Postage/Shipping Charges",
  prepaidExpenseFutureMonths = "Prepaid Expense Future Months",
  seminarsTraining = "Seminars & Training",
  telephoneCell = "Telephone - Cell",
  telephoneHome = "Telephone - Home",
  telephoneSupplies = "Telephone - Supplies",
  tips = "Tips",
  travelAgentFee = "Travel Agent Fee",
  marketingDevelopment = "Marketing Development",
}

export const WarningMessages = {
  approvedRequisition:
    "Approved Requisition is required for this expense type. Enter Requisition number in Justification Field",
  preApproval: "Pre-approval required, include approved form with receipts",
  mustPurchase: "Must include approved Purchase Requisition number",
  mustETA:
    "Must include approved ETA number. Enter ETA number in Justification field",
};

export const WarningMessagesByType: any = {
  [ExpenseType.airlineClubMembershipDues]: WarningMessages.approvedRequisition,
  [ExpenseType.automobile]: WarningMessages.preApproval,
  [ExpenseType.companySponsorVPDF]: WarningMessages.preApproval,
  [ExpenseType.customerGifts]: WarningMessages.preApproval,
  [ExpenseType.dataProcessingDisksManual]: WarningMessages.preApproval,
  [ExpenseType.entertainment]: WarningMessages.approvedRequisition,
  [ExpenseType.fieldEngineerSupplies]: WarningMessages.approvedRequisition,
  [ExpenseType.officeSupplies]: WarningMessages.mustPurchase,
  [ExpenseType.otherMarketingExpenses]: WarningMessages.approvedRequisition,
  [ExpenseType.seminarsTraining]: WarningMessages.mustETA,
  [ExpenseType.prepaidExpenseFutureMonths]: WarningMessages.preApproval,
  [ExpenseType.marketingDevelopment]: WarningMessages.approvedRequisition,
};

export const ExpenseDetailsInfos: any = {
  [ExpenseType.airlineClubMembershipDues]: {
    justificationRequired: true,
    receiptRequired: false,
    errorMessage: WarningMessages.approvedRequisition,
  },
  [ExpenseType.automobile]: {
    justificationRequired: true,
    receiptRequired: false,
    errorMessage: WarningMessages.preApproval,
  },
  [ExpenseType.companySponsorVPDF]: {
    justificationRequired: false,
    receiptRequired: true,
    errorMessage: WarningMessages.preApproval,
  },
  [ExpenseType.customerGifts]: {
    justificationRequired: false,
    receiptRequired: true,
    errorMessage: WarningMessages.preApproval,
  },
  [ExpenseType.dataProcessingDisksManual]: {
    justificationRequired: false,
    receiptRequired: true,
    errorMessage: WarningMessages.preApproval,
  },
  [ExpenseType.entertainment]: {
    justificationRequired: true,
    receiptRequired: false,
    errorMessage: WarningMessages.approvedRequisition,
  },
  [ExpenseType.fieldEngineerSupplies]: {
    justificationRequired: true,
    receiptRequired: false,
    errorMessage: WarningMessages.approvedRequisition,
  },
  [ExpenseType.officeSupplies]: {
    justificationRequired: false,
    receiptRequired: false,
    errorMessage: WarningMessages.mustPurchase,
  },
  [ExpenseType.otherMarketingExpenses]: {
    justificationRequired: true,
    receiptRequired: false,
    errorMessage: WarningMessages.approvedRequisition,
  },
  [ExpenseType.seminarsTraining]: {
    justificationRequired: true,
    receiptRequired: false,
    errorMessage: WarningMessages.mustETA,
  },
  [ExpenseType.prepaidExpenseFutureMonths]: {
    justificationRequired: true,
    receiptRequired: false,
    errorMessage: WarningMessages.preApproval,
  },
  [ExpenseType.marketingDevelopment]: {
    justificationRequired: true,
    receiptRequired: false,
    errorMessage: WarningMessages.approvedRequisition,
  },
};
