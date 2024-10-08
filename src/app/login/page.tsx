import { Metadata } from 'next';
import LoginForm from '../components/LoginForm';
import { SignIn } from '../components/SigninButton';

export const metadata: Metadata = {
  title: 'Login',
};

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32 text-black">
        <LoginForm />
        {/* <SignIn /> */}
      </div>
    </main>
  );
}
