import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AuthLayout } from '../../components/ui/AuthLayout';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Alert } from '../../components/ui/Alert';
import { Mail, ArrowLeft, Send } from 'lucide-react';

const forgotPasswordSchema = zod.object({
  email: zod.string().min(1, 'Email is required').email('Invalid email address'),
});

type ForgotPasswordFields = zod.infer<typeof forgotPasswordSchema>;

export const ForgotPassword: React.FC = () => {
  const { forgotPassword } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFields>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFields) => {
    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      await forgotPassword(data.email);
      setSuccessMsg('Password reset email sent! Please check your mailbox.');
    } catch (err) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('Error sending reset email.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <div className="mb-8 mt-12 lg:mt-0">
        <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-2">
          Recover Access Signature
        </h2>
        <p className="text-sm text-white/50">
          Enter your registered email below to request a security recovery link.
        </p>
      </div>

      <div className="mb-6 space-y-4">
        {errorMsg && <Alert type="error" message={errorMsg} />}
        {successMsg && <Alert type="success" message={successMsg} />}
      </div>

      {!successMsg && (
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Registered Email Address"
            type="email"
            icon={Mail}
            placeholder="name@company.com"
            error={errors.email?.message}
            {...register('email')}
          />

          <Button 
            type="submit" 
            isLoading={isSubmitting} 
            loadingText="Sending..."
            icon={<Send size={16} />}
          >
            Send Recovery Link
          </Button>
        </form>
      )}

      <div className="mt-8 flex items-center justify-center">
        <Link to="/login" className="inline-flex items-center gap-2 text-xs font-semibold text-white/50 hover:text-brand transition-colors">
          <ArrowLeft size={14} /> Back to Sign In
        </Link>
      </div>
    </AuthLayout>
  );
};
