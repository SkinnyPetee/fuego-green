import { SignupForm } from "@/modules/auth/signup/ui/components/signup-form";

const Page = () => {
  //const tgetstarted = useTranslations("get-started-page");
  return (
    <div className="flex h-screen">
      {/* Left side - Welcome section (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden"></div>

      {/* Right side - Registration form */}
      <div className="w-full lg:w-1/2 flex justify-center p-6 lg:p-16">
        <div className="w-full max-w-md">
          <div className="mb-8 space-y-2 text-center lg:text-left">
            <h1 className="text-3xl font-bold text-gray-900">
              Create an Account
            </h1>
            <p className="text-gray-600">
              Fill in your details to create a new account
            </p>
          </div>
          <SignupForm />
        </div>
      </div>
    </div>
  );
};

export default Page;
