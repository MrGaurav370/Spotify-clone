
import React, { useState, useEffect } from 'react';

interface LoginProps {
  onLogin: () => void;
}

type ViewState = 'landing' | 'login' | 'signup';
type SocialProvider = 'Google' | 'Facebook' | 'Apple';

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [view, setView] = useState<ViewState>('landing');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Social Login Popup State
  const [activeSocialProvider, setActiveSocialProvider] = useState<SocialProvider | null>(null);
  const [socialStage, setSocialStage] = useState<'initial' | 'processing' | 'success'>('initial');

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password || (view === 'signup' && !name)) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      onLogin();
    } catch (err) {
      setError(`Failed to ${view === 'login' ? 'log in' : 'sign up'}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const startSocialLogin = (provider: SocialProvider) => {
    setActiveSocialProvider(provider);
    setSocialStage('initial');
  };

  const handleSocialConfirm = async () => {
    setSocialStage('processing');
    // Simulate authentication lag
    await new Promise(resolve => setTimeout(resolve, 1800));
    setSocialStage('success');
    await new Promise(resolve => setTimeout(resolve, 600));
    onLogin();
  };

  const getProviderIcon = (provider: SocialProvider) => {
    switch (provider) {
      case 'Google': return <i className="fa-brands fa-google text-red-500"></i>;
      case 'Facebook': return <i className="fa-brands fa-facebook text-blue-600"></i>;
      case 'Apple': return <i className="fa-brands fa-apple text-black"></i>;
    }
  };

  const getProviderColors = (provider: SocialProvider) => {
    switch (provider) {
      case 'Google': return 'bg-white text-gray-700 border-gray-200';
      case 'Facebook': return 'bg-[#1877F2] text-white border-transparent';
      case 'Apple': return 'bg-black text-white border-transparent';
    }
  };

  return (
    <div className="min-h-screen w-full bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden font-['Circular']">
      {/* Immersive Background Elements */}
      <div className={`absolute top-[-25%] left-[-15%] w-[800px] h-[800px] bg-green-500/10 rounded-full blur-[140px] pointer-events-none transition-all duration-1000 ${view !== 'landing' ? 'opacity-100 scale-110' : 'opacity-40 scale-100'}`}></div>
      <div className={`absolute bottom-[-25%] right-[-15%] w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none transition-all duration-1000 ${view !== 'landing' ? 'opacity-100 scale-110' : 'opacity-40 scale-100'}`}></div>

      {/* Simulated Social Popup Modal */}
      {activeSocialProvider && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isLoading && setActiveSocialProvider(null)}></div>
          <div className={`relative w-full max-w-[380px] bg-white rounded-2xl overflow-hidden shadow-2xl transition-all transform ${socialStage === 'processing' ? 'scale-95 opacity-90' : 'scale-100 opacity-100'}`}>
            <div className="p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-3xl mb-4 shadow-inner">
                {getProviderIcon(activeSocialProvider)}
              </div>
              
              <h3 className="text-gray-900 text-xl font-black mb-1">
                {socialStage === 'initial' ? `Sign in with ${activeSocialProvider}` : 
                 socialStage === 'processing' ? 'Authenticating...' : 'Success!'}
              </h3>
              
              <p className="text-gray-500 text-sm mb-8">
                {socialStage === 'initial' ? `Lumina would like to use your ${activeSocialProvider} account for login.` : 
                 socialStage === 'processing' ? 'Establishing secure connection...' : 'Redirecting to your dashboard...'}
              </p>

              {socialStage === 'initial' && (
                <div className="w-full space-y-3">
                  <button 
                    onClick={handleSocialConfirm}
                    className={`w-full py-3.5 rounded-full font-bold flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg ${getProviderColors(activeSocialProvider)}`}
                  >
                    Continue with {activeSocialProvider}
                  </button>
                  <button 
                    onClick={() => setActiveSocialProvider(null)}
                    className="w-full py-3 text-gray-400 font-bold hover:text-gray-600 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {socialStage === 'processing' && (
                <div className="py-6 flex flex-col items-center">
                  <div className="w-12 h-12 border-4 border-gray-100 border-t-green-500 rounded-full animate-spin"></div>
                </div>
              )}

              {socialStage === 'success' && (
                <div className="py-6 text-green-500 animate-bounce">
                  <i className="fa-solid fa-circle-check text-5xl"></i>
                </div>
              )}
            </div>
            
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-between items-center text-[10px] text-gray-400 font-bold tracking-widest uppercase">
               <span>Lumina Privacy</span>
               <div className="flex gap-2">
                  <i className="fa-solid fa-shield-halved"></i>
                  <span>Secure SSL</span>
               </div>
            </div>
          </div>
        </div>
      )}

      {view === 'landing' ? (
        <div className="z-10 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-700 w-full max-w-[400px]">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full scale-150"></div>
            <i className="fa-brands fa-spotify text-8xl text-green-500 relative z-10 drop-shadow-[0_0_25px_rgba(34,197,94,0.5)] hover:rotate-[360deg] transition-transform duration-1000"></i>
          </div>
          
          <h1 className="text-6xl font-black tracking-tighter mb-2 bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
            Lumina
          </h1>
          <p className="text-zinc-400 text-lg font-medium mb-10 max-w-sm leading-relaxed px-6">
            Experience the future of music. <br/>AI-curated for your soul.
          </p>

          <div className="flex flex-col gap-3 w-full px-4">
            <button 
              onClick={() => setView('signup')}
              className="bg-green-500 text-black font-black py-4 rounded-full text-base hover:scale-105 active:scale-95 transition-all shadow-[0_10px_30px_rgba(34,197,94,0.3)] hover:bg-green-400"
            >
              Sign up free
            </button>

            <button 
              onClick={() => startSocialLogin('Google')}
              className="flex items-center justify-center gap-4 text-white font-bold py-3.5 rounded-full border border-zinc-700 hover:border-white hover:bg-white/5 transition-all active:scale-95"
            >
              <i className="fa-brands fa-google text-xl text-red-500"></i>
              Continue with Google
            </button>
            <button 
              onClick={() => startSocialLogin('Facebook')}
              className="flex items-center justify-center gap-4 text-white font-bold py-3.5 rounded-full border border-zinc-700 hover:border-white hover:bg-white/5 transition-all active:scale-95"
            >
              <i className="fa-brands fa-facebook text-xl text-blue-600"></i>
              Continue with Facebook
            </button>
            <button 
              onClick={() => startSocialLogin('Apple')}
              className="flex items-center justify-center gap-4 text-white font-bold py-3.5 rounded-full border border-zinc-700 hover:border-white hover:bg-white/5 transition-all active:scale-95"
            >
              <i className="fa-brands fa-apple text-xl"></i>
              Continue with Apple
            </button>

            <button 
              onClick={() => setView('login')}
              className="mt-4 text-white font-bold py-4 hover:underline transition-all text-sm opacity-80 hover:opacity-100"
            >
              Log in with email or username
            </button>
          </div>

          <div className="mt-12 pt-6 border-t border-zinc-800 w-full flex flex-col items-center">
             <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-4">Powered by Gemini AI</p>
             <div className="flex gap-6 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
                <i className="fa-solid fa-microchip text-xl"></i>
                <i className="fa-solid fa-bolt-lightning text-xl"></i>
                <i className="fa-solid fa-wave-square text-xl"></i>
             </div>
          </div>
        </div>
      ) : (
        <div className="z-10 w-full max-w-[460px] bg-zinc-950/80 backdrop-blur-xl border border-zinc-800/50 p-8 md:p-10 rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] flex flex-col items-center animate-in fade-in slide-in-from-bottom-12 duration-500">
          <div className="mb-10 flex flex-col items-center relative w-full">
            <button 
              onClick={() => setView('landing')}
              className="absolute left-0 top-0 w-10 h-10 flex items-center justify-center rounded-full bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <i className="fa-brands fa-spotify text-5xl text-green-500 mb-4 drop-shadow-[0_0_10px_rgba(34,197,94,0.3)]"></i>
            <h2 className="text-2xl font-black tracking-tight">
              {view === 'login' ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="text-zinc-500 text-sm mt-1">
              {view === 'login' ? 'Please enter your details' : 'Start your journey with Lumina'}
            </p>
          </div>

          {error && (
            <div className="w-full bg-red-500/10 border border-red-500/30 text-red-500 text-xs py-3 px-4 rounded-xl mb-6 flex items-center gap-3 animate-in fade-in zoom-in-95">
              <i className="fa-solid fa-circle-exclamation text-base"></i>
              {error}
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="w-full space-y-4">
            {view === 'signup' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2 ml-1" htmlFor="name">
                  What's your name?
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Enter a profile name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-3 px-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/30 transition-all"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2 ml-1" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-3 px-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/30 transition-all"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2 ml-1">
                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500" htmlFor="password">
                  {view === 'login' ? 'Password' : 'Create a Password'}
                </label>
                {view === 'login' && (
                  <button type="button" className="text-[10px] font-bold text-zinc-400 hover:text-green-500 uppercase tracking-tighter">Forgot?</button>
                )}
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-3 px-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/30 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                >
                  <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-sm`}></i>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-500 text-black font-black py-4 rounded-xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl disabled:opacity-50 disabled:scale-100 mt-6"
            >
              {isLoading ? (
                <i className="fa-solid fa-circle-notch animate-spin text-xl"></i>
              ) : (
                view === 'login' ? 'Log In' : 'Sign Up'
              )}
            </button>
          </form>

          <p className="text-zinc-500 text-xs mt-10 text-center">
            {view === 'login' ? "Don't have an account?" : "Already have an account?"} {' '}
            <span 
              onClick={() => setView(view === 'login' ? 'signup' : 'login')}
              className="text-white font-bold hover:underline cursor-pointer"
            >
              {view === 'login' ? 'Sign up free' : 'Log in here'}
            </span>
          </p>
        </div>
      )}
      
      <div className="absolute bottom-6 flex flex-col items-center gap-2 opacity-30 select-none">
        <div className="text-zinc-500 text-[10px] font-black tracking-[0.3em]">SECURED BY GEMINI AI</div>
        <div className="flex gap-2 text-[8px] text-zinc-600 font-bold uppercase tracking-widest">
          <span>Privacy</span>
          <span>•</span>
          <span>Security</span>
          <span>•</span>
          <span>Cookie Policy</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
