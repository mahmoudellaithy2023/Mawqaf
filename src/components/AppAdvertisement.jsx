import React, { useEffect, useState } from "react";
import { X, Bus } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function AppAdvertisement() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already seen the ad
    const hasSeenAd = localStorage.getItem("mowqif_app_intro_shown");
    if (!hasSeenAd) {
      // Show ad after a small delay for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // Mark as shown in localStorage
    localStorage.setItem("mowqif_app_intro_shown", "true");
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center text-center pt-12 pb-8 px-8">
              {/* Logo Badge */}
              <div className="flex items-center gap-3 mb-8 bg-gray-50 px-5 py-2 rounded-full border border-gray-100 shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-[#0e6b73] flex items-center justify-center text-white shadow-sm">
                  <Bus size={16} />
                </div>
                <span className="text-lg font-bold text-[#0e6b73]">موقف</span>
              </div>

              {/* Realistic iPhone Mockup using CSS */}
              <div className="relative mb-8 group cursor-default transform hover:-translate-y-2 transition-transform duration-500">
                <div className="absolute inset-0 bg-[#f59f0a]/30 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* iPhone Frame */}
                <div className="relative z-10 w-40 h-72 bg-gray-900 rounded-[2.5rem] p-3 shadow-2xl border-4 border-gray-800 ring-1 ring-gray-950/40">
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
                      <div className="w-16 h-16 bg-[#0e6b73] rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg z-10 animate-pulse">
                        <Bus size={32} />
                      </div>

                      {/* Skeleton UI Lines */}
                      <div className="w-3/4 h-2 bg-gray-200 rounded-full mb-2 z-10"></div>
                      <div className="w-1/2 h-2 bg-gray-200 rounded-full z-10"></div>

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

                {/* Floating Elements (Preserved) */}
                <div className="absolute -right-8 top-12 bg-white p-2.5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] animate-bounce delay-700 z-20">
                  <span className="text-xl filter drop-shadow-sm">🚍</span>
                </div>
                <div className="absolute -left-6 bottom-16 bg-white p-2.5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] animate-bounce delay-100 z-20">
                  <span className="text-xl filter drop-shadow-sm">📍</span>
                </div>
              </div>

              {/* Content */}
              <h2 className="text-3xl font-black text-gray-800 mb-3">
                تجربة جديدة في الطريق!
              </h2>
              <p className="text-gray-500 text-lg mb-8 leading-relaxed max-w-xs">
                حمل التطبيق واستمتع بحجز رحلاتك بسهولة وسرعة أكبر.{" "}
                <span className="text-[#f59f0a] font-bold">
                  قريباً على هاتفك.
                </span>
              </p>

              {/* Action Button */}
              <Link
                to="/stay-tuned"
                onClick={handleClose} // Close overlay when navigating
                className="w-full btn bg-[#0e6b73] hover:bg-[#094f56] text-white border-none h-14 rounded-2xl text-lg font-bold shadow-lg hover:shadow-[#0e6b73]/30 transition-all flex items-center justify-center gap-2 group"
              >
                <span>ترقبوا الإطلاق</span>
                <span className="group-hover:translate-x-1 transition-transform">
                  ←
                </span>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
