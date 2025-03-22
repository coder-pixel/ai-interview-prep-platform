"use client";
import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

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

const Agent = ({ userName, userId, type }: AgentProps) => {
  const router = useRouter();
  console.log(userName, userId, type);

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);

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
      router.push("/interview");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callStatus]);

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);

    // start the conversation with this (NEXT_PUBLIC_VAPI_WORKFLOW_ID) specific ai agent
    await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
      variableValues: {
        username: userName,
        userid: userId,
      },
    });
  };

  const handleDisconnect = async () => {
    setCallStatus(CallStatus.FINISHED);

    vapi.stop(); // stop the conversation
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
          <button className="relative btn-call" onClick={handleCall}>
            <span
              className={cn(
                "absolute animate-ping rounded-full opacity-75",
                callStatus !== "CONNECTING" && "hidden"
              )}
            />

            <span className="relative">
              {isCallInactiveOrFinished ? "Call" : ". . ."}
            </span>
          </button>
        ) : (
          <button
            className="btn-disconnect cursor-pointer"
            onClick={handleDisconnect}
          >
            End
          </button>
        )}
      </div>
    </>
  );
};

export default Agent;
