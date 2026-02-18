import ProfileSummary from "./_components/ProfileSummary";

export default function AppHomePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      <p className="mt-2 text-white/70">Resumen rápido de tu cuenta.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <div className="text-sm font-semibold">Estado</div>
          <div className="mt-1 text-sm text-white/70">Sesión activa ✅</div>
        </div>

        <ProfileSummary />
      </div>
    </div>
  );
}
