export const ReportStatusBgColor = (status: string): string => {
  const colors = {
    submitted: "#eae4c7",
    approved: "#c7e3ea",
    paid: "#d7e3d0"
  };
  return colors[status as keyof typeof colors] || colors.submitted;
};

export const ReportStatusTextColor = (status: string) => {
  const colors = {
    submitted: "#4f440f",
    approved: "#0f404c",
    paid: "#1b350d",
  };
  return colors[status as keyof typeof colors] || colors.submitted;
};

