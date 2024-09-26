"use client";

import UserInfo from "@/components/user-info";
import { useCurrentUser } from "@/hooks/use-current-user";
import React from "react";

const ClientPage = () => {
  const user = useCurrentUser();

  return <UserInfo user={user} label="📱 Server Component" />;
};

export default ClientPage;
