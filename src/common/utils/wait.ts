export const waitPeriod = (ms: number): Promise<void> =>
  new Promise((res) => setTimeout(res, ms));
