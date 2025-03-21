export const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const ReportStatusBgColor = (status: string): string => {
  const colors = {
    Submitted: "#eae4c7",
    Approved: "#c7e3ea",
    Paid: "#d7e3d0",
    Open: "#E4E4E4",
    Rejected: "#f4c7c7",
  };
  return colors[status as keyof typeof colors] || colors.Submitted;
};

export const ReportStatusTextColor = (status: string) => {
  const colors = {
    Submitted: "#4f440f",
    Approved: "#0f404c",
    Paid: "#1b350d",
    Open: "#1E1E1E",
    Rejected: "#4f440f",
  };
  return colors[status as keyof typeof colors] || colors.Submitted;
};

export const ReportTypes = [
  { label: "Domestic", value: "Domestic" },
  { label: "International", value: "International" },
];

export const ReportPreferences = [
  { label: "Cash", value: "Cash" },
  { label: "Credit Card", value: "Credit Card" }
];

export enum ExpenseType {
  airFare = "Airfare",
  airlineClubMembershipDues = "Airline Club Membership Dues",
  airlineFees = "Airline Fees",
  autoRental = "Auto Rental",
  automobile = "Automobile",
  businessMeals = "Business Meals",
  companySponsorCDFO = "Company Sponsor - CDFO",
  companySponsorVPDF = "Company Sponsor - VPDF",
  customerGifts = "Customer Gifts",
  dataProcessingDisksManual = "Data Processing-Disks, Manual",
  distributorCoopFunds = "Distributor Co-Op Funds",
  duesSubscriptions = "Dues & Subscriptions",
  entertainment = "Entertainment",
  entertainmentLevi = "Entertainment - Levi",
  fieldEngineerSupplies = "Field Engineer Supplies",
  gas = "Gas",
  hotel = "Hotel",
  internetHome = "Internet - Home",
  internetHotelAirplane = "Internet - Hotel/Airplane",
  laundry = "Laundry",
  mileage = "Mileage",
  officeSupplies = "Office Supplies",
  otherMarketingExpenses = "Other Marketing Expenses",
  otherTransportTaxiTrainLimousine = "Other Transport - Taxi, Train, Limousine",
  otherTransportTaxiTrainLimoToll = "Other Transport -Taxi,Train,Limo,Toll",
  parkingAndToll = "Parking and Toll",
  otherEmployeeExpenses = "Other Employee Expenses",
  postageShippingCharges = "Postage/Shipping Charges",
  prepaidExpenseFutureMonths = "Prepaid Expenses-Future Months",
  seminarsTraining = "Seminars & Training",
  telephoneCell = "Telephone - Cell",
  telephoneHome = "Telephone - Home",
  telephoneSupplies = "Telephone - Supplies",
  tips = "Tips",
  travelAgentFee = "Travel Agent Fee",
  marketingDevelopmentFund = "Marketing Development Fund"
}

export const ExpenseTypes: Record<number, Record<string, string[]>> = {
  101: {
    Domestic: [
      "Airfare",
      "Airline Club Membership Dues",
      "Airline Fees",
      "Auto Rental",
      "Automobile",
      "Business Meals",
      "Company Sponsor - CDFO",
      "Company Sponsor - VPDF",
      "Customer Gifts",
      "Data Processing-Disks, Manual",
      "Distributor Co-Op Funds",
      "Dues & Subscriptions",
      "Entertainment",
      "Entertainment - Levi",
      "Field Engineer Supplies",
      "Gas",
      "Hotel",
      "Internet - Home",
      "Internet - Hotel/Airplane",
      "Laundry",
      "Marketing Development Fund",
      "Mileage",
      "Office Supplies",
      "Other Employee Expenses",
      "Other Marketing Expenses",
      "Other Transport - Taxi, Train, Limousine",
      "Parking and Toll",
      "Postage/Shipping Charges",
      "Prepaid Expenses-Future Months",
      "Seminars & Training",
      "Telephone - Cell",
      "Telephone - Home",
      "Telephone - Supplies",
      "Tips",
      "Travel Agent Fee"
    ],
    International: [
      "Airfare",
      "Airline Club Membership Dues",
      "Airline Fees",
      "Auto Rental",
      "Business Meals",
      "Company Sponsor - CDFO",
      "Company Sponsor - VPDF",
      "Customer Gifts",
      "Entertainment",
      "Gas",
      "Hotel",
      "Internet - Home",
      "Internet - Hotel/Airplane",
      "Laundry",
      "Mileage",
      "Office Supplies",
      "Other Employee Expenses",
      "Other Transport -Taxi,Train,Limo,Toll",
      "Parking",
      "Postage/Shipping Charges",
      "Telephone - Cell",
      "Telephone - Home",
      "Telephone - Supplies",
      "Tips",
      "Travel Agent Fee"
    ]
  },
  141: {
    Domestic: [
      "Airfare",
      "Airline Club Membership Dues",
      "Airline Fees",
      "Auto Rental",
      "Business Meals",
      "Customer Gifts",
      "Entertainment",
      "Entertainment - Levi",
      "Gas",
      "Hotel",
      "Laundry",
      "Mileage",
      "Other Employee Expenses",
      "Other Transport - Taxi, Train, Limousine",
      "Parking",
      "Telephone - Cell",
      "Tips",
      "Travel Agent Fee"
    ],
    International: [
      "Airfare",
      "Airline Club Membership Dues",
      "Airline Fees",
      "Auto Rental",
      "Business Meals",
      "Customer Gifts",
      "Gas",
      "Hotel",
      "Laundry",
      "Mileage",
      "Office Supplies",
      "Other Employee Expenses",
      "Other Transport -Taxi,Train,Limo,Toll",
      "Parking",
      "Telephone - Cell",
      "Tips",
      "Travel Agent Fee"
    ]
  }
};

