"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

type Profile = {
  username: string | null;
  avatar_url: string | null;
};

export default function UserHeader() {
  const [email, setEmail] = useState("—");
  const [username, setUsername] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  async function load() {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    setEmail(user?.email ?? "—");

    if (!user) {
      setUsername(null);
      setAvatarUrl(null);
      return;
    }

    const { data } = await supabase
      .from("profiles")
      .select("username, avatar_url")
      .eq("id", user.id)
      .maybeSingle();

    const p = (data as Profile | null) ?? null;
    setUsername(p?.username ?? null);
    setAvatarUrl(p?.avatar_url ?? null);
  }

  useEffect(() => {
    load();

    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      load();
    });

    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="flex items-center gap-3">
      <div className="h-9 w-9 overflow-hidden rounded-xl border border-white/10 bg-white/[0.06]">
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt="avatar"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-[10px] text-white/50">
            —
          </div>
        )}
      </div>

      <div className="text-xs text-white/60 leading-tight">
        <div className="text-sm font-semibold text-white">
          {username ? username : "Usuario"}
        </div>
        <div className="text-xs text-white/60">{email}</div>
      </div>
    </div>
  );
}
