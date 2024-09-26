import { signOut } from "next-auth/react";

export const logout = async () => {
  try {
    await signOut();
  } catch (e) {
    throw new Error("Failed to logout: " + e);
  }
};
