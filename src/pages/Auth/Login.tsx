import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AuthLayout } from '../../components/ui/AuthLayout';
import { Input } from '../../components/ui/Input';
import { PasswordInput } from '../../components/ui/PasswordInput';
import { Button } from '../../components/ui/Button';
import { AuthDivider } from '../../components/ui/AuthDivider';
import { Alert } from '../../components/ui/Alert';
import { Mail, LogIn } from 'lucide-react';

const loginSchema = zod.object({
  email: zod.string().min(1, 'Email is required').email('Invalid email address'),
  password: zod.string().min(1, 'Password is required'),
  rememberMe: zod.boolean().optional(),
});

type LoginFields = zod.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const { login, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFields>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: true
    }
  });

  const onSubmit = async (data: LoginFields) => {
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      await login(data.email, data.password);
      navigate('/');
    } catch (err) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('Invalid credentials. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setErrorMsg(null);
    try {
      await signInWithGoogle();
      navigate('/');
    } catch (err) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('Google sign in failed.');
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="mb-8 mt-12 lg:mt-0">
        <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-2">
          Welcome Back
        </h2>
        <p className="text-sm text-white/50">
          Sign in to access your autonomous AI workforce.
        </p>
      </div>

      <div className="mb-6">
        <Alert type="error" message={errorMsg || ''} />
      </div>

      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Business Email"
          type="email"
          icon={Mail}
          placeholder="name@company.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <PasswordInput
          label="Password"
          placeholder="••••••••"
          error={errors.password?.message}
          showForgotPasswordLink
          onForgotPasswordClick={() => navigate('/forgot-password')}
          {...register('password')}
        />

        <div className="flex items-center">
          <input
            id="remember-me"
            type="checkbox"
            className="h-4 w-4 rounded border-white/20 bg-black text-brand focus:ring-brand focus:ring-offset-black"
            {...register('rememberMe')}
          />
          <label htmlFor="remember-me" className="ml-2 block text-xs text-white/50">
            Remember Me
          </label>
        </div>

        <Button 
          type="submit" 
          isLoading={isSubmitting} 
          loadingText="Authorizing..."
          icon={<LogIn size={16} />}
        >
          Sign In
        </Button>
      </form>

      <AuthDivider />

      <Button
        type="button"
        variant="outline"
        isLoading={isGoogleLoading}
        loadingText="Connecting..."
        onClick={handleGoogleSignIn}
        icon={
          <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
        }
      >
        Continue with Google
      </Button>

      <p className="mt-8 text-center text-xs text-white/50">
        Don't have an account?{' '}
        <Link to="/register" className="font-semibold text-brand hover:text-brand-hover transition-colors">
          Register
        </Link>
      </p>
    </AuthLayout>
  );
};
