const DEFAULT_GOOGLE_APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwKSxtsmw-E52NQrEos8URCm3k7ogKxYhkBSmZFojRyxWHpVAOUp3FYyI9RFpCcEzRSuw/exec";

export function getGoogleAppsScriptUrl() {
  return process.env.GOOGLE_APPS_SCRIPT_URL || DEFAULT_GOOGLE_APPS_SCRIPT_URL;
}
