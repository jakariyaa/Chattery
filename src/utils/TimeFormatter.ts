export function formatLocalTime(
  isoTimestamp: string,
  options?: Intl.DateTimeFormatOptions
): string {
  const date = new Date(isoTimestamp);
  // Default: show hour and minute in user's locale, 12/24h based on system
  const defaultOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
  };
  return date.toLocaleTimeString(undefined, { ...defaultOptions, ...options });
}

export function formatLocalDateTime(isoTimestamp: string): string {
  const date = new Date(isoTimestamp);
  return date.toLocaleString();
}
