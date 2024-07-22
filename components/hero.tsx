import Image from "next/image";
import React from "react";

const Hero = () => {
    return (
        <div className="w-full gap-8 aileron max-sm:h-[70vh] md:h-[550px] lg:h-[800px]">

            {/*Desktop image*/}
            <div className="max-sm:hidden absolute top-28 -left-10 h-[250px] w-[250px] xl:h-96 xl:w-96 2xl:h-[500px] 2xl:w-[500px] -z-10">
                <Image src="/path1.svg" alt="Amea hero path one" fill className="" />
            </div>

            {/*Mobile image*/}
            <div className="sm:hidden absolute top-28 -left-10 max-sm:h-[180px] max-sm:w-[200px] h-[250px] w-[250px] xl:h-96 xl:w-96 2xl:h-[500px] 2xl:w-[500px] -z-10">
                <Image src="/path3.svg" alt="Amea hero path one" fill className="" />
            </div>

            <div className="w-[200px] h-[215px] mx-auto relative mt-12 lg:mt-24 max-sm:mt-36 -z-10">
                <Image
                    src="/ameaarchives.svg"
                    alt="Amea hero"
                    fill
                />
            </div>



            {/*Desktop image*/}
            <div className="max-sm:hidden absolute -right-14 h-[250px] w-[250px] xl:h-96 xl:w-96 2xl:h-[500px] 2xl:w-[500px] overflow-hidden -z-10">
                <Image
                    src="/path2.svg"
                    alt="Amea hero path one"
                    className=""
                    fill
                />
            </div>

            {/*Mobile image*/}
            <div className="sm:hidden absolute bottom-0 right-0 max-sm:h-[180px] max-sm:w-[200px] h-96 w-96 2xl:h-[500px] 2xl:w-[500px] overflow-hidden -z-10">
                <Image
                    src="/path4.svg"
                    alt="Amea hero path one"
                    className="absolute right-0 translate-x-12"
                    fill
                />
            </div>
        </div>
    );
};

export default Hero;
