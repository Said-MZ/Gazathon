"use client";

import { useRouter } from "next/navigation";

enum Mode {
  Modal = "modal",
  Redirect = "redirect",
}

interface LoginButtonProps {
  children: React.ReactNode;
  mode?: Mode;
  asChild?: boolean;
}

const LoginButton = ({
  children,
  mode = Mode.Redirect,
}: LoginButtonProps) => {
  const router = useRouter();

  const onClick = () => {
    router.push("/auth/login");
  };

  if (mode === Mode.Modal) {
    return <span>TODO: Add modal</span>;
  }
  return (
    <span onClick={onClick} className="cursor-pointer">
      {children}
    </span>
  );
};

export default LoginButton;
