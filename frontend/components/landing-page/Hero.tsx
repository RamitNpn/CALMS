export default function Hero() {
  return (
    <section className="relative overflow-hidden min-h-screen">
      <section className="py-8 sm:py-14 lg:py-20">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">
            
            <div>

              <h1 className="mt-4 text-2xl font-bold text-black lg:mt-8 sm:text-3xl xl:text-5xl leading-tight">
                Simplify Your
                <span className="block">
                  Business Operations
                </span>
              </h1>

              <p className="mt-4 text-base text-black lg:mt-8 sm:text-lg max-w-2xl">
                A modern MERN-stack SaaS platform designed to manage staff,
                billing, scheduling, analytics, clients, subscriptions and
                operations, all from one centralized dashboard.
              </p>

              <div className="mt-8 rounded-3xl border border-gray-200 bg-gray-50 p-6">
                <p className="text-lg italic leading-relaxed text-black">
                  “Technology should empower businesses to grow faster,
                  operate smarter and serve better.”
                </p>

                <div className="mt-4 text-sm text-gray-600">
                  - FlowDesk Vision
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mt-8 lg:mt-12">
                <a href="/pages/register-page" className="inline-flex items-center px-6 py-2 font- outline-none text-white transition-all duration-200 bg-blue-600 rounded hover:bg-blue-700 focus:bg-blue-700">
                  Get Started
                </a>

                <a href="/pages/services" className="inline-flex items-center px-6 py-2 font-semibold outline-none text-black transition-all duration-200 border border-gray-300 rounded hover:bg-gray-100">
                  Explore Services
                </a>
              </div>

            </div>

            <div>
              <div className="rounded-[12px] border border-gray-200 bg-white p-8 shadow-xl">
                
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-2xl font-bold text-black">
                      Business Dashboard
                    </h3>

                    <p className="text-sm text-gray-600">
                      Real-time overview & analytics
                    </p>
                  </div>

                  <div className="px-4 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                    ● Live
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  {[
                    ["Active Clients", "1,248"],
                    ["Monthly Revenue", "$12.8K"],
                    ["Appointments", "320"],
                    ["Staff Members", "42"],
                  ].map(([title, value]) => (
                    <div
                      key={title}
                      className="rounded-2xl border border-gray-200 bg-gray-50 p-5"
                    >
                      <p className="text-sm text-gray-600">
                        {title}
                      </p>

                      <h4 className="mt-3 text-3xl font-bold text-black">
                        {value}
                      </h4>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-5">
                  <p className="text-sm leading-relaxed text-blue-900">
                    Real-time scheduling, token systems, analytics,
                    subscriptions and business management modules integrated
                    into one ecosystem.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </section>
  );
}