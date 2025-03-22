"use server";

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";

const ONE_WEEK = 60 * 60 * 24 * 7;

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

    return {
      success: true,
      message: "Account created successfully. Please sign in.",
    };

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

export const signIn = async (params: SignInParams) => {
  const { email, idToken } = params;

  try {
    const userRecord = await auth.getUserByEmail(email);

    if (!userRecord) {
      return {
        success: false,
        message: "User does not exist. Create an account instead.",
      };
    }

    // if a user does exist, create a session cookie for that user
    await setSessionCookies(idToken);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log("Error signing in", error);

    if (error?.code === "auth/invalid-credential") {
      return { success: false, message: "Invalid credentials" };
    }

    return {
      success: false,
      message: "Failed to sign in",
    };
  }
};

export const setSessionCookies = async (idToken: string) => {
  const cookieStore = await cookies(); // storing in cookies using next/cookies

  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: ONE_WEEK * 1000, // 7 days
  });

  //   storing in cookies using next/cookies, so that we can access it on the client side
  cookieStore.set("session", sessionCookie, {
    maxAge: ONE_WEEK,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });
};

export const getCurrentUser = async (): Promise<User | null> => {
  const cookieStore = await cookies();

  const sessionCookie = cookieStore.get("session")?.value;

  //   user doesn't exist
  if (!sessionCookie) {
    return null;
  }

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

    const userRecord = await db
      .collection("users")
      .doc(decodedClaims.uid)
      .get();

    if (!userRecord?.exists) {
      return null;
    }

    return {
      ...userRecord?.data(),
      id: userRecord?.id,
    } as User;
  } catch (error) {
    console.log("Error getting current user", error);
    return null;
  }
};

export const isAuthenticated = async () => {
  const user = await getCurrentUser();

  return !!user; // if user exists, return true, otherwise return false
};
