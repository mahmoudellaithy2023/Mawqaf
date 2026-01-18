const EmptyFeed = () => {
  return (
    <div className="bg-[#ffffff] rounded-xl border border-white/5 p-10 flex flex-col items-center justify-center text-center">
      <h3 className="text-lg font-semibold mb-1">
        No posts in this category
      </h3>
      <p className="text-sm text-gray-400">
        Be the first to share something with the community!
      </p>
    </div>
  );
};

export default EmptyFeed;
