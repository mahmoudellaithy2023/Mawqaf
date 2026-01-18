import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPosts, resetCommunity } from "../../store/slices/communitySlice";

import CommunityLayout from "./CommunityLayout";
import CommunitySidebar from "./Components/Sidebar/CommunitySidebar";

// (Next steps components – coming soon)
// import CreatePost from "./components/CreatePost/CreatePost";
// import CategoryTabs from "./Components/UI/CategoryTabs";
import PostFeed from "./Components/Feed/PostFeed";
import CreatePost from "./Components/CreatePost/CreatePost";

const Community = () => {
  const dispatch = useDispatch();
  const { posts, isLoadingPosts, page, lastPage } = useSelector(
    (state) => state.community
  );
  const [activeCategory, setActiveCategory] = useState("ALL");

  useEffect(() => {
    dispatch(resetCommunity());

    dispatch(
      getPosts({
        category: activeCategory,
        page: 1,
      })
    );
  }, [dispatch, activeCategory]);

  return (
    <CommunityLayout
      sidebar={
        <CommunitySidebar
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      }
    >
      <CreatePost />

      <PostFeed posts={posts} isLoading={isLoadingPosts} />

      {isLoadingPosts && posts.length > 0 && (
        <div className="mt-8 flex justify-center pb-8">
          <div className="w-8 h-8 border-4 border-mainColor border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {page < lastPage && !isLoadingPosts && (
        <div className="mt-8 flex justify-center pb-8">
          <button
            type="button"
            className="group relative px-8 py-3 bg-white/80 backdrop-blur-md border border-white/40 shadow-lg shadow-mainColor/10 rounded-2xl
              text-mainColor font-bold overflow-hidden transition-all duration-300
              hover:shadow-mainColor/20 hover:scale-[1.02] hover:bg-white active:scale-95"
            onClick={(e) => {
              e.preventDefault();
              dispatch(
                getPosts({
                  category: activeCategory,
                  page: page + 1,
                })
              );
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
    </CommunityLayout>
  );
};

export default Community;
