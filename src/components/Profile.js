import { useEffect, useRef, useState } from "react";
import { Pencil, Camera, Save, Loader2 } from "lucide-react";
import api from "../services/api";

const API_URL = "http://localhost:5000";

export default function Profile() {
  const fileRef = useRef(null);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [edit, setEdit] = useState(null);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    about: "",
    phone: "",
  }):
  useEffect(() => {
    api.get("/users/me").then(res => {
      setUser(res.data);
      setForm({
        first_name: res.data.first_name || "",
        last_name: res.data.last_name || "",
        about: res.data.about || "",
        phone: res.data.phone || "",
      });
    });
  }, []);
  const save = async (endpoint, payload) => {
    try {
      setLoading(true);
      await api.put(endpoint, payload);
      setUser(p => ({ ...p, ...payload }));
      setEdit(null);
    } finally {
      setLoading(false);
    }
  };

  const uploadPic = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = new FormData();
    data.append("profilePic", file);

    try {
      setUploading(true);
      const res = await api.put("/users/profile-pic", data);

      setUser(p => ({
        ...p,
        profilePic: res.data.profilePic,
      }));
    } catch (err) {
      console.error("UPLOAD ERROR:", err.response?.data || err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black flex justify-center items-center p-6 text-white">
      <div className="w-[440px] bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
        <h2 className="text-xl font-semibold text-center mb-6">My Profile</h2>

        <div className="relative flex justify-center mb-8">
          <div className="h-28 w-28 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 p-[2px] overflow-hidden">
            <img
              src={
                user.profilePic
                  ? `${API_URL}${user.profilePic}`   
                  : "/default-user.png"
              }
              alt="profile"
              className="h-full w-full rounded-full object-cover"
            />
          </div>

          <button
            onClick={() => fileRef.current.click()}
            disabled={uploading}
            className="absolute bottom-0 right-[calc(50%-56px)] bg-black/70 hover:bg-black p-2 rounded-full transition"
          >
            {uploading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Camera size={16} />
            )}
          </button>

          <input
            ref={fileRef}
            hidden
            type="file"
            accept="image/*"
            onChange={uploadPic}
          />
        </div>

        {/* ================= NAME ================= */}
        <Field
          label="Name"
          editing={edit === "name"}
          onEdit={() => setEdit("name")}
          value={`${user.first_name} ${user.last_name}`}
        >
          <div className="flex gap-2">
            <Input value={form.first_name} onChange={v => setForm(f => ({ ...f, first_name: v }))} />
            <Input value={form.last_name} onChange={v => setForm(f => ({ ...f, last_name: v }))} />
          </div>
          <SaveBtn loading={loading} onClick={() =>
            save("/users/name", {
              first_name: form.first_name,
              last_name: form.last_name,
            })
          } />
        </Field>

        {/* ================= ABOUT ================= */}
        <Field
          label="About"
          editing={edit === "about"}
          onEdit={() => setEdit("about")}
          value={user.about || "Tell something about yourself"}
        >
          <textarea
            rows={3}
            maxLength={60}
            value={form.about}
            onChange={e => setForm(f => ({ ...f, about: e.target.value }))}
            className="w-full bg-zinc-900/60 border border-zinc-700 rounded-lg px-3 py-2 text-sm"
          />
          <p className="text-xs text-zinc-500 text-right">
            {form.about.length}/60
          </p>
          <SaveBtn loading={loading} onClick={() => save("/users/about", { about: form.about })} />
        </Field>

        {/* ================= PHONE ================= */}
        <div className="mb-5">
          <p className="text-xs uppercase tracking-wider text-zinc-400 mb-2">Phone</p>
          <p className="text-sm break-words">{user.phone || "Not added"}</p>
        </div>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.reload();
          }}
          className="w-full mt-4 bg-gradient-to-r from-red-600 to-red-700 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

/* ================= UI ================= */

const Field = ({ label, editing, onEdit, value, children }) => (
  <div className="mb-5">
    <div className="flex justify-between items-center mb-2">
      <p className="text-xs uppercase tracking-wider text-zinc-400">{label}</p>
      {!editing && (
        <Pencil
          size={14}
          onClick={onEdit}
          className="cursor-pointer text-zinc-400 hover:text-white"
        />
      )}
    </div>
    {editing ? <div className="space-y-2">{children}</div> : <p className="text-sm break-words">{value}</p>}
  </div>
);

const Input = ({ value, onChange }) => (
  <input
    value={value}
    onChange={e => onChange(e.target.value)}
    className="w-full bg-zinc-900/60 border border-zinc-700 rounded-lg px-3 py-2 text-sm"
  />
);

const SaveBtn = ({ onClick, loading }) => (
  <button
    onClick={onClick}
    disabled={loading}
    className="mt-2 bg-emerald-600 px-3 py-2 rounded-lg text-sm flex items-center gap-2"
  >
    {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save
  </button>
);
