import React from 'react'
import ChamberHeader from "@/components/chambers/header";

const ChamberThree = () => {
    return (
        <div className="space-y-12">
            <ChamberHeader
                title="chamber iii"
                description="Business and Consultance."
            />
            <section className="space-y-10">
                <p className="text-xl max-md:text-base font-light">
                    {"We are in 2500 BC, Egypt. About 30,000 of the best craftsmen, sculptors and other skilled workers of the time use their combined talents, knowledge and experience to mold and piece together humble blocks of stones to build up what would be-till today-one of the most majestic structures on Earth: The Great Pyramids.\n"}
                </p>
                <p className="text-xl max-md:text-base font-light">
                    {"All major innovations in history have at least one thing in common; they are human-centred. And it isn't a mere coincidence. These are the kinds of innovations which produce real impact. Be it by keeping us warm in Winter; saving hundreds of millions of lives from disease; or even helping in writing essays.\n"}
                </p>
            </section>

        </div>
    )
}

export default ChamberThree