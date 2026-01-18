import { useState } from "react";
import { Link } from "react-router-dom";
import { getRelativeTime } from "../../../../utils/timeUtils";

const UserInfo = ({ user, date }) => {
  // Build display name from firstName + lastName (matching authSlice structure)
  const displayName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`.trim()
      : user?.firstName ||
        user?.lastName ||
        user?.name ||
        user?.username ||
        "Unknown User";

  const cleanName = displayName.replace(/[\u200E\u200F\u202A-\u202E]/g, "");
  const initial = cleanName.charAt(0).toUpperCase();

  const [imageError, setImageError] = useState(false);

  return (
    <div className="flex items-center gap-3 mb-4">
      {/* User Avatar */}
      <Link to={`/profile/${user?.id}`} className="shrink-0 relative">
        {user?.avatar && !imageError ? (
          <img
            src={
              user.avatar.startsWith("http")
                ? user.avatar
                : `${import.meta.env.VITE_API_URL}/uploads/${user.avatar}`
            }
            alt={displayName}
            className="w-11 h-11 rounded-full object-cover ring-2 ring-transparent group-hover:ring-mainColor/20 transition-all"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-mainColor to-teal-600 flex items-center justify-center font-bold text-white shadow-sm">
            {initial}
          </div>
        )}
      </Link>

      {/* User Name + Date */}
      <div className="flex flex-col leading-tight">
        <Link to={`/profile/${user?._id}`} className="group">
          <p className="font-bold text-[15px] text-foreground group-hover:text-mainColor transition-colors">
            {displayName}
          </p>
        </Link>
        {date && (
          <p className="text-xs text-muted-foreground font-medium mt-0.5">
            {getRelativeTime(date)}
          </p>
        )}
      </div>
    </div>
  );
};

export default UserInfo;
