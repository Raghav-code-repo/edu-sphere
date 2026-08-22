export const formatDate = (date: Date) => date.toISOString().split('T')[0];
export const formatDateTime = (date: Date) => date.toISOString().replace('T', ' ').replace('Z', '');
export const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};
export const addMonths = (date: Date, months: number) => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};
