"use server";

import { db } from "@/firebase/admin";

export const signUp = async (params: SignUpParams) => {
  const { uid, name, email } = params;

  try {
    const userRecord = await db.collection("users").doc(uid).get();

    if (userRecord?.exists) {
      return {
        success: false,
        message: "User already exists. Please sign in.",
      };
    }

    // creating a new user
    await db.collection("users").doc(uid).set({
      name,
      email,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log("Error creating user", error);

    if (error?.code === "auth/email-already-exists") {
      return { success: false, message: "This email is already in use" };
    }

    return {
      success: false,
      message: "Failed to create user",
    };
  }
};
