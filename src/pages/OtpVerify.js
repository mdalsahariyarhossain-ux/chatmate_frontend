import { useState } from "react";
import api from "../services/api";

const OtpVerify = ({ phone, setScreen }) => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 6) {
      setError("Enter valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await api.post("/auth/verify-otp", {
        phone,
        otp,
      });

      localStorage.setItem("token", res.data.token);
      setScreen("chat"); // next page
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-900 via-black to-black px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-black/70 p-8 shadow-2xl backdrop-blur-xl">
        <h2 className="text-center text-3xl font-bold text-white">
          OTP Verify
        </h2>

        <p className="mt-2 mb-8 text-center text-sm text-gray-400">
          OTP sent to <span className="text-white">{phone}</span>
        </p>

        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={6}
          autoComplete="off"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e) => {
            setOtp(e.target.value.replace(/\D/g, ""));
          }}
          className="w-full text-center tracking-[0.4em] rounded-xl border border-white/10 bg-black px-4 py-4 text-xl text-white placeholder-gray-500 outline-none focus:border-white/30 focus:ring-2 focus:ring-white/10"
        />

        <button
          onClick={handleVerifyOtp}
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-white py-3 font-semibold text-black transition hover:bg-gray-200 disabled:opacity-60"
        >
          {loading ? "Verifying..." : "Verify & Continue"}
        </button>

        <p
          onClick={() => setScreen("login")}
          className="mt-6 cursor-pointer text-center text-sm text-blue-400 hover:underline"
        >
          Change phone number
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

export default OtpVerify;
