import { SendHorizontal } from "lucide-react";

export default function ChatInput({
  newMessage,
  setNewMessage,
  handleSendMessage,
  replyingTo,
  setReplyingTo,
  otherUser,
  currentUser,
}) {
  return (
    <div className="bg-white">
      {/* Replying Banner */}
      {replyingTo && (
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 flex justify-between items-center text-sm text-gray-600 animate-slide-up">
          <div className="flex flex-col border-r-4 border-mainColor pr-3">
            <span className="font-bold text-mainColor mb-0.5">
              الرد على:{" "}
              {replyingTo.senderId === currentUser ? "نفسك" : otherUser?.name}
            </span>
            <span className="text-xs text-gray-500 truncate max-w-[300px]">
              {replyingTo.text}
            </span>
          </div>
          <button
            onClick={() => setReplyingTo(null)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition text-gray-500"
          >
            ✕
          </button>
        </div>
      )}

      {/* Input */}
      <form
        onSubmit={handleSendMessage}
        className="h-[80px] px-4 lg:px-6 flex items-center gap-3 border-t border-gray-200 bg-white"
      >
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="اكتب رسالتك هنا..."
          className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-5 py-3 outline-none focus:border-mainColor focus:ring-1 focus:ring-mainColor/20 transition placeholder:text-gray-400"
        />

        <button
          type="submit"
          disabled={!newMessage.trim()}
          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300
              ${
                newMessage.trim()
                  ? "bg-mainColor text-white shadow-lg shadow-mainColor/30 hover:scale-105 hover:bg-teal-700"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }
            `}
        >
          <SendHorizontal
            size={20}
            className={newMessage.trim() ? "mr-1" : ""}
          />
        </button>
      </form>
    </div>
  );
}
