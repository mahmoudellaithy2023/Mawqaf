export const getOtherUser = (members, currentUser) => {
  if (!members || !Array.isArray(members))
    return { name: "مستخدم", avatar: null };

  // Find the member that is NOT the current user
  const other = members.find((m) => {
    const memberId = m._id || m;
    return memberId?.toString() !== currentUser?.toString();
  });

  if (!other) return { name: "مستخدم", avatar: null };

  // Handle populated object
  if (typeof other === "object" && (other.firstName || other.avatar)) {
    let avatar = other.avatar;
    // Normalize avatar URL
    if (avatar) {
      if (!avatar.startsWith("http")) {
        const API_URL = import.meta.env.VITE_API_URL;
        avatar = `${API_URL}/uploads/${avatar}`;
        // Ensure correct path
      } else if (avatar.includes("localhost:8080")) {
        avatar = avatar.replace("8080", "5000");
      }
    }

    const fullName = other.firstName
      ? `${other.firstName} ${other.lastName}`
      : "مستخدم";
    return {
      id: other._id,
      name: fullName,
      avatar: avatar,
    };
  }

  // Handle unpopulated ID or partial data
  return { id: other._id || other, name: "مستخدم", avatar: null };
};
