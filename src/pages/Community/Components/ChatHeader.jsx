export default function ChatHeader({
  setOpen,
  currentConversation,
  otherUser,
  onlineUsers,
}) {
  return (
    <div className="h-[70px] bg-white border-b border-gray-200 flex items-center px-4 justify-between lg:justify-start">
      <button onClick={() => setOpen(true)} className="lg:hidden ml-4">
        ☰
      </button>
      {otherUser && (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden relative">
            {otherUser.avatar ? (
              <img
                src={otherUser.avatar}
                alt={otherUser.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600 font-bold">
                {otherUser.name && otherUser.name[0]}
              </div>
            )}
            {/* Online Indicator */}
            {onlineUsers?.some((u) => u.userId === otherUser.id) && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
            )}
          </div>
          <div>
            <div className="font-semibold">{otherUser.name}</div>
            <div className="text-xs text-green-500">
              {onlineUsers?.some((u) => u.userId === otherUser.id)
                ? "متصل الآن"
                : ""}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
