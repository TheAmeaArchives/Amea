import Image from "next/image";
import React from "react";

const About = () => {
  return (
    <div className="py-40 px-[100px] min-h-screen flex flex-col gap-80">
      <div>
        <div className="flex items-center gap-10">
          <div className="editor-font">
            <h1 className="font-bold text 2xl:text-9xl lg:text-[120px] leading-[100px]">
              AI.
            </h1>
            <h1 className="font-bold text 2xl:text-9xl lg:text-[120px] leading-[100px]">
              Penicillin.
            </h1>
            <h1 className="font-bold text 2xl:text-9xl lg:text-[120px] leading-[100px]">
              Fire.
            </h1>
          </div>
          <p className="flex flex-col gap-8 text-xl font-light aileron">
            <span>
              All major innovations in history have at least one thing in
              common; they are human-centred. And it isn&apos;t a mere
              coincidence. These are the kinds of innovations which produce real
              impact. Be it by keeping us warm in Winter; saving hundreds of
              millions of lives from disease; or even helping in writing essays.
            </span>
            <span>
              {" "}
              We are in an era with no precedent in history. Millions of
              Africans are working all over the continent to produce innovations
              to tackle our most pressing issues. For these innovations to have
              any practical relevance, they should be
              human-centred—“we”-centred. They should be built around the way
              we—as Africans—think and behave. By doing so, building innovations
              that matter.{" "}
            </span>
            <span>
              Unfortunately, building such innovations doesn&apos;t happen
              naturally. It happens by design. This brings us to our mission;
              the raison d&apos;être of the Amea Archives:
            </span>
          </p>
        </div>
      </div>
      <div>
        <div className="flex items-center gap-10">
          <p className="flex flex-col gap-8 text-xl  aileron font-light">
            Now this begs the question “How?” Our approach to moving forward
            that mission is threefold. First, we gather all the insights from
            the sciences of human thinking and behavior. These insights, from
            experiments in behavioral sciences, are curated to leave only the
            essentials. Second, we contextualize them. Before we can apply those
            insights, we need to know how much they apply to us. Individuals and
            organizations would be able to leverage on this impressive body of
            knowledge (insights into the behavior of Africans) to guide their
            efforts in producing innovations that matter. Lastly, we can enable
            some ovf these innovators to push their efforts even further by
            having them consultant us and benefit from our expertise.
          </p>
          <div className="editor-font">
            <h1 className="font-bold text 2xl:text-9xl lg:text-8xl relative flex flex-col gap-5">
              Innovation <span>Behavioral</span> <span>Science.</span>
              <span className="text-default absolute w-full h-full -top-16 left-0 center">
                &
              </span>
            </h1>
          </div>
        </div>
      </div>
      <div className=" gap-10 center flex-col editor-font">
        <Image src="/big.svg" alt="Amea big logo" width={250} height={250} />
        <p className="text-center text-3xl">
          <span className="relative after:absolute after:bg-default after:w-full after:h-1/3 after:left-0 after:bottom-[3px] after:-z-10">
            It&apos;s all about insights
          </span>
        </p>
      </div>
    </div>
  );
};

export default About;
