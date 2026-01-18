import React from "react";
import { useRouteError, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, RefreshCcw, AlertCircle } from "lucide-react";

const ErrorPage = () => {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center space-y-8"
      >
        {/* Animated Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.2 
          }}
          className="relative inline-block"
        >
          <div className="text-mainColor bg-mainColor/10 p-8 rounded-full">
            <AlertCircle size={80} strokeWidth={1.5} />
          </div>
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut" 
            }}
            className="absolute inset-0 bg-mainColor/20 rounded-full -z-10 blur-xl"
          />
        </motion.div>

        {/* Text Content */}
        <div className="space-y-4">
          <h1 className="text-6xl font-black text-mainColor">
             {error?.status || "404"}
          </h1>
          <h2 className="text-2xl font-bold text-foreground">
            {error?.statusText || "Oops! Page Not Found"}
          </h2>
          <p className="text-muted-foreground text-lg">
            {error?.data?.message || "    هذا الصفحه غير موجوده      "}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 bg-mainColor hover:bg-mainColorHover text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-mainColor/25 active:scale-95"
          >
            <Home size={20} />
            الرئيسيه
          </Link>
          
          <button
            onClick={() => window.location.reload()}
            className="flex items-center justify-center gap-2 bg-white border-2 border-mainColor text-mainColor hover:bg-mainColor/5 px-8 py-3 rounded-xl font-semibold transition-all duration-300 active:scale-95"
          >
            <RefreshCcw size={20} />
            حاول مره اخري
          </button>
        </div>

        {/* Subtle Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-20 overflow-hidden">
          <div className="absolute top-1/4 -left-12 w-64 h-64 bg-mainColor/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-12 w-64 h-64 bg-mainColor/10 rounded-full blur-3xl" />
        </div>
      </motion.div>
    </div>
  );
};

export default ErrorPage;
