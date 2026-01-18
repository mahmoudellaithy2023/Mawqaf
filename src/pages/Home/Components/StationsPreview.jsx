import { ArrowRight, Download, Globe } from "lucide-react";
import React from "react";
import { motion } from "motion/react";
import { animate } from "motion";
import { Link } from "react-router-dom";

export default function StationsPreview() {
  const statsData = [
    { value: "4.8★", label: "تقييم التطبيق" },
    { value: "200+", label: "المسارات" },
    { value: "50+", label: "المحطات" },
    { value: "10K+", label: "المستخدمون يوميًا" },
  ];
  return (
    <div className="max-w-screen min-h-screen bg-[#18727D] overflow-x-hidden flex justify-center items-center flex-col">
      <motion.h1
        animate={{ x: [10, -10] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          repeatType: "reverse",
        }}
        className="lg:w-6/12 md:w-full text-center md:text-4xl lg:text-5xl text-3xl font-bold mb-10"
      >
        جاهز لتحويل رحلاتك اليومية؟
      </motion.h1>

      <motion.p
        animate={{ x: [-10, 10] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          repeatType: "reverse",
        }}
        className="lg:w-7/12 md:w-full text-center text-[#78ACB4] lg:text-2xl md:text-2xl text-balance font-bold mb-10"
      >
        انضم لآلاف الركاب الذين جعلوا تنقلهم اليومي أسهل مع موقف. ابدأ التخطيط
        لمسارات أكثر ذكاءً اليوم.
      </motion.p>

      <div className="flex flex-wrap gap-4 w-full justify-center items-center">
        <Link to="/stations">
          <motion.div
            whileHover={{
              scale: 1.07,
            }}
            className="flex justify-center items-center gap-4 rounded-2xl w-fit px-10 py-3 bg-white text-center hover:bg-gray-200 hover:cursor-pointer"
          >
            <Globe color="#146F7B" size={20} strokeWidth={1.5} />
            <p className="text-[#146F7B] font-bold text-center">
              استكشف المحطات
            </p>
            <motion.div
              initial={{ x: -5 }}
              animate={{ x: 5 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              <ArrowRight color="#146F7B" size={25} strokeWidth={1.25} />
            </motion.div>
          </motion.div>
        </Link>

        <Link to="/stay-tuned">
            <motion.div
              whileHover={{
                scale: 1.1,
              }}
              className="flex justify-center w-fit items-center gap-4 rounded-2xl px-7 py-3 bg-[#2C7E88] text-center border border-white hover:bg-[#2C7E88]-foreground/20 hover:cursor-pointer"
            >
              <motion.div
                initial={{ y: -3 }}
                animate={{ y: 3 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                <Download color="white" size={20} strokeWidth={1.5} />
              </motion.div>
              <p className="text-white font-bold text-center">تحميل التطبيق</p>
            </motion.div>
        </Link>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-8 mt-12 pt-12 border-t border-primary-foreground/10">
        {statsData.map((item, index) => {
          return (
            <motion.div
              key={index}
              whileInView={{
                x: index % 2 === 0 ? [100, 0] : [-100, 0],
              }}
              transition={{
                duration: 2,
              }}
              className="text-center"
            >
              <p className="font-display text-3xl font-bold text-primary-foreground">
                {item.value}
              </p>
              <p className="text-sm text-primary-foreground/60">{item.label}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
