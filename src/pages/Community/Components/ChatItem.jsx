export default function ChatItem({
  name,
  avatar,
  message,
  time,
  active,
  unreadCount,
}) {
  return (
    <div
      className={`px-4 py-4 flex items-center gap-3 cursor-pointer transition-all duration-200 border-b border-gray-50 last:border-0
      ${
        active
          ? "bg-mainColor/5 border-r-4 border-mainColor"
          : "hover:bg-gray-50 border-r-4 border-transparent"
      }`}
    >
      <div
        className={`w-12 h-12 rounded-full ring-2 ${
          active ? "ring-mainColor/30" : "ring-transparent"
        } 
        ${avatar ? "" : "bg-gradient-to-br from-mainColor to-teal-600"} 
        text-white flex items-center justify-center font-bold text-lg overflow-hidden relative shadow-sm transition-all`}
      >
        {avatar ? (
          <img src={avatar} alt={name} className="w-full h-full object-cover" />
        ) : (
          name[0]
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1">
          <div
            className={`font-semibold text-sm truncate ${
              active ? "text-mainColor" : "text-gray-800"
            }`}
          >
            {name}
          </div>
          <div className="text-[10px] text-gray-400 whitespace-nowrap">
            {time}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div
            className={`text-xs truncate max-w-[180px] ${
              unreadCount > 0 ? "font-bold text-gray-800" : "text-gray-500"
            }`}
          >
            {message}
          </div>
          {unreadCount > 0 && (
            <div className="min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold shadow-sm">
              {unreadCount}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
