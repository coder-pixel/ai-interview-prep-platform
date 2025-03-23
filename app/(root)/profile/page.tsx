"use client";

import Image from "next/image";
// import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { auth } from "@/firebase/client";
// import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EyeOff } from "lucide-react";

const ProfilePage = () => {
  const user = auth.currentUser;

  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  const getUserDetails = async () => {
    const userDetails = await getCurrentUser();
    setProfileData(userDetails);
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  return (
    <div className="card-border w-[400px] mx-auto my-8">
      <div className="card p-8">
        <div className="flex flex-col items-center gap-6">
          {/* Profile Image */}
          <div className="relative w-30 h-30 rounded-full overflow-hidden">
            <Image
              src={user?.photoURL || "/user-avatar.png"} // Add a placeholder image to your public folder
              alt="Profile"
              fill
              className="object-cover"
            />
          </div>

          {/* Profile Information */}
          <div className="w-full space-y-4">
            <div className="flex justify-center items-center">
              <h2 className="text-2xl text-center font-bold text-primary-100">
                Profile Details
              </h2>

              {/*               
              <Button
                variant="outline"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? "Save Changes" : "Edit Profile"}
              </Button> */}
            </div>

            <div className="space-y-4">
              {profileData?.name && (
                <ProfileField label="Name" value={profileData?.name} />
              )}
              {profileData?.email && (
                <ProfileField label="Email" value={profileData?.email} />
              )}
              {profileData?.phone && (
                <ProfileField label="Phone" value={profileData?.phone} />
              )}
              {profileData?.password && (
                <ProfileField
                  label="Password"
                  value={profileData?.password || "********"}
                  type="password"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component for profile fields
const ProfileField = ({
  label,
  value,
  type = "text",
}: {
  label: string;
  value: string;
  type?: string;
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === "password";

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-500">{label}</label>
      {type !== "password" ? (
        <input
          type={type}
          className="border rounded-md p-2"
          defaultValue={value}
          disabled={true}
          readOnly={true}
        />
      ) : (
        <>
          <div className="relative">
            <input
              className="input pr-10"
              type={isPasswordField && showPassword ? "text" : type}
              defaultValue={value}
              disabled={true}
              readOnly={true}
            />
            {isPasswordField && (
              <Button
                type="button"
                variant="ghost"
                className="absolute inset-y-0 right-5 top-1/2 -translate-y-1/2 flex items-center cursor-pointer"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ProfilePage;
