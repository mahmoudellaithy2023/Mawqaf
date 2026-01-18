import { motion } from "framer-motion";
import { X, Bot } from "lucide-react";
import { useEffect, useState } from "react";
const apiKey = "AIzaSyDzXO-ZBNcC3FRsxn0rL2PgB6DWYLeJaUo";

export default function AIChatBox({ close }) {
  const [messages, setMessages] = useState([]);
  const [value, setValue] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("ai-chat");
    if (saved) {
      setMessages(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("ai-chat", JSON.stringify(messages));
  }, [messages]);
  async function sendMessage() {
    if (!value.trim()) return;

    const userInput = value;

    setMessages((prev) => [...prev, { from: "user", text: userInput }]);
    setValue("");

    setMessages((prev) => [...prev, { from: "typing", text: "" }]);

    try {
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey,
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: userInput }] }],
          }),
        }
      );

      const data = await response.json();
      const reply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        data?.error?.message ||
        "تعذر الحصول على رد.";

      setMessages((prev) => prev.filter((m) => m.from !== "typing"));

      setMessages((prev) => [...prev, { from: "bot", text: reply }]);
    } catch (e) {
      setMessages((prev) => prev.filter((m) => m.from !== "typing"));

      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "حدث خطأ أثناء الاتصال بالخادم." },
      ]);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, y: 100 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.5, y: 100 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="
        fixed bottom-24 left-6 z-50
        w-80 h-96 bg-white shadow-2xl rounded-2xl
        flex flex-col overflow-hidden
      "
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-mainColor text-white">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5" />
          <span className="font-semibold">مساعد الذكاء الاصطناعي</span>
        </div>
        <button onClick={close}>
          <X className="w-5 h-5 cursor-pointer" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
        {messages.map((m, i) =>
          m.from === "typing" ? (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="px-3 py-2 w-16 bg-gray-300 text-gray-700 rounded-xl flex gap-1"
            >
              <motion.span
                animate={{ y: [0, -3, 0] }}
                transition={{ repeat: Infinity, duration: 0.6 }}
                className="w-2 h-2 bg-gray-600 rounded-full"
              ></motion.span>

              <motion.span
                animate={{ y: [0, -3, 0] }}
                transition={{ repeat: Infinity, duration: 0.6, delay: 0.15 }}
                className="w-2 h-2 bg-gray-600 rounded-full"
              ></motion.span>

              <motion.span
                animate={{ y: [0, -3, 0] }}
                transition={{ repeat: Infinity, duration: 0.6, delay: 0.3 }}
                className="w-2 h-2 bg-gray-600 rounded-full"
              ></motion.span>
            </motion.div>
          ) : (
            <div
              key={i}
              className={`p-2 max-w-[80%] rounded-xl text-sm 
        ${
          m.from === "user"
            ? "bg-mainColor text-white self-end ms-auto"
            : "bg-gray-200 text-black self-start"
        }
      `}
            >
              {m.text}
            </div>
          )
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-t bg-white flex items-center gap-2">
        <input
          className="flex-1 border text-black rounded-xl p-2 text-sm focus:outline-mainColor"
          placeholder="اكتب رسالة…"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button
          onClick={sendMessage}
          className="bg-mainColor cursor-pointer text-white px-4 py-2 rounded-xl text-sm hover:bg-mainColorHover"
        >
          إرسال
        </button>
      </div>
    </motion.div>
  );
}
