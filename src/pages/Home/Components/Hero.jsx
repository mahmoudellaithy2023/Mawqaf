import {
  MapPin,
  Navigation,
  Search,
  Clock,
  Eye,
  MoveLeft,
  Users,
  Smartphone,
} from "lucide-react";
import MyMap from "./Map";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

export default function Hero() {
  return (
    <>
      <section className="z-0 heroHome grid grid-cols-1 lg:grid-cols-2 h-full items-center justify-center gap-4 sm:gap-6 pt-28 sm:pt-40 px-4 relative ">
        <motion.div
          whileInView={{
            opacity: [0, 0.3, 0.7, 1],
            x: [-100, 0],
          }}
          animate={{ x: 0 }}
          transition={{ duration: 2 }}
          className="w-full h-[70vh] md:h-[70vh] lg:h-11/12 flex justify-start items-start lg:mb-40"
        >
          <MyMap />
        </motion.div>

        <div>
          <motion.div
            initial={{}}
            animate={{}}
            transition={{ duration: 2 }}
            whileInView={{
              opacity: [0, 0.3, 0.7, 1],
              x: [100, 0],
            }}
            className="flex flex-col justify-center items-center"
          >
            <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
              <motion.div
                initial={{ opacity: 0, y: -100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, type: "spring", mass: 4 }}
                className="flex w-40 h-8 items-center justify-center text-white gap-2 bg-[#2C7E88]/80 backdrop-blur-sm rounded-full border border-white/10"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <p className="text-xs font-bold"> تتبّع مباشر للحركة</p>
              </motion.div>

              <Link to="/stay-tuned">
                <motion.div
                  initial={{ opacity: 0, y: -100 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 1,
                    delay: 0.1,
                    type: "spring",
                    mass: 4,
                  }}
                  className="flex px-4 h-8 items-center justify-center text-white gap-2 bg-[#f59f0a] hover:bg-[#d98b09] transition-colors rounded-full shadow-lg shadow-orange-500/20"
                >
                  <Smartphone size={14} />
                  <p className="text-xs font-bold">تطبيق الهاتف </p>
                </motion.div>
              </Link>
            </div>

            <motion.div
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 2,
                type: "spring",
                mass: 2,
              }}
            >
              <motion.div
                animate={{ x: [10, -10] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatType: "reverse",
                }}
              >
                <h3 className="text-white text-4xl sm:text-6xl md:text-7xl text-center font-bold leading-tight">
                  مواصلات عامة ذكية
                  <br />
                  <span className="opacity-75">في متناول يدك</span>
                </h3>

                <p className="text-white text-center mt-4 sm:mt-6 text-sm sm:text-lg opacity-65 leading-relaxed">
                  اعثر على المحطات، خطّط مسارك، واحجز مقعدك في ثوانٍ. لا مزيد من
                  <br className="hidden sm:block" />
                  الانتظار، لا مزيد من الارتباك.
                </p>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 2, type: "spring", mass: 4 }}
              className="w-full text-center flex items-center justify-center gap-15 md:gap-20 py-8 sm:py-10 text-gray-100 mb-25"
            >
              <div className="flex flex-col items-center gap-1">
                <div className="flex gap-2 items-center justify-center">
                  <Clock size={20} className="text-white mb-1" />
                  <span className="text-2xl sm:text-3xl font-bold">
                    10دقائق
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-white/80">
                  حجز مقعد مؤقت
                </p>
              </div>

              <div className="flex flex-col items-center gap-1">
                <div className="flex gap-2 items-center justify-center">
                  <Users size={26} className="text-white mb-1" />
                  <span className="text-2xl sm:text-3xl font-bold">50+</span>
                </div>
                <p className="text-xs sm:text-sm text-white/80">محطة نشطة</p>
              </div>

              <div className="flex flex-col items-center gap-1">
                <div className="flex gap-2 items-center justify-center">
                  <Eye size={26} className="text-white mb-1" />
                  <span className="text-2xl sm:text-3xl font-bold">24/7</span>
                </div>
                <p className="text-xs sm:text-sm text-white/80">
                  مراقبة على مدار الساعة
                </p>
              </div>
            </motion.div>
          </motion.div>
          <div className="absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none">
            <svg
              data-name="Layer 1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
              className="relative block w-full h-[50px] md:h-[100px]"
            >
              <path
                d="M0,30 C400,120 900,-60 1200,60 V120 H0 Z"
                className="fill-gray-100"
              ></path>
            </svg>
          </div>
        </div>
      </section>
    </>
  );
}
