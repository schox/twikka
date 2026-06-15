// Utility to clear all local/session storage and cookies, then reload the app
export function clearAuthAndReload() {
  try {
    localStorage.clear();
    sessionStorage.clear();
    // Remove all cookies for the current domain
    document.cookie.split(';').forEach(c => {
      document.cookie = c
        .replace(/^ +/, '')
        .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
    });
  } catch {
    // Ignore errors
  }
  window.location.reload();
}
