import React from 'react';
import Image from "next/image";

const IndividualContributorPage = ({ params } : { params : { name: string } }) => {
    const { name } = params
    return (
        <>
            <div className="md:hidden">
                <h1 className="aileron font-bold text-2xl">John Rushword</h1>
                <h2 className="aileron font-semibold text-xl">Yaounde</h2>
            </div>
            <div className="flex flex-col md:flex-row-reverse gap-y-9 gap-x-11 mb-9 md:mb-12 max-md:mt-9">
                <div className="flex-1">
                    <div className="w-full h-[350px] md:h-full relative">
                        <Image
                            src="/test.svg"
                            alt="Amea project collaborator"
                            className="object-cover"
                            fill
                        />
                    </div>
                </div>
                <div className="space-y-9 flex-1">
                    <div className="max-md:hidden">
                        <h1 className="aileron font-bold text-2xl md:text-5xl">John Rushword</h1>
                        <h2 className="aileron font-semibold text-xl md:text-4xl">Yaounde</h2>
                    </div>
                    <p className="font-light aileron md:text-xl">
                        All major innovations in history have at least one thing in common; they are human-centred. And it isn&apos;t a mere coincidence. These are the kinds of innovations which produce real impact. Be it by keeping us warm in Winter; saving hundreds of millions of lives from disease; or even helping in writing essays.
                        <br />
                        <br />
                        We are in an era with no precedent in history. Millions of Africans are working all over the continent to produce innovations to tackle our most pressing issues. For these innovations to have any practical relevance, they should be human-centred—“we”-centred. They should be built around the way we—as Africans—think and behave. By doing so, building innovations that matter.
                        <br />
                        <br />
                        Unfortunately, building such innovations doesn&apos;t happen naturally. It happens by design. This brings us to our mission; the raison d&apos;être of the Amea Archives: Now this begs the question “How?”
                        <br />
                        <br />
                        Our approach to moving forward that mission is threefold. First, we gather all the insights from the sciences of human thinking and behavior. These insights, from experiments in behavioral sciences, are curated to leave only the essentials. Second, we contextualize them.
                    </p>
                </div>

            </div>
            <div className="space-y-4">
                <h1 className="aileron font-bold text-xl md:text-4xl">Articles</h1>
                <div className="flex flex-col md:flex-row frex-wrap gap-x-28 gap-y-9">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <div
                            key={index}
                            className="pt-4 border-t-2 md:border-t-[9px] w-full border-t-black/10 md:w-[36rem] md:space-y-3"
                        >
                            <h1 className="text-xl md:text-[32px] md:leading-[2.25rem] font-bold max-w-xl editor-font">Letter from the editor: You Are Safe Here</h1>
                            <p className="text-base max-md:text-sm aileron font-normal">JUNE 17, 2024</p>
                        </div>
                    ))}
                </div>

            </div>
        </>
    );
};

export default IndividualContributorPage;
