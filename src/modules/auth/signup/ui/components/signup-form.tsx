"use client";
import { Suspense, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import Link from "next/link";
import { useSignupForm } from "@/modules/auth/signup/hooks/use-signup";
import {
  BasicInfoValues,
  OtpValues,
  AdditionalInfoValues,
} from "@/modules/auth/signup/hooks/use-signup";
import {
  sendOtp,
  TRegisterData,
  verifyOtp,
  register,
} from "@/modules/auth/signup/actions";
import { resendOtp } from "@/modules/auth/commons/actions";
import ResendOtp from "@/modules/auth/commons/ui/components/resend-otp";
import { useMutation } from "@tanstack/react-query";
import StatefulButton from "@/components/ui/stateful-button";

export const SignupForm = () => {
  return (
    <Suspense fallback={<></>}>
      <SignupFormSuspense />
    </Suspense>
  );
};

export function SignupFormSuspense() {
  const [step, setStep] = useState<
    "basicInfo" | "otp" | "additionalInfo" | "success"
  >("basicInfo");
  const [formData, setFormData] = useState<{
    basicInfo: BasicInfoValues;
    otpInfo: OtpValues;
    additionalInfo: AdditionalInfoValues;
  }>({
    basicInfo: { email: "" },
    otpInfo: { otp: "" },
    additionalInfo: {
      title: "Mr",
      accountType: "Business",
      firstName: "",
      lastName: "",
      address: "",
      contactMedium: "Email",
      phoneNumber: "",
    },
  });

  const { basicInfoForm, otpForm, additionalInfoForm } = useSignupForm();
  const watchAccountType = additionalInfoForm.watch("accountType");

  const sendOtpMutation = useMutation({
    mutationFn: (data: { email: string }) => sendOtp(data),
    onSuccess: () => {
      setTimeout(() => {
        setStep("otp");
      }, 1500);
    },
    onError: () => {
      basicInfoForm.setError("root", {
        type: "server",
        message: "Failed to send OTP. Please try again.",
      });
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: (data: { email: string; otp: string }) => verifyOtp(data),
    onSuccess: ({ data }) => {
      if (data.token) {
        localStorage.setItem("auth_token", data.token);
      }
      setTimeout(() => {
        setStep("additionalInfo");
      }, 1500);
    },
    onError: () => {
      otpForm.setError("root", {
        type: "server",
        message: "Failed to verify OTP. Please try again.",
      });
    },
  });

  const registrationMutation = useMutation({
    mutationFn: (data: TRegisterData & { token: string }) => register(data),
    onSuccess: ({ data }) => {
      if (data.accountID) {
        localStorage.setItem("fuego_accountId", data.accountID);
      }
      setStep("success");
    },
    onError: (error) => {
      additionalInfoForm.setError("root", {
        type: "server",
        message: error.message || `Registration failed, Please try again.`,
      });
    },
  });

  const resendMutation = useMutation({
    mutationFn: (data: { email: string }) => resendOtp(data),
  });

  // const handleBasicInfoSubmit = (data: BasicInfoValues) => {
  //   setFormData((prev) => ({ ...prev, basicInfo: data }));
  //   sendOtpMutation.mutate(data);
  // };

  // const handleOtpSubmit = (data: OtpValues) => {
  //   setFormData((prev) => ({ ...prev, otpInfo: data }));
  //   const finalData = {
  //     email: formData.basicInfo.email,
  //     otp: data.otp,
  //   };
  //   verifyOtpMutation.mutate(finalData);
  // };

  const handleAdditionalInfoSubmit = (data: AdditionalInfoValues) => {
    setFormData((prev) => ({ ...prev, additionalInfo: data }));

    const token = localStorage.getItem("auth_token");

    if (!token) {
      additionalInfoForm.setError("root", {
        type: "server",
        message: "No auth token found. Please try again.",
      });
      return;
    }

    const finalData = {
      email: formData.basicInfo.email,
      ...data,
      token: token,
    };

    //console.log("email in final data, register endpoint", finalData.email);

    registrationMutation.mutate(finalData);
  };

  const handleResendOtp = async (data: BasicInfoValues) => {
    resendMutation.mutate(data);
  };

  // Progress indicator
  const steps = [
    { id: "basicInfo", name: "Basic Info" },
    { id: "otp", name: "Otp Verification" },
    { id: "additionalInfo", name: "Additional Info" },
    { id: "success", name: "success" },
  ];

  return (
    <>
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex justify-between">
          {steps.map((s, i) => (
            <div
              key={s.id}
              className={`flex flex-col items-center ${
                i < steps.findIndex((st) => st.id === step) + 1
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                  i < steps.findIndex((st) => st.id === step) + 1
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                {i + 1}
              </div>
              <span className="text-xs">{s.name}</span>
            </div>
          ))}
        </div>
        <div className="mt-2 h-1 w-full bg-muted">
          <div
            className="h-1 bg-primary transition-all"
            style={{
              width: `${
                (steps.findIndex((s) => s.id === step) / (steps.length - 1)) *
                100
              }%`,
            }}
          ></div>
        </div>
      </div>

      {/* Basic Info Step */}

      {step === "basicInfo" && (
        <Card>
          <CardContent className="pt-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Basic Information</h2>
              {/* <p className="text-muted-foreground">
                Please provide your basic details
              </p> */}
            </div>
            <Form {...basicInfoForm}>
              <form
                //onSubmit={basicInfoForm.handleSubmit(handleBasicInfoSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={basicInfoForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="john.doe@example.com"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e); // Update form value
                            basicInfoForm.trigger("email"); // Trigger validation to update isDirty
                          }}
                          onPaste={(e) => {
                            field.onChange(e); // Handle paste
                            basicInfoForm.trigger("email"); // Ensure isDirty updates
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        We&apos;ll send a verification code to this email.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {basicInfoForm.formState.errors.root && (
                  <p className="text-red-600 text-sm text-center">
                    {basicInfoForm.formState.errors.root.message}
                  </p>
                )}
                <StatefulButton
                  className="w-full"
                  disabled={
                    !basicInfoForm.formState.isDirty ||
                    !basicInfoForm.formState.isValid
                  }
                  onClick={basicInfoForm.handleSubmit(async (data) => {
                    try {
                      // ⏳ Artificial delay of 2s
                      setFormData((prev) => ({ ...prev, basicInfo: data }));
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
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2 text-center mb-6">
              <h2 className="text-xl font-semibold">Verify Your Email</h2>
              <p className="text-muted-foreground">
                We&apos;ve sent a 6-digit verification code to your email
                <span className="font-medium">{formData.basicInfo.email}</span>
              </p>
            </div>
            <Form {...otpForm}>
              <form
                //onSubmit={otpForm.handleSubmit(handleOtpSubmit)}
                className="space-y-6"
                autoComplete="off"
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
                {/* <Button
                  type="submit"
                  disabled={
                    !otpForm.formState.isDirty || !otpForm.formState.isValid
                  }
                  // className="w-full bg-primary hover:bg-amber-600"
                  className="w-full bg-primary hover:bg-amber-600"
                >
                  {verifyOtpMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      verifying
                    </>
                  ) : (
                    <>sdjflsdjglksdv</>
                  )}
                </Button> */}
                <StatefulButton
                  className="w-full"
                  disabled={
                    !otpForm.formState.isDirty || !otpForm.formState.isValid
                  }
                  onClick={otpForm.handleSubmit(async (data) => {
                    try {
                      // ⏳ Artificial delay of 2s
                      setFormData((prev) => ({ ...prev, otpInfo: data }));
                      //await new Promise((resolve) => setTimeout(resolve, 2000));

                      // Run your mutation after delay
                      const finalData = {
                        email: formData.basicInfo.email,
                        otp: data.otp,
                      };
                      await verifyOtpMutation.mutateAsync(finalData);

                      // Save data into parent state
                    } catch (error) {
                      // Let StatefulButton handle the error state
                      throw error;
                    }
                  })}
                >
                  Submit
                </StatefulButton>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="w-full justify-center items-center">
            <ResendOtp
              autoStart={true}
              onResend={() => handleResendOtp(formData.basicInfo)}
              basicInfo={formData.basicInfo}
            />
          </CardFooter>
        </Card>
      )}

      {/* Additional Info Step */}
      {step === "additionalInfo" && (
        <Card>
          <CardContent className="pt-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Additional Information</h2>

              {/* <p className="text-muted-foreground">sdgdfgdg</p> */}
            </div>

            <Form {...additionalInfoForm}>
              <form
                onSubmit={additionalInfoForm.handleSubmit(
                  handleAdditionalInfoSubmit
                )}
                className="space-y-4"
              >
                {/* Account Type */}
                <FormField
                  control={additionalInfoForm.control}
                  name="accountType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select account type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Individual">Individual</SelectItem>
                          <SelectItem value="Business">Business</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Organization Name - Only show if Business */}
                <FormField
                  control={additionalInfoForm.control}
                  name="organizationName"
                  render={({ field }) => (
                    <FormItem
                      className={
                        watchAccountType === "Business" ? "" : "sr-only"
                      }
                    >
                      <FormLabel>Organization Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter organization name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Organization Type - Only show if Business */}
                <FormField
                  control={additionalInfoForm.control}
                  name="organizationType"
                  render={({ field }) => (
                    <FormItem
                      className={
                        watchAccountType === "Business" ? "" : "hidden"
                      }
                    >
                      <FormLabel>Organization Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select organization type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Corporation">
                            Corporation
                          </SelectItem>
                          <SelectItem value="LLC">LLC</SelectItem>
                          <SelectItem value="Partnership">
                            Partnership
                          </SelectItem>
                          <SelectItem value="Sole Proprietorship">
                            Sole Proprietorship
                          </SelectItem>
                          <SelectItem value="Non-Profit">Non-Profit</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Title */}
                <FormField
                  control={additionalInfoForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select title" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Mr">Mr</SelectItem>
                          <SelectItem value="Ms">Ms</SelectItem>
                          <SelectItem value="Mrs">Mrs</SelectItem>
                          <SelectItem value="Dr">Dr</SelectItem>
                          <SelectItem value="Prof">Prof</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={additionalInfoForm.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter first name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={additionalInfoForm.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter last name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Address */}
                <FormField
                  control={additionalInfoForm.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter your complete address"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Phone Number */}
                <FormField
                  control={additionalInfoForm.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <div className="flex items-center">
                          <span className="inline-flex items-center px-3 h-10 rounded-l-md font-medium">
                            +91
                          </span>
                          <Input
                            type="text"
                            inputMode="numeric"
                            placeholder="Enter 10-digit phone number"
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, "");
                              field.onChange(value.slice(0, 10));
                            }}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Contact Medium */}
                <FormField
                  control={additionalInfoForm.control}
                  name="contactMedium"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Contact Method</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select contact method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Email">Email</SelectItem>
                          <SelectItem value="Phone">Phone</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {additionalInfoForm.formState.errors.root && (
                  <p className="text-red-600 text-sm text-center">
                    {additionalInfoForm.formState.errors.root.message}
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={
                    !additionalInfoForm.formState.isDirty ||
                    !additionalInfoForm.formState.isValid
                  }
                  className="w-full bg-primary hover:bg-amber-600"
                >
                  {registrationMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>Submit</>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {/* Success Step */}
      {step === "success" && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center flex-col space-y-4 py-6">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-md md:text-2xl font-semibold">
                Registration Successful!
              </h2>
              {/* <p className="text-sm text-muted-foreground text-center"> */}
              <p className="text-center">
                Your account has been created successfully. You can now log in
                with your credentials.
              </p>
              <Button className="mt-4 w-full" asChild>
                <Link href={`/dashboard`}>Go to Dashboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      {
        <p className="text-center mt-4">
          <span className="text-xs text-muted-foreground">
            Already have an account?
          </span>{" "}
          <Button variant="link" className="p-0 h-auto text-primary text-xs">
            <Link href="/signin">Sign in</Link>
          </Button>
        </p>
      }
    </>
  );
}
