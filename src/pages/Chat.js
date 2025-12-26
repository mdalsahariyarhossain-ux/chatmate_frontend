import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import FriendList from "../components/FriendList";
import AddFriend from "../components/AddFriend";
import ChatWindow from "../components/ChatWindow";
import Profile from "../components/Profile";
import socket from "../socket";

const Chat = () => {
  const [active, setActive] = useState(
    localStorage.getItem("sidebarActive") || "chat"
  );
  const [selectedFriend, setSelectedFriend] = useState(null);

  useEffect(() => {
    localStorage.setItem("sidebarActive", active);
  }, [active]);

  useEffect(() => {
    socket.connect();

    const user = JSON.parse(localStorage.getItem("user"));
    if (user?._id) {
      socket.emit("join", user._id);
    }

    return () => {
      socket.off();
      socket.disconnect();
    };
  }, []);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gradient-to-br from-zinc-900 via-black to-black">
      {/* SIDEBAR */}
      <Sidebar active={active} setActive={setActive} />

      {/* RIGHT SIDE */}
      <div className="flex flex-1 h-full">
        {active === "chat" && (
          <>
            <FriendList
              selectedFriend={selectedFriend}
              setSelectedFriend={setSelectedFriend}
            />

            {/* CHAT WINDOW */}
            {selectedFriend ? (
              <ChatWindow friend={selectedFriend} socket={socket} />
            ) : (
              <div className="flex-1 flex items-center justify-center text-zinc-500">
                Select a chat to start messaging
              </div>
            )}
          </>
        )}

        {active === "add" && <AddFriend />}
        {active === "settings" && <h2 className="text-xl">Settings</h2>}
        {active === "profile" && <Profile />}
      </div>
    </div>
  );
};

export default Chat;
