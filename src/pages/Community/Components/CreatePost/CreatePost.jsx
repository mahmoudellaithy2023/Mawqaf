import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createPost } from "../../../../store/slices/communitySlice";
import CategorySelector from "./CategorySelector";
import { Image, Video, X } from "lucide-react";

const CreatePost = () => {
  const dispatch = useDispatch();

  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [category, setCategory] = useState("DISCUSSION");

  // Cleanup preview URL on unmount or when file changes
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreviewUrl(null);
  };

  const handleSubmit = (e) => {
    console.log("loading");

    e.preventDefault();
    if (!content.trim() && !file) return;

    const formData = new FormData();
    formData.append("content", content);
    formData.append("category", category);
    if (file) formData.append("media", file);

    dispatch(createPost(formData));

    setContent("");
    removeFile();
    setCategory("DISCUSSION");
  };

  return (
    <div className="bg-white/90 backdrop-blur rounded-2xl p-5 mb-8 shadow-sm border border-white/20 hover:shadow-md transition-shadow duration-300">
      {/* Category Pills */}
      <CategorySelector value={category} onChange={setCategory} />

      <form onSubmit={handleSubmit}>
        {/* Textarea */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind? Share with the community..."
          rows={3}
          className="w-full mt-4 bg-gray-50/50 resize-none border border-gray-200 rounded-2xl p-4
            placeholder:text-muted-foreground
            text-foreground focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor/50 transition-all"
        />

        {/* Media Preview */}
        {previewUrl && (
          <div className="relative mt-4 w-full rounded-xl overflow-hidden bg-gray-50 border border-gray-100 max-h-[300px] flex items-center justify-center group">
            <button
              type="button"
              onClick={removeFile}
              className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors z-10 opacity-0 group-hover:opacity-100"
            >
              <X size={16} />
            </button>
            {file?.type.startsWith("video") ? (
              <video
                src={previewUrl}
                controls
                className="w-full h-full object-contain max-h-[300px]"
              />
            ) : (
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-contain max-h-[300px]"
              />
            )}
          </div>
        )}

        {/* Bottom actions */}
        <div className="flex items-center justify-between mt-4 pl-1">
          {/* Media buttons */}
          <div className="flex items-center gap-4 text-muted-foreground">
            <label className="flex items-center gap-2 cursor-pointer hover:text-mainColor transition-colors px-2 py-1 rounded-lg hover:bg-mainColor/5">
              <Image size={20} />
              <span className="text-sm font-medium">Photo</span>
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleFileChange}
              />
            </label>

            <label className="flex items-center gap-2 cursor-pointer hover:text-mainColor transition-colors px-2 py-1 rounded-lg hover:bg-mainColor/5">
              <Video size={20} />
              <span className="text-sm font-medium">Video</span>
              <input
                type="file"
                accept="video/*"
                hidden
                onChange={handleFileChange}
              />
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!content.trim() && !file}
            className="px-6 py-2.5 rounded-xl bg-mainColor text-white font-medium cursor-pointer shadow-lg shadow-mainColor/25
              hover:bg-mainColorHover hover:translate-y-[-1px] transition-all
              disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0"
          >
            Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
