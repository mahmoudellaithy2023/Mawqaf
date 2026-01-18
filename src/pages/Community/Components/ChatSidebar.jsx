import { motion, AnimatePresence } from "framer-motion";
import ChatItem from "./ChatItem";
import { getOtherUser } from "../../../utils/chatUtils";
import { useNavigate } from "react-router-dom";

export default function ChatSidebar({
  open,
  setOpen,
  conversations,
  currentConversation,
  currentUser,
}) {
  const navigate = useNavigate();

  return (
    <div
      className={`
        fixed lg:static z-40
        h-full w-[320px] bg-white
        border-l border-gray-200
        transition-transform duration-300
        ${open ? "translate-x-0" : "translate-x-full"}
        lg:translate-x-0
        flex flex-col
      `}
    >
      <div className="p-4 text-xl font-semibold flex justify-between items-center text-mainColor">
        المحادثات
        <button
          onClick={() => setOpen(false)}
          className="lg:hidden text-xl text-gray-500"
        >
          ✕
        </button>
      </div>

      <div className="px-4">
        <input
          placeholder="ابحث في المحادثات..."
          className="w-full rounded-lg bg-gray-50 border border-gray-200 px-4 py-2 text-sm outline-none focus:border-mainColor focus:ring-1 focus:ring-mainColor/20 transition placeholder:text-gray-400"
        />
      </div>

      <div className="mt-4 overflow-y-auto flex-1">
        <AnimatePresence>
          {conversations &&
            [...conversations]
              .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
              .map((conv) => {
                const isActive = currentConversation?._id === conv._id;
                const other = getOtherUser(conv.members, currentUser);
                const lastMsg = conv.lastMessage?.text || conv.lastMessage;

                return (
                  <motion.div
                    key={conv._id}
                    layout
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => {
                      if (other.id) {
                        navigate(`/chat/${other.id}`);
                      }
                      setOpen(false);
                    }}
                  >
                    <ChatItem
                      active={isActive}
                      name={other.name}
                      avatar={other.avatar}
                      message={lastMsg}
                      unreadCount={conv.unreadCount || 0}
                      time={
                        conv.updatedAt
                          ? new Date(conv.updatedAt).toLocaleTimeString(
                              "ar-EG",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )
                          : ""
                      }
                    />
                  </motion.div>
                );
              })}
        </AnimatePresence>
      </div>
    </div>
  );
}
