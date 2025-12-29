
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { UserProfile } from './types';
import { Button, Input, TrustBadge } from './components/UI';
import { BasicProfile, WorkDetails, CreditConsent } from './components/OnboardingFlow';
import { Processing, Offers, OfferDetails, Documents, Handoff } from './components/LoanFlow';
import { DashboardHome, SupportChat, UserProfileScreen, CreditHealthScreen } from './components/Dashboard';

// --- Screen 0: Splash ---
const Splash = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => navigate('/login'), 2500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="h-screen w-full bg-rupivo-primary flex flex-col items-center justify-center text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-800 to-transparent opacity-50"></div>

      <div className="relative z-10 flex flex-col items-center animate-fade-in-up">
        <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-2xl shadow-blue-900/50">
          <span className="text-4xl font-display font-bold text-rupivo-primary">R</span>
        </div>
        <h1 className="text-4xl font-display font-bold tracking-tight mb-2">RUPIVO</h1>
        <p className="text-blue-200 text-sm font-medium tracking-wide">SMART PERSONAL LOANS</p>
      </div>

      <div className="absolute bottom-10 text-xs text-blue-300/60">
        Bank-grade Security • RBI Regulated
      </div>
    </div>
  );
};

// --- Screen 1: Login ---
const Login = () => {
  const navigate = useNavigate();
  const [mobile, setMobile] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  const handleSendOtp = () => {
    if (mobile.length === 10) setOtpSent(true);
  };

  const handleVerify = () => {
    if (otp.length === 4) navigate('/profile-basic');
  };

  return (
    <div className="min-h-screen bg-white px-6 flex flex-col pt-20">
      <div className="mb-10">
        <div className="w-12 h-12 bg-rupivo-primary rounded-lg flex items-center justify-center text-white font-bold font-display text-xl mb-6">R</div>
        <h2 className="text-3xl font-display font-bold text-rupivo-dark mb-2">Welcome Back</h2>
        <p className="text-slate-500">Secure login to your financial hub.</p>
      </div>

      {!otpSent ? (
        <div className="space-y-6">
          <Input
            label="Mobile Number"
            placeholder="98765 43210"
            type="tel"
            maxLength={10}
            value={mobile}
            onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
          />
          <Button onClick={handleSendOtp} disabled={mobile.length !== 10}>Get OTP</Button>
        </div>
      ) : (
        <div className="space-y-6 animate-fade-in">
          <div>
            <div className="flex justify-between items-baseline mb-1">
              <label className="block text-sm font-medium text-slate-700 ml-1">Enter OTP</label>
              <button className="text-xs text-rupivo-accent font-medium" onClick={() => setOtpSent(false)}>Edit Number</button>
            </div>
            <input
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-center text-2xl tracking-widest font-bold focus:outline-none focus:ring-2 focus:ring-rupivo-accent"
              placeholder="••••"
              maxLength={4}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <p className="text-xs text-slate-400 mt-2 text-center">Auto-reading OTP...</p>
          </div>
          <Button onClick={handleVerify} disabled={otp.length !== 4}>Verify & Login</Button>
        </div>
      )}

      <div className="flex-1"></div>
      <TrustBadge text="We work only with RBI-regulated lenders" />
      <div className="h-8"></div>
    </div>
  );
};

const App = () => {
  // Shared state for the application flow
  const [user, setUser] = useState<UserProfile>({
    mobile: '',
    pan: '',
    isPanVerified: false,
    verifiedName: '',
    employmentType: null,
    monthlyIncome: '',
    isIncomeVerified: false,
    city: '',
    pincode: '',
    isAadhaarVerified: false,
    isSelfieVerified: false
  });

  const updateUser = (data: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...data }));
  };

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/login" element={<Login />} />

        {/* Onboarding Flow */}
        <Route path="/profile-basic" element={<BasicProfile user={user} updateUser={updateUser} />} />
        <Route path="/work-details" element={<WorkDetails user={user} updateUser={updateUser} />} />
        <Route path="/credit-consent" element={<CreditConsent />} />

        {/* Loan Flow */}
        <Route path="/processing" element={<Processing />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/offer-details" element={<OfferDetails />} />
        <Route path="/documents" element={<Documents user={user} updateUser={updateUser} />} />
        <Route path="/handoff" element={<Handoff />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<DashboardHome />} />
        <Route path="/credit-health" element={<CreditHealthScreen />} />
        <Route path="/support" element={<SupportChat />} />
        <Route path="/profile" element={<UserProfileScreen />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
