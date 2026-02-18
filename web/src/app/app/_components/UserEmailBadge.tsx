"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function UserEmailBadge() {
  const [email, setEmail] = useState<string>("—");

  useEffect(() => {
    let mounted = true;

    async function load() {
      const { data } = await supabase.auth.getUser();
      if (mounted) setEmail(data.user?.email ?? "—");
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

  return <div className="text-xs text-white/60">{email}</div>;
}
