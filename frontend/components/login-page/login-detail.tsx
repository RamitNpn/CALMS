import Image from "next/image";

export default function LoginDetails() {
  return (
    <div className="hidden md:flex flex-col justify-center bg-white p-10 relative overflow-hidden border-gray-200">

      <div className="relative z-10 max-w-md space-y-7">
        {/* Branding */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Image
              src="/DrivingLogo.png"
              alt="Public Driving Management System"
              width={64}
              height={64}
              priority
              className="h-16 w-auto rounded-xl p-1 shadow-sm"
            />

            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                PDMS
              </h1>
              <p className="text-sm text-gray-600">
                Public Driving Management System
              </p>
            </div>
          </div>

          <p className="text-md leading-relaxed text-gray-700">
            A comprehensive platform designed to streamline driving school
            operations, student training, instructor management, scheduling,
            attendance tracking, examinations and payment processing.
            <br />
            <span className="font-semibold text-gray-900">
              Everything managed from one centralized dashboard.
            </span>
          </p>
        </div>

        {/* Feature Highlights */}
        <div>
          <h3 className="mb-3 text-sm uppercase tracking-[0.2em] text-gray-500">
            Core Features
          </h3>

          <ul className="space-y-3 text-sm text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-green-600">✔</span>
              <span>
                Student registration, enrollment and profile management
              </span>
            </li>

            <li className="flex items-start gap-3">
              <span className="text-green-600">✔</span>
              <span>
                Instructor assignment and training schedule management
              </span>
            </li>

            <li className="flex items-start gap-3">
              <span className="text-green-600">✔</span>
              <span>Attendance tracking for both students and instructors</span>
            </li>

            <li className="flex items-start gap-3">
              <span className="text-green-600">✔</span>
              <span>
                Driving lessons, practical sessions and test scheduling
              </span>
            </li>

            <li className="flex items-start gap-3">
              <span className="text-green-600">✔</span>
              <span>Examination management and progress monitoring</span>
            </li>

            <li className="flex items-start gap-3">
              <span className="text-green-600">✔</span>
              <span>Payment tracking, reporting and operational analytics</span>
            </li>
          </ul>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 pt-6">
          <p className="text-sm text-gray-600">
            Built to modernize driving school administration and improve
            training efficiency through digital transformation.
          </p>

          <div className="mt-4 text-xs text-gray-500">
            © {new Date().getFullYear()} Public Driving Management System
            <br />
            Powered by Cornor Tech Pvt. Ltd.
          </div>
        </div>
      </div>
    </div>
  );
}
