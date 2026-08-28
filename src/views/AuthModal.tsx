import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { X, Mail, Lock, User, Phone, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { showAuthModal, setShowAuthModal, loginUser, continueAsGuest, showToast } = useApp();

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!showAuthModal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (mode === 'forgot') {
      if (!email) {
        setErrorMsg('Please enter your registered email address.');
        return;
      }
      setLoading(true);
      try {
        if (isSupabaseConfigured && supabase) {
          const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin,
          });
          if (error) throw error;
        }
        setSuccessMsg('✅ Password reset link has been sent to your email. Check your inbox!');
        showToast('Password Reset Sent 📧', 'Please check your email inbox.', 'info');
      } catch (err: any) {
        setErrorMsg(err?.message || 'Could not send reset link. Please check the email address.');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      if (isSupabaseConfigured && supabase) {
        // --- Supabase is configured: use REAL authentication ---
        if (mode === 'signup') {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: fullName,
                phone: phone || '',
              },
            },
          });
          if (error) {
            setErrorMsg(error.message);
            return;
          }
          // Sign up successful
          await loginUser(email, fullName || email.split('@')[0], phone);
        } else {
          // Login: strictly validate password via Supabase
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (error) {
            // Show exact error from Supabase (wrong password, not found, etc.)
            if (error.message.toLowerCase().includes('invalid login credentials') ||
                error.message.toLowerCase().includes('invalid password')) {
              setErrorMsg('❌ Wrong password. Please try again.');
            } else if (error.message.toLowerCase().includes('email not confirmed')) {
              setErrorMsg('📧 Please confirm your email address first, then log in.');
            } else if (error.message.toLowerCase().includes('user not found') ||
                       error.message.toLowerCase().includes('no user found')) {
              setErrorMsg('❌ No account found with this email. Please sign up first.');
            } else {
              setErrorMsg(error.message);
            }
            return; // STOP — do NOT log in on error
          }
          // Success: get name from Supabase user metadata
          const name = data.user?.user_metadata?.full_name || email.split('@')[0];
          const ph = data.user?.user_metadata?.phone || phone;
          await loginUser(email, name, ph);
        }
      } else {
        // --- Supabase NOT configured: local-only fallback ---
        await loginUser(email, fullName || email.split('@')[0], phone);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  const handleGoogleLogin = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        setLoading(true);
        setErrorMsg('');
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin,
          },
        });
        if (error) {
          setErrorMsg(error.message);
        }
        return;
      } catch (err: any) {
        setErrorMsg(err?.message || 'Google sign in failed.');
      } finally {
        setLoading(false);
      }
    } else {
      await loginUser('sathwikbethina@gmail.com', 'Sathwik Bethina', '+91 98765 43210');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-white dark:bg-[#0F1117] w-full max-w-sm rounded-[32px] p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-left relative my-6">
        <button
          onClick={() => {
            setShowAuthModal(false);
            setMode('login');
            setErrorMsg('');
            setSuccessMsg('');
          }}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#1A56DB] to-[#FF5A1F] text-white mx-auto flex items-center justify-center font-black text-xl shadow-lg shadow-orange-500/20 mb-2">
            ⚡
          </div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white">
            {mode === 'login'
              ? 'Welcome to SmartPrice AI'
              : mode === 'signup'
              ? 'Create Your Free Account'
              : 'Reset Your Password'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {mode === 'login'
              ? 'Track Indian store prices & sync across devices'
              : mode === 'signup'
              ? 'Save thousands on groceries & electronics'
              : 'Enter your email to receive a password reset link'}
          </p>
        </div>

        {/* Mode switcher tabs */}
        {mode !== 'forgot' ? (
          <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl mb-4">
            <button
              onClick={() => {
                setMode('login');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${
                mode === 'login'
                  ? 'bg-white dark:bg-[#1E2130] text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Log In
            </button>
            <button
              onClick={() => {
                setMode('signup');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${
                mode === 'signup'
                  ? 'bg-white dark:bg-[#1E2130] text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>
        ) : (
          <div className="mb-4">
            <button
              onClick={() => {
                setMode('login');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className="text-xs font-bold text-[#1A56DB] dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              ← Back to Log In
            </button>
          </div>
        )}

        {errorMsg && (
          <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs mb-3 font-semibold">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400 text-xs mb-3 font-semibold">
            {successMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <div className="relative flex items-center bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 focus-within:ring-2 focus-within:ring-[#1A56DB]">
                  <User className="w-4 h-4 text-slate-400 ml-3.5" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Sathwik Bethina"
                    className="w-full py-2.5 pl-2.5 pr-3 text-xs text-slate-900 dark:text-white bg-transparent focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Phone Number
                </label>
                <div className="relative flex items-center bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 focus-within:ring-2 focus-within:ring-[#1A56DB]">
                  <Phone className="w-4 h-4 text-slate-400 ml-3.5" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full py-2.5 pl-2.5 pr-3 text-xs text-slate-900 dark:text-white bg-transparent focus:outline-none"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative flex items-center bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 focus-within:ring-2 focus-within:ring-[#1A56DB]">
              <Mail className="w-4 h-4 text-slate-400 ml-3.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full py-2.5 pl-2.5 pr-3 text-xs text-slate-900 dark:text-white bg-transparent focus:outline-none"
                required
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Password
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setErrorMsg('');
                      setSuccessMsg('');
                    }}
                    className="text-[10px] font-bold text-[#1A56DB] dark:text-blue-400 hover:underline"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative flex items-center bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 focus-within:ring-2 focus-within:ring-[#1A56DB]">
                <Lock className="w-4 h-4 text-slate-400 ml-3.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full py-2.5 pl-2.5 pr-3 text-xs text-slate-900 dark:text-white bg-transparent focus:outline-none"
                  required
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-[#1A56DB] text-white font-extrabold text-xs shadow-lg shadow-blue-500/25 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {loading
              ? 'Processing...'
              : mode === 'login'
              ? 'Sign In'
              : mode === 'signup'
              ? 'Create Account'
              : 'Send Reset Link'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {mode !== 'forgot' && (
          <>
            {/* Divider */}
            <div className="relative my-4 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800" />
              </div>
              <span className="relative bg-white dark:bg-[#0F1117] px-3 text-[10px] uppercase font-bold text-slate-400">
                or continue with
              </span>
            </div>

            {/* Social Buttons */}
            <div className="space-y-2">
              <button
                onClick={handleGoogleLogin}
                className="w-full py-2.5 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
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
                Continue with Google
              </button>

              <button
                onClick={continueAsGuest}
                className="w-full py-2.5 px-4 rounded-2xl bg-transparent border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all"
              >
                Continue as Guest
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

