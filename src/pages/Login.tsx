import { AuthLayout } from '@/layouts';
import { LoginForm } from '@/features/auth';

export function Login() {
  return (
    <AuthLayout title="Sign In" subtitle="Welcome back to PRIMUS Olympiad">
      <LoginForm />
    </AuthLayout>
  );
}
