export const formatCurrency = (amount: number): string => {
  const formatted = new Intl.NumberFormat("ar-DZ", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    useGrouping: true,
  }).format(amount);
  return `${formatted} دج`;
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString("ar-DZ", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatRepetation = (rep: string): string => {
  if (rep === "MONTHLY") return "شهري";
  if (rep === "YEARLY") return "سنوي";
  return rep;
};
