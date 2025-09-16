import SigninForm from "@/modules/auth/signin/ui/components/signin-form";

export default function Home() {
  //const tloginForm = useTranslations("login-page");

  return (
    <div className="flex min-h-screen">
      <div className="hidden md:flex md:w-1/2 bg-white flex-col justify-center items-center relative overflow-hidden">
        {/* <img
          src="/wallpapers/fire.avif"
          alt="fire wallpaper for styling"
          className="w-full h-screen object-cover"
        /> */}
      </div>
      <div className="w-full lg:w-1/2 flex justify-center items-center p-6 lg:p-16">
        <div className="w-full max-w-md">
          {/* <div className="mb-8 space-y-2 text-center lg:text-left flex flex-col items-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Sign in to your account
            </h1>
            <p className="text-gray-600">
              Enter your email to receive a verification code.
            </p>
          </div> */}
          <SigninForm />
        </div>
      </div>
    </div>
  );
}
