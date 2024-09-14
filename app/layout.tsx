import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/nav/navbar";
import Footer from "@/components/footer";
import localFont from "next/font/local";
import { cn } from "@/lib/utils";
import { pathsHavingBackButton } from "@/constants";
import {headers} from "next/headers";
import Back from "@/components/back";
import { matchesAny } from "@/constants/functions";

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
            path: "../fonts/Aileron-Regular.otf",
            weight: "400",
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
            path: "../fonts/Editor'sNote-Bold.ttf",
            weight: "700",
        },
        {
            path: "../fonts/Editor'sNote-Medium.ttf",
            weight: "500",
        },
        {
            path: "../fonts/Editor'sNote-Light.ttf",
            weight: "300",
        },
        {
            path: "../fonts/Editor'sNote-Thin.ttf",
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

    const pathname = headers().get('x-url');
    const pathHasBackButton = matchesAny(pathname as string, pathsHavingBackButton);

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
                <main className={cn("w-full min-h-screen px-[105px] max-sm:px-8", {
                    "py-40 pt-48 md:pt-80": !pathHasBackButton,
                    "py-20": pathHasBackButton,
                })}>
                    {!pathHasBackButton ? (
                        <>
                            {children}
                        </>
                    ) : (
                        <>
                            <Back />
                            <div className="mt-[85px] md:mt-40">
                                {children}
                            </div>
                        </>
                    )}
                </main>


                <Footer />
            </body>
        </html>
    );
}
