import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Mail, ArrowLeft } from 'lucide-react';
import logo from '../../assets/logo.png';

const forgotPasswordSchema = zod.object({
  email: zod.string().min(1, 'Email is required').email('Invalid email address'),
});

type ForgotPasswordFields = zod.infer<typeof forgotPasswordSchema>;

export const ForgotPassword: React.FC = () => {
  const { forgotPassword } = useAuth();
  const { showToast } = useToast();
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFields>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFields) => {
    setIsSubmittingForm(true);
    try {
      await forgotPassword(data.email);
      showToast('Reset email sent! Please check your mailbox.', 'success');
    } catch (err) {
      showToast('Error sending reset email.', 'error');
    } finally {
      setIsSubmittingForm(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] bg-grid-pattern flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-brand/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
          <div className="flex items-center justify-center">
            <img src={logo} alt="TaskBeacons Logo" className="h-10 w-auto" />
          </div>
        <h2 className="mt-6 text-center text-3xl font-black text-white uppercase tracking-tight">
          RECOVER ACCESS SIGNATURE
        </h2>
        <p className="mt-2 text-center text-sm text-white/40">
          Enter your registered email below to request a security recovery link.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-[#121212] py-8 px-4 border border-white/5 shadow-2xl rounded-2xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-white/50">
                Registered Email Address
              </label>
              <div className="mt-1.5 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/30">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  {...register('email')}
                  className={`block w-full pl-10 pr-3 py-2.5 bg-black border ${errors.email ? 'border-red-500/50' : 'border-white/10'} rounded-xl focus:outline-none focus:border-brand/50 text-white placeholder-white/20 text-sm transition-all`}
                  placeholder="name@company.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-400 font-semibold">{errors.email.message}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmittingForm}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-[#0a0a0a] bg-[#00d4b4] hover:bg-[#00b89e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00d4b4] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isSubmittingForm ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'SEND RECOVERY LINK'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 flex items-center justify-center">
            <Link to="/login" className="inline-flex items-center gap-2 text-xs font-semibold text-white/50 hover:text-brand transition-colors">
              <ArrowLeft size={14} /> Back to Terminal Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
