import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { User, Camera, ShieldCheck, Mail, Building, Phone, Globe, Languages } from 'lucide-react';

export const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [name, setName] = useState(user?.name || '');
  const [company, setCompany] = useState(user?.company || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [timezone, setTimezone] = useState(user?.timezone || 'Asia/Colombo');
  const [language, setLanguage] = useState(user?.language || 'en-US');
  const [avatar, setAvatar] = useState(user?.avatar || '');

  // Password fields state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
        toast.showToast('Avatar preview uploaded.', 'info');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancel = () => {
    // Reset to current auth user details
    setName(user?.name || '');
    setCompany(user?.company || '');
    setEmail(user?.email || '');
    setPhone(user?.phone || '');
    setTimezone(user?.timezone || 'Asia/Colombo');
    setLanguage(user?.language || 'en-US');
    setAvatar(user?.avatar || '');
    setCurrentPassword('');
    setNewPassword('');
    toast.showToast('Profile edits discarded.', 'info');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.showToast('Officer Name and Enterprise Email are required.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await updateProfile({
        name,
        company,
        email,
        phone,
        timezone,
        language,
        avatar
      });
      toast.showToast('Commanding Officer profile successfully synchronized.', 'success');
    } catch (err) {
      toast.showToast('Error syncing profile changes.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-black uppercase text-white tracking-wide">
          Officer Identity Portal
        </h2>
        <p className="text-xs text-white/40 mt-1 leading-relaxed">
          Manage system identity cards, select preferred timezones, and change terminal access signatures.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-[#121212] border border-white/5 rounded-3xl p-6 sm:p-8">
          {/* Read-Only Firebase Metadata */}
          {user?.uid && (
            <div className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-white/5 pb-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-white/50 mb-1 font-mono">Firebase UID</p>
                <p className="text-xs text-white/80 font-mono truncate">{user.uid}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-white/50 mb-1 font-mono">Account Created</p>
                <p className="text-xs text-white/80 font-mono truncate">{user.createdAt ? new Date(user.createdAt).toLocaleString() : 'N/A'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-white/50 mb-1 font-mono">Last Login</p>
                <p className="text-xs text-white/80 font-mono truncate">{user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'N/A'}</p>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-8 items-start">
            
            {/* Avatar picker container */}
            <div className="flex flex-col items-center gap-3 shrink-0">
              <div className="relative group">
                <img
                  src={avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&h=256&fit=crop'}
                  alt="Officer avatar preview"
                  className="w-28 h-28 rounded-full border border-white/10 object-cover shadow-xl"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-brand transition-opacity cursor-pointer"
                >
                  <Camera size={20} />
                </button>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                accept="image/*"
                className="hidden"
              />
              <span className="text-[9px] font-mono text-white/30 uppercase tracking-wider">Click photo to update</span>
            </div>

            {/* Profile fields grid */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50 mb-1.5 font-mono">
                  Commanding Officer Name
                </label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full bg-black border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand/50 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50 mb-1.5 font-mono">
                  Enterprise Company
                </label>
                <div className="relative">
                  <Building size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="block w-full bg-black border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand/50 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50 mb-1.5 font-mono">
                  Enterprise Email
                </label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full bg-black border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand/50 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50 mb-1.5 font-mono">
                  Authorized Phone Contact
                </label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="block w-full bg-black border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand/50 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50 mb-1.5 font-mono">
                  System Timezone Area
                </label>
                <div className="relative">
                  <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="block w-full bg-black border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand/50 font-mono"
                  >
                    <option value="Asia/Colombo">Asia/Colombo (GMT+05:30)</option>
                    <option value="America/New_York">America/New_York (GMT-05:00)</option>
                    <option value="Europe/London">Europe/London (GMT+00:00)</option>
                    <option value="Asia/Singapore">Asia/Singapore (GMT+08:00)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50 mb-1.5 font-mono">
                  Interface Language Code
                </label>
                <div className="relative">
                  <Languages size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="block w-full bg-black border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand/50 font-mono"
                  >
                    <option value="en-US">English (en-US)</option>
                    <option value="de-DE">Deutsch (de-DE)</option>
                    <option value="ja-JP">日本語 (ja-JP)</option>
                  </select>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Change Access Signature */}
        <div className="bg-[#121212] border border-white/5 rounded-3xl p-6 sm:p-8">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono mb-6">Modify Access Signature (Password)</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50 mb-1.5 font-mono">
                Current Pass Signature
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="block w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-brand/50 font-mono"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50 mb-1.5 font-mono">
                New Pass Signature
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="block w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-brand/50 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex justify-end gap-3 font-mono">
          <button
            type="button"
            onClick={handleCancel}
            className="px-5 py-2.5 bg-transparent hover:bg-white/5 text-white/60 font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
          >
            Discard Changes
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2.5 bg-[#00d4b4] hover:bg-[#00b89e] disabled:opacity-50 text-[#0a0a0a] font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <ShieldCheck size={14} /> Synchronize Config
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
