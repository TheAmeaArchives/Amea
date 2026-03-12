"use client"
import { constants as fallbackConstants, stats as fallbackStats } from "@/constants";
import { createClient } from "@/lib/supabase/client";
import type { SiteContentMap } from "@/lib/types";
import React, { FormEventHandler, useState } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import ValidationPage from "@/components/validation";
import { EditableText } from "@/components/admin/editable-text";

interface ChamberTwoClientProps {
    stats: { count: string; text: string }[];
    beliefs: { name: string; description: string }[];
    content: SiteContentMap;
}

const ChamberTwoClient = ({ stats: propStats, beliefs: propBeliefs, content }: ChamberTwoClientProps) => {
    const [isVolunteerFormActive, setIsVolunteerFormActive] = useState(false)
    const [isValidationPageActive, setIsValidationPageActive] = useState(false)

    const stats = propStats.length > 0 ? propStats : fallbackStats;
    const constants = propBeliefs.length > 0 ? propBeliefs : fallbackConstants;

    const getContentValue = (key: string, fallback: string) => content[key] ?? fallback;

    return (
        <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-2">
                <h1 className="text-5xl font-bold uppercase akira">
                    <EditableText
                        contentKey="chamber_ii_title"
                        defaultValue={getContentValue('chamber_ii_title', 'Chamber II')}
                    >
                        {getContentValue('chamber_ii_title', 'Chamber II')}
                    </EditableText>
                </h1>
                <p className="font-light text-2xl">
                    <EditableText
                        contentKey="chamber_ii_subtitle"
                        defaultValue={getContentValue('chamber_ii_subtitle', 'A Virtual Research Center.')}
                    >
                        {getContentValue('chamber_ii_subtitle', 'A Virtual Research Center.')}
                    </EditableText>
                </p>
            </div>
            <div className="flex flex-col gap-y-12 sm:gap-y-16 md:gap-y-[70px] items-center bg">
                <div className="h-full flex w-full items-center justify-around sm:justify-evenly gap-2 sm:gap-4">
                    {stats.map((stat) => (
                        <div key={stat.text} className="text-center flex-1 sm:flex-none">
                            <h2 className="editor-font text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">{stat.count}</h2>
                            <p className="max-w-24 sm:max-w-32 text-center text-sm sm:text-lg md:text-xl lg:text-2xl aileron font-light mt-1 sm:mt-2 mx-auto">
                                {stat.text}
                            </p>
                        </div>
                    ))}
                </div>
                <div className="flex flex-col gap-2 items-center gap-y-10 sm:gap-y-14 md:gap-y-10">
                    <div className="w-0.5 sm:w-1 bg-black h-32 sm:h-48 md:h-60 rounded" />
                    <button
                        onClick={() => setIsVolunteerFormActive(true)}
                        className="text-center w-auto px-4 text-default hover:text-[#e9190f]/70 text-base sm:text-lg md:text-2xl pb-2 border-b-2 border-default hover:border-[#e9190f]/80 transition-colors cursor-pointer"
                    >
                        <EditableText
                            contentKey="chamber_ii_cta"
                            defaultValue={getContentValue('chamber_ii_cta', 'Volunteer to participate')}
                        >
                            {getContentValue('chamber_ii_cta', 'Volunteer to participate')}
                        </EditableText>
                    </button>
                </div>
                {isVolunteerFormActive && <VolunteerForm setIsVolunteerFormActive={setIsVolunteerFormActive} setIsValidationPageActive={setIsValidationPageActive} />}
                {isValidationPageActive && !isVolunteerFormActive && <ValidationPage />}
            </div>
            <div className="flex flex-col gap-12 sm:gap-16 md:gap-20 mt-12 sm:mt-16 md:mt-20">
                {constants.map((constant) => (
                    <div key={constant.name} className="flex flex-col gap-4 sm:gap-5 md:gap-6">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold akira">{constant.name}</h1>
                        <p className="text-base sm:text-lg md:text-xl font-light">{constant.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const VolunteerForm = ({ setIsVolunteerFormActive, setIsValidationPageActive }: { setIsVolunteerFormActive: ((value: boolean) => void), setIsValidationPageActive: (value: boolean) => void }) => {
    const [formState, setFormState] = useState({
        name: "",
        email: "",
        whatsapp: ""
    })
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleOnSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault()
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
    }

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
                                <label className="aileron font-light text-sm sm:text-base mb-1" htmlFor="name">Name:</label>
                                <input
                                    className="text-base sm:text-lg md:text-2xl border-b border-b-black outline-none p-2 focus:border-default transition-all" 
                                    id="name"
                                    onChange={e => setFormState(prev => ({ ...prev, name: e.target.value }))}
                                    value={formState.name}
                                    required
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="aileron font-light text-sm sm:text-base mb-1" htmlFor="email">E-mail:</label>
                                <input
                                    id="email"
                                    type="email"
                                    className="text-base sm:text-lg md:text-2xl border-b border-b-black outline-none p-2 focus:border-default transition-all"
                                    onChange={e => setFormState(prev => ({ ...prev, email: e.target.value }))}
                                    value={formState.email}
                                    required
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="aileron font-light text-sm sm:text-base mb-1" htmlFor="whatsapp">WhatsApp (optional):</label>
                                <input
                                    id="whatsapp"
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

export default ChamberTwoClient;
