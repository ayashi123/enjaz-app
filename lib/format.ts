export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("ar-SA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function formatScore(value: number) {
  return new Intl.NumberFormat("ar-SA", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  }).format(value);
}
