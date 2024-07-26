"use client";
import React from 'react';
import Image from "next/image";
import Footer from "@/components/footer";
import {ArrowLeft} from "lucide-react";

const ValidationPage = () => {
    return (
        <div className="fixed w-screen h-screen bg-white z-[100] top-0 requires-no-scroll pt-52 pb-36 max-md:px-8">
            <div className="w-full max-w-[450px] mx-auto">
                <button
                    className="mb-4 border rounded-full p-2 h-9 w-9 center duration-300 transition-all hover:bg-gray-100"
                    onClick={() => window.location.reload()}
                >
                    <ArrowLeft className="w-7 h-7 md:w-14 md:h-14" />
                </button>

                <div className="relative w-24 h-24 mx-auto mb-[60px]">
                    <Image src="/validationcheck.svg" alt="validation" fill />
                </div>
                <div className="w-full text-center space-y-7">
                    <h1 className="editor-font font-semibold text-4xl md:text-[64px] md:leading-none">Thank You!</h1>
                    <p className="aileron font-light text-base md:text-xl">Lorem ipsum dolor sit amet, consecteteur adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet magna aliquam erat volutpat.</p>
                </div>

                <Footer />
            </div>

        </div>
    );
};

export default ValidationPage;
