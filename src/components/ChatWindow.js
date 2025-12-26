import { useEffect, useRef, useState } from "react";
import { Phone, Video, MoreVertical, Send } from "lucide-react";
import api from "../services/api";
import socket from "../socket";

const API_URL = "http://localhost:5000";

const ChatWindow = ({ friend }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  /* ================= LOAD MESSAGES ================= */
  useEffect(() => {
  if (!friend?._id) return;

  setMessages([]); // safe

  api.get(`/messages/${friend._id}`).then((res) => {
    setMessages(res.data);
  });
}, [friend?._id]);


  /* ================= SOCKET LISTENER ================= */
  useEffect(() => {
  const handler = (msg) => {
    setMessages((prev) => {
      // avoid duplicates
      if (prev.some((m) => m._id === msg._id)) return prev;
      return [...prev, msg];
    });
  };

  socket.on("receiveMessage", handler);

  return () => {
    socket.off("receiveMessage", handler);
  };
}, [friend]);


  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ================= SEND MESSAGE ================= */
  const sendMessage = async () => {
    if (!text.trim() || !friend) return;

    const res = await api.post("/messages/send", {
      receiver: friend._id,
      message: text,
    });

    // optimistic update
    setMessages((prev) => [...prev, res.data]);
    setText("");
  };

  /* ================= EMPTY STATE ================= */
  if (!friend) {
    return (
      <div className="flex-1 flex items-center justify-center text-zinc-500 bg-black">
        Select a chat to start messaging
      </div>
    );
  }

  return (
    <div className="flex-1 min-w-0 h-full flex flex-col bg-zinc-950">
      {/* ================= HEADER ================= */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-white/10 bg-black/70 backdrop-blur">
        <div className="flex items-center gap-3">
          <img
            src={
              friend.profilePic
                ? `${API_URL}${friend.profilePic}`
                : "/default-user.png"
            }
            alt={`${friend.first_name} profile`}
            className="h-10 w-10 rounded-full object-cover"
          />
          <div>
            <p className="font-medium text-white">
              {friend.first_name} {friend.last_name}
            </p>
            <p className="text-xs text-zinc-400">
              {friend.isOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-zinc-400">
          <Phone size={18} className="hover:text-white cursor-pointer" />
          <Video size={18} className="hover:text-white cursor-pointer" />
          <MoreVertical size={18} className="hover:text-white cursor-pointer" />
        </div>
      </div>

      {/* ================= MESSAGES ================= */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((m) => {
          const isMe = m.sender !== friend._id;

          return (
            <div
              key={m._id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`
                  max-w-[70%] px-4 py-2 rounded-2xl text-sm
                  ${
                    isMe
                      ? "bg-sky-600 text-black rounded-br-sm"
                      : "bg-zinc-800 text-white rounded-bl-sm"
                  }
                `}
              >
                {m.message}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* ================= INPUT ================= */}
      <div className="h-16 px-4 flex items-center gap-3 border-t border-white/10 bg-black/70 backdrop-blur">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message"
          className="
            flex-1 rounded-xl px-4 py-2
            bg-zinc-900 border border-zinc-700
            text-sm text-white placeholder-zinc-500
            outline-none focus:ring-1 focus:ring-gray-500
          "
          onKeyDown={(e) => {
           if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
        />

        <button
          onClick={sendMessage}
          className="h-10 w-10 rounded-full bg-sky-400 flex items-center justify-center hover:bg-emerald-700 transition"
        >
          <Send size={16} className="text-black" />
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
