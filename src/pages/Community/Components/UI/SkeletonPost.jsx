const SkeletonPost = () => {
  return (
    <div className="bg-[var(--community-card)] rounded-2xl p-5 animate-pulse space-y-4">
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-300" />
        <div className="space-y-2">
          <div className="h-3 w-32 bg-gray-300 rounded" />
          <div className="h-2 w-20 bg-gray-200 rounded" />
        </div>
      </div>

      <div className="space-y-2">
        <div className="h-3 bg-gray-300 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-4/5" />
      </div>

      <div className="h-40 bg-gray-200 rounded-xl" />
    </div>
  );
};

export default SkeletonPost;
