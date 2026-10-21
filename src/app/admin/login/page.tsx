"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/src/lib/supabase/client";
import { ArrowLeft, KeyRound, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";

export default function AdminLogin() {
  const [email, setEmail] = useState("veerracersselectric.database@gmail.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/admin/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 pt-24 pb-12 overflow-y-auto">
      <Link href="/" className="absolute top-8 left-8 text-white/50 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors">
        <ArrowLeft className="w-5 h-5" /> Back to Home
      </Link>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-panel p-8 rounded-3xl relative overflow-hidden border border-white/10"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-racing-red/10 rounded-full blur-3xl" />
        
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
             <KeyRound className="w-8 h-8 text-racing-red" />
          </div>
        </div>

        <h1 className="text-3xl font-black uppercase font-display text-center mb-2 tracking-tight">Admin Portal</h1>
        <p className="text-white/50 text-center mb-8 text-sm">PR & Club Operations Access</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-3 rounded-lg mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div>
            <label className="text-xs uppercase tracking-widest text-white/70 block mb-2 font-mono">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-racing-red transition-colors text-sm"
              placeholder="veerracersselectric.database@gmail.com"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-white/70 block mb-2 font-mono">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white focus:outline-none focus:border-racing-red transition-colors text-sm"
                placeholder="Enter password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <input type="checkbox" id="remember" defaultChecked className="accent-racing-red cursor-pointer" />
             <label htmlFor="remember" className="text-xs text-white/50 cursor-pointer">Remember me on this browser</label>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-racing-red text-white font-bold uppercase tracking-widest py-3.5 rounded-xl mt-2 hover:bg-white hover:text-black transition-all disabled:opacity-50 text-xs sm:text-sm"
          >
            {loading ? "Authenticating..." : "Login to Operations Center"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
