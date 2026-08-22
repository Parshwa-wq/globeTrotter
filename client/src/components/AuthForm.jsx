import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff } from "lucide-react";

export default function AuthForm({ initialMode = "login" }) {
  const [isLogin, setIsLogin] = useState(initialMode === "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [localError, setLocalError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    setIsProcessing(true);

    try {
      let result;
      if (isLogin) {
        result = await login(email, password);
      } else {
        result = await register(name, email, password);
      }

      if (result.success) {
        navigate("/dashboard");
      } else {
        setLocalError(result.message || "Authentication failed");
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Auth Exception:", error);
      setLocalError("An unexpected error occurred");
      setIsProcessing(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setLocalError("");
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bento-card !p-0 flex flex-col"
      >
        {/* Terminal/Window Header */}
        <div className="bg-[#111111] border-b border-[#1a1a1a] px-4 py-3 flex items-center justify-between rounded-t-[24px]">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#333] hover:bg-red-500 transition-colors cursor-pointer"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#333] hover:bg-yellow-500 transition-colors cursor-pointer"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#333] hover:bg-green-500 transition-colors cursor-pointer"></div>
          </div>
          <div className="font-mono text-[9px] text-[#555] tracking-[0.2em] uppercase font-bold absolute left-1/2 -translate-x-1/2">
            GLOBETROTTER_SYS_{isLogin ? "LOGIN" : "REGISTRATION"}
          </div>
          <div className="w-10"></div>
        </div>

        <div className="p-8">
          {/* Header Info */}
          <div className="mb-8 border-l-2 border-neon-green pl-4">
            <h1 className="text-2xl font-bold text-white mb-2 font-grotesk tracking-tight flex items-center">
              <span className="text-neon-green mr-2 font-mono">&gt;</span>
              {isLogin ? "Secure Access" : "Secure Onboarding"}
            </h1>
            <p className="text-[#888] text-sm font-inter">
              {isLogin ? "Authenticate to access your dashboard." : "Create your GlobeTrotter account."}
            </p>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {localError && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mb-6"
              >
                <div className="p-3 rounded-lg bg-red-950/30 border border-red-500/20 text-red-400 text-sm font-medium flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shrink-0" />
                  {localError}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5 mb-8">
            <AnimatePresence mode="popLayout">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pb-1">
                    <label className="block text-[10px] font-mono text-[#666] mb-2 uppercase tracking-widest">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={isProcessing}
                      className="w-full bg-[#0d0d0d] border border-[#222] rounded-lg px-4 py-3 text-gray-300 font-mono text-sm focus:outline-none focus:border-neon-green focus:ring-1 focus:ring-neon-green transition-all disabled:opacity-50"
                      placeholder="John Doe"
                      required={!isLogin}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-[10px] font-mono text-[#666] mb-2 uppercase tracking-widest">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isProcessing}
                className="w-full bg-[#0d0d0d] border border-[#222] rounded-lg px-4 py-3 text-gray-300 font-mono text-sm focus:outline-none focus:border-neon-green focus:ring-1 focus:ring-neon-green transition-all disabled:opacity-50"
                placeholder="user@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-[#666] mb-2 uppercase tracking-widest">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isProcessing}
                  className="w-full bg-[#0d0d0d] border border-[#222] rounded-lg px-4 py-3 text-gray-300 font-mono text-sm focus:outline-none focus:border-neon-green focus:ring-1 focus:ring-neon-green transition-all disabled:opacity-50 pr-12"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666] hover:text-neon-green transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full flex justify-center py-3.5 px-4 border border-transparent text-[15px] font-bold rounded-lg text-black bg-neon-green hover:brightness-110 focus:outline-none transition-all disabled:opacity-50 mt-4 shadow-[0_0_20px_rgba(127,255,0,0.15)] hover:shadow-[0_0_30px_rgba(127,255,0,0.4)]"
            >
              {isProcessing ? (
                isLogin ? "Authenticating..." : "Creating Account..."
              ) : (
                isLogin ? "Authenticate" : "Create Account"
              )}
            </button>
          </form>
          
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px bg-[#222] flex-1"></div>
            <span className="text-[#444] font-mono text-[10px] tracking-widest uppercase">OR</span>
            <div className="h-px bg-[#222] flex-1"></div>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={toggleMode}
              disabled={isProcessing}
              className="text-sm text-[#888] hover:text-white transition-colors disabled:opacity-50"
            >
              {isLogin ? "Need an account? " : "Already have an account? "} 
              <span className="font-bold text-white ml-1">
                {isLogin ? "Sign Up" : "Login"}
              </span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
