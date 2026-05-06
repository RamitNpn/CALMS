export default function LoginDetails() {
  return (
    <div className="hidden md:flex flex-col justify-center bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-10">
      <div className="max-w-md space-y-6">
        <h1 className="text-4xl font-bold">FlowDesk</h1>

        <p className="text-lg text-indigo-100">
          Manage your business operations, staff, and clients in one unified platform.
        </p>

        <ul className="space-y-3 text-sm text-indigo-200">
          <li>✔ Multi-business management</li>
          <li>✔ Staff & client portals</li>
          <li>✔ Subscription-based SaaS</li>
          <li>✔ Real-time analytics dashboard</li>
        </ul>

        <div className="pt-6 text-sm text-indigo-300">
          © {new Date().getFullYear()} FlowDesk. All rights reserved.
        </div>
      </div>
    </div>
  );
}