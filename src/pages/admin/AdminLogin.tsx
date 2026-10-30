import React, { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth-context';
import { NavioraaLogo } from '../../components/public/NavioraaLogo';

export const AdminLogin: React.FC = () => {
  const { loginWithGoogle, loginWithEmail, sendPasswordReset, bootstrapOwnerAccount, currentUser, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('shubhammahadik3228@gmail.com');
  const [password, setPassword] = useState('Harvey@2026');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('shubhammahadik3228@gmail.com');
  const [resetStatus, setResetStatus] = useState<string | null>(null);
  const [resetLoading, setResetLoading] = useState(false);

  // If already logged in as admin, redirect to dashboard
  if (currentUser && isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
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
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'Invalid email or password. Please verify your credentials or click Forgot Password.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSendReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) return;
    setResetStatus(null);
    setResetLoading(true);
    try {
      await sendPasswordReset(resetEmail.trim());
      setResetStatus(
        `A secure password reset link has been dispatched to ${resetEmail.trim()}. Please check your inbox and spam folder.`
      );
    } catch (err) {
      setResetStatus(
        err instanceof Error ? err.message : 'Failed to send reset email. Please ensure the email address is valid.'
      );
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white flex flex-col justify-center items-center p-4 selection:bg-[#0052FF] selection:text-white">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#0052FF]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-3">
            <NavioraaLogo variant="dark" size="md" />
          </div>
          <h1 className="font-heading font-extrabold text-2xl text-white tracking-tight">
            Administrator Workspace
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Authorized personnel portal for Academy LMS, digital assets, and incoming admissions CRM.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[#131926] rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-5">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-950/50 border border-red-800/80 text-red-300 text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-800/80 text-emerald-300 text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              <span>{successMsg}</span>
            </div>
          )}

          {/* Email/Password Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Administrator Email
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-[18px]">
                  mail
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="shubhammahadik3228@gmail.com"
                  className="w-full h-11 pl-10 pr-3.5 rounded-xl border border-slate-700 bg-slate-900/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#0052FF] focus:ring-1 focus:ring-[#0052FF]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-300">Password</label>
                <button
                  type="button"
                  onClick={() => {
                    setResetEmail(email || 'shubhammahadik3228@gmail.com');
                    setShowResetModal(true);
                  }}
                  className="text-[11px] font-semibold text-[#00E5FF] hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-[18px]">
                  lock
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 pl-10 pr-3.5 rounded-xl border border-slate-700 bg-slate-900/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#0052FF] focus:ring-1 focus:ring-[#0052FF]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-[#0052FF] hover:bg-[#0040CC] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#0052FF]/20 active:scale-98 transition-all disabled:opacity-60"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In as Administrator'}</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </form>

          <div className="relative flex items-center justify-center my-3">
            <div className="w-full h-px bg-slate-800" />
            <span className="absolute px-3 bg-[#131926] text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Or OAuth Login
            </span>
          </div>

          {/* Google Workspace OAuth Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full h-11 rounded-xl bg-slate-900 hover:bg-slate-800/80 border border-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2.5 transition-all"
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
            <span>Continue with Google Workspace</span>
          </button>
        </div>

        {/* Public Site Return */}
        <div className="mt-6 flex items-center justify-between text-xs text-slate-400">
          <Link to="/" className="inline-flex items-center gap-1.5 hover:text-[#00E5FF] transition-colors">
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Return to Public Website</span>
          </Link>
          <span className="text-[11px] text-slate-500 font-mono">NAVIORAA v2.4 Enterprise</span>
        </div>
      </div>

      {/* Password Reset Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#131926] rounded-3xl max-w-sm w-full p-6 border border-slate-700 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00E5FF] text-[20px]">
                  lock_reset
                </span>
                <h3 className="font-heading font-bold text-sm text-white">Reset Password</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Enter your registered administrator email address. Firebase Authentication will transmit an official password reset link directly to your inbox.
            </p>

            {resetStatus && (
              <div className="p-3 bg-slate-900 border border-slate-700 text-slate-200 rounded-xl text-xs leading-relaxed">
                {resetStatus}
              </div>
            )}

            <form onSubmit={handleSendReset} className="space-y-3 pt-1">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  Recipient Email
                </label>
                <input
                  type="email"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="shubhammahadik3228@gmail.com"
                  className="w-full h-10 px-3.5 rounded-xl border border-slate-700 bg-slate-900 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#0052FF]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowResetModal(false)}
                  className="h-9 px-3 rounded-xl border border-slate-700 text-xs text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="h-9 px-4 rounded-xl bg-[#0052FF] text-white font-semibold text-xs flex items-center gap-1.5 hover:bg-[#0040CC] disabled:opacity-60"
                >
                  <span className="material-symbols-outlined text-[16px]">send</span>
                  <span>{resetLoading ? 'Sending...' : 'Send Verification Link'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
