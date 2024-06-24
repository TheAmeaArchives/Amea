// import styles from "./style.module.scss";
import Link from "next/link";
import { motion } from "framer-motion";
import { slide, scale } from "./anime";

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
      onMouseEnter={() => {
        setSelectedIndicator(href);
      }}
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
      <Link href={href}>{title}</Link>
    </motion.div>
  );
}
