import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/nav/navbar";
import Footer from "@/components/footer";
import localFont from "next/font/local";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "The Amea Archives",
  description: "Write the content not the code",
};

const aileronFont = localFont({
  src: [
    {
      path: "../fonts/Aileron-Bold.otf",
      weight: "700",
    },
    {
      path: "../fonts/Aileron-SemiBold.otf",
      weight: "600",
    },
    {
      path: "../fonts/Aileron-Light.otf",
      weight: "300",
    },
  ],
  variable: "--aileron-font",
});

const editorFont = localFont({
  src: [
    {
      path: "../fonts/editor-bold.ttf",
      weight: "700",
    },
    {
      path: "../fonts/editor-light.ttf",
      weight: "300",
    },
    {
      path: "../fonts/editor-thin.ttf",
      weight: "100",
    },
  ],
  variable: "--editor-font",
});
const akiraFont = localFont({
  src: "../fonts/akira-word.otf",
  variable: "--akira-font",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        aileronFont.variable,
        editorFont.variable,
        akiraFont.variable
      )}
    >
      <body>
        <Navbar />
        <main
          className={cn(
            "max-w-7xl mx-auto w-full min-h-screen py-40 px-24 "
            // myFont.className
          )}
        >
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
