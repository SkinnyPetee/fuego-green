import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { ReactQueryProvider } from "@/modules/commons/ui/providers/react-query-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const fontManrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope", // Define a CSS variable name
});

export const metadata: Metadata = {
  title: "Fuego | Business App",
  description: "Business App for Indian SME's",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${fontManrope.variable}  antialiased`}>
        <ReactQueryProvider>
          <>
            {children}
            <Toaster />
          </>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
