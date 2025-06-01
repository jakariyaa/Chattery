export function formatLocalTime(
  isoTimestamp: string,
  options?: Intl.DateTimeFormatOptions
): string {
  const date = new Date(isoTimestamp);
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

// create a function to compare from current time to the timestamp: e.g. 5 minutes ago, 1 hour ago, 1 day ago
export function formatRelativeTime(isoTimestamp: string): string {
  const date = new Date(isoTimestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days !== 1 ? "s" : ""} ago`;
  }
}
