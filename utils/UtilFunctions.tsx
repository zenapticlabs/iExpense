export const formatDate = (dateString: string | undefined, noYear?: boolean) => {
  if (!dateString) return "N/A";
  // Parse the date in UTC and force it to stay in UTC
  const date = new Date(dateString + 'T00:00:00.000Z');
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: noYear ? undefined : "numeric",
    timeZone: 'UTC'  // Force UTC timezone for display
  });
};
