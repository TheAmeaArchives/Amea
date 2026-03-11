import { createClient } from "@/lib/supabase/server";
import type { Contributor } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Contributors = async () => {
    const supabase = createClient();
    const { data } = await supabase
        .from("contributors")
        .select("*")
        .order("created_at", { ascending: false });

    const contributors = (data as Contributor[] | null) ?? [];

    return (
        <>
            <div className="flex flex-col gap-10">
                <div className="w-full gap-4 flex flex-col">
                    <h1 className="text-5xl max-md:text-2xl font-bold akira w-fit">OUR CONTRIBUTORS</h1>
                    <p className="text-xl max-md:text-base font-light max-w-4xl">We are in 2500 BC, Egypt. About 30,000 of the best craftsmen, sculptors and other skilled</p>
                </div>
                <div className="flex flex-col md:grid md:grid-cols-3 max-md:gap-y-8 gap-10">
                    {contributors.length > 0 ? (
                        contributors.map((contributor) => (
                            <Link
                                href={`/contributors/${contributor.id}`}
                                className="w-full group"
                                key={contributor.id}
                            >
                                <div className="relative w-full h-72 bg-black">
                                    <Image
                                        src={contributor.image_url ?? "/test.svg"}
                                        alt={contributor.name}
                                        className="object-cover"
                                        fill
                                    />
                                </div>
                                <div className="flex flex-col mt-2 ">
                                    <h1 className="group-hover:underline">{contributor.name}</h1>
                                    <span className="font-light aileron text-sm">{contributor.location ?? ""}</span>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="col-span-3 flex flex-col items-center justify-center py-20 text-center">
                            <p className="text-xl text-gray-500 aileron">No contributors listed yet.</p>
                            <p className="text-sm text-gray-400 mt-2">Check back soon for updates.</p>
                        </div>
                    )}
                </div>
            </div>

        </>
    );
};

export default Contributors;
