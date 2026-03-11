import React from 'react'
import ChamberHeader from "@/components/chambers/header";
import { createClient } from "@/lib/supabase/server";
import type { ChamberContent } from "@/lib/types";

const ChamberThree = async () => {
    const supabase = createClient();
    const { data } = await supabase
        .from("chamber_content")
        .select("*")
        .eq("chamber", "iii")
        .order("section");

    const content = (data as ChamberContent[] | null) ?? [];

    return (
        <div className="space-y-12">
            <ChamberHeader
                title="chamber iii"
                description="Business and Consultance."
            />
            <section className="space-y-10">
                {content.length > 0 ? (
                    content.map((item) => (
                        <p key={item.id} className="text-xl max-md:text-base font-light">
                            {item.content ?? ""}
                        </p>
                    ))
                ) : (
                    <p className="text-xl max-md:text-base font-light text-gray-500 text-center py-10">
                        Content coming soon.
                    </p>
                )}
            </section>
        </div>
    )
}

export default ChamberThree