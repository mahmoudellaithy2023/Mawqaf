import { useRef, useEffect } from "react";
import { Reply } from "lucide-react";

export default function MessageList({
  messages,
  currentUser,
  otherUser,
  setReplyingTo,
}) {
  const containerRef = useRef(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div
      className="flex-1 p-4 lg:p-6 overflow-y-auto flex flex-col"
      ref={containerRef}
    >
      {messages.map((msg, index) => {
        // FIX: Check 'senderId' first (from your backend code), then fallback to 'sender'
        const msgSender = msg.senderId || msg.sender;
        const senderId = msgSender?._id || msgSender;

        const isOwn = senderId?.toString() === currentUser?.toString();

        const nextMsg = messages[index + 1];
        const nextSender = nextMsg?.senderId || nextMsg?.sender;
        const nextSenderId = nextSender?._id || nextSender;
        const nextIsSame = nextSenderId?.toString() === senderId?.toString();

        const prevMsg = messages[index - 1];
        const prevSender = prevMsg?.senderId || prevMsg?.sender;
        const prevSenderId = prevSender?._id || prevSender;
        const prevIsSame = prevSenderId?.toString() === senderId?.toString();

        return (
          <div
            key={msg._id}
            className={`max-w-[85%] lg:max-w-[60%] px-4 py-3 relative group flex flex-col shadow-sm
                  ${
                    isOwn
                      ? "self-start bg-gradient-to-br from-mainColor to-teal-700 text-white rounded-2xl"
                      : "self-end bg-white text-gray-800 border border-gray-100 rounded-2xl"
                  }
                  ${isOwn && nextIsSame ? "rounded-bl-md mb-[2px]" : ""}
                  ${isOwn && prevIsSame ? "rounded-tl-md" : ""}
                  ${!isOwn && nextIsSame ? "rounded-br-md mb-[2px]" : ""}
                  ${!isOwn && prevIsSame ? "rounded-tr-md" : ""}
                  ${!nextIsSame ? "mb-4" : ""}
                `}
          >
            {/* Reply Button (Active on Hover) */}
            <button
              onClick={() => setReplyingTo(msg)}
              className={`absolute top-2 ${
                isOwn ? "-left-8" : "-right-8"
              } opacity-0 group-hover:opacity-100 transition p-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 shadow-sm z-10`}
              title="reply"
            >
              <Reply size={14} />
            </button>

            {/* Quoted Message Display */}
            {msg.replyTo && (
              <div
                className={`mb-2 p-2 rounded-lg text-xs border-r-2 
                        ${
                          isOwn
                            ? "bg-black/10 border-white/50 text-white/90"
                            : "bg-gray-50 border-mainColor text-gray-600"
                        }`}
              >
                <div className="font-bold mb-1 flex items-center gap-1">
                  <span className="opacity-70">الرد على:</span>
                  {msg.replyTo.senderId === currentUser
                    ? "أنت"
                    : otherUser?.name || "مستخدم"}
                </div>
                <div className="truncate opacity-80">{msg.replyTo.text}</div>
              </div>
            )}

            <div className="leading-relaxed">{msg.text}</div>

            {/* Timestamp */}
            <div
              className={`text-[10px] mt-1 transition-opacity duration-200
                    ${
                      !nextIsSame
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100 h-0 overflow-hidden group-hover:h-auto"
                    }
                    ${isOwn ? "text-teal-100 text-left" : "text-gray-400"}
                  `}
            >
              {new Date(msg.createdAt).toLocaleTimeString("ar-EG", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        );
      })}
      <div />
    </div>
  );
}