export const getAllowedExpenseTypes = (orgId: number, reportType: string) => {
  return ExpenseTypes[orgId]?.[reportType] || [];
};

export const WarningMessages = {
  approvedRequisition:
    "Approved Requisition is required for this expense type. Enter Requisition number in Justification Field",
  preApproval: "Pre-approval required, include approved form with receipts",
  mustPurchase: "Must include approved Purchase Requisition number",
  mustETA:
    "Must include approved ETA number. Enter ETA number in Justification field",
  notesRequired: "Must include Notes",
  justficiationRequired: "Justification is required"
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
  [ExpenseType.marketingDevelopmentFund]: WarningMessages.approvedRequisition,
};

export const ExpenseDetailsInfos: any = {
  [ExpenseType.airlineFees]: {
    justificationRequired: true,
    receiptRequired: false,
    errorMessage: WarningMessages.approvedRequisition,
  },
  [ExpenseType.automobile]: {
    justificationRequired: true,
    receiptRequired: false,
    errorMessage: WarningMessages.preApproval,
  },
  [ExpenseType.companySponsorCDFO]: {
    justificationRequired: false,
    receiptRequired: true,
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
    justificationRequired: true,
    receiptRequired: true,
    errorMessage: WarningMessages.preApproval,
  },
  [ExpenseType.duesSubscriptions]: {
    justificationRequired: true,
    receiptRequired: true,
    errorMessage: WarningMessages.approvedRequisition,
  },
  [ExpenseType.fieldEngineerSupplies]: {
    justificationRequired: true,
    receiptRequired: false,
    errorMessage: WarningMessages.approvedRequisition,
  },
  [ExpenseType.gas]: {
    justificationRequired: true,
    receiptRequired: false,
  },
  [ExpenseType.officeSupplies]: {
    justificationRequired: true,
    receiptRequired: false,
    errorMessage: WarningMessages.mustPurchase,
  },
  [ExpenseType.otherEmployeeExpenses]: {
    justificationRequired: true,
    receiptRequired: false,
  },
  [ExpenseType.otherMarketingExpenses]: {
    justificationRequired: true,
    receiptRequired: false,
    errorMessage: WarningMessages.approvedRequisition,
  },
  [ExpenseType.postageShippingCharges]: {
    justificationRequired: true,
    receiptRequired: false,
  },
  [ExpenseType.prepaidExpenseFutureMonths]: {
    justificationRequired: true,
    receiptRequired: false,
    errorMessage: WarningMessages.approvedRequisition
  },
  [ExpenseType.seminarsTraining]: {
    justificationRequired: true,
    receiptRequired: false,
    errorMessage: WarningMessages.mustETA,
  },
  [ExpenseType.marketingDevelopmentFund]: {
    justificationRequired: true,
    receiptRequired: false,
  },
  [ExpenseType.distributorCoopFunds]: {
    justificationRequired: true,
    receiptRequired: false,
    errorMessage: WarningMessages.notesRequired
  },
  [ExpenseType.airlineClubMembershipDues]: {
    justificationRequired: false,
    receiptRequired: false,
    errorMessage: WarningMessages.notesRequired
  }
};
