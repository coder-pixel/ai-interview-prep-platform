"use client";

import React, { useTransition } from "react";
import { Button } from "./ui/button";
import CustomSpinner from "./CustomSpinner";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface CustomButtonProps {
  className?: string;
  btnText: string | React.ReactNode;
  linkHref: string;
  isDisabled?: boolean;
  removeBtnClasses?: boolean;
  variant?: "link" | "outline" | "ghost" | "default" | "destructive";
  dontShowSpinner?: boolean;
  isLink?: boolean;
  title?: string;
}

const CustomButton = ({
  className,
  btnText,
  linkHref,
  isDisabled,
  removeBtnClasses = false,
  variant = "default",
  dontShowSpinner = false,
  isLink = false,
  title = "",
}: CustomButtonProps) => {
  const router = useRouter();

  const [isLoading, startTransition] = useTransition();

  return (
    <>
      {isLink ? (
        <Link href={linkHref} className={className} title={title}>
          {btnText}
        </Link>
      ) : (
        <Button
          title={title}
          className={`${
            removeBtnClasses ? "" : "btn-primary"
          } ${className} cursor-pointer`}
          variant={variant}
          onClick={() => {
            startTransition(() => {
              router.push(linkHref);
            });
          }}
          disabled={isDisabled || isLoading}
        >
          {btnText} {isLoading && !dontShowSpinner ? <CustomSpinner /> : null}
        </Button>
      )}
    </>
  );
};

export default CustomButton;
