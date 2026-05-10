export default function LoginDetails() {
  return (
    <div className="hidden md:flex flex-col justify-center bg-gradient-to-br from-indigo-600 via-purple-700 to-slate-900 text-white p-10 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-400/10 blur-3xl rounded-full" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/10 blur-3xl rounded-full" />

      <div className="relative z-10 max-w-md space-y-7">
        {/* Branding */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center text-2xl">
              ⚡
            </div>

            <div>
              <h1 className="text-4xl font-bold tracking-tight">
                FlowDesk
              </h1>
              <p className="text-sm text-indigo-200">
                Multi-Tenant Business Operations Platform
              </p>
            </div>
          </div>

          <p className="text-lg leading-relaxed text-indigo-100">
            A modern modular SaaS platform built with the MERN stack to manage
            operations, staff, billing, scheduling, clients and analytics <br /><span className="font-bold">All from one centralized dashboard</span>.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="space-y-4">
          <div>
            <h3 className="text-sm uppercase tracking-[0.2em] text-indigo-200 mb-3">
              Core Features
            </h3>

            <ul className="space-y-3 text-sm text-indigo-100">
              <li className="flex items-start gap-3">
                <span>✔</span>
                <span>
                  Multi-business & multi-branch tenant management
                </span>
              </li>

              <li className="flex items-start gap-3">
                <span>✔</span>
                <span>
                  Staff, admin, and client portals with RBAC authentication
                </span>
              </li>

              <li className="flex items-start gap-3">
                <span>✔</span>
                <span>
                  Real-time token & queue system powered by Socket.io
                </span>
              </li>

              <li className="flex items-start gap-3">
                <span>✔</span>
                <span>
                  Billing, invoicing, attendance & scheduling modules
                </span>
              </li>

              <li className="flex items-start gap-3">
                <span>✔</span>
                <span>
                  SaaS subscriptions with Stripe, eSewa & Khalti integration
                </span>
              </li>

              <li className="flex items-start gap-3">
                <span>✔</span>
                <span>
                  Analytics dashboard with reports, exports & insights
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-white/10">
          <p className="text-sm text-indigo-100">
            Built for driving institutes, coaching centers, clinics,
            gyms, salons, and enterprise service businesses.
          </p>

          <div className="mt-4 text-xs text-indigo-200">
            © {new Date().getFullYear()} FlowDesk — Cornor Tech Pvt. Ltd.
          </div>
        </div>
      </div>
    </div>
  );
}