export function calcDateDiff(
  date1: Date,
  date2: Date,
): { minutes: number; days: number; months: number; years: number } {
  const diff = Math.floor(date1.getTime() - date2.getTime());
  const day = 1000 * 60 * 60 * 24;
  const minute = 1000 * 60;

  const minutes = Math.floor(diff / minute);
  const days = Math.floor(diff / day);
  const months = Math.floor(days / 31);
  const years = Math.floor(months / 12);

  return { minutes, days, months, years };
}
