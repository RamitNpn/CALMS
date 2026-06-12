export const toLocalDateTimeInput = (date: string | Date) => {
  const d = new Date(date);

  const offset = d.getTimezoneOffset();

  const localDate = new Date(d.getTime() - offset * 60 * 1000);

  return localDate.toISOString().slice(0, 16);
};