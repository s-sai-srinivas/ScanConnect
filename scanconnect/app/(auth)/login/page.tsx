import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="dashboard-theme flex min-h-screen flex-col items-center justify-center px-4">
      <Link href="/" className="mb-8 text-xl font-bold text-primary">
        ScanConnect
      </Link>
      <LoginForm />
    </div>
  );
}
