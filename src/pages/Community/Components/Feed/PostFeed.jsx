import PostCard from "../Posts/PostCard";
import EmptyFeed from "./EmptyFeed";

const PostFeed = ({ posts, isLoading }) => {
  if (isLoading && posts.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-mainColor font-bold text-lg">
          جاري تحميل البوستات...
        </p>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return <EmptyFeed />;
  }

  return (
    <div className="space-y-4 ">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
};

export default PostFeed;
