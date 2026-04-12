export function getGoogleAppsScriptUrl() {
  const url = process.env.GOOGLE_APPS_SCRIPT_URL;

  if (!url) {
    throw new Error("GOOGLE_APPS_SCRIPT_URL belum diatur di environment variables.");
  }

  return url;
}
