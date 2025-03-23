import React, { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { isAuthenticated } from "@/lib/actions/auth.action";
import { redirect } from "next/navigation";
import { LogoutBtn } from "@/components/LogoutBtn";
import CustomButton from "@/components/CustomButton";

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();

  if (!isUserAuthenticated) {
    redirect("/sign-in");
  }

  return (
    <div className="root-layout">
      <nav className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="MockMate Logo" width={38} height={32} />
          <h2 className="text-primary-100">InterviewPrep</h2>
        </Link>

        <div className="flex items-center gap-2">
          <LogoutBtn />

          <CustomButton
            linkHref="/profile"
            className="p-0"
            btnText={
              <Image src="/profile.svg" alt="Profile" width={30} height={30} />
            }
            removeBtnClasses={true}
            dontShowSpinner={true}
            isLink={true}
            title="Profile"
          />
        </div>
      </nav>
      {children}
    </div>
  );
};

export default RootLayout;
