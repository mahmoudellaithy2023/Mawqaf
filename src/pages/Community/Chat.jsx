import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getConversations,
  getMessages,
  sendMessage,
  clearMessages,
  addMessage,
} from "../../store/slices/chatSlice";
import { useSocket } from "../../../context/socketContext";
import { useParams } from "react-router-dom";
import { fetchProfile } from "../../store/slices/profileSlice";
import { getOtherUser } from "../../utils/chatUtils";

// Components
import ChatSidebar from "./Components/ChatSidebar";
import ChatHeader from "./Components/ChatHeader";
import MessageList from "./Components/MessageList";
import ChatInput from "./Components/ChatInput";

export default function Chat() {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { conversations, messages } = useSelector((state) => state.chat);
  const { data: recipientProfile } = useSelector((state) => state.profile);

  const currentUser = user?.id;
  const { id: receiverId } = useParams();

  const { socket, onlineUsers } = useSocket();

  const [open, setOpen] = useState(false);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);

  /* ===============================
      Fetch Conversations (Redux)
  ================================ */
  useEffect(() => {
    if (currentUser) {
      dispatch(getConversations(currentUser));
    }
  }, [dispatch, currentUser]);

  /* ===============================
     Fetch Recipient Profile Info
  ================================ */
  useEffect(() => {
    if (receiverId) {
      dispatch(fetchProfile(receiverId));
    }
  }, [dispatch, receiverId]);

  /* ===============================
     Select conversation from URL
  ================================ */
  useEffect(() => {
    if (!receiverId || !conversations.length) return;

    const existingConversation = conversations.find((conv) =>
      conv.members.some((m) => {
        const memberId = m._id || m;
        return memberId?.toString() === receiverId;
      })
    );

    // Only update if the conversation ID has changed to prevent re-fetching messages
    if (existingConversation?._id !== currentConversation?._id) {
      setCurrentConversation(existingConversation || null);
    }
  }, [receiverId, conversations, currentConversation]);

  /* ===============================
     Add User to Socket
  ================================ */
  useEffect(() => {
    if (socket && currentUser) {
      socket.emit("addUser", currentUser);
    }
  }, [socket, currentUser]);

  /* ===============================
     Fetch Messages (Redux)
  ================================ */
  useEffect(() => {
    if (!currentConversation) return;

    dispatch(clearMessages());
    dispatch(getMessages(currentConversation._id));
  }, [dispatch, currentConversation]);

  /* ===============================
     Receive Message (Realtime)
  ================================ */
  useEffect(() => {
    if (!socket) return;

    socket.on("getMessage", (data) => {
      // 1. Refresh messages if we are in this conversation
      if (currentConversation?._id === data.conversationId) {
        const messageToAdd = data.message || data;
        dispatch(addMessage(messageToAdd));
      }

      // 2. Refresh conversations list to update sorting
      if (currentUser) {
        dispatch(getConversations(currentUser));
      }
    });

    return () => socket.off("getMessage");
  }, [socket, dispatch, currentConversation, currentUser]);

  /* ===============================
     Send Message
  ================================ */
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentConversation) return;

    // Safe receiver extraction
    const receiver = currentConversation.members.find((member) => {
      const mId = member._id || member;
      return mId?.toString() !== currentUser?.toString();
    });

    const receiverId = receiver?._id || receiver;

    const res = await dispatch(
      sendMessage({
        conversationId: currentConversation._id,
        senderId: currentUser,
        text: newMessage,
        replyTo: replyingTo?._id, // Send reply ID
      })
    );

    if (res.payload) {
      socket.emit("sendMessage", {
        senderId: currentUser,
        receiverId,
        conversationId: currentConversation._id,
        message: res.payload,
      });
      // Refresh conversations to move this one to top
      dispatch(getConversations(currentUser));
    }

    setNewMessage("");
    setReplyingTo(null); // Clear reply state
  };

  const otherUserFromConv = currentConversation
    ? getOtherUser(currentConversation.members, currentUser)
    : null;

  // Use recipientProfile as a higher-quality source if available
  const getAvatar = () => {
    let avatar =
      recipientProfile && recipientProfile._id === receiverId
        ? recipientProfile.avatar
        : otherUserFromConv?.avatar;

    if (avatar && !avatar.startsWith("http")) {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
      return `${API_URL}/uploads/${avatar}`;
    }
    return avatar;
  };

  const otherUser = {
    id: receiverId,
    name:
      recipientProfile && recipientProfile._id === receiverId
        ? `${recipientProfile.firstName} ${recipientProfile.lastName || ""}`
        : otherUserFromConv?.name || "مستخدم",
    avatar: getAvatar(),
  };

  return (
    <div
      dir="rtl"
      className="h-screen w-full bg-gray-100 flex text-gray-800 relative pt-20"
    >
      {/* Sidebar */}
      <ChatSidebar
        open={open}
        setOpen={setOpen}
        conversations={conversations}
        currentConversation={currentConversation}
        currentUser={currentUser}
      />

      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
        />
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full bg-[#f0f2f5] relative">
        <ChatHeader
          setOpen={setOpen}
          currentConversation={currentConversation}
          otherUser={otherUser}
          onlineUsers={onlineUsers}
        />

        <MessageList
          messages={messages}
          currentUser={currentUser}
          otherUser={otherUser}
          setReplyingTo={setReplyingTo}
        />

        <ChatInput
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          handleSendMessage={handleSendMessage}
          replyingTo={replyingTo}
          setReplyingTo={setReplyingTo}
          otherUser={otherUser}
          currentUser={currentUser}
        />
      </div>
    </div>
  );
}
