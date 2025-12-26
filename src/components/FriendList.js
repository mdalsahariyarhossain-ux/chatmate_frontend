import { useEffect, useMemo, useState } from "react";
import api from "../services/api";

const API_URL = "http://localhost:5000";

const FriendList = ({ setSelectedFriend, selectedFriend }) => {
  const [friends, setFriends] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api
      .get("/users/contacts")
      .then((res) => setFriends(res.data))
      .catch(() => setFriends([]));
  }, []);

  const filteredFriends = useMemo(() => {
    const q = search.toLowerCase();
    return friends.filter((f) =>
      `${f.first_name} ${f.last_name} ${f.phone}`
        .toLowerCase()
        .includes(q)
    );
  }, [friends, search]);

  return (
    <div className="w-80 min-w-[320px] h-full bg-black border-r border-white/10 flex flex-col">

      {/* SEARCH */}
      <div className="p-3 border-b border-white/10">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search or start new chat"
          className="
            w-full rounded-xl bg-zinc-900 px-4 py-2
            text-sm text-white placeholder-zinc-400
            outline-none focus:ring-1 focus:ring-white
          "
        />
      </div>

      {/* FRIEND LIST */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700">
        {filteredFriends.length === 0 && (
          <p className="text-center text-zinc-500 mt-6 text-sm">
            No friends found
          </p>
        )}

        {filteredFriends.map((f) => {
          const isActive = selectedFriend?._id === f._id;

          return (
            <div
              key={f._id}
              onClick={() => setSelectedFriend(f)}
              className={`
                group relative flex items-center gap-3 px-4 py-3 cursor-pointer
                transition-all duration-200
                
              `}
            >
              {/* PROFILE IMAGE */}
              <div
                className={`
                  relative h-11 w-11 rounded-full p-[2px]
                `}
              >
                <img
                src={
                  f.profilePic
                  ? `${API_URL}${f.profilePic}`
                  : "/default-user.png"
  }
  onError={(e) => {
    e.target.src = "/default-user.png";
  }}
  alt=""
  className="h-full w-full rounded-full object-cover bg-zinc-800"
/>


                {/* ONLINE DOT (OPTIONAL) */}
                {f.isOnline && (
                  <span className="absolute bottom-0 right-0 h-3 w-3 bg-emerald-500 border-2 border-zinc-950 rounded-full" />
                )}
              </div>

              {/* NAME + SUBTEXT */}
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium truncate ${
                    isActive ? "text-blue-400" : "text-white"
                  }`}
                >
                  {f.first_name} {f.last_name}
                </p>
                <p className="text-xs text-zinc-400 truncate">
                  {f.lastMessage || "Tap to chat"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FriendList;
