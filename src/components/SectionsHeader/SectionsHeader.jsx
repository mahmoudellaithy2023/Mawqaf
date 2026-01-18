import { motion } from "motion/react";
export default function SectionsHeader({ title, desc, article }) {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      transition={{
        duration: 2,
      }}
      whileInView={{
        y: 0,
        opacity: 1,
      }}
      className="container  mx-auto px-4  flex justify-center items-center"
    >
      <div className=" my-12 w-5/6 xl:w-3/6 px-12 text-center ">
        <span className="sectionTitle">{title}</span>
        <h2 className=" sectionDesc">{desc}</h2>
        <p className="sectionArticle">{article}</p>
      </div>
    </motion.div>
  );
}
