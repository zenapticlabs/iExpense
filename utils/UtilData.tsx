export const ReportStatusBgColor = (status: string): string => {
  const colors = {
    submitted: "#eae4c7",
    approved: "#c7e3ea",
    paid: "#d7e3d0",
    Open: "#E4E4E4"
  };
  return colors[status as keyof typeof colors] || colors.submitted;
};

export const ReportStatusTextColor = (status: string) => {
  const colors = {
    submitted: "#4f440f",
    approved: "#0f404c",
    paid: "#1b350d",
    Open: "#1E1E1E"
  };
  return colors[status as keyof typeof colors] || colors.submitted;
};

export const ReportTypes = [
  { label: "Mobiles", value: "Mobiles" },
  { label: "Appliances", value: "Appliances" },
  { label: "Cameras", value: "Cameras" },
  { label: "Computers", value: "Computers" },
  { label: "Vegetables", value: "Vegetables" },
  { label: "Diary Products", value: "Diary Products" },
  { label: "Drinks", value: "Drinks" },
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
  marketingDevelopment = "Marketing Development"
}

const WarningMessages = {
  approvedRequisition: "Approved Requisition is required for this expense type. Enter Requisition number in Justification Field",
  preApproval: "Pre-approval required, include approved form with receipts",
  mustPurchase: "Must include approved Purchase Requisition number",
  mustETA: "Must include approved ETA number. Enter ETA number in Justification field"
}

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
}