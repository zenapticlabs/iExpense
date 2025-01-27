export const formatDate = (dateString: string | undefined, noYear?: boolean) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: noYear ? undefined : "numeric",
  });
};
