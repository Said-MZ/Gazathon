/*
 * An array of public routes that don't need authentication.
 * routes that don't need authentication
 * @type {string[]}
 */
export const publicRoutes = ["/", "/auth/new-verification"];

/*
 * An array of routes that are used for authentication.
 * These will redirect logged in users to the settings page.
 * @type {string[]}
 */
export const authRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/error",
  "/auth/reset",
  "/auth/new-password",
];

/*
 * The prefix for the API authentication routes.
 * Routes that start with this prefix are used for api authentication purposes.
 * everybody should be able to access these routes
 * @type {string}
 */

export const apiAuthPrefix = "/api/auth";

/*
 * The default redirect path after a user logs in.
 * @type {string}
 */

export const DEFAULT_LOGIN_REDIRECT = "/settings";
