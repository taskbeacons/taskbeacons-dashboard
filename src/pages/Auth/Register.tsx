import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Lock, Mail, User, Building } from 'lucide-react';
import logo from '../../assets/logo.png';

const registerSchema = zod.object({
  name: zod.string().min(2, 'Name must be at least 2 characters'),
  email: zod.string().min(1, 'Email is required').email('Invalid email address'),
  company: zod.string().min(2, 'Company name must be at least 2 characters'),
  password: zod.string().min(6, 'Password must be at least 6 characters'),
});

type RegisterFields = zod.infer<typeof registerSchema>;

export const Register: React.FC = () => {
  const { register: signup } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFields>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFields) => {
    setIsSubmittingForm(true);
    try {
      await signup(data.name, data.email, data.company);
      showToast('Registration successful! Command Center initialized.', 'success');
      navigate('/');
    } catch (err) {
      showToast('Registration failed. Please try again.', 'error');
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
          INITIALIZE WORKFORCE DEPLOYMENT
        </h2>
        <p className="mt-2 text-center text-sm text-white/40">
          Already authorized?{' '}
          <Link to="/login" className="font-semibold text-brand hover:text-brand-hover transition-colors">
            Access existing terminal
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-[#121212] py-8 px-4 border border-white/5 shadow-2xl rounded-2xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-white/50">
                Commanding Officer Name
              </label>
              <div className="mt-1.5 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/30">
                  <User size={16} />
                </div>
                <input
                  type="text"
                  {...register('name')}
                  className={`block w-full pl-10 pr-3 py-2.5 bg-black border ${errors.name ? 'border-red-500/50' : 'border-white/10'} rounded-xl focus:outline-none focus:border-brand/50 text-white placeholder-white/20 text-sm transition-all`}
                  placeholder="Officer Name"
                />
              </div>
              {errors.name && (
                <p className="mt-1.5 text-xs text-red-400 font-semibold">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-white/50">
                Enterprise Email
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
              <label className="block text-xs font-semibold uppercase tracking-wider text-white/50">
                Company Name
              </label>
              <div className="mt-1.5 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/30">
                  <Building size={16} />
                </div>
                <input
                  type="text"
                  {...register('company')}
                  className={`block w-full pl-10 pr-3 py-2.5 bg-black border ${errors.company ? 'border-red-500/50' : 'border-white/10'} rounded-xl focus:outline-none focus:border-brand/50 text-white placeholder-white/20 text-sm transition-all`}
                  placeholder="Acme Corp"
                />
              </div>
              {errors.company && (
                <p className="mt-1.5 text-xs text-red-400 font-semibold">{errors.company.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-white/50">
                Secure Password
              </label>
              <div className="mt-1.5 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/30">
                  <Lock size={16} />
                </div>
                <input
                  type="password"
                  {...register('password')}
                  className={`block w-full pl-10 pr-3 py-2.5 bg-black border ${errors.password ? 'border-red-500/50' : 'border-white/10'} rounded-xl focus:outline-none focus:border-brand/50 text-white placeholder-white/20 text-sm transition-all`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-400 font-semibold">{errors.password.message}</p>
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
                  'PROVISION TENANT'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
