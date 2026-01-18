import { getPostsByUser, resetUserPosts } from "../store/slices/communitySlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import PostFeed from "../pages/Community/Components/Feed/PostFeed";

export default function UserPosts({ userId }) {
  const dispatch = useDispatch();
  const { userPosts, isLoadingPosts, userPostsPage, userPostsLastPage } =
    useSelector((state) => state.community);

  useEffect(() => {
    if (userId) {
      dispatch(resetUserPosts());
      dispatch(getPostsByUser({ userId, page: 1 }));
    }
  }, [userId, dispatch]);

  const handleLoadMore = () => {
    if (userPostsPage < userPostsLastPage) {
      dispatch(getPostsByUser({ userId, page: userPostsPage + 1 }));
    }
  };

  if (!userPosts.length && !isLoadingPosts)
    return (
      <p className="text-center mt-8 text-gray-500">
        لا توجد بوستات لهذا المستخدم
      </p>
    );

  return (
    <div className="w-full flex flex-col gap-4">
      <PostFeed posts={userPosts} isLoading={isLoadingPosts} />

      {isLoadingPosts && userPosts.length > 0 && (
        <div className="mt-8 flex justify-center pb-8">
          <div className="w-8 h-8 border-4 border-mainColor border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {userPostsPage < userPostsLastPage && !isLoadingPosts && (
        <div className="mt-4 flex justify-center pb-8">
          <button
            type="button"
            className="group relative px-8 py-3 bg-white/80 backdrop-blur-md border border-white/40 shadow-lg shadow-mainColor/10 rounded-2xl
              text-mainColor font-bold overflow-hidden transition-all duration-300
              hover:shadow-mainColor/20 hover:scale-[1.02] hover:bg-white active:scale-95"
            onClick={(e) => {
              e.preventDefault();
              handleLoadMore();
            }}
          >
            <span className="relative z-10 flex items-center gap-2">
              تحميل المزيد
              <svg
                className="w-4 h-4 transition-transform group-hover:translate-y-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
