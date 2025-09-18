"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  EmailValues,
  OtpValues,
  useSigninForm,
} from "@/modules/auth/signin/hooks/use-signin";
import { signin, sendOtp } from "@/modules/auth/signin/actions";
import Link from "next/link";
import ResendOtp from "@/modules/auth/commons/ui/components/resend-otp";
import { resendOtp } from "@/modules/auth/commons/actions";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import StatefulButton from "../../../../../components/ui/stateful-button";

export default function SigninForm() {
  const [step, setStep] = useState<"email" | "otp">("email");
  const [formData, setFormData] = useState<{
    email: EmailValues;
    otp: OtpValues;
  }>({
    email: { email: "" },
    otp: { otp: "" },
  });

  const router = useRouter();
  const { emailForm, otpForm } = useSigninForm();

  const sendOtpMutation = useMutation({
    mutationFn: (data: { email: string }) => sendOtp(data),
    onSuccess: () => {
      setTimeout(() => {
        setStep("otp");
      }, 1500);
    },
    onError: () => {
      emailForm.setError("root", {
        type: "server",
        message: "Failed to send OTP. Please try again.",
      });
    },
  });

  const signinMutation = useMutation({
    mutationFn: (data: { email: string; otp: string }) => signin(data),
    onSuccess: ({ data }) => {
      if (data.token) {
        localStorage.setItem("auth_token", data.token);
      }
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    },
    onError: (error) => {
      otpForm.setError("root", {
        type: "server",
        message: error.message || "Failed to verify OTP. Please try again.",
      });
    },
  });

  const resendMutation = useMutation({
    mutationFn: (data: { email: string }) => resendOtp(data),
  });

  // Handle email submission
  const handleEmailSubmit = (data: EmailValues) => {
    setFormData((prev) => ({ ...prev, email: data }));
    sendOtpMutation.mutate(data);
  };

  // Handle OTP submission
  const handleOtpSubmit = (data: OtpValues) => {
    setFormData((prev) => ({ ...prev, otp: data }));
    const finalData = {
      email: formData.email.email,
      otp: data.otp,
    };
    signinMutation.mutate(finalData);
  };

  const handleResendOtp = async (data: EmailValues) => {
    resendMutation.mutate(data);
  };

  return (
    <>
      {/* Email Step */}
      {step === "email" && (
        <Card className="w-full min-w-[300px]">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Signin
            </CardTitle>
            <CardDescription className="text-center">
              Enter your email to receive a verification code.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...emailForm}>
              <form
                onSubmit={emailForm.handleSubmit(handleEmailSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={emailForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            id="pl-email"
                            placeholder="john.doe@example.com"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e); // Update form value
                              emailForm.trigger("email"); // Trigger validation to update isDirty
                            }}
                            onPaste={(e) => {
                              field.onChange(e); // Handle paste
                              emailForm.trigger("email"); // Ensure isDirty updates
                            }}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {emailForm.formState.errors.root && (
                  <p className="text-red-600 text-sm text-center">
                    {emailForm.formState.errors.root.message}
                  </p>
                )}
                {/* <Button
                  id="pl-email-submit"
                  type="submit"
                  className="w-full bg-primary hover:bg-amber-600"
                  disabled={
                    !emailForm.formState.isDirty || !emailForm.formState.isValid
                  }
                >
                  {sendOtpMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      fsdfsdf
                    </>
                  ) : (
                    <>asfasfsdfsd</>
                  )}
                </Button> */}
                <StatefulButton
                  className="w-full"
                  disabled={
                    !emailForm.formState.isDirty || !emailForm.formState.isValid
                  }
                  onClick={emailForm.handleSubmit(async (data) => {
                    try {
                      // ⏳ Artificial delay of 2s
                      setFormData((prev) => ({ ...prev, email: data }));
                      //await new Promise((resolve) => setTimeout(resolve, 2000));

                      // Run your mutation after delay
                      await sendOtpMutation.mutateAsync(data);

                      // Save data into parent state
                    } catch (error) {
                      // Let StatefulButton handle the error state
                      throw error;
                    }
                  })}
                >
                  Send
                </StatefulButton>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {/* OTP Verification Step */}
      {step === "otp" && (
        <Card className="w-full max-w-md border-amber-200">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Verify Your Email
            </CardTitle>
            <CardDescription className="text-center">
              We&apos;ve sent a 6-digit verification code to your email
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...otpForm}>
              <form
                onSubmit={otpForm.handleSubmit(handleOtpSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={otpForm.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center">
                      <FormControl>
                        <div className="flex justify-center">
                          <InputOTP
                            maxLength={6}
                            autoFocus
                            {...field}
                            onChange={(e) => {
                              field.onChange(e); // Update form value
                              otpForm.trigger("otp"); // Trigger validation to update isDirty
                            }}
                            onPaste={(e) => {
                              field.onChange(e); // Handle paste
                              otpForm.trigger("otp"); // Ensure isDirty updates
                            }}
                          >
                            <InputOTPGroup>
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                              <InputOTPSlot index={2} />
                              <InputOTPSlot index={3} />
                              <InputOTPSlot index={4} />
                              <InputOTPSlot index={5} />
                            </InputOTPGroup>
                          </InputOTP>
                        </div>
                      </FormControl>
                      <FormMessage className="text-center" />
                    </FormItem>
                  )}
                />
                {otpForm.formState.errors.root && (
                  <p className="text-red-600 text-sm text-center">
                    {otpForm.formState.errors.root.message}
                  </p>
                )}
                <StatefulButton
                  className="w-full"
                  disabled={
                    !otpForm.formState.isDirty || !otpForm.formState.isValid
                  }
                  onClick={otpForm.handleSubmit(async (data) => {
                    try {
                      // ⏳ Artificial delay of 2s
                      setFormData((prev) => ({ ...prev, otp: data }));
                      const finalData = {
                        email: formData.email.email,
                        otp: data.otp,
                      };
                      await signinMutation.mutateAsync(finalData);
                      //await new Promise((resolve) => setTimeout(resolve, 2000));

                      // Run your mutation after delay
                      //await sendOtpMutation.mutateAsync(data);

                      // Save data into parent state
                    } catch (error) {
                      // Let StatefulButton handle the error state
                      throw error;
                    }
                  })}
                >
                  Verify Otp
                </StatefulButton>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="w-full justify-center items-center">
            <ResendOtp
              autoStart={true}
              onResend={() => handleResendOtp(formData.email)}
              basicInfo={formData.email}
            />
          </CardFooter>
        </Card>
      )}
      <p className="text-center mt-4">
        <span className="text-xs text-muted-foreground">
          Dont have an account?
        </span>{" "}
        <Button variant="link" className="p-0 h-auto text-primary text-xs">
          <Link href="/signup">Signup</Link>
        </Button>
      </p>
    </>
  );
}
