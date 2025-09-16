"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Clock, RefreshCw, Lock } from "lucide-react";
import { BasicInfoValues } from "@/modules/auth/signup/hooks/use-signup";

interface ResendOtpProps {
  onResend: (data: BasicInfoValues) => Promise<void>;
  initialTimer?: number;
  autoStart?: boolean;
  maxAttempts?: number;
  basicInfo: BasicInfoValues;
}

export default function ResendOtp({
  onResend,
  initialTimer = 60,
  autoStart = false,
  maxAttempts = 5,
  basicInfo,
}: ResendOtpProps) {
  const [timeLeft, setTimeLeft] = useState(initialTimer);
  const [isActive, setIsActive] = useState(autoStart);
  const [attempts, setAttempts] = useState(0);

  const isLocked = attempts >= maxAttempts;

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            setIsActive(false);
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const handleResend = () => {
    if (isLocked) return;

    setTimeLeft(initialTimer);
    setIsActive(true);
    setAttempts((prev) => prev + 1);
    onResend(basicInfo);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (isLocked) {
    return (
      <div className="flex items-center justify-center space-x-2 text-xs text-red-600">
        <Lock className="h-3 w-3" />
        <span>
          Too many attempts. Please try again later or contact support.
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center space-x-2 text-xs text-gray-600">
      {isActive && timeLeft > 0 ? (
        <>
          <Clock className="h-3 w-3" />
          <span>
            Resend OTP in {formatTime(timeLeft)} ({attempts}/{maxAttempts}{" "}
            attempts)
          </span>
        </>
      ) : (
        <>
          <span>{"Didn't receive the code?"}</span>
          <Button
            onClick={handleResend}
            variant="link"
            className="text-xs  hover:text-amber-600 p-0 h-auto font-normal underline"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Resend OTP ({attempts}/{maxAttempts})
          </Button>
        </>
      )}
    </div>
  );
}
