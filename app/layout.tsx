import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/nav/navbar";
import Footer from "@/components/footer";
import localFont from "next/font/local";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Amea",
  description: "Write the content not the code",
};

const myFont = localFont({
  src: [
    {
      path: "../fonts/word.woff",
    },
  ],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="">
        <Navbar />
        <main
          className={cn(
            "max-w-7xl mx-auto w-full min-h-screen button",
            myFont.className
          )}
        >
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
