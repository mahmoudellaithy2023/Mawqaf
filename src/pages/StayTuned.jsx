import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import qrCode from "../Assets/Images/qr_code.jpeg";

export default function StayTuned() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-6 bg-pattern">
      <div className="text-center max-w-2xl mx-auto pt-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative inline-block mb-8"
        >
          <div className="absolute inset-0 bg-[#0e6b73]/20 blur-3xl rounded-full "></div>

          {/* Realistic iPhone Mockup using CSS */}
          <div className="relative group cursor-default transform rotate-[-5deg] hover:rotate-0 transition-transform duration-500">
            {/* iPhone Frame */}
            <div className="relative z-10 mt-3.5 w-60 h-100 bg-gray-900 rounded-[2.5rem] p-3 shadow-2xl border-4 border-gray-800 ring-1 ring-gray-950/40">
              {/* Screen */}
              <div className="w-full h-full bg-white rounded-[2rem] overflow-hidden relative flex flex-col">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-gray-900 rounded-b-xl z-20 flex justify-center items-center gap-2">
                  <div className="w-8 h-1 bg-gray-800 rounded-full"></div>
                  <div className="w-1 h-1 bg-gray-800 rounded-full"></div>
                </div>

                {/* Status Bar Mock */}
                <div className="h-8 flex justify-between items-center px-4 pt-2 text-[8px] font-bold text-gray-800 z-10">
                  <span>9:41</span>
                  <div className="flex gap-1">
                    <span>📶</span>
                    <span>🔋</span>
                  </div>
                </div>

                {/* App UI Content Mock */}
                <div className="flex-1 bg-gray-50 relative overflow-hidden flex flex-col items-center pt-8">
                  {/* Map Background Pattern */}
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#0e6b73_1px,transparent_1px)] [background-size:16px_16px]"></div>

                  {/* App Logo on Screen */}
                  <div>
                    <img
                      src={qrCode}
                      alt="Mawqif Logo"
                      className="w-full h-full mb-4 relative z-10"
                    />
                  </div>
                  {/* Bottom Tab Bar Mock */}
                  <div className="mt-auto w-full h-12 bg-white border-t border-gray-100 flex justify-around items-center text-gray-400 z-10">
                    <div className="w-4 h-4 rounded bg-[#0e6b73]"></div>
                    <div className="w-4 h-4 rounded bg-gray-300"></div>
                    <div className="w-4 h-4 rounded bg-gray-300"></div>
                  </div>
                </div>
              </div>

              {/* Side Buttons (CSS) */}
              <div className="absolute -left-[2px] top-20 w-[2px] h-8 bg-gray-700 rounded-l-md"></div>
              <div className="absolute -left-[2px] top-32 w-[2px] h-12 bg-gray-700 rounded-l-md"></div>
              <div className="absolute -right-[2px] top-24 w-[2px] h-16 bg-gray-700 rounded-r-md"></div>
            </div>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl md:text-6xl font-black text-gray-900 mb-6 drop-shadow-sm"
        >
          تطبيق <span className="text-[#0e6b73]">موقف</span>
          <br />
          <span className="text-[#f59f0a]">امسح الباركود للتحميل</span>
        </motion.h1>

        {/* <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed"
        >
          نعمل بجد لإطلاق تطبيقنا الجديد لتجربة حجز أسهل وأسرع.
          <br />
          تابعنا لتعرف موعد الإطلاق!
        </motion.p>*/}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          {/*<button className="btn bg-[#0e6b73] hover:bg-[#094f56] text-white border-none rounded-xl px-8 h-12 text-lg font-bold shadow-lg hover:shadow-[#0e6b73]/30 transition-all flex items-center gap-3 group">
            <BellRing size={20} className="group-hover:animate-swing" />
            أعلمني عند الإطلاق
          </button>
          */}

          <Link
            to="/"
            className="btn bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-xl px-8 h-12 text-lg font-bold shadow-sm hover:shadow-md transition-all flex items-center gap-3"
          >
            العودة للرئيسية
            <ArrowLeft size={20} />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}