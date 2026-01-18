import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addComment,
  updateComment,
} from "../../../../store/slices/communitySlice";
import API from "../../../../API/axios";
import UserInfo from "./UserInfo";
import { Link } from "react-router-dom";
import { getRelativeTime } from "../../../../utils/timeUtils";
import { AlertTriangle } from "lucide-react";
import ReportModal from "../UI/ReportModal";

const PostComments = ({ post }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const userId = user?.id;
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [reportingCommentId, setReportingCommentId] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      const res = await API.get(`/community/posts/${post._id}/comments`);
      setComments(res.data);
      setLoading(false);
    };
    fetchComments();
  }, [post._id]);

  useEffect(() => {
    const closeMenu = () => setOpenMenuId(null);
    document.addEventListener("click", closeMenu);

    return () => {
      document.removeEventListener("click", closeMenu);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    const result = await dispatch(addComment({ postId: post._id, content }));
    if (addComment.fulfilled.match(result)) {
      setComments([...comments, result.payload.comment]);
      setContent("");
    }
  };

  const handleEdit = (comment) => {
    if (comment.user?._id !== userId) return;
    setEditingCommentId(comment._id);
    setEditingContent(comment.content);
  };

  const handleUpdateComment = async (e) => {
    e.preventDefault();
    if (!editingContent.trim()) return;

    const result = await dispatch(
      updateComment({ commentId: editingCommentId, content: editingContent })
    );

    if (updateComment.fulfilled.match(result)) {
      setComments(
        comments.map((c) =>
          c._id === editingCommentId ? { ...c, content: editingContent } : c
        )
      );
      setEditingCommentId(null);
      setEditingContent("");
    }
  };

  return (
    <div className="mt-4 pt-2 space-y-4">
      {loading && (
        <p className="text-xs text-muted-foreground animate-pulse">
          Loading comments...
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex gap-3 items-center">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor/50 transition-all placeholder:text-muted-foreground text-foreground"
        />
        <button
          disabled={!content.trim()}
          className="px-4 py-2 rounded-full bg-mainColor text-white text-sm font-medium hover:bg-mainColorHover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Reply
        </button>
      </form>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment._id} className="group flex gap-3">
            <div className="shrink-0">
              <Link to={`/profile/${comment.user?._id}`}>
                {comment.user?.avatar ? (
                  <img
                    src={
                      comment.user.avatar.startsWith("http")
                        ? comment.user.avatar
                        : `/${comment.user.avatar}`
                    }
                    alt="avatar"
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-gray-100"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-mainColor/10 flex items-center justify-center text-xs font-bold text-mainColor">
                    {comment.user?.firstName?.charAt(0) || "?"}
                  </div>
                )}
              </Link>
            </div>

            <div className="flex-1">
              <div className="bg-gray-50 rounded-2xl rounded-tl-none px-4 py-2.5 inline-block min-w-[200px]">
                <div className="flex items-center justify-between gap-4 mb-1">
                  <Link to={`/profile/${comment.user?._id}`}>
                    <span className="text-sm font-bold text-foreground hover:text-mainColor transition-colors cursor-pointer">
                      {comment.user?.firstName} {comment.user?.lastName}
                    </span>
                  </Link>
                  <span className="text-[10px] text-muted-foreground">
                    {getRelativeTime(comment.createdAt)}
                  </span>
                </div>

                {editingCommentId === comment._id ? (
                  <form onSubmit={handleUpdateComment} className="mt-1">
                    <input
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-mainColor"
                      autoFocus
                    />
                    <div className="flex justify-end gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => setEditingCommentId(null)}
                        className="text-xs text-gray-500 hover:text-gray-700"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="text-xs text-mainColor font-medium hover:text-mainColorHover"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                ) : (
                  <p className="text-[14px] text-gray-700 leading-snug break-words">
                    {comment.content}
                  </p>
                )}
              </div>

              {/* Actions Row */}
              <div className="flex items-center gap-4 mt-1 ml-2">
                {/* Add Like/Reply button logic here later */}

                {comment.user?._id === userId && (
                  <button
                    onClick={() => handleEdit(comment)}
                    className="text-xs font-medium text-gray-400 hover:text-mainColor transition-colors opacity-0 group-hover:opacity-100"
                  >
                    Edit
                  </button>
                )}
                {comment.user?._id === userId && (
                  <button className="text-xs font-medium text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                    Delete
                  </button>
                )}

                {comment.user?._id !== userId && (
                  <button
                    onClick={() => setReportingCommentId(comment._id)}
                    className="text-xs font-medium text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 flex items-center gap-1"
                  >
                    <AlertTriangle size={12} />
                    إبلاغ
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {reportingCommentId && (
        <ReportModal
          targetId={reportingCommentId}
          targetModel="Comment"
          onClose={() => setReportingCommentId(null)}
        />
      )}
    </div>
  );
};

export default PostComments;
