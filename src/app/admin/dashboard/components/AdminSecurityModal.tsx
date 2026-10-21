"use client";

import { useState, useEffect } from "react";
import {
  Lock,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  X,
  Send,
  ShieldCheck,
} from "lucide-react";
import { createClient } from "@/src/lib/supabase/client";

interface AdminSecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
  adminEmail: string;
  showToast: (msg: string) => void;
  showError: (msg: string) => void;
}

export function AdminSecurityModal({
  isOpen,
  onClose,
  adminEmail,
  showToast,
  showError,
}: AdminSecurityModalProps) {
  // OTP Flow States
  const [step, setStep] = useState<1 | 2>(1);
  const [emailInput, setEmailInput] = useState(adminEmail || "veerracersselectric.database@gmail.com");
  const [otpToken, setOtpToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      setEmailInput(adminEmail || "veerracersselectric.database@gmail.com");
      setFeedback(null);
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isOpen, adminEmail]);

  // Step 1: Send OTP to Email
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) {
      setFeedback({ type: "error", message: "Please enter your admin email address." });
      return;
    }

    setLoading(true);
    setFeedback(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(emailInput.trim(), {
        redirectTo: typeof window !== "undefined" ? `${window.location.origin}/admin/dashboard` : undefined,
      });

      if (error) throw error;

      setStep(2);
      setFeedback({
        type: "success",
        message: `Verification code / reset link has been dispatched to ${emailInput}. Check your inbox!`,
      });
      showToast("OTP sent to your email!");
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: err.message || "Failed to dispatch verification email.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP & Apply New Password
  const handleVerifyOtpAndChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setFeedback({ type: "error", message: "Password must be at least 6 characters." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setFeedback({ type: "error", message: "Passwords do not match." });
      return;
    }

    setLoading(true);
    setFeedback(null);
    try {
      const supabase = createClient();

      // Verify OTP token
      const { error: verifyErr } = await supabase.auth.verifyOtp({
        email: emailInput.trim(),
        token: otpToken.trim(),
        type: "recovery",
      });

      if (verifyErr) throw verifyErr;

      // Update password
      const { error: updateErr } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateErr) throw updateErr;

      showToast("Admin password updated successfully!");
      setFeedback({
        type: "success",
        message: "Your new password has been verified and updated. Please keep it safe.",
      });

      setTimeout(() => {
        onClose();
        setStep(1);
        setOtpToken("");
        setNewPassword("");
        setConfirmPassword("");
      }, 1500);
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: err.message || "Invalid OTP code or password update failed.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      <div
        className="bg-[#0b0c10] border border-white/15 w-full max-w-md max-h-[88vh] flex flex-col p-6 sm:p-8 shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-racing-red/10 border border-racing-red/30 flex items-center justify-center text-racing-red">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-black text-lg uppercase text-white tracking-wide">
                Security & Password
              </h3>
              <p className="text-[10px] font-mono text-white/50">
                Email OTP Verified Admin Password Change
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-white/50 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* OTP FLOW */}
        <div>
          {step === 1 ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="text-[11px] uppercase text-white/60 mb-1.5 block font-mono">
                    Admin Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="e.g. veerracersselectric.database@gmail.com"
                      className="w-full bg-[#121318] border border-white/10 pl-9 pr-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none"
                    />
                  </div>
                  <span className="text-[10px] text-white/40 block mt-1 font-mono">
                    A confirmation email containing your verification code will be sent to this address.
                  </span>
                </div>

                {feedback && (
                  <div
                    className={`p-3 text-xs font-mono flex items-center gap-2 border ${
                      feedback.type === "error"
                        ? "bg-red-500/10 border-red-500/40 text-red-300"
                        : "bg-emerald-500/10 border-emerald-500/40 text-emerald-300"
                    }`}
                  >
                    {feedback.type === "error" ? (
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                    ) : (
                      <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
                    )}
                    <span>{feedback.message}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-racing-red hover:bg-white hover:text-black text-white text-xs font-mono font-bold uppercase py-2.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <span>Dispatching OTP...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Confirmation Mail with OTP</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtpAndChange} className="space-y-4 animate-in fade-in">
                <div>
                  <label className="text-[11px] uppercase text-white/60 mb-1.5 block font-mono">
                    6-Digit OTP / Token
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={otpToken}
                      onChange={(e) => setOtpToken(e.target.value)}
                      placeholder="e.g. 123456"
                      className="w-full bg-[#121318] border border-white/10 pl-9 pr-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none tracking-widest font-bold"
                    />
                  </div>
                  <span className="text-[10px] text-white/40 block mt-1 font-mono">
                    Enter the code received at <strong className="text-white">{emailInput}</strong>
                  </span>
                </div>

                <div>
                  <label className="text-[11px] uppercase text-white/60 mb-1.5 block font-mono">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={6}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full bg-[#121318] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] uppercase text-white/60 mb-1.5 block font-mono">
                    Confirm New Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full bg-[#121318] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:border-racing-red outline-none"
                  />
                </div>

                {feedback && (
                  <div
                    className={`p-3 text-xs font-mono flex items-center gap-2 border ${
                      feedback.type === "error"
                        ? "bg-red-500/10 border-red-500/40 text-red-300"
                        : "bg-emerald-500/10 border-emerald-500/40 text-emerald-300"
                    }`}
                  >
                    {feedback.type === "error" ? (
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                    ) : (
                      <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
                    )}
                    <span>{feedback.message}</span>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setFeedback(null);
                    }}
                    className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-mono uppercase"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-racing-red hover:bg-white hover:text-black text-white text-xs font-mono font-bold uppercase py-2.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <span>Verifying & Updating...</span>
                    ) : (
                      <>
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Verify OTP & Update Password</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
        </div>
      </div>
    </div>
  );
}
