import React from "react";
import { motion } from "motion/react";

export default function FeaturesCard({ icon, title, desc, color, bgColor }) {
  return (
    <motion.div
      animate={{ y: 40, opacity: 0 }}
      whileInView={{
        y: 0,
        opacity: 1,
      }}
      transition={{
        duration: 1,
      }}
      className="w-[95%] lg:w-[48%] xl:w-[32%] bg-white my-5 rounded-xl p-8 cardHover "
    >
      <div
        className={`iconDev w-12 h-14 rounded-xl flex justify-center items-center ${bgColor}`}
      >
        {React.cloneElement(icon, { color })}
      </div>

      <h3 className=" text-xl text-foreground my-5 font-bold ">{title}</h3>
      <p className=" text-muted-foreground leading-relaxed">{desc}</p>
    </motion.div>
  );
}
