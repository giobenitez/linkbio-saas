"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

type Profile = {
  username: string | null;
  bio: string | null;
  avatar_url: string | null;
};

export default function ProfileForm() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string>("");

  async function loadProfile() {
    setMsg(null);
    setLoading(true);

    const { data: userData, error: userErr } = await supabase.auth.getUser();
    const user = userData.user;

    if (userErr || !user) {
      setMsg("❌ No hay sesión.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("username, bio, avatar_url")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      setMsg(`❌ ${error.message}`);
      setLoading(false);
      return;
    }

    const p = (data as Profile | null) ?? null;
    setUsername(p?.username ?? "");
    setBio(p?.bio ?? "");
    setAvatarUrl(p?.avatar_url ?? "");
    setLoading(false);
  }

  async function saveProfile(nextAvatarUrl?: string) {
    setMsg(null);
    setSaving(true);

    try {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user) throw new Error("No hay sesión.");

      const payload = {
        id: user.id,
        username: username.trim() || null,
        bio: bio.trim() || null,
        avatar_url: (nextAvatarUrl ?? avatarUrl).trim() || null,
      };

      const { error } = await supabase.from("profiles").upsert(payload);
      if (error) throw error;

      setAvatarUrl(payload.avatar_url ?? "");
      setMsg("✅ Perfil guardado");
    } catch (err: any) {
      setMsg(`❌ ${err?.message ?? "Error"}`);
    } finally {
      setSaving(false);
    }
  }

  async function onPickAvatar(file: File | null) {
    if (!file) return;

    setMsg(null);
    setUploading(true);

    try {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user) throw new Error("No hay sesión.");

      // 👇 siempre mismo nombre (solo cambia extensión)
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${user.id}/avatar.${ext}`;

      const { error: upErr } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true });

      if (upErr) throw upErr;

      const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path);

      // 👇 cache-busting para ver el cambio instantáneo
      const publicUrl = `${pub.publicUrl}?v=${Date.now()}`;

      await saveProfile(publicUrl);
    } catch (err: any) {
      setMsg(`❌ ${err?.message ?? "Error subiendo avatar"}`);
    } finally {
      setUploading(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
      {loading ? (
        <div className="text-sm text-white/70">Cargando perfil…</div>
      ) : (
        <div className="space-y-5">
          {msg && (
            <div className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/80">
              {msg}
            </div>
          )}

          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarUrl}
                  alt="avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="grid h-full w-full place-items-center text-xs text-white/40">
                  No avatar
                </div>
              )}
            </div>

            <div>
              <label className="text-sm text-white/70">Subir avatar</label>
              <div className="mt-2 flex items-center gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => onPickAvatar(e.target.files?.[0] ?? null)}
                  className="block w-full text-sm text-white/70
                             file:mr-3 file:rounded-xl file:border-0 file:bg-white/10
                             file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white
                             hover:file:bg-white/15"
                  disabled={uploading}
                />
                {uploading && (
                  <span className="text-xs text-white/50">Subiendo…</span>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm text-white/70">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="tu-nombre"
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none transition
                         focus:border-white/25 focus:ring-4 focus:ring-violet-500/25"
            />
            <p className="mt-1 text-xs text-white/50">
              Debe ser único (si lo repites, Supabase dará error).
            </p>
          </div>

          <div>
            <label className="text-sm text-white/70">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Cuenta algo sobre ti…"
              rows={4}
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none transition
                         focus:border-white/25 focus:ring-4 focus:ring-violet-500/25"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => saveProfile()}
              disabled={saving || uploading}
              className="rounded-xl px-4 py-3 font-semibold text-white transition disabled:opacity-60
                         hover:brightness-110 active:translate-y-[1px]
                         focus:outline-none focus:ring-4 focus:ring-violet-500/30"
              style={{
                background:
                  "linear-gradient(90deg, rgba(139,92,246,0.95) 0%, rgba(59,130,246,0.95) 100%)",
              }}
            >
              {saving ? "Guardando…" : "Guardar"}
            </button>

            <button
              onClick={loadProfile}
              type="button"
              className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white hover:bg-white/[0.07] transition"
              disabled={saving || uploading}
            >
              Recargar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
