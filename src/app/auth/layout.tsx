import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full grid place-items-center bg-background">
      {children}
    </div>
  );
};

export default AuthLayout;
