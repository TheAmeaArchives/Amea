import React from 'react';
import {Bookmark, Heart, MessageCircle} from "lucide-react";

const ExperimentsPage = ({ params } : { params: { slug: string } }) => {
    return (
        <>
            <div className="md:p-5">
                <h1 className="aileron font-bold text-2xl max-w-2xl mb-16">The Mozart Effect| Rauscher, Shaw, Ky | Stanford University, California | 1993.</h1>
                <div className="bg-default w-full h-[200px] mx-auto md:h-[405px] md:w-[800px] mb-20"></div>
                <p className="editor-font font-light text-xl w-full text-center max-w-96 mx-auto mb-[70px]">Lorem ipsum dolor sit amet, consecteteur adipiscing elit, sed diam nonummy nibh</p>
                <p className="aileron font-light text-base mb-[70px]">
                    All major innovations in history have at least one thing in common; they are human-centred. And it isn&apos;t a mere coincidence. These are the kinds of innovations which produce real impact. Be it by keeping us warm in Winter; saving hundreds of millions of lives from disease; or even helping in writing essays.
                    <br />
                    <br />
                    We are in an era with no precedent in history. Millions of Africans are working all over the continent to produce innovations to tackle our most pressing issues. For these innovations to have any practical relevance, they should be human-centred—“we”-centred. They should be built around the way we—as Africans—think and behave. By doing so, building innovations that matter.
                    <br />
                    <br />
                    Unfortunately, building such innovations doesn&apos;t happen naturally. It happens by design. This brings us to our mission; the raison d&apos;être of the Amea Archives:
                    <br />
                    <br />
                    Now this begs the question “How?”
                    Our approach to moving forward that mission is threefold. First, we gather all the insights from the sciences of human thinking and behavior. These insights, from experiments in behavioral sciences, are curated to leave only the essentials. Second, we contextualize them. Before we can apply those insights, we need to know how much they apply to us. Individuals and organizations would be able to leverage on this impressive body of knowledge (insights into the behavior of Africans) to guide their efforts in producing innovations that matter.
                    <br />
                    <br />
                    Lastly, we can enable some ovf these innovators to push their efforts even further by having them consultant us and benefit from our expertise.
                </p>
                <p className="editor-font font-light text-xl w-full text-center max-w-96 mx-auto">Lorem ipsum dolor sit amet, consecteteur adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet magna aliquam erat volutpat.</p>
            </div>
            <div className="flex mt-20 md:border md:px-14 md:rounded-[20px] mx-auto max-w-5xl md:py-2.5">
                <div className="flex gap-x-8">
                    <div className="space-y-5">
                        <div className="bg-default rounded-full w-20 h-20"/>
                        <p className="text-center">Curator</p>
                    </div>
                    <div className="space-y-5">
                        <div className="bg-default rounded-full w-20 h-20"/>
                        <p className="text-center">Editor</p>
                    </div>
                </div>
                <div className="text-default flex w-full items-end md:items-center justify-end  gap-x-4">
                    <Heart className="w-6 h-6"/>
                    <MessageCircle className="w-6 h-6"/>
                    <Bookmark className="w-6 h-6"/>
                </div>
            </div>
        </>
    );
};

export default ExperimentsPage;
