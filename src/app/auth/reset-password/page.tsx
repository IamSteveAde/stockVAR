import { Suspense } from "react";
import ResetPassword from "../../components/auth/reset-password";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen grid place-items-center">Loading...</div>}>
      <ResetPassword />
    </Suspense>
  );
}
