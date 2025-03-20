//returns next sunday
export function getPreviousGiveawayDate(): Date {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysUntilSunday = (7 - dayOfWeek) % 7; // Calculate days until next Sunday

  const previousDate = new Date(today);
  previousDate.setDate(today.getDate() + daysUntilSunday - 7); // Set date to next Sunday
  previousDate.setUTCHours(23, 59, 0, 0);
  return previousDate;
}
