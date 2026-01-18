import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PostContent from "./PostContent";
import PostActions from "./PostActions";
import PostComments from "./PostComments";
import {
  updatePost,
  deletePost,
} from "../../../../store/slices/communitySlice";
import UserInfo from "./UserInfo";
import ReportModal from "../UI/ReportModal";
import { AlertTriangle, Trash2, Edit2 } from "lucide-react";
import Swal from "sweetalert2";

const PostCard = ({ post }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const userId = user?.id;

  const [showComments, setShowComments] = useState(false);
  const [editingPost, setEditingPost] = useState(false);
  const [editingContent, setEditingContent] = useState(post.content || "");
  const [editingMedia, setEditingMedia] = useState(null);
  const [editingMediaType, setEditingMediaType] = useState(
    post.mediaType || null
  );
  const [openMenu, setOpenMenu] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    const closeMenu = () => setOpenMenu(false);
    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, []);

  const handleEdit = (e) => {
    e.stopPropagation();
    if (post.user._id !== userId) return;
    setEditingPost(true);
    setOpenMenu(false);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    setOpenMenu(false);

    const result = await Swal.fire({
      title: "هل أنت متأكد؟",
      text: "لن تتمكن من استرجاع هذا المنشور بعد حذفه!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "نعم، احذف",
      cancelButtonText: "إلغاء",
    });

    if (result.isConfirmed) {
      try {
        await dispatch(deletePost(post._id)).unwrap();
        Swal.fire("تم الحذف!", "تم حذف المنشور بنجاح.", "success");
      } catch (err) {
        Swal.fire("خطأ!", err || "فشل في حذف المنشور", "error");
      }
    }
  };

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setEditingMedia(file);
    const type = file.type.startsWith("image") ? "IMAGE" : "VIDEO";
    setEditingMediaType(type);
  };

  const handleUpdate = async () => {
    if (!editingContent.trim() && !editingMedia) return;

    const formData = new FormData();
    formData.append("content", editingContent);
    formData.append("category", post.category || "DISCUSSION");
    if (editingMedia) formData.append("media", editingMedia);

    try {
      await dispatch(
        updatePost({ postId: post._id, updateData: formData })
      ).unwrap();
      setEditingPost(false);
      setEditingMedia(null);
    } catch (err) {
      console.error("Failed to update post:", err);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur rounded-2xl shadow-sm border border-white/20 p-5 relative transition-all duration-300 hover:shadow-xl hover:translate-y-[-2px]">
      {/* Header */}
      <div className="flex justify-between items-start">
        <UserInfo user={post.user} date={post.createdAt} />

        {/* Menu */}
        {!editingPost && (
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpenMenu(!openMenu);
              }}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-foreground"
            >
              <div className="text-xl leading-none mb-2 font-bold tracking-widest">
                ...
              </div>
            </button>

            {openMenu && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 mt-2 w-48 bg-white shadow-2xl border border-gray-100 rounded-2xl overflow-hidden z-[100] animate-in fade-in zoom-in-95 duration-200"
              >
                {post.user?._id === userId ? (
                  <div className="py-1">
                    <button
                      onClick={handleEdit}
                      className="w-full text-right px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-mainColor transition-colors flex items-center justify-between gap-2"
                    >
                      <span>تعديل المنشور</span>
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={handleDelete}
                      className="w-full text-right px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors flex items-center justify-between gap-2 border-t border-gray-50"
                    >
                      <span>حذف المنشور</span>
                      <Trash2 size={16} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setShowReportModal(true);
                      setOpenMenu(false);
                    }}
                    className="w-full text-right px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors flex items-center justify-between gap-2"
                  >
                    <span>إبلاغ عن المنشور</span>
                    <AlertTriangle size={16} />
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      {editingPost ? (
        <div className="mb-4 mt-2 bg-gray-50/50 rounded-2xl p-4 border border-mainColor/20 ring-1 ring-mainColor/10">
          <p className="text-xs font-bold text-mainColor mb-2 uppercase tracking-wider">
            Editing Post
          </p>
          <textarea
            value={editingContent}
            onChange={(e) => setEditingContent(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor/50 transition-all text-foreground resize-none"
            rows={4}
          />

          <div className="flex items-center gap-4 mt-3">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-muted-foreground hover:text-mainColor transition-colors bg-white border border-gray-200 px-3 py-1.5 rounded-lg hover:border-mainColor/30">
              <span>Change Media</span>
              <input
                type="file"
                accept="image/*,video/*"
                hidden
                onChange={handleMediaChange}
              />
            </label>
          </div>

          <div className="mt-3">
            {editingMedia && editingMediaType === "IMAGE" && (
              <div className="relative group w-fit">
                <img
                  src={URL.createObjectURL(editingMedia)}
                  alt="Preview"
                  className="max-h-[200px] rounded-lg border border-gray-200 object-cover"
                />
              </div>
            )}

            {editingMedia && editingMediaType === "VIDEO" && (
              <div className="relative group w-fit">
                <video
                  controls
                  className="max-h-[200px] rounded-lg border border-gray-200 object-cover"
                >
                  <source
                    src={URL.createObjectURL(editingMedia)}
                    type="video/mp4"
                  />
                </video>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={() => {
                setEditingPost(false);
                setEditingContent(post.content || "");
                setEditingMedia(null);
              }}
              className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              className="px-6 py-2 bg-mainColor text-white text-sm font-medium rounded-xl hover:bg-mainColorHover shadow-lg shadow-mainColor/20 transition-all hover:-translate-y-0.5"
            >
              Save Changes
            </button>
          </div>
        </div>
      ) : (
        <PostContent post={post} />
      )}

      {/* Actions */}
      <PostActions
        post={post}
        onCommentClick={() => setShowComments(!showComments)}
      />

      {/* Comments */}
      {showComments && <PostComments post={post} />}

      {/* Report Modal */}
      {showReportModal && (
        <ReportModal
          targetId={post._id}
          targetModel="Post"
          onClose={() => setShowReportModal(false)}
        />
      )}
    </div>
  );
};

export default PostCard;
