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

export default function SidebarNav() {
  const pathname = usePathname();

  const [email, setEmail] = useState<string>("—");
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
    const { data: sub } = supabase.auth.onAuthStateChange(() => load());
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <aside className="w-64 shrink-0">
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        {/* Perfil mini */}
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06]">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt="avatar"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="grid h-full w-full place-items-center text-[10px] text-white/50">
                LB
              </div>
            )}
          </div>

          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-white">
              {username ?? "Usuario"}
            </div>
            <div className="truncate text-xs text-white/60">{email}</div>
          </div>
        </div>

        <div className="mt-4 h-px bg-white/10" />

        {/* Navegación */}
        <div className="mt-4">
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
    </aside>
  );
}
