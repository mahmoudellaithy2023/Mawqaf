const PostHeader = ({ post }) => {
    return (
        <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-mainColor flex items-center justify-center font-bold text-white">
                        {post.user?.name?.[0] || "U"}
                    </div>

                    <div>
                    <p className="font-semibold mt-1 text-lg text-mainColor hover:text-mainColorHover cursor-pointer hover:scale-105 transition-all duration-150">
                        {post.user?.name || "Unknown User"}
                    </p>
                    <p className="text-xs  text-black">
                        {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                    </div>
            </div>
        </div>
    );
};

export default PostHeader;
