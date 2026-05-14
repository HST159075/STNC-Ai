import { createAuthClient } from "better-auth/react";

// IMPORTANT: NEXT_PUBLIC_AUTH_URL must point to the SERVER ROOT (no /api suffix).
// Better Auth client will append basePath (/api/auth) automatically.
// This is separate from NEXT_PUBLIC_API_URL (which has /api suffix for axios).
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:5000",
  basePath: "/api/auth",
  fetchOptions: {
    credentials: "include", // Required for cross-origin cookies
  },
});

export const { signIn, signOut, signUp, useSession } = authClient;