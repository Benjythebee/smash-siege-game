export const cleanNumber = (value: string) => {
  // sanitate the number but allow negatives
  return Number(value.replace(/[^0-9.-]/g, ''));
};
