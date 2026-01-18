import React, { useEffect, useState } from "react";
import { Star, ArrowUpRight, Sparkles, UserPlus } from "lucide-react";
import ProfileCard from "./ProfileCard";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile, toggleFollow } from "../../store/slices/profileSlice";
import UserPosts from "../../components/UserPosts";
import { MessageCircleMore } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createConversation } from "../../store/slices/chatSlice";

import UserReservations from "../../components/UserReservations";

export default function Profile() {
  const navigate = useNavigate();
  const { id } = useParams();

  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const currentUser = user?.id;

  const {
    data: profile,
    loading,
    isFollowing,
  } = useSelector((state) => state.profile);

  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (id) dispatch(fetchProfile(id));
  }, [id, dispatch]);

  const handleCreateConversation = async () => {
    if (!currentUser || !id) return;

    try {
      await dispatch(
        createConversation({ senderId: currentUser, receiverId: id })
      ).unwrap();
    } catch (err) {
      console.error("Failed to create conversation:", err);
      // Even if it fails (e.g. already exists), we typically want to go to chat
    }
    navigate(`/chat/${id}`);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-mainColor font-bold text-lg">
          جاري تحميل الملف الشخصي...
        </p>
      </div>
    );

  if (!profile)
    return <p className="text-center mt-40 text-xl">لا يوجد بيانات</p>;

  return (
    <div className="w-full flex flex-col items-center bg-white">
      {console.log("mmmma", profile)}
      {/* Cover */}
      <div className="w-full h-72 rounded-xl shadow-md bg-mainColor flex items-center justify-center"></div>

      {/* Profile Card */}
      <div className="-mt-24 w-full flex flex-col items-center px-6 relative z-10">
        <ProfileCard data={profile} />
        <div className="flex justify-center gap-4">
          {" "}
          {currentUser !== id && (
            <button
              onClick={() => dispatch(toggleFollow())}
              className={`mt-4 px-6 py-2 rounded-full font-semibold transition flex items-center gap-2 ${
                isFollowing
                  ? "bg-gray-200 text-gray-700"
                  : "bg-mainColor text-white"
              }`}
            >
              {isFollowing ? (
                "متابع"
              ) : (
                <>
                  <UserPlus size={18} /> متابعة
                </>
              )}
            </button>
          )}
          {currentUser === id ? (
            <button
              onClick={() => navigate(`/chat/${id}`)}
              className={`mt-4 px-6 py-2 bg-mainColor text-white rounded-full font-semibold transition flex items-center gap-2 `}
            >
              <MessageCircleMore size={18} /> الدردشات
            </button>
          ) : (
            <button
              onClick={() => handleCreateConversation()}
              className={`mt-4 px-6 py-2 bg-mainColor text-white rounded-full font-semibold transition flex items-center gap-2 `}
            >
              <MessageCircleMore size={18} /> مراسلة
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="w-11/12 md:w-4/5 mt-6 flex justify-around font-semibold text-lg text-gray-600">
        {["overview", ...(currentUser === id ? ["activity"] : [])].map(
          (tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 ${
                activeTab === tab
                  ? "text-mainColor border-b-2 border-mainColor"
                  : "hover:text-mainColor"
              }`}
            >
              {tab === "overview" ? "   المنشورات  " : "   سجل الرحالات    "}
            </button>
          )
        )}
      </div>

      {/* Tabs Content */}
      <div className="w-11/12 md:w-4/5 mt-6 mb-10">
        {activeTab === "overview" && (
          <div className="flex flex-col gap-6">
            <UserPosts userId={id} />
          </div>
        )}

        {activeTab === "activity" && (
          <div className="flex flex-col gap-6">
            <UserReservations />
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ icon, value, label }) {
  return (
    <div className="bg-white shadow rounded-xl p-6 flex flex-col items-center gap-2">
      {icon}
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-gray-600">{label}</p>
    </div>
  );
}
