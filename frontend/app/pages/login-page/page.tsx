import LoginDetails from "@/components/login-page/login-detail";
import LoginForm from "@/components/login-page/login-form";


export default function LoginPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left Side */}
      <LoginDetails />

      {/* Right Side */}
      <div className="flex items-center justify-center bg-gray-50 p-6">
        <LoginForm />
      </div>
    </div>
  );
}