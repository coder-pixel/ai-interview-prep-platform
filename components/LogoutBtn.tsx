"use client";

import Image from "next/image";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { signOut } from "@/lib/actions/auth.action";
import { redirect } from "next/navigation";
import Swal from "sweetalert2";
import { useTransition } from "react";
import CustomSpinner from "./CustomSpinner";

export const LogoutBtn = () => {
  const [isLoading, startTransition] = useTransition();

  const _signOut = async () => {
    try {
      const { success, message } = await signOut();

      if (success) {
        toast.success(message);
        redirect("/sign-in");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const _signOutAlert = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to logout!",
      icon: "warning",
      confirmButtonText: "Yes, Logout!",
      showCancelButton: true,
      cancelButtonText: "Cancel",
      showCloseButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        startTransition(() => {
          _signOut();
        });
      }
    });
  };

  return (
    <Button
      variant="outline"
      size="icon"
      title="Logout"
      className="cursor-pointer"
      onClick={_signOutAlert}
      disabled={isLoading}
    >
      {isLoading ? (
        <CustomSpinner />
      ) : (
        <Image
          src="/logout-svgrepo-com.svg"
          alt="Logout Logo"
          width={20}
          height={20}
        />
      )}
    </Button>
  );
};
