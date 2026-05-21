export default function RegisterPage() {
  const services = [
    {
      title: "Business Management",
      features: [
        "Centralized dashboard",
        "Multi-branch control",
        "Performance analytics",
        "Role-based access",
        "Workflow automation",
      ],
    },
    {
      title: "Asset Management",
      features: [
        "Track assets in real-time",
        "Maintenance scheduling",
        "Asset lifecycle tracking",
        "Depreciation insights",
        "Inventory visibility",
      ],
    },
    {
      title: "Client Management",
      features: [
        "Client database",
        "Interaction tracking",
        "Segmentation tools",
        "CRM insights",
        "Communication history",
      ],
    },
    {
      title: "Staff Management",
      features: [
        "Employee profiles",
        "Role & permissions",
        "Task assignments",
        "Performance tracking",
        "Team collaboration",
      ],
    },
    {
      title: "Attendance Management",
      features: [
        "Daily attendance logs",
        "Leave management",
        "Shift scheduling",
        "Biometric integration",
        "Attendance reports",
      ],
    },
    {
      title: "Billing & Payments",
      features: [
        "Invoice generation",
        "Online payments",
        "Subscription tracking",
        "Financial reports",
        "Tax management",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-10">
      {/* Header */}
      <div className="max-w-5xl mx-auto text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          Register Your Business with FlowDesk
        </h1>

        <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
          To get started with our platform, please contact us using the details below.
          Our team will guide you through the registration and onboarding process.
        </p>
      </div>

      {/* Services Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-white rounded-[12px] shadow-sm p-6 hover:shadow-md transition"
          >
            <h3 className="text-lg font-semibold text-indigo-600 mb-3">
              {service.title}
            </h3>

            <ul className="space-y-2 text-sm text-gray-600">
              {service.features.map((feature, i) => (
                <li key={i}>✔ {feature}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Contact Section */}
      <div className="max-w-3xl mx-auto bg-white border rounded-lg border-gray-200 shadow-md p-8 text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Contact Us for Registration
        </h2>

        <p className="text-gray-500 mb-6">
          Reach out to our team to register your business. We’ll help you set up
          your system tailored to your business needs.
        </p>

        <div className="space-y-3 text-gray-700 text-sm">
          <p>
            📧 Email:{" "}
            <span className="font-medium text-indigo-600">
              support@flowdesk.com
            </span>
          </p>

          <p>
            📞 Phone:{" "}
            <span className="font-medium text-indigo-600">
              +977-9800000000
            </span>
          </p>

          <p>
            📍 Office:{" "}
            <span className="font-medium text-indigo-600">
              Kathmandu, Nepal
            </span>
          </p>
        </div>

        {/* CTA */}
        <div className="mt-8">
          <a
            href="/pages/login-page"
            className="inline-block bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition"
          >
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
}