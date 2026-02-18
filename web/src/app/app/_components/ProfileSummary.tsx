"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

type Profile = {
  username: string | null;
  bio: string | null;
  avatar_url: string | null;
};

export default function ProfileSummary() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);

      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;

      if (!user) {
        if (mounted) {
          setProfile(null);
          setLoading(false);
        }
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("username, bio, avatar_url")
        .eq("id", user.id)
        .maybeSingle();

      if (mounted) {
        if (error) {
          setProfile(null);
        } else {
          setProfile((data as Profile | null) ?? null);
        }
        setLoading(false);
      }
    }

    load();

    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      load();
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <div className="text-sm font-semibold">Tu perfil</div>

      {loading ? (
        <div className="mt-2 text-sm text-white/70">Cargando…</div>
      ) : (
        <div className="mt-2 space-y-1 text-sm text-white/70">
          <div>
            <span className="text-white/50">Username:</span>{" "}
            <span className="text-white">{profile?.username ?? "—"}</span>
          </div>

          <div className="line-clamp-2">
            <span className="text-white/50">Bio:</span>{" "}
            <span className="text-white">{profile?.bio ?? "—"}</span>
          </div>

          <div>
            <span className="text-white/50">Avatar:</span>{" "}
            <span className="text-white">
              {profile?.avatar_url ? "Sí" : "No"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
