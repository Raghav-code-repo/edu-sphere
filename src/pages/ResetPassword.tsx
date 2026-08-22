import { AuthLayout } from '@/layouts';
import { ResetPasswordForm } from '@/features/auth';

export function ResetPassword() {
  return (
    <AuthLayout title="Reset Password" subtitle="Enter your new password">
      <ResetPasswordForm />
    </AuthLayout>
  );
}
