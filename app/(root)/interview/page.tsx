import Agent from "@/components/Agent";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { redirect } from "next/navigation";

const InterviewPage = async () => {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <>
      <h3>Interview Generation</h3>

      <Agent userName={user?.name} userId={user?.id} type="generate" />
    </>
  );
};

export default InterviewPage;
