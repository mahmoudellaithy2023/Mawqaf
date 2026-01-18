const tags = [
  { name: "#Tesla", posts: 234 },
  { name: "#SupercarSunday", posts: 189 },
  { name: "#EVFuture", posts: 156 },
  { name: "#TrackDay", posts: 98 },
];

const TrendingTags = () => {
  return (
    <>
      <h3 className="text-sm font-semibold text-gray-300 mb-3">
        Trending
      </h3>

      <ul className="space-y-3">
        {tags.map((tag) => (
          <li key={tag.name} className="flex justify-between text-sm">
            <span className="text-mainColor cursor-pointer hover:underline">
              {tag.name}
            </span>
            <span className="text-gray-500">
              {tag.posts} posts
            </span>
          </li>
        ))}
      </ul>
    </>
  );
};

export default TrendingTags;
