"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;

        router.push("/app");
        router.refresh();
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;

        setMsg(
          "✅ Cuenta creada. Revisa tu email para confirmar (si Supabase lo pide)."
        );
        setMode("login");
      }
    } catch (err: any) {
      setMsg(`❌ ${err?.message ?? "Error"}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen text-white flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0">
        <div
          className="absolute -top-44 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full blur-3xl opacity-35"
          style={{
            background:
              "radial-gradient(circle, rgba(139, 92, 246, 0.55) 0%, transparent 60%)",
          }}
        />
        <div
          className="absolute -top-24 right-[-120px] h-[520px] w-[520px] rounded-full blur-3xl opacity-25"
          style={{
            background:
              "radial-gradient(circle, rgba(59, 130, 246, 0.55) 0%, transparent 60%)",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.08),transparent_42%)]" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-7 shadow-2xl backdrop-blur-xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
              </h1>
              <p className="mt-1 text-sm text-zinc-300">
                Linkbio SaaS — acceso con email y contraseña
              </p>
            </div>

            <div className="h-10 w-10 rounded-xl border border-white/10 bg-white/[0.05] grid place-items-center">
              <span
                className="text-sm font-semibold"
                style={{ color: `rgb(var(--accent))` }}
              >
                LB
              </span>
            </div>
          </div>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label className="text-sm text-zinc-300">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="tu@email.com"
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none transition
                           focus:border-white/25 focus:ring-4 focus:ring-violet-500/25"
                required
              />
            </div>

            <div>
              <label className="text-sm text-zinc-300">Contraseña</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="mín. 6"
                minLength={6}
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none transition
                           focus:border-white/25 focus:ring-4 focus:ring-violet-500/25"
                required
              />
            </div>

            {msg && (
              <div className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-zinc-200">
                {msg}
              </div>
            )}

            <button
              disabled={loading}
              type="submit"
              className="w-full rounded-xl px-4 py-3 font-semibold text-white transition disabled:opacity-60
                         hover:brightness-110 active:translate-y-[1px]
                         focus:outline-none focus:ring-4 focus:ring-violet-500/30"
              style={{
                background:
                  "linear-gradient(90deg, rgba(139,92,246,0.95) 0%, rgba(59,130,246,0.95) 100%)",
              }}
            >
              {loading
                ? "Procesando..."
                : mode === "login"
                ? "Entrar"
                : "Crear cuenta"}
            </button>

            <button
              type="button"
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 font-medium text-white
                         hover:bg-white/[0.07] transition"
            >
              {mode === "login"
                ? "No tengo cuenta → Crear"
                : "Ya tengo cuenta → Entrar"}
            </button>

            <p className="text-xs text-zinc-400 pt-1">
              Tip: si activaste “Confirm email” en Supabase, te pedirá confirmar
              por correo.
            </p>
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-zinc-500">
          Hecho con Next.js + Supabase
        </p>
      </div>
    </div>
  );
}
