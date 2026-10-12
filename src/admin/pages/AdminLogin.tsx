import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  ShieldAlert,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Truck,
} from 'lucide-react';
import {
  hasPasscode,
  setPasscode,
  verifyPasscode,
  isAuthenticated,
  loginSession,
  resetStoredPasscode,
  CONVENIENCE_LOCK_NOTE,
} from '../lib/auth';
import ConfirmDialog from '../components/ConfirmDialog';
import { useContent } from '@/hooks/useContent';

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const logoUrl = useContent('global.logo.url', 'https://i.ibb.co/KgkfFKV/Santa-Logo.png');
  const brandName = useContent('global.brand.name', 'Santa Towing & Garage Services Ltd.');

  const [isFirstUse, setIsFirstUse] = useState<boolean>(false);
  const [passcode, setPasscodeVal] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Target path user was trying to access
  const fromPath = (location.state as any)?.from?.pathname || '/admin';

  useEffect(() => {
    // If already logged in, redirect immediately to target admin route
    if (isAuthenticated()) {
      navigate(fromPath, { replace: true });
      return;
    }

    // Determine if this is first-time setup
    setIsFirstUse(!hasPasscode());
  }, [navigate, fromPath]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (isFirstUse) {
      // First-time passcode creation
      if (!passcode || passcode.trim().length < 4) {
        setErrorMsg('Please choose a passcode with at least 4 characters.');
        return;
      }
      if (passcode !== confirmPasscode) {
        setErrorMsg('Passcodes do not match. Please verify and retype.');
        return;
      }

      setIsSubmitting(true);
      try {
        const success = await setPasscode(passcode);
        if (success) {
          loginSession();
          navigate(fromPath, { replace: true });
        } else {
          setErrorMsg('Failed to save passcode. Please try again.');
        }
      } catch (err) {
        setErrorMsg('An unexpected error occurred while saving the passcode.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Returning passcode verification
      if (!passcode) {
        setErrorMsg('Please enter your passcode to unlock.');
        return;
      }

      setIsSubmitting(true);
      try {
        const isValid = await verifyPasscode(passcode);
        if (isValid) {
          loginSession();
          navigate(fromPath, { replace: true });
        } else {
          setErrorMsg('Incorrect passcode. Please try again.');
          setPasscodeVal('');
        }
      } catch (err) {
        setErrorMsg('Error verifying passcode. Please retry.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleResetPasscode = () => {
    resetStoredPasscode();
    setIsFirstUse(true);
    setPasscodeVal('');
    setConfirmPasscode('');
    setErrorMsg('');
    setShowResetConfirm(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 antialiased">
      {/* Background ambient decorative glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#015557]/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#d80000]/15 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Brand Lockup */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block transition-transform hover:scale-105 mb-3">
            <div className="bg-white p-2.5 rounded-xl shadow-lg inline-block border border-slate-700">
              <img
                src={logoUrl}
                alt={brandName}
                className="h-10 w-auto object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
          </Link>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Admin Console Gate
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {brandName}
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#015557] flex items-center justify-center shrink-0 shadow-xs border border-emerald-100">
              {isFirstUse ? <KeyRound className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-tight">
                {isFirstUse ? 'Create Admin Passcode' : 'Enter Admin Passcode'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {isFirstUse
                  ? 'First-time setup: secure this browser session'
                  : 'Passcode required to access management controls'}
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div
                role="alert"
                className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-[#d80000] flex items-start gap-2.5 animate-in fade-in"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="font-medium leading-relaxed">{errorMsg}</span>
              </div>
            )}

            {/* Passcode input */}
            <div>
              <label
                htmlFor="admin-passcode"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                {isFirstUse ? 'Choose Passcode' : 'Passcode'}
              </label>
              <div className="relative">
                <input
                  id="admin-passcode"
                  type={showPasscode ? 'text' : 'password'}
                  value={passcode}
                  onChange={(e) => setPasscodeVal(e.target.value)}
                  placeholder={isFirstUse ? 'Enter 4+ digit or letter code' : '••••••••'}
                  autoFocus
                  required
                  className="w-full min-h-[46px] px-3.5 pr-11 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 hover:border-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#015557] focus-visible:border-[#015557] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  aria-label={showPasscode ? 'Hide passcode' : 'Show passcode'}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-slate-700 rounded-lg min-h-[40px] min-w-[40px] flex items-center justify-center transition-colors"
                >
                  {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {isFirstUse && (
                <p className="text-[11px] text-slate-500 mt-1">
                  Can be numbers, words, or a PIN (minimum 4 characters).
                </p>
              )}
            </div>

            {/* Confirm passcode input (first use only) */}
            {isFirstUse && (
              <div>
                <label
                  htmlFor="admin-confirm-passcode"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
                >
                  Confirm Passcode
                </label>
                <input
                  id="admin-confirm-passcode"
                  type={showPasscode ? 'text' : 'password'}
                  value={confirmPasscode}
                  onChange={(e) => setConfirmPasscode(e.target.value)}
                  placeholder="Re-enter chosen passcode"
                  required
                  className="w-full min-h-[46px] px-3.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 hover:border-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#015557] focus-visible:border-[#015557] transition-all"
                />
              </div>
            )}

            {/* Convenience Lock Warning Notice */}
            <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/90 text-amber-900">
              <div className="flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed">
                  <span className="font-bold block text-amber-950 mb-0.5">
                    Convenience Lock Notice
                  </span>
                  <p className="text-amber-800">
                    {CONVENIENCE_LOCK_NOTE} Only a cryptographic SHA-256 hash is saved.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full min-h-[46px] px-4 py-2.5 bg-[#015557] hover:bg-[#014345] text-white font-semibold text-sm rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#015557]"
            >
              {isSubmitting ? (
                <span>Verifying...</span>
              ) : (
                <>
                  <span>{isFirstUse ? 'Set Passcode & Enter Admin' : 'Unlock Admin Console'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Reset / Return actions */}
          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <Link
              to="/"
              className="hover:text-slate-900 transition-colors flex items-center gap-1 font-medium min-h-[38px]"
            >
              ← Back to public site
            </Link>

            {!isFirstUse && (
              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="text-slate-400 hover:text-amber-700 transition-colors flex items-center gap-1 font-medium min-h-[38px]"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset passcode</span>
              </button>
            )}
          </div>
        </div>

        {/* Small footer text */}
        <p className="text-center text-xs text-slate-500 mt-6">
          Santa Towing Administrative Portal &middot; 24/7 Operations Ghana
        </p>
      </div>

      {/* Confirmation Dialog for Resetting Passcode */}
      <ConfirmDialog
        isOpen={showResetConfirm}
        title="Reset Admin Passcode?"
        description="Because this is a local convenience lock, resetting will clear the stored hash on this browser and let you set a new passcode immediately."
        confirmLabel="Reset Passcode"
        cancelLabel="Cancel"
        isDestructive={true}
        onConfirm={handleResetPasscode}
        onCancel={() => setShowResetConfirm(false)}
      />
    </div>
  );
}
