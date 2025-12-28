import React from 'react';
import { Loader2, CheckCircle2, ShieldCheck } from 'lucide-react';

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'outline' | 'ghost'; loading?: boolean }> = ({ 
  className = '', 
  variant = 'primary', 
  children, 
  disabled,
  loading = false,
  ...props 
}) => {
  const baseStyle = "w-full py-3.5 px-6 rounded-xl font-display font-semibold transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    primary: "bg-rupivo-accent text-white shadow-lg shadow-teal-500/20 hover:bg-teal-600",
    outline: "border-2 border-rupivo-primary text-rupivo-primary hover:bg-blue-50",
    ghost: "text-slate-500 hover:text-slate-700 bg-transparent"
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} disabled={disabled || loading} {...props}>
      {loading ? <div className="flex items-center justify-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Please wait...</div> : children}
    </button>
  );
};

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, className = '', ...props }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">{label}</label>
    <input 
      className={`w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-rupivo-accent focus:border-transparent transition-all placeholder:text-slate-400 ${className}`}
      {...props} 
    />
  </div>
);

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label: string; options: string[] }> = ({ label, options, className = '', ...props }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">{label}</label>
    <div className="relative">
      <select 
        className={`w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-rupivo-accent focus:border-transparent appearance-none transition-all ${className}`}
        {...props}
      >
        <option value="" disabled>Select option</option>
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </div>
    </div>
  </div>
);

export const TrustBadge: React.FC<{ text?: string }> = ({ text = "RBI-Regulated Partners Only" }) => (
  <div className="flex items-center justify-center gap-1.5 py-2 px-3 bg-blue-50 rounded-full w-fit mx-auto mt-4">
    <ShieldCheck className="w-4 h-4 text-rupivo-primary" />
    <span className="text-xs font-medium text-rupivo-primary">{text}</span>
  </div>
);

export const ProgressBar: React.FC<{ current: number; total: number }> = ({ current, total }) => (
  <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden mb-6">
    <div 
      className="h-full bg-rupivo-accent transition-all duration-500 ease-out" 
      style={{ width: `${(current / total) * 100}%` }}
    />
  </div>
);

export const Header: React.FC<{ title?: string; showBack?: boolean; onBack?: () => void }> = ({ title, showBack, onBack }) => (
  <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-10 border-b border-slate-100 px-4 h-14 flex items-center">
    {showBack && (
      <button onClick={onBack} className="mr-3 p-1 rounded-full hover:bg-slate-100">
        <svg className="w-6 h-6 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
      </button>
    )}
    {title ? (
      <h1 className="text-lg font-display font-bold text-rupivo-dark">{title}</h1>
    ) : (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-rupivo-primary rounded-lg flex items-center justify-center text-white font-bold font-display">R</div>
        <span className="text-xl font-display font-bold text-rupivo-primary tracking-tight">RUPIVO</span>
      </div>
    )}
  </header>
);