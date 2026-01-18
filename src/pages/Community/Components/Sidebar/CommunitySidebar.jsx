import SidebarNav from "./SidebarNav";
import TrendingTags from "./TrendingTags";

const CommunitySidebar = ({ activeCategory, onCategoryChange }) => {
  return (
    <div className="sticky top-24 space-y-6">
      {/* Navigation */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-white/20">
        <SidebarNav
          activeCategory={activeCategory}
          onCategoryChange={onCategoryChange}
        />
      </div>

      {/* Trending */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-white/20">
        <TrendingTags />
      </div>

      {/* Go Pro */}
    </div>
  );
};

export default CommunitySidebar;
