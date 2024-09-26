"use client";

import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Button } from "../ui/button";
import { signIn } from "next-auth/react";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { useSearchParams } from "next/navigation";
const Social = () => {
  const searchParams = useSearchParams();
  // const callbackURL = searchParams.get("callbackURL");

  const onClick = async (provider: "google" | "github") => {
    await signIn(provider, {
      // callbackUrl: callbackURL || DEFAULT_LOGIN_REDIRECT,
      callbackUrl: DEFAULT_LOGIN_REDIRECT 
    });
  };
  return (
    <div className="flex items-center w-full gap-x-2">
      <Button
        size={"lg"}
        variant="outline"
        className="w-full"
        onClick={() => {
          onClick("google");
        }}
      >
        <FcGoogle className="w-5 h-5" />
      </Button>
      <Button
        size={"lg"}
        variant="outline"
        className="w-full"
        onClick={() => {
          onClick("github");
        }}
      >
        <FaGithub className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default Social;
