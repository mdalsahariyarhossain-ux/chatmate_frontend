import {
  MessageSquare,
  UserPlus,
  Settings,
} from "lucide-react";
import { useEffect, useState } from "react";
import api from "../services/api";

const API_URL = "http://localhost:5000";

const Sidebar = ({ active, setActive }) => {
  const [user, setUser] = useState(null);
  const [refresh, setRefresh] = useState(0);

  const loadUser = async () => {
    const res = await api.get("/users/me");
    setUser(res.data);
  };

  // load initially + when refresh changes
  useEffect(() => {
    loadUser();
  }, [refresh]);

  // 🔥 LISTEN FOR PROFILE PIC UPDATE
  useEffect(() => {
    const handler = () => {
      setRefresh(Date.now());
    };

    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const Item = ({ id, icon: Icon, label }) => {
    const isActive = active === id;

    return (
      <button
        onClick={() => setActive(id)}
        className="group relative flex items-center justify-center"
      >
        <span
          className={`absolute left-0 h-10 w-1 rounded-r-full transition-all ${
            isActive ? "bg-blue-500 opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl transition-all
            ${
              isActive
                ? "bg-white/10 text-white"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
        >
          <Icon size={20} />
        </div>
        <span className="pointer-events-none absolute left-14 rounded-md bg-black px-2 py-1 text-xs text-white opacity-0 shadow-lg transition-all group-hover:opacity-100">
          {label}
        </span>
      </button>
    );
  };

  return (
      <div className="relative z-50 flex h-screen w-20 flex-col justify-between border-r border-white/10 bg-zinc-900 py-4">
      <div className="flex flex-col items-center gap-6">
        <Item id="chat" icon={MessageSquare} label="Chats" />
        <Item id="add" icon={UserPlus} label="Add Contact" />
      </div>

      <div className="flex flex-col items-center gap-6">
        <Item id="settings" icon={Settings} label="Settings" />

        <button onClick={() => setActive("profile")} className="relative">
          {user?.profilePic ? (
            <img
              src={`${API_URL}${user.profilePic}?t=${refresh}`}
              alt={`${user.first_name || "User"} profile`}
              className="h-10 w-10 rounded-full border border-white/10 object-cover"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-zinc-700 flex items-center justify-center text-white font-semibold">
              {user?.first_name?.[0] || "U"}
            </div>
          )}
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-zinc-900 bg-green-500" />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
