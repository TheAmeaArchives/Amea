"use client";

import { createClient } from "@/lib/supabase/client";
import React, { FormEventHandler, useState } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import ValidationPage from "@/components/validation";

interface VolunteerButtonProps {
    label?: string;
    className?: string;
}

export function VolunteerButton({ label = "Volunteer to participate", className }: VolunteerButtonProps) {
    const [isVolunteerFormActive, setIsVolunteerFormActive] = useState(false);
    const [isValidationPageActive, setIsValidationPageActive] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsVolunteerFormActive(true)}
                className={className || "text-center w-auto px-4 text-default hover:text-[#e9190f]/70 text-base sm:text-lg md:text-2xl pb-2 border-b-2 border-default hover:border-[#e9190f]/80 transition-colors cursor-pointer"}
            >
                {label}
            </button>
            {isVolunteerFormActive && (
                <VolunteerFormModal 
                    setIsVolunteerFormActive={setIsVolunteerFormActive} 
                    setIsValidationPageActive={setIsValidationPageActive} 
                />
            )}
            {isValidationPageActive && !isVolunteerFormActive && <ValidationPage />}
        </>
    );
}

interface VolunteerFormModalProps {
    setIsVolunteerFormActive: (value: boolean) => void;
    setIsValidationPageActive: (value: boolean) => void;
}

function VolunteerFormModal({ setIsVolunteerFormActive, setIsValidationPageActive }: VolunteerFormModalProps) {
    const [formState, setFormState] = useState({
        name: "",
        email: "",
        whatsapp: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleOnSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);

        try {
            const supabase = createClient();
            await supabase.from("volunteer_submissions").insert({
                name: formState.name,
                email: formState.email,
                whatsapp: formState.whatsapp || null,
            });
        } catch {
            // Submission failed silently — still show validation page
        } finally {
            setIsSubmitting(false);
            setIsVolunteerFormActive(false);
            setIsValidationPageActive(true);
        }
    };

    return (
        <div className="fixed inset-0 w-screen h-screen bg-white z-[100] requires-no-scroll overflow-y-auto">
            <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-8 py-16 sm:py-20">
                <div className="hidden sm:block absolute -top-16 -left-16 md:-left-24 h-[180px] w-[180px] md:h-[250px] md:w-[250px] xl:h-96 xl:w-96 2xl:h-[500px] 2xl:w-[500px]">
                    <Image src="/path1.svg" alt="Amea hero path one" fill />
                </div>
                <div className="hidden sm:block absolute -bottom-24 md:-bottom-36 -right-12 md:-right-20 h-[180px] w-[180px] md:h-[250px] md:w-[250px] xl:h-96 xl:w-96 2xl:h-[500px] 2xl:w-[500px]">
                    <Image src="/path2.svg" alt="Amea hero path two" fill />
                </div>

                <div className="w-full max-w-md sm:max-w-lg relative">
                    <button 
                        type="button"
                        className="absolute -top-8 sm:-top-10 right-0 p-2 hover:bg-gray-100 rounded-full transition-colors"
                        onClick={() => setIsVolunteerFormActive(false)}
                    >
                        <X className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold editor-font mb-8 sm:mb-10 text-center">Volunteer to Participate</h2>
                    <form onSubmit={handleOnSubmit}>
                        <div className="space-y-8 sm:space-y-10 md:space-y-14 mb-10 sm:mb-14 md:mb-20">
                            <div className="flex flex-col">
                                <label className="aileron font-light text-sm sm:text-base mb-1" htmlFor="volunteer-name">Name:</label>
                                <input
                                    className="text-base sm:text-lg md:text-2xl border-b border-b-black outline-none p-2 focus:border-default transition-all" 
                                    id="volunteer-name"
                                    onChange={e => setFormState(prev => ({ ...prev, name: e.target.value }))}
                                    value={formState.name}
                                    required
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="aileron font-light text-sm sm:text-base mb-1" htmlFor="volunteer-email">E-mail:</label>
                                <input
                                    id="volunteer-email"
                                    type="email"
                                    className="text-base sm:text-lg md:text-2xl border-b border-b-black outline-none p-2 focus:border-default transition-all"
                                    onChange={e => setFormState(prev => ({ ...prev, email: e.target.value }))}
                                    value={formState.email}
                                    required
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="aileron font-light text-sm sm:text-base mb-1" htmlFor="volunteer-whatsapp">WhatsApp (optional):</label>
                                <input
                                    id="volunteer-whatsapp"
                                    className="text-base sm:text-lg md:text-2xl border-b border-b-black outline-none p-2 focus:border-default transition-all"
                                    onChange={e => setFormState(prev => ({ ...prev, whatsapp: e.target.value }))}
                                    value={formState.whatsapp}
                                />
                            </div>
                        </div>
                        <div className="w-fit mx-auto">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="py-2.5 sm:py-3 px-8 sm:px-10 bg-default hover:bg-default/90 text-white rounded-sm font-medium text-sm sm:text-base disabled:opacity-50 transition-colors"
                            >
                                {isSubmitting ? "Submitting..." : "Submit"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
