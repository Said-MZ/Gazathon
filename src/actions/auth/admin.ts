"use server";

import { currentRole } from "./current-user";

export const admin = async () => {
  const role = await currentRole();

  if (role !== "admin") {
    return { error: "Forbidden" };
  }

  return { success: "Success" };
};
