import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth-context';

export const AdminLogin: React.FC = () => {
  const { loginWithGoogle, loginWithEmail, sendPasswordReset, bootstrapOwnerAccount, currentUser, isAdmin, isOwner } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetStatus, setResetStatus] = useState<string | null>(null);

  // If already logged in as admin, redirect to dashboard
  if (currentUser && isAdmin) {
    navigate('/admin/dashboard', { replace: true });
    return null;
  }

  const handleGoogleLogin = async () => {
    setErrorMsg(null);
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate('/admin/dashboard');
    } catch (err) {
      console.error(err);
      setErrorMsg(err instanceof Error ? err.message : 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);
    try {
      await loginWithEmail(email.trim(), password);
      navigate('/admin/dashboard');
    } catch (err) {
      console.error(err);
      setErrorMsg('Invalid email or password. Please verify your credentials or use Google sign-in.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetStatus(null);
    try {
      await sendPasswordReset(resetEmail.trim());
      setResetStatus('Password reset link sent to your email.');
    } catch (err) {
      setResetStatus(err instanceof Error ? err.message : 'Failed to send reset email');
    }
  };

  const handleBootstrapOwner = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await bootstrapOwnerAccount('Shubham (Founder & CEO)');
      if (res.success) {
        setSuccessMsg(res.message);
        setTimeout(() => navigate('/admin/dashboard'), 1000);
      } else {
        setErrorMsg(res.message);
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Bootstrap failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-subtle flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <img
              src="https://lh3.googleusercontent.com/aida/AEtjO1WvXapdEnMeltY8iU9JwLdNKOOhH7ol8heGxaeDchiHMIQiUDUyAuHcuck53FXh1wQZvsQ_KMJHLuP9j-hYcpx4NjKm43K4yXHYRfZ7Hr7jgG_Sf4z888BGGW993BnVKCLGDXqlrJ748xu2l9Ip1YsAWTfk7IkPQJVfnkCMNvZzGqwTVaSacqoNkCcMFJ0cXECpzLvUGq0ESurWQ7xF9ukcpKDb0t1mtDoh8wHgUzc3mCIbW9z4y2U_RVO8"
              alt="NAVIORAA Logo"
              className="h-9 w-auto"
            />
            <span className="font-heading font-extrabold text-xl text-primary tracking-tight">NAVIORAA</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl text-on-surface">Administrative CMS</h1>
          <p className="text-xs text-on-surface-variant mt-1">
            Authorized personnel portal for website management & enquiry CRM.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border-subtle shadow-lg space-y-5">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              <span>{successMsg}</span>
            </div>
          )}

          {/* Primary 1-Click Google OAuth */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full h-12 rounded-xl bg-white hover:bg-slate-50 border border-border-medium text-on-surface font-semibold text-xs flex items-center justify-center gap-3 shadow-xs active:scale-98 transition-all"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Sign in with Google Workspace</span>
          </button>

          <div className="relative flex items-center justify-center my-2">
            <div className="w-full h-px bg-border-subtle" />
            <span className="absolute px-3 bg-white text-[11px] font-bold text-text-muted">
              Or password login
            </span>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleEmailLogin} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@navioraa.com"
                className="w-full h-11 px-3.5 rounded-xl border border-border-medium bg-white text-xs text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-2xs"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-on-surface">Password</label>
                <button
                  type="button"
                  onClick={() => setShowResetModal(true)}
                  className="text-[11px] font-semibold text-primary hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 px-3.5 rounded-xl border border-border-medium bg-white text-xs text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-2xs"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm active:scale-98 transition-all disabled:opacity-60"
            >
              <span>Login to CMS</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </form>

          {/* First-Owner Bootstrap Procedure */}
          {currentUser && !isAdmin && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2 mt-4">
              <p className="text-xs font-bold text-amber-900">
                Logged in as {currentUser.email}
              </p>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                If you are the founder (Shubham) or initial administrator, click below to bootstrap the Super Admin owner permissions for this account.
              </p>
              <button
                onClick={handleBootstrapOwner}
                disabled={loading}
                className="w-full h-9 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-xs"
              >
                <span>Initialize First Owner (Super Admin)</span>
              </button>
            </div>
          )}
        </div>

        {/* Security Policy Notice */}
        <p className="text-[11px] text-text-muted text-center mt-6">
          Access restricted strictly to authorized NAVIORAA faculty and project administrators. All administrative actions are recorded in immutable audit logs.
        </p>
      </div>

      {/* Password Reset Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 border border-border-subtle shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-base text-on-surface">Reset Password</h3>
              <button
                onClick={() => setShowResetModal(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <p className="text-xs text-on-surface-variant">
              Enter your registered administrator email to receive a password reset link.
            </p>
            {resetStatus && (
              <div className="p-3 bg-blue-50 border border-blue-200 text-blue-800 rounded-xl text-xs">
                {resetStatus}
              </div>
            )}
            <form onSubmit={handleSendReset} className="space-y-3">
              <input
                type="email"
                required
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="your.email@navioraa.com"
                className="w-full h-11 px-3.5 rounded-xl border border-border-medium text-xs text-on-surface"
              />
              <button
                type="submit"
                className="w-full h-10 rounded-xl bg-primary text-white font-semibold text-xs"
              >
                Send Reset Link
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
