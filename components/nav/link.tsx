// import styles from "./style.module.scss";
import Link from "next/link";
import { motion } from "framer-motion";
import { slide, scale } from "./anime";
import { cn } from "@/lib/utils";

type Data = {
  data: {
    title: string;
    href: string;
    index: number;
  };
  isActive: boolean;
  setSelectedIndicator: (text: string) => void;
};

export default function Index({ data, isActive, setSelectedIndicator }: Data) {
  const { title, href, index } = data;

  return (
    <motion.div
      className=""
      custom={index}
      variants={slide}
      initial="initial"
      animate="enter"
      exit="exit"
    >
      <motion.div
        variants={scale}
        animate={isActive ? "open" : "closed"}
        className=""
      ></motion.div>
      <Link
        href={href}
        className={cn({
          "after:bg-white after:absolute after:h-full after:w-1 after:-left-10 relative after:rounded-r after:top-0 after:bottom-0 my-auto":
            isActive,
        })}
      >
        {title}
      </Link>
    </motion.div>
  );
}
