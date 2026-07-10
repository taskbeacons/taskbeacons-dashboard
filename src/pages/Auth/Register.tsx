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
import { Mail, User, Building, UserPlus } from 'lucide-react';

const registerSchema = zod.object({
  firstName: zod.string().min(1, 'First name is required'),
  lastName: zod.string().min(1, 'Last name is required'),
  email: zod.string().min(1, 'Email is required').email('Invalid email address'),
  company: zod.string().min(2, 'Company name is required'),
  password: zod.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: zod.string().min(1, 'Please confirm your password'),
  terms: zod.boolean().refine((val) => val === true, {
    message: 'You must agree to the Terms of Service and Privacy Policy',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFields = zod.infer<typeof registerSchema>;

export const Register: React.FC = () => {
  const { register: signup, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFields>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFields) => {
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const fullName = `${data.firstName} ${data.lastName}`.trim();
      await signup(fullName, data.email, data.company, data.password);
      navigate('/');
    } catch (err) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('Registration failed. Please try again.');
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
      <div className="mt-12 mb-8 lg:mt-0">
        <h2 className="mb-2 text-3xl font-black tracking-tight text-white uppercase">
          Create Your Workspace
        </h2>
        <p className="text-sm text-white/50">
          Build your autonomous AI workforce in minutes.
        </p>
      </div>

      <div className="mb-6">
        <Alert type="error" message={errorMsg || ''} />
      </div>

      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First Name"
            type="text"
            icon={User}
            placeholder="Jane"
            error={errors.firstName?.message}
            {...register('firstName')}
          />
          <Input
            label="Last Name"
            type="text"
            icon={User}
            placeholder="Doe"
            error={errors.lastName?.message}
            {...register('lastName')}
          />
        </div>

        <Input
          label="Company Name"
          type="text"
          icon={Building}
          placeholder="Acme Corp"
          error={errors.company?.message}
          {...register('company')}
        />

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
          {...register('password')}
        />

        <PasswordInput
          label="Confirm Password"
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="terms"
              type="checkbox"
              className="w-4 h-4 bg-black rounded border-white/20 text-brand focus:ring-brand focus:ring-offset-black"
              {...register('terms')}
            />
          </div>
          <label htmlFor="terms" className="block ml-2 text-xs leading-tight text-white/50">
            I agree to the{' '}
            <a href="http://taskbeacons.com/terms-of-service" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="http://taskbeacons.com/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">Privacy Policy</a>.
          </label>
        </div>
        {errors.terms && (
          <p className="mt-1 text-xs font-semibold text-red-400">{errors.terms.message}</p>
        )}

        <Button 
          type="submit" 
          isLoading={isSubmitting} 
          loadingText="Creating..."
          icon={<UserPlus size={16} />}
        >
          Create Account
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

      <p className="mt-8 text-xs text-center text-white/50">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold transition-colors text-brand hover:text-brand-hover">
          Sign In
        </Link>
      </p>
    </AuthLayout>
  );
};
