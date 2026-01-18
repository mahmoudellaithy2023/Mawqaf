import React, { useState } from "react";
import { Calendar, BadgeCheck, Camera } from "lucide-react";
import API from "../../API/axios";
import { useSelector } from "react-redux";

export default function ProfileCard({ data }) {
  const user = data?.data?.user;
  const [updating, setUpdating] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState(null);

  const currentUser = useSelector((state) => state.auth);

  if (!user || !currentUser?.user) return null;

  const { firstName, lastName, email, verified, avatar, createdAt, role } =
    user;

  // ✅ تحديد هل صاحب البروفايل ولا لأ
  const isOwner = user?._id?.toString() === currentUser?.user?.id?.toString();

  // avatar display
  const displayAvatar = currentAvatar || avatar;
  const avatarUrl = displayAvatar?.startsWith("http")
    ? displayAvatar
    : `${import.meta.env.VITE_API_URL}/uploads/${displayAvatar}`;

  // upload handler
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUpdating(true);

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await API.patch("/auth/update-profile", formData);
      setCurrentAvatar(res.data.data.user.avatar);
    } catch (error) {
      console.error("Failed to update avatar:", error);
      alert("Failed to update profile picture");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
      <div className="p-6 md:p-9 flex flex-row justify-between items-start gap-4 md:gap-8">
        {/* ================= Info ================= */}
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">
              {firstName} {lastName}
            </h2>

            {verified && (
              <BadgeCheck
                className="text-blue-700 mt-1"
                size={20}
                title="موثق"
              />
            )}
          </div>

          <p className="text-gray-500 mt-1 text-sm break-all">{email}</p>

          <div className="flex gap-2 md:gap-3 mt-4 md:mt-5 flex-wrap">
            <span className="bg-gray-100 text-gray-700 px-4 py-1.5 rounded-full text-sm font-medium">
              {role}
            </span>
          </div>

          <div className="mt-5 md:mt-6 text-gray-400 flex items-center gap-2 text-sm">
            <Calendar size={16} />
            عضو منذ {new Date(createdAt).toLocaleDateString("ar-EG")}
          </div>
        </div>

        {/* ================= Avatar ================= */}
        <div className="flex-shrink-0 flex items-center justify-end relative">
          <label
            className={`relative group ${
              isOwner && !updating ? "cursor-pointer" : "cursor-default"
            } ${updating ? "opacity-50 pointer-events-none" : ""}`}
          >
            {/* File Input (مرة واحدة فقط) */}
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleAvatarUpload}
              disabled={!isOwner || updating}
            />

            {/* Avatar Image */}
            <img
              src={avatarUrl}
              alt="avatar"
              className="w-20 h-20 md:w-28 md:h-28 rounded-full object-cover shadow-md bg-muted-foreground transition-opacity group-hover:opacity-80"
              onClick={(e) => {
                if (!isOwner) e.preventDefault();
              }}
            />

            {/* Camera Overlay (للصاحب فقط) */}
            {isOwner && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="text-white w-8 h-8" />
              </div>
            )}
          </label>
        </div>
      </div>
    </div>
  );
}
