import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "InterviewPrep",
  description: "An AI powered Interview Prep platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${monaSans?.className} antialiased pattern`}>
        {children}

        <Toaster />
      </body>
    </html>
  );
}

// resources:
// account for below resources: sau***ks*****d@gmail.com

// yt video: https://www.youtube.com/watch?v=8GK8R77Bd7g
// github(tutorial): https://github.com/adrianhajdin/ai_mock_interviews/blob/main/app/(root)/interview/%5Bid%5D/feedback/page.tsx

// google
// firebase: https://console.firebase.google.com/u/1/project/interviewprep-b67f0/firestore/databases/-default-/data/~2Ffeedback~2FlhX3eCSKnKa0Ji1VxtQQ?fb_gclid=Cj0KCQjwv_m-BhC4ARIsAIqNeBskKzLt9cP0Se0SaI4Bwai3hPPXjhFj0gLzzp-0vg43y7x8J1nfUD8aAveMEALw_wcB
// gemini: https://aistudio.google.com/apikey

// vapi dashboard: https://dashboard.vapi.ai/assistants/bfbf9534-3c88-4d10-9ce9-41ac66635ad3
// vapi docs: https://docs.vapi.ai/sdk/web
