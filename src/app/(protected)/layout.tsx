import React from "react";
import Navbar from "@/components/global/navbar";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}
const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return (
    <div>
      <Navbar />
      <div className="grid place-items-center w-full min-h-screen gap-y-10 bg-background">
        {children}
      </div>
    </div>
  );
};

export default ProtectedLayout;
