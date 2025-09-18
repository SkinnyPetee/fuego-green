"use client";

import { Suspense, useEffect, useState } from "react";
import { ArrowLeft, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useCreateBusinessForm } from "@/modules/businesses/hooks/use-create-business";
import { Textarea } from "@/components/ui/textarea";
import {
  createBusiness,
  TCreateBusinessData,
} from "@/modules/businesses/actions";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import StatefulButton from "@/components/ui/stateful-button";

export const CreateBusiness = () => {
  return (
    <Suspense fallback={<></>}>
      <CreateBusinessFormSuspense />
    </Suspense>
  );
};

function CreateBusinessFormSuspense() {
  const [initialLoading, setInitialLoading] = useState(true);
  const { createBusinessform } = useCreateBusinessForm();
  const router = useRouter();

  useEffect(() => {
    setInitialLoading(false);
  }, []);

  const createBusinessMutation = useMutation({
    mutationFn: (
      data: TCreateBusinessData & {
        accountId: string;
        token: string;
      }
    ) => createBusiness(data),
    onSuccess: () => {
      toast.success("Successfully created a business.");
      setTimeout(() => {
        router.push("/businesses");
      }, 1500);
    },
    onError: (error) => {
      createBusinessform.setError("root", {
        type: "manual",
        message: error.message || "Something went wrong.",
      });
    },
  });

  // const onSubmit = async (data: CreateBusinessFormData) => {
  //   const token = localStorage.getItem("auth_token");
  //   const accountId = localStorage.getItem("fuego_accountId");

  //   console.log(`token: ${token}, accountId: ${accountId}`);

  //   if (!token || !accountId) {
  //     toast.error("Something went wrong, login again.");
  //     return;
  //   }

  //   const finaldata = {
  //     accountId: accountId,
  //     token: token,
  //     ...data,
  //   };

  //   createBusinessMutation.mutate(finaldata);
  // };

  if (initialLoading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/businesses">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="animate-pulse">
            <div className="h-6 bg-muted rounded w-48 mb-2"></div>
            <div className="h-4 bg-muted rounded w-64"></div>
          </div>
        </div>
        <div className="max-w-full flex justify-center">
          <div className="w-full max-w-[800px]">
            <Card>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-10 bg-muted rounded"></div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/businesses">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        {/* <div>
          <h1 className="font-semibold text-lg md:text-2xl">
            create-business.title
          </h1>
          <p className="text-muted-foreground">create-business.desc</p>
        </div> */}
      </div>
      <div className="max-w-full flex justify-center">
        <div className="w-full max-w-[800px]">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary font-semibold" />
                Create Your Business
              </CardTitle>
              <CardDescription>
                Provide your business details to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...createBusinessform}>
                <form
                  //onSubmit={createBusinessform.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={createBusinessform.control}
                    name="businessName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Name of your business"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Provide your business name
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={createBusinessform.control}
                      name="pan"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pan Number</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="eg: ABCDE1234F"
                              {...field}
                              onChange={(e) =>
                                field.onChange(e.target.value.toUpperCase())
                              }
                              maxLength={10}
                            />
                          </FormControl>
                          <FormDescription>
                            Provide your PAN number
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={createBusinessform.control}
                      name="registrationNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Registration Number</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="eg: U12345MH2020PLC123456"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Provide you business registartion number
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={createBusinessform.control}
                    name="businessEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="john.doe@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Provide your business email
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={createBusinessform.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone number</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="eg: 98765-43210"
                            {...field}
                            maxLength={10}
                            onChange={(e) =>
                              field.onChange(e.target.value.replace(/\D/g, ""))
                            }
                          />
                        </FormControl>
                        <FormDescription>
                          Provide a 10-digit phone number
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={createBusinessform.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Address</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter your complete business address"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Complete business address
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={createBusinessform.control}
                      name="businessSize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Size</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select business size" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="small">Small</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="large">Large</SelectItem>
                              <SelectItem value="enterprise">
                                Enterprise
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Size category of your business
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={createBusinessform.control}
                      name="tan"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>TAN Number</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="eg: MUMA12345B"
                              {...field}
                              onChange={(e) =>
                                field.onChange(e.target.value.toUpperCase())
                              }
                              maxLength={10}
                            />
                          </FormControl>
                          <FormDescription>
                            Tax Deduction Account Number
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={createBusinessform.control}
                      name="gstin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>GSTIN Number</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="eg: 29ABCDE1234F1Z2"
                              {...field}
                              onChange={(e) =>
                                field.onChange(e.target.value.toUpperCase())
                              }
                              maxLength={15}
                            />
                          </FormControl>
                          <FormDescription>
                            Goods and Services Tax Identification Number
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <p className="text-sm text-red-500">
                    {createBusinessform.formState.errors.root?.message}
                  </p>
                  <div className="flex gap-4 pt-4 flex-row-reverse">
                    {/* <Button
                      type="submit"
                      disabled={createBusinessMutation.isPending}
                    >
                      {createBusinessMutation.isPending
                        ? t("create-business.submitting-btn")
                        : t("create-business.submit-btn")}
                    </Button> */}
                    <StatefulButton
                      disabled={
                        !createBusinessform.formState.isDirty ||
                        !createBusinessform.formState.isValid
                      }
                      onClick={createBusinessform.handleSubmit(async (data) => {
                        try {
                          // ⏳ Artificial delay of 2s
                          const token = localStorage.getItem("auth_token");
                          const accountId =
                            localStorage.getItem("fuego_accountId");

                          console.log(
                            `token: ${token}, accountId: ${accountId}`
                          );

                          if (!token || !accountId) {
                            toast.error("Something went wrong, login again.");
                            return;
                          }

                          const finaldata = {
                            accountId: accountId,
                            token: token,
                            ...data,
                          };

                          await createBusinessMutation.mutateAsync(finaldata);

                          // Save data into parent state
                        } catch (error) {
                          // Let StatefulButton handle the error state
                          throw error;
                        }
                      })}
                    >
                      Submit
                    </StatefulButton>
                    <Button type="button" variant="outline" asChild>
                      <Link href="/businesses">Cancel</Link>
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
