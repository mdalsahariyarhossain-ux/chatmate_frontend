import { useState } from "react";
import api from "../services/api";

const Register = ({ setScreen, setPhone }) => {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const normalizePhone = (value) => value.replace(/\D/g, "");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const signup = async () => {
    const cleanPhone = normalizePhone(form.phone);

    if (!cleanPhone || !form.password || !form.confirm_password) {
      return setError("Phone and password are required");
    }

    if (form.password !== form.confirm_password) {
      return setError("Passwords do not match");
    }

    try {
      setLoading(true);
      setError("");

      await api.post("/auth/signup", {
        ...form,
        phone: cleanPhone,
      });

      setPhone(cleanPhone);
      setScreen("otp");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-900 via-black to-black px-3">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-black/70 p-8 shadow-2xl backdrop-blur-xl">
        <h2 className="text-center text-3xl font-bold text-white">
          Create Account
        </h2>
        <p className="mt-2 mb-8 text-center text-sm text-gray-400">
          Fill in your details to continue
        </p>

        <div autoComplete="off" className="space-y-2 mb-8">
          <input
            name="first_name"
            placeholder="First name"
            value={form.first_name}
            onChange={handleChange}
            autoComplete="off"
            className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white"
          />

          <input
            name="last_name"
            placeholder="Last name"
            value={form.last_name}
            onChange={handleChange}
            autoComplete="off"
            className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white"
          />

          <input
            name="email"
            type="email"
            autoComplete="new-email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
            className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white"
          />

          <input
            name="phone"
            type="tel"
            autoComplete="off"
            placeholder="Phone number"
            value={form.phone}
            onChange={handleChange}
            className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white"
          />

          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-gray-400"
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

          <input
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white"
          />

          <input
            name="confirm_password"
            type="password"
            autoComplete="new-password"
            placeholder="Confirm password"
            value={form.confirm_password}
            onChange={handleChange}
            className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white"
          />

          <button
            type="button"
            onClick={signup}
            disabled={loading}
            className="w-full rounded-xl bg-white py-3 font-semibold text-black"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </div>
        <p
          onClick={() => setScreen("login")}
          className="mt-6 cursor-pointer text-center text-sm text-blue-400 hover:underline"
        >
          Already have an account? Login
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

export default Register;
