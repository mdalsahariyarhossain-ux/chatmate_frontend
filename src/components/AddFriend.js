import { useState } from "react";
import { UserPlus, Phone } from "lucide-react";
import api from "../services/api";

const AddFriend = () => {
  const [phone, setPhone] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const addFriend = async () => {
    try {
      const cleanPhone = phone.replace(/\D/g, "");

      if (!cleanPhone) {
        setMsg("Please enter a valid phone number");
        return;
      }

      setLoading(true);

      await api.post("/users/add-contact", {
        contactPhone: cleanPhone,
      });

      setMsg("Friend added successfully!");
      setPhone("");
    } catch (err) {
      console.log("ADD FRIEND ERROR:", err.response?.data);
      setMsg(err.response?.data?.message || "Failed to add friend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-black text-white px-4">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-full bg-blue-600/20 flex items-center justify-center">
            <UserPlus size={20} className="text-blue-400" />
          </div>
          <h2 className="text-xl font-semibold">Add Friend</h2>
        </div>

        {/* INPUT */}
        <div className="relative">
          <Phone
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
          />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter phone number"
            className="
              w-full pl-10 pr-4 py-3 rounded-xl
              bg-zinc-900/60 border border-zinc-700
              text-white placeholder-zinc-500
              outline-none
              focus:ring-1 focus:ring-blue-500
              transition
            "
          />
        </div>

        {/* BUTTON */}
        <button
          onClick={addFriend}
          disabled={loading}
          className="
            mt-5 w-full py-3 rounded-xl
            bg-blue-600 hover:bg-blue-700
            text-black font-medium
            transition
            disabled:opacity-60
          "
        >
          {loading ? "Adding..." : "Add Friend"}
        </button>

        {/* MESSAGE */}
        {msg && (
          <p
            className={`mt-4 text-sm text-center ${
              msg.includes("success")
                ? "text-emerald-400"
                : "text-red-400"
            }`}
          >
            {msg}
          </p>
        )}
      </div>
    </div>
  );
};

export default AddFriend;
