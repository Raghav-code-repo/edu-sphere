import { AuthLayout } from '@/layouts';
import { ForgotPasswordForm } from '@/features/auth';

export function ForgotPassword() {
  return (
    <AuthLayout title="Forgot Password" subtitle="Enter your email to reset your password">
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
