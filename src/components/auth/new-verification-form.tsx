"use client";

import CardWrapper from "./card-wrapper";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import FormSuccess from "./form-success";
import FormError from "./form-error";
import Spinner from "@/components/ui/spinner";
import { newVerification } from "@/actions/auth/new-verification";

const NewVerificationForm = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const onSubmit = useCallback(async () => {
    if (error || success) return;
    if (!token) {
      setError("No token provided");
      return;
    }

    newVerification(token)
      .then((data) => {
        setSuccess(data?.success);
        setError(data?.error);
      })
      .catch(() => {
        setError("Something went wrong");
      });
  }, [token, success, error]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <CardWrapper
      headerLabel="Confirming your verification"
      backButtonHref="/auth/login"
      backButtonLabel="Back to login"
    >
      <div className="flex flex-col items-center justify-center w-full gap-7 min-h-28">
        {error || success ? (
          <div>
            <FormSuccess message={success} />
            {!success && <FormError message={error} />}
          </div>
        ) : (
          <Spinner color="background" />
        )}
      </div>
    </CardWrapper>
  );
};

export default NewVerificationForm;
