import { AuthLayout } from '@/layouts';
import { RegisterForm } from '@/features/auth';

export function Register() {
  return (
    <AuthLayout title="Create Account" subtitle="Join PRIMUS Olympiad today">
      <RegisterForm />
    </AuthLayout>
  );
}
