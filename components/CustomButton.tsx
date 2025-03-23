"use client";

import React, { useTransition } from "react";
import { Button } from "./ui/button";
import CustomSpinner from "./CustomSpinner";
import { useRouter } from "next/navigation";

interface CustomButtonProps {
  btnClasses?: string[];
  btnText: string;
  linkHref: string;
  isDisabled?: boolean;
}

const CustomButton = ({
  btnClasses,
  btnText,
  linkHref,
  isDisabled,
}: CustomButtonProps) => {
  const router = useRouter();

  const [isLoading, startTransition] = useTransition();

  return (
    <Button
      className={`btn-primary ${btnClasses}`}
      onClick={() => {
        startTransition(() => {
          router.push(linkHref);
        });
      }}
      disabled={isDisabled || isLoading}
    >
      {btnText} {isLoading ? <CustomSpinner /> : null}
    </Button>
  );
};

export default CustomButton;
