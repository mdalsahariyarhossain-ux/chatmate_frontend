import { useEffect, useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import OtpVerify from "./pages/OtpVerify";
import Chat from "./pages/Chat";

function App() {
  const [screen, setScreen] = useState("login");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setScreen("chat");
    } else {
      setScreen("login");
    }

    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading...
      </div>
    );
  }
 

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-black">
      {screen === "login" && (
        <Login setScreen={setScreen} setPhone={setPhone} />
      )}

      {screen === "register" && (
        <Register setScreen={setScreen} setPhone={setPhone} />
      )}

      {screen === "otp" && (
        <OtpVerify phone={phone} setScreen={setScreen} />
      )}

      {screen === "chat" && <Chat />}
    </div>
  );
}

export default App;
