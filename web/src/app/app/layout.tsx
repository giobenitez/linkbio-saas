import SidebarNav from "./_components/SidebarNav";
import LogoutButton from "./_components/LogoutButton";
import UserHeader from "./_components/UserHeader";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen text-white">
      <div className="mx-auto max-w-6xl px-4 py-6">
        {/* Topbar */}
        <div className="mb-6 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl border border-white/10 bg-white/[0.05] grid place-items-center">
              <span
                className="text-sm font-semibold"
                style={{ color: `rgb(var(--accent))` }}
              >
                LB
              </span>
            </div>

            <div>
              <div className="text-xs text-white/50">Linkbio SaaS</div>
              <UserHeader />
            </div>
          </div>

          <LogoutButton />
        </div>

        {/* Layout */}
        <div className="grid gap-6 md:grid-cols-[256px_1fr]">
          {/* Sidebar */}
          <aside className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl">
            <SidebarNav />
          </aside>

          {/* Main */}
          <main className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
