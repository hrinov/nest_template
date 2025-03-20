export const getCurrentUtcDate = (): Date => {
  const currentDate = new Date();
  const currentUtcDate = new Date(
    currentDate.getTime() + currentDate.getTimezoneOffset() * 60000,
  );

  return currentUtcDate;
};
