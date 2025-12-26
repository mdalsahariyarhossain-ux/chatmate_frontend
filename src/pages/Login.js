import { useState } from "react";
import api from "../services/api";

const Login = ({ setScreen, setPhone }) => {
  const [phone, setPhoneInput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const normalizePhone = (value) => value.replace(/\D/g, "");

  const login = async () => {
    const cleanPhone = normalizePhone(phone);

    if (!cleanPhone) {
      setError("Phone number is required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await api.post("/auth/signin", { phone: cleanPhone });

      setPhone(cleanPhone);
      setScreen("otp"); // ✅ go to OTP page
    } catch (err) {
      if (err.response?.data?.signup) {
        setPhone(cleanPhone);
        setScreen("register"); // ✅ new user
      } else {
        setError(err.response?.data?.message || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-900 via-black to-black px-3">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-black/70 p-8 shadow-2xl backdrop-blur-xl">

        <h2 className="text-center text-3xl font-bold text-white">
          ChatMate
        </h2>

        <p className="mt-2 mb-8 text-center text-sm text-gray-400">
          Login using your phone number
        </p>

        <input
          type="tel"
          placeholder="Phone number"
          value={phone}
          onChange={(e) => setPhoneInput(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-white/10"
        />

        <button
          onClick={login}
          disabled={loading}
          className="mt-4 w-full rounded-xl bg-white py-3 font-semibold text-black hover:bg-gray-200 active:scale-[0.98]"
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>

        <p
          onClick={() => setScreen("register")}
          className="mt-6 cursor-pointer text-center text-sm text-blue-400 hover:underline"
        >
          New user? Create a new account
        </p>

        {error && (
          <p className="mt-4 text-center text-sm text-red-500">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
