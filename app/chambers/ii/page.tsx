"use client"
import ChamberHeader from "@/components/chambers/header";
import { constants, stats } from "@/constants";
import React, {FormEventHandler, useEffect, useState} from "react";
import { X } from "lucide-react";
import Image from "next/image";
import ValidationPage from "@/components/validation";

const ChamberTwo = () => {
    const [isVolunteerFormActive, setIsVolunteerFormActive] = useState(false)
    const [isValidationPageActive, setIsValidationPageActive] = useState(false)

    return (
        <div className="flex flex-col gap-10">
            <ChamberHeader
                title="chamber ii"
                description="A Virtual Research Center."
            />
            <div className="flex flex-col gap-y-[70px] items-center bg">
                <div className="h-full flex w-full items-center md:justify-evenly">
                    {stats.map((stat) => (
                        <div key={stat.text} className="text-center">
                            <h2 className="editor-font text-5xl max-md:text-4xl font-bold">{stat.count}</h2>
                            <p className="max-w-32 text-center text-2xl max-md:text-xl aileron font-light mt-2">
                                {stat.text}
                            </p>
                        </div>
                    ))}
                </div>
                <div className="flex flex-col gap-2 items-center gap-y-20 md:gap-y-10">
                    <div className="w-1 bg-black h-60 rounded" />
                    <p
                        // href="/chambers/i/volunteer"
                        onClick={() => setIsVolunteerFormActive(true)}
                        className="text-center w-[110px] md:w-[185px] text-default hover:text-[#e9190f]/60 text-2xl max-md:text-lg pb-2 border-b-2 border-default hover:border-[#e9190f]/80"
                    >
                        Volunteer to participate
                    </p>
                </div>
                {isVolunteerFormActive && <VolunteerForm setIsVolunteerFormActive={setIsVolunteerFormActive} setIsValidationPageActive={setIsValidationPageActive} />}
                {isValidationPageActive && !isVolunteerFormActive && <ValidationPage />}
            </div>
            <div className="flex flex-col gap-20 mt-20">
                {constants.map((constant) => (
                    <div key={constant.name} className="flex flex-col gap-6">
                        <h1 className="text-5xl max-md:text-2xl font-bold akira">{constant.name}</h1>
                        <p className="text-xl max-md:text-base font-light">{constant.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const VolunteerForm = ({ setIsVolunteerFormActive, setIsValidationPageActive }: { setIsVolunteerFormActive: ((value:  boolean) => void), setIsValidationPageActive: (value:  boolean) => void  }) => {
    const [formState, setFormState] = useState({
        name: "",
        email: "",
        whatsapp: ""
    })

    useEffect(() => {
        console.log(formState)
    }, [formState]);

    const handleOnSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault()
        // Some code
        setIsVolunteerFormActive(false);
        setIsValidationPageActive(true);
    }

    return (
        <div className="fixed w-screen h-screen bg-white z-[100] top-0 requires-no-scroll pt-56 pb-36 px-8">

            <div className="max-sm:hidden absolute -top-16 -left-24 h-[250px] w-[250px] xl:h-96 xl:w-96 2xl:h-[500px] 2xl:w-[500px]">
                <Image src="/path1.svg" alt="Amea hero path one" fill />
            </div>
            <div className="max-sm:hidden absolute -bottom-36 -right-20 h-[250px] w-[250px] xl:h-96 xl:w-96 2xl:h-[500px] 2xl:w-[500px]">
                <Image src="/path2.svg" alt="Amea hero path one" fill/>
            </div>

            <div className="w-full max-w-lg mx-auto">
                <span className="w-full flex justify-end">
                    <X className="w-5 h-5 md:w-6 md:h-6" onClick={() => setIsVolunteerFormActive(false)}/>
                </span>
                <form onSubmit={handleOnSubmit}>
                    <div className="space-y-14 mb-20">
                        <div className="flex flex-col">
                            <label className="aileron font-light" htmlFor="name">Name:</label>
                            <input
                                className="md:text-2xl border-b border-b-black outline-none p-2 focus:border-default transition-all" id="name"
                                onChange={e => setFormState(prev => ({...prev, name: e.target.value}))}
                                value={formState.name}
                                required
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="aileron font-light" htmlFor="email">E-mail:</label>
                            <input
                                id="email"
                                type="email"
                                className="md:text-2xl border-b border-b-black outline-none p-2 focus:border-default transition-all"
                                onChange={e => setFormState(prev => ({...prev, email: e.target.value}))}
                                value={formState.email}
                                required
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="aileron font-light" htmlFor="whatsapp">WhatsApp:</label>
                            <input
                                id="whatsapp"
                                className="md:text-2xl border-b border-b-black outline-none p-2 focus:border-default transition-all"
                                onChange={e => setFormState(prev => ({...prev, whatsapp: e.target.value}))}
                                value={formState.whatsapp}
                            />
                        </div>
                    </div>
                    <div className="w-fit mx-auto">
                        <button
                            type="submit"
                            className="p-[5px] px-6 bg-default hover:bg-default/90 text-white rounded-sm font-medium hover:bg-[#e9190f]/80"
                        >
                            Submit
                        </button>
                    </div>

                </form>
            </div>

        </div>
    );
}

export default ChamberTwo;
