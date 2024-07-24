import Link from "next/link";
import React from "react";
import { ArrowRight, EllipsisVertical } from "lucide-react";
import Search from "@/components/chambers/search";

const Blogs = () => {
    return (
        <div className="min-h-screen">
            <div className="flex gap-10 flex-wrap justify-between">
                <div className="flex flex-col gap-3 ">
                    <h1 className="text-5xl max-md:text-2xl font-bold akira">OUR BLOG</h1>
                    <p className="md:text-2xl text-base aileron font-light">
                        A virtual research center
                    </p>
                </div>
                <span className="">
                    <Search mode="ICON" />
                </span>
            </div>
            <div className="flex flex-col gap-20 mt-20">
                {Array.from({ length: 10 }).map((_, index) => (
                    <div
                        key={index}
                        className="-z-10 relative after:absolute after:h-2 w-full flex max-md:flex-col after:-bottom-10 gap-5 after:w-full after:left-0 after:bg-black/10 after:-z-10"
                    >
                        <div className="bg-default h-60 w-full max-w-96" />
                        <div className="flex flex-col justify-between flex-1">
                            <div className="flex justify-between ">
                                <div className="py-3">
                                    <p className="text-2xl max-md:text-sm font-normal">JUNE 17, 2024</p>
                                    <h1 className="text-[40px] max-md:text-xl font-bold max-w-xl -z-10 editor-font">
                                        Letter from the editor: You Are Safe Here
                                    </h1>
                                </div>
                                <EllipsisVertical className="cursor-pointer" />
                            </div>
                            <Link
                                href={`/blog/${index}`}
                                className="flex items-center gap-3 "
                            >
                                <span className="text-2xl max-md:text-sm">READ MORE</span>
                                <ArrowRight className="w-6 h-6" />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex py-20 flex-col gap-5">
                <h1 className="text-3xl max-md:text-base max-md:w-64 font-bold max-w-xl -z-10 editor-font">
                    Join over 100,000 Subcriber to Our Newsletter
                </h1>
                <p className="max-w-2xl max-md:text-xs font-light aileron">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis eveniet
                    inventore laborum id deserunt dolorum. Dicta ullam libero aut, quis
                    deserunt, sit dolore laudantium minima temporibus sapiente nulla
                    perspiciatis repellat.
                </p>
            </div>
            {/*Desktop*/}
            <form className="max-w-xl flex border rounded-full overflow-hidden max-md:hidden">
                <input
                    type="text"
                    className="flex-1 outline-none border-none px-5 placeholder:aileron placeholder:font-light"
                    placeholder="Enter your email"
                />
                <button className="py-[5px] bg-default text-white text-xl px-10 outline-none aileron uppercase">
                    Sign up
                </button>
            </form>

            {/*Mobile*/}
            <form className="w-full flex gap-x-3 md:hidden">
                <input
                    type="text"
                    className="flex-1 border rounded-full outline-none px-5 placeholder:aileron placeholder:font-light"
                    placeholder="Enter your email"
                />
                <button className="border rounded-full bg-default text-white text-base p-4 aileron uppercase">
                    Sign up
                </button>
            </form>
            <div className="p-10" />
        </div>
    );
};

export default Blogs;
