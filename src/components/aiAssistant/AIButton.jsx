import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export default function AIButton({ onClick }) {
  return (
    <>
      <motion.button
        onClick={onClick}
        initial={{ opacity: 0, scale: 0.5, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.9 }}
        transition={{
          duration: 0.4,
          type: "spring",
          stiffness: 200,
          damping: 15,
        }}
        className="
        fixed bottom-6 left-6 z-50
        w-14 h-14 rounded-full
        bg-mainColor text-white
        shadow-xl cursor-pointer
        flex items-center justify-center
      "
      >
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <MessageCircle className="w-7 h-7" />
        </motion.div>
      </motion.button>
    </>
  );
}
