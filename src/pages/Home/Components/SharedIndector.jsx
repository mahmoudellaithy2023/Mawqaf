import React from "react";
import { motion } from "motion/react";

export default function SharedIndicator({
  count,
  icon: Icon,
  title,
  description,
  index,
}) {
  return (
    <motion.div
      whileInView={{
        scale: [1, 1.5, 1],
      }}
      transition={{
        duration: 0.5 * index + 1,
      }}
      className="flex flex-col justify-center h-fit items-center text-center w-full mb-5"
    >
      <div className="indicator w-32 h-32 flex justify-center items-center mb-2 ">
        <motion.span
          initial={{
            x: 20,
            y: 10,
          }}
          animate={{
            x: -20,
            y: -10,
          }}
          transition={{
            duration: 0.5 * index + 1,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="indicator-item badge w-8 border-base-content right-2 h-8 rounded-full bg-[#146F7B]"
        >
          {count}
        </motion.span>
        <div className="bg-[#E4EDEF] rounded-2xl grid h-full w-full place-items-center">
          <Icon className="bg-[#E4EDEF] w-12 z-40" color="#146F7B" size={45} />
        </div>
      </div>
      <h1 className="mt-3 text-black text-lg">{title}</h1>
      <p className="mt-3 text-[#9BA6B1] font-semibold text-sm mx-6 flex text-center ">
        {description}
      </p>
    </motion.div>
  );
}
