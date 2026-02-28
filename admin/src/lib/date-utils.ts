/**
 * Returns a string representation of the UTC week for a given date in "YYYY-WW" format.
 * Matches the backend aggregation boundary logic.
 */
export function getUTCWeekStr(date: Date = new Date()): string {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    // Get first day of year
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    // Calculate full weeks to nearest Thursday
    const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    // Return formatted string
    return `${d.getUTCFullYear()}-${String(weekNo).padStart(2, '0')}`;
}

/**
 * Returns the current day in YYYY-MM-DD format (UTC).
 */
export function getUTCDayStr(date: Date = new Date()): string {
    return date.toISOString().split('T')[0];
}

/**
 * Returns the current month in YYYY-MM format (UTC).
 */
export function getUTCMonthStr(date: Date = new Date()): string {
    return date.toISOString().slice(0, 7);
}
