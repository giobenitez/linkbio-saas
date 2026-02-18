"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

type Profile = {
  username: string | null;
  avatar_url: string | null;
};

const nav = [
  { href: "/app", label: "Dashboard" },
  { href: "/app/profile", label: "Profile" },
  { href: "/app/settings", label: "Settings" },
];

function getInitial(username: string | null, email: string | null) {
  const fromUsername = username?.trim()?.charAt(0);
  if (fromUsername) return fromUsername.toUpperCase();

  const fromEmail = email?.trim()?.charAt(0);
  if (fromEmail && fromEmail !== "—") return fromEmail.toUpperCase();

  return "?";
}

export default function SidebarNav() {
  const pathname = usePathname();

  const [email, setEmail] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      const { data: userData } = await supabase.auth.getUser();
      if (!active) return;

      const user = userData.user;
      setEmail(user?.email ?? null);

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

      if (!active) return;

      const profile = (data as Profile | null) ?? null;
      setUsername(profile?.username ?? null);
      setAvatarUrl(profile?.avatar_url ?? null);
    }

    load();
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      load();
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const displayName = username ?? "Usuario";
  const initial = getInitial(username, email);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 overflow-hidden rounded-full border border-white/10 bg-white/[0.06]">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt="avatar"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="grid h-full w-full place-items-center text-sm font-semibold text-white/70">
              {initial}
            </div>
          )}
        </div>

        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-white">
            {displayName}
          </div>
          <div className="text-xs text-white/50">Perfil</div>
        </div>
      </div>

      <div className="h-px bg-white/10" />

      <div>
        <div className="mb-2 text-xs font-semibold text-white/50">
          Navegación
        </div>

        <nav className="space-y-1">
          {nav.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "block rounded-xl px-3 py-2 text-sm transition",
                  active
                    ? "bg-white/[0.08] text-white"
                    : "text-white/80 hover:bg-white/[0.06] hover:text-white",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
