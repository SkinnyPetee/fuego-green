"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Clock, RefreshCw, Lock, AlertCircle } from "lucide-react";
import { BasicInfoValues } from "@/modules/auth/signup/hooks/use-signup";

interface ResendOtpProps {
  onResend: (data: BasicInfoValues) => Promise<void>;
  initialTimer?: number;
  autoStart?: boolean;
  basicInfo: BasicInfoValues;
}

// interface ApiError {
//   message: string;
//   waitTime?: number;
//   resendCount?: number;
// }

export default function ResendOtp({
  onResend,
  initialTimer = 60, // This will be overridden by API response
  autoStart = false,
  basicInfo,
}: ResendOtpProps) {
  const [timeLeft, setTimeLeft] = useState(initialTimer);
  const [isActive, setIsActive] = useState(autoStart);
  const [resendCount, setResendCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Constants from your API
  //const MAX_RESENDS_PER_HOUR = 5;
  const MAX_RESENDS_PER_DAY = 10;
  const RESEND_DELAY_SECONDS = 60;

  // Check if we've hit daily limit
  const isDailyLimitReached = resendCount >= MAX_RESENDS_PER_DAY;

  // Check if we've hit hourly limit (this would need to be tracked separately)
  // For now, we'll rely on the API to tell us about hourly limits

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            setIsActive(false);
            setError(null); // Clear any errors when timer expires
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

  const handleResend = async () => {
    if (isDailyLimitReached || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      // Call the parent's onResend function
      await onResend(basicInfo);

      // If onResend doesn't throw, assume it was successful
      // Update state for successful resend
      setResendCount((prev) => prev + 1);
      setTimeLeft(RESEND_DELAY_SECONDS);
      setIsActive(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error resending OTP:", error);

      // Set the error message from the thrown error
      setError(error.message || "Failed to resend OTP. Please try again.");

      // For rate limiting errors, we might want to start a timer
      // Since we can't differentiate error types easily with this pattern,
      // we'll use a default timer for any error that mentions waiting or limits
      if (error.message?.includes("wait") || error.message?.includes("limit")) {
        setTimeLeft(RESEND_DELAY_SECONDS);
        setIsActive(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Show error state
  if (error && !isActive) {
    return (
      <div className="flex flex-col items-center justify-center space-y-2">
        <div className="flex items-center space-x-2 text-xs text-red-600">
          <AlertCircle className="h-3 w-3" />
          <span>{error}</span>
        </div>
        {!isDailyLimitReached && (
          <Button
            onClick={handleResend}
            variant="link"
            className="text-xs hover:text-amber-600 p-0 h-auto font-normal underline"
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-3 w-3 mr-1 ${isLoading ? "animate-spin" : ""}`}
            />
            Try Again
          </Button>
        )}
      </div>
    );
  }

  // Show daily limit reached
  if (isDailyLimitReached) {
    return (
      <div className="flex items-center justify-center space-x-2 text-xs text-red-600">
        <Lock className="h-3 w-3" />
        <span>
          Daily limit reached ({resendCount}/{MAX_RESENDS_PER_DAY}). Try again
          tomorrow.
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
            {error ? error : `Resend OTP in ${formatTime(timeLeft)}`}
            {resendCount > 0 &&
              ` (${resendCount}/${MAX_RESENDS_PER_DAY} attempts)`}
          </span>
        </>
      ) : (
        <>
          <span>{"Didn't receive the code?"}</span>
          <Button
            onClick={handleResend}
            variant="link"
            className="text-xs hover:text-amber-600 p-0 h-auto font-normal underline"
            disabled={isLoading || isDailyLimitReached}
          >
            <RefreshCw
              className={`h-3 w-3 mr-1 ${isLoading ? "animate-spin" : ""}`}
            />
            {isLoading
              ? "Sending..."
              : `Resend OTP${
                  resendCount > 0
                    ? ` (${resendCount}/${MAX_RESENDS_PER_DAY})`
                    : ""
                }`}
          </Button>
        </>
      )}
    </div>
  );
}
