import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <div className="dashboard-theme flex min-h-screen flex-col items-center justify-center px-4">
      <Link href="/" className="mb-8 text-xl font-bold text-primary">
        ScanConnect
      </Link>
      <RegisterForm />
    </div>
  );
}
