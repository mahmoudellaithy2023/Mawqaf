const PostContent = ({ post }) => {
  const baseURL = import.meta.env.VITE_API_URL;
  const getMediaUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${baseURL}${path}`;
  };

  return (
    <div className="mb-4">
      {post.content && (
        <p className="text-[15px] leading-relaxed text-foreground whitespace-pre-wrap mb-4">
          {post.content}
        </p>
      )}

      {post.media && (
        <img
          src={getMediaUrl(post.media)}
          alt="Post media"
          className="rounded-xl w-full max-h-[500px] object-contain border border-gray-100"
        />
      )}

      {post.media && post.mediaType === "VIDEO" && (
        <video
          controls
          className="rounded-xl w-full max-h-[500px] object-cover border border-gray-100"
        >
          <source src={getMediaUrl(post.media)} type="video/mp4" />
        </video>
      )}
    </div>
  );
};

export default PostContent;
