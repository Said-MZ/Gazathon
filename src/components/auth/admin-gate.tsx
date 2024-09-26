"use client";

import useCurrentRole from "@/hooks/use-current-role";
interface AdminGateProps {
  children: React.ReactNode;
  allowedRoles: "admin" | "user";
  error?: React.ReactNode | null;
}

const AdminGate = ({ children, allowedRoles, error }: AdminGateProps) => {
  const role = useCurrentRole();

  if (role !== allowedRoles) {
    return error;
  }

  return <>{children}</>;
};

export default AdminGate;
