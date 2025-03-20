//returns next sunday
export function getNextGiveawayDate(): Date {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysUntilSunday = (7 - dayOfWeek) % 7 || 7; // Calculate days until next Sunday
  const nextGiveawayDate = new Date(today);
  nextGiveawayDate.setDate(today.getDate() + daysUntilSunday); // Set date to next Sunday
  nextGiveawayDate.setUTCHours(23, 59, 0, 0);

  return nextGiveawayDate;
}
