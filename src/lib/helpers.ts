export function trimText(input: string, maxLength: number = 100): string {
  if (input.length <= maxLength) return input;
  return input.substring(0, maxLength - 3) + "...";
}

export function getCurrentTimeInIndia(): Date {
  const now = new Date();
  // Get the current time in IST (Indian Standard Time, UTC+5:30)
  return new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
}

export function formatTimeForIndia(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true, // 12-hour format with AM/PM
    timeZone: "Asia/Kolkata", // Automatically adjusts to IST
  };

  // Format the time
  let formattedTime = new Intl.DateTimeFormat("en-US", options).format(date);

  // Append the time zone abbreviation (IST)
  formattedTime += " IST";

  return formattedTime;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
