"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Logo from "./logo";

const Navbar = () => {
  return (
    <header className="fixed top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md px-10 lg:px-40">
      <div className="w-full flex h-[60px] items-center justify-between landing-base-px">
        <div className="flex items-center space-x-2 justify-center">
          {/* <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <Calculator className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
              Fuego
            </span> */}
          <Logo />
        </div>

        {/* Desktop Navigation */}
        {/* <nav className="hidden md:flex items-center space-x-6"></nav> */}

        <div className="flex items-center space-x-2 sm:space-x-4">
          <Button
            id="pl-register"
            size="sm"
            variant="ghost"
            className="auth-btn"
            asChild
          >
            <Link href="/signin">Signin</Link>
          </Button>

          <Button
            id="pl-login"
            size="sm"
            className="bg-primary text-white text-xs sm:text-sm px-3 sm:px-4"
            asChild
          >
            <Link href="/signup">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
