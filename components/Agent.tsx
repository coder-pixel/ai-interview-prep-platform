"use client";
import { interviewer } from "@/constants";
import { createFeedback } from "@/lib/actions/general.action";
import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import CustomSpinner from "./CustomSpinner";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

const Agent = ({
  userName,
  userId,
  type,
  interviewId,
  questions,
  feedbackId,
}: AgentProps) => {
  const router = useRouter();
  console.log(userName, userId, type);

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);

  const [isCallStartLoading, isCallStartTransition] = useTransition();
  const [isCallEndLoading, isCallEndTransition] = useTransition();

  const latestMessage = messages[messages?.length - 1]?.content; // get the last message of the conversation, so that we can display it as a transcript to the user

  const isCallInactiveOrFinished =
    callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED;

  // ----------------  vapi event handlers start ----------------
  const onCallStart = () => {
    setCallStatus(CallStatus.ACTIVE);
  };

  const onCallEnd = () => {
    setCallStatus(CallStatus.FINISHED);
  };

  const onMessage = (message: Message) => {
    if (message?.type === "transcript" && message?.transcriptType === "final") {
      const newMessage = {
        role: message?.role,
        content: message?.transcript,
      };

      setMessages((prev) => [...prev, newMessage]);
    }
  };

  const onSpeechStart = () => {
    console.log("speech start");
    setIsSpeaking(true);
  };

  const onSpeechEnd = () => {
    console.log("speech end");
    setIsSpeaking(false);
  };

  const onError = (error: Error) => {
    console.log("Error:", error);
  };

  // ----------------  vapi event handlers end ----------------

  useEffect(() => {
    // vapi event listeners start on mount
    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    //  clearing vapi event listeners on unmount
    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  useEffect(() => {
    if (callStatus === CallStatus.FINISHED) {
      if (type === "generate") {
        router.push("/");
      } else {
        handleGenerateFeedback(messages);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callStatus]);

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);

    if (type === "generate") {
      // start the conversation with this (NEXT_PUBLIC_VAPI_WORKFLOW_ID) specific ai agent
      await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
        variableValues: {
          username: userName,
          userid: userId,
        },
      });
    } else {
      let formattedQuestions = "";

      if (questions) {
        formattedQuestions = questions
          ?.map((question) => `- ${question}`)
          ?.join("\n");
      }

      await vapi.start(interviewer, {
        variableValues: {
          questions: formattedQuestions,
        },
      });
    }
  };

  const handleDisconnect = async () => {
    setCallStatus(CallStatus.FINISHED);

    vapi.stop(); // stop the conversation
  };

  const handleGenerateFeedback = async (messages: SavedMessage[]) => {
    console.log("Generate Feedback Here: ", { messages });

    // TODO: create a server action to generate feedback
    const { success, feedbackId: id } = await createFeedback({
      interviewId: interviewId!,
      userId: userId!,
      transcript: messages,
      feedbackId,
    });

    if (success && id) {
      router.push(`/interview/${interviewId}/feedback`);
    } else {
      console.log("Error saving feedback");
      toast.error("Error saving feedback");
      router.push("/");
    }
  };

  return (
    <>
      <div className="call-view">
        {/* AI Interviewer Card */}
        <div className="card-interviewer">
          <div className="avatar">
            <Image
              src="/ai-avatar.png"
              alt="profile-image"
              width={65}
              height={54}
              className="object-cover"
            />
            {isSpeaking && <span className="animate-speak" />}
          </div>
          <h3>AI Interviewer</h3>
        </div>

        {/* User Profile Card */}
        <div className="card-border">
          <div className="card-content">
            <Image
              src="/user-avatar.png"
              alt="profile-image"
              width={539}
              height={539}
              className="rounded-full object-cover size-[120px]"
            />
            <h3>{userName}</h3>
          </div>
        </div>
      </div>

      {messages?.length > 0 && (
        <div className="transcript-border">
          <div className="transcript">
            <p
              key={latestMessage}
              className={cn(
                "transition-opacity duration-500 opacity-0",
                "animate-fadeIn opacity-100"
              )}
            >
              {latestMessage}
            </p>
          </div>
        </div>
      )}

      {/* btn to start/end call */}
      <div className="w-full flex justify-center">
        {callStatus !== "ACTIVE" ? (
          <>
            <button
              className="relative btn-call"
              onClick={() => {
                isCallStartTransition(() => handleCall());
              }}
              disabled={isCallStartLoading}
            >
              <span
                className={cn(
                  "absolute animate-ping rounded-full opacity-75",
                  callStatus !== "CONNECTING" && "hidden"
                )}
              />

              <span className="relative flex items-center gap-2 justify-center flex-row">
                {isCallInactiveOrFinished && !isCallStartLoading
                  ? "Call"
                  : ". . ."}{" "}
              </span>
            </button>

            {/* btn to end call to show when call is being generated */}
            {/* {callStatus === "CONNECTING" ||
              (isCallStartLoading && (
                <button
                  className="btn-disconnect cursor-pointer"
                  onClick={handleDisconnect}
                  disabled={isCallEndLoading}
                >
                  End {isCallEndLoading && <CustomSpinner />}
                </button>
              ))} */}
          </>
        ) : (
          <button
            className="btn-disconnect cursor-pointer flex justify-center items-center"
            onClick={() => {
              isCallEndTransition(() => handleDisconnect());
            }}
            disabled={isCallEndLoading}
          >
            <span className="mr-2">End </span>{" "}
            {isCallEndLoading && <CustomSpinner />}
          </button>
        )}
      </div>
    </>
  );
};

export default Agent;
