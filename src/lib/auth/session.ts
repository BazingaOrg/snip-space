export const SESSION_COOKIE_NAME = "snipspace-session";

export function generateSessionToken(): string {
  return crypto.randomUUID();
}

export function getSessionCookieOptions() {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: isProduction,
    path: "/",
  };
}
