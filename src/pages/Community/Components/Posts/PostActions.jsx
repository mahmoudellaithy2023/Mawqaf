import { useState } from "react";
import { useDispatch } from "react-redux";
import { likePost } from "../../../../store/slices/communitySlice";
import { Heart, MessageCircle } from "lucide-react";
import API from "../../../../API/axios";

const PostActions = ({ post, onCommentClick }) => {
  const dispatch = useDispatch();
  const [likers, setLikers] = useState([]);
  const [loadingLikers, setLoadingLikers] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleLike = async () => {
    try {
      await dispatch(likePost(post._id)).unwrap();
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleMouseEnter = async () => {
    setShowTooltip(true);
    if (likers.length === 0 && post.likesCount > 0) {
      setLoadingLikers(true);
      try {
        const res = await API.get(`/community/posts/${post._id}/likes`);
        setLikers(res.data);
      } catch (error) {
        console.error("Failed to fetch likers", error);
      } finally {
        setLoadingLikers(false);
      }
    }
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
    <div className="flex items-center justify-start pt-3 mt-3 gap-2 border-t border-gray-100">
      {/* Like */}
      <div className="relative">
        <button
          onClick={handleLike}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={`group flex items-center gap-1.5 text-sm font-medium transition-colors px-2 py-1.5 rounded-full hover:bg-red-50
            ${
              post.isLiked ? "text-red-500" : "text-gray-500 hover:text-red-500"
            }`}
        >
          <div
            className={`p-1.5 rounded-full group-hover:bg-red-100/50 transition-colors`}
          >
            <Heart
              size={20}
              fill={post.isLiked ? "currentColor" : "none"}
              className={`transition-transform duration-200 ${
                post.isLiked ? "scale-110" : "group-hover:scale-110"
              }`}
            />
          </div>
          <span className="tabular-nums">
            {Math.max(0, post.likesCount || 0)}
          </span>
        </button>

        {/* Likers Tooltip */}
        {showTooltip && post.likesCount > 0 && (
          <div className="absolute bottom-full left-0 mb-2 w-48 bg-white/95 backdrop-blur-md shadow-xl border border-gray-100 rounded-xl p-3 z-50 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-xs font-semibold text-gray-400 mb-2">
              Liked by
            </div>
            {loadingLikers ? (
              <div className="space-y-2">
                <div className="h-6 bg-gray-100 rounded animate-pulse" />
                <div className="h-6 bg-gray-100 rounded animate-pulse" />
              </div>
            ) : (
              <div className="flex flex-col gap-2 max-h-[150px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
                {likers.length > 0 ? (
                  likers.map((user) => (
                    <div key={user._id} className="flex items-center gap-2">
                      {user.avatar ? (
                        <img
                          src={
                            user.avatar.startsWith("http")
                              ? user.avatar
                              : `/${user.avatar}`
                          }
                          alt={user.firstName}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-mainColor/10 flex items-center justify-center text-[8px] font-bold text-mainColor">
                          {user.firstName?.charAt(0)}
                        </div>
                      )}
                      <span className="text-xs font-medium text-foreground truncate">
                        {user.firstName} {user.lastName}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400 italic">
                    No likers found
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Comment */}
      <button
        onClick={onCommentClick}
        className="group flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-mainColor transition-colors px-2 py-1.5 rounded-full hover:bg-mainColor/5"
      >
        <div className="p-1.5 rounded-full group-hover:bg-mainColor/10 transition-colors">
          <MessageCircle
            size={20}
            className="group-hover:scale-110 transition-transform"
          />
        </div>
        <span>{post.commentsCount}</span>
      </button>
    </div>
  );
};

export default PostActions;
