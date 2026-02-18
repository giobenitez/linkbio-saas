"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function LogoutButton() {
  const router = useRouter();

  return (
    <button
      onClick={async () => {
        await supabase.auth.signOut();
        router.push("/login");
        router.refresh();
      }}
      className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white hover:bg-white/[0.07] transition"
    >
      Logout
    </button>
  );
}
