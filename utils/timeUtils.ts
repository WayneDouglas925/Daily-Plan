
/**
 * Calculates a time string 3 hours before the given HH:mm time.
 */
export const calculateKitchenCloseTime = (bedtime: string): string => {
  if (!bedtime) return "--:--";
  
  const [hours, minutes] = bedtime.split(':').map(Number);
  let closeHours = hours - 3;
  
  // Handle wraparound
  if (closeHours < 0) {
    closeHours = 24 + closeHours;
  }
  
  return `${closeHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

/**
 * Formats a number to a fixed decimal for display.
 */
export const formatEquity = (val: number): string => val.toFixed(0);

/**
 * Gets today's date string for comparison.
 */
export const getTodayString = (): string => new Date().toISOString().split('T')[0];
