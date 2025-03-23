import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getFeedbackByInterviewId,
  getInterviewById,
} from "@/lib/actions/general.action";
import { getTextColorOnFeedback } from "@/lib/utils";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

const FeedBack = async ({ params }: RouteParams) => {
  const { id } = await params; // interview id

  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const interview = await getInterviewById(id);
  console.log({ interview });

  if (!interview) {
    redirect("/");
  }

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user?.id,
  });

  if (!feedback) {
    redirect("/");
  }

  console.log({ feedback });

  return (
    <section className="section-feedback">
      <div className="flex flex-row justify-center">
        <h1 className="text-4xl font-semibold">
          Feedback on the Interview -{" "}
          <span className="capitalize">{interview?.role}</span> Interview
        </h1>
      </div>

      <div className="flex flex-row justify-center ">
        <div className="flex flex-row gap-5">
          {/* overall feedback */}
          <div className="flex flex-row gap-2 items-center">
            <Image src="/star.svg" width={22} height={22} alt="star" />
            <p>
              Overall Impression:{" "}
              <span
                className={`text-primary-200 font-bold ${getTextColorOnFeedback(
                  feedback?.totalScore
                )}`}
              >
                {feedback?.totalScore || "N/A"}{" "}
              </span>
              / 100
            </p>
          </div>

          {/* date */}
          <div className="flex flex-row gap-2 items-center">
            <Image src="/calendar.svg" width={22} height={22} alt="star" />
            <p>
              Date:{" "}
              <span className="text-primary-200 font-bold">
                {feedback?.createdAt
                  ? dayjs(feedback?.createdAt)?.format("MMM D, YYYY h:mm A")
                  : "N/A"}
              </span>
            </p>
          </div>
        </div>
      </div>

      <hr />

      <p>{feedback?.finalAssessment}</p>

      {/* Interview Breakdown */}
      {feedback?.categoryScores?.length ? (
        <div className="flex flex-col gap-5">
          <p className="text-2xl font-semibold">Interview Breakdown:</p>

          {feedback?.categoryScores?.map((category, index) => (
            <div key={index}>
              <p className="font-bold">
                {index + 1}. {category?.name} (
                <span
                  className={`font-sm ${getTextColorOnFeedback(
                    category?.score
                  )}`}
                >
                  {category?.score}
                </span>{" "}
                / 100)
              </p>
              <p>{category?.comment}</p>
            </div>
          ))}
        </div>
      ) : null}

      {/* strengths */}
      {feedback?.strengths?.length ? (
        <div className="flex flex-col gap-3">
          <h3>Strengths</h3>
          <ul>
            {feedback?.strengths?.map((strength, index) => (
              <li key={index}>{strength}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {feedback?.areasForImprovement?.length ? (
        <div className="flex flex-col gap-3">
          <h3>Areas for Improvement</h3>
          <ul>
            {feedback?.areasForImprovement?.map((area, index) => (
              <li key={index}>{area}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="buttons">
        <Button className="btn-secondary flex-1">
          <Link href="/" className="flex w-full justify-center">
            <p className="text-sm font-semibold text-primary-200 text-center">
              Back to dashboard
            </p>
          </Link>
        </Button>

        <Button className="btn-primary flex-1">
          <Link
            href={`/interview/${id}`}
            className="flex w-full justify-center"
          >
            <p className="text-sm font-semibold text-black text-center">
              Retake Interview
            </p>
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default FeedBack;
