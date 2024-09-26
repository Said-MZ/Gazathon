"use client";

import useCurrentRole from "@/hooks/use-current-role";
interface adminGateProps {
  children: React.ReactNode;
  allowedRoles: "admin" | "user";
  error?: React.ReactNode | null;
}

const adminGate = ({ children, allowedRoles, error }: adminGateProps) => {
  const role = useCurrentRole();

  if (role !== allowedRoles) {
    return error;
  }

  return <>{children}</>;
};

export default adminGate;
