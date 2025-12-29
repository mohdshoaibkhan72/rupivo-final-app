import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Header, TrustBadge, ProgressBar } from './UI';
import { LoanOffer, UserProfile } from '../types';
import { ShieldCheck, ChevronRight, UploadCloud, CheckCircle, Clock, ArrowUpDown, Zap, Loader2, Landmark, ScanFace, Lock, X, CreditCard, Camera } from 'lucide-react';
import { mockOffers } from '../constants';

// --- Screen 5: Processing ---
export const Processing: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/offers');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-50 to-transparent opacity-50"></div>

      <div className="relative">
        <div className="w-24 h-24 border-4 border-slate-100 border-t-rupivo-accent rounded-full animate-spin mb-8 mx-auto"></div>
        <div className="w-16 h-16 bg-white rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center font-bold text-rupivo-primary text-xl">
          R
        </div>
      </div>

      <h2 className="text-2xl font-display font-bold text-rupivo-dark mb-3">Verifying details...</h2>
      <p className="text-slate-500 mb-8 max-w-xs mx-auto">RUPIVO is fetching your CIBIL score and matching with RBI-regulated partners.</p>

      <div className="bg-slate-50 py-2 px-4 rounded-lg flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-slate-400" />
        <span className="text-xs text-slate-500 font-medium">Secure 256-bit Encrypted Check</span>
      </div>
    </div>
  );
};

// --- Screen 6: Offers ---
export const Offers: React.FC = () => {
  const navigate = useNavigate();
  const [sortType, setSortType] = useState<'recommended' | 'interest' | 'amount' | 'tenure'>('recommended');

  const getSortedOffers = () => {
    const sorted = [...mockOffers];
    switch (sortType) {
      case 'interest':
        return sorted.sort((a, b) => a.minInterest - b.minInterest);
      case 'amount':
        return sorted.sort((a, b) => b.maxAmount - a.maxAmount);
      case 'tenure':
        return sorted.sort((a, b) => b.maxTenure - a.maxTenure);
      default:
        // Default sort: Recommended first
        return sorted.sort((a, b) => (a.isRecommended === b.isRecommended ? 0 : a.isRecommended ? -1 : 1));
    }
  };

  const currentOffers = getSortedOffers();
  const primaryOffer = currentOffers[0];
  const secondaryOffers = currentOffers.slice(1);

  return (
    <div className="min-h-screen bg-slate-50 pt-16 px-4 pb-6">
      <Header />

      {/* Sorting Controls */}
      <div className="flex items-center gap-2 mb-2 overflow-x-auto pb-2 no-scrollbar">
        <div className="flex items-center gap-1 text-xs font-medium text-slate-400 whitespace-nowrap mr-1">
          <ArrowUpDown className="w-3 h-3" /> Sort by:
        </div>
        {[
          { id: 'recommended', label: 'Recommended' },
          { id: 'interest', label: 'Lowest Rate' },
          { id: 'amount', label: 'Max Amount' },
          { id: 'tenure', label: 'Longest Tenure' }
        ].map(opt => (
          <button
            key={opt.id}
            onClick={() => setSortType(opt.id as any)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all border ${sortType === opt.id
              ? 'bg-rupivo-dark text-white border-rupivo-dark shadow-md'
              : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
              }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="mb-4 flex items-center gap-2">
        <CheckCircle className="w-5 h-5 text-green-500" />
        <h2 className="text-lg font-bold text-rupivo-dark">
          {sortType === 'recommended' ? 'Best Match for You' : `${currentOffers.length} Offers Found`}
        </h2>
      </div>

      {/* Primary Offer Card */}
      {primaryOffer && (
        <div className="bg-white rounded-2xl p-1 shadow-lg shadow-blue-900/5 border border-blue-100 mb-6 transform transition-all active:scale-[0.99]">
          <div className="bg-gradient-to-br from-rupivo-primary to-blue-800 rounded-xl p-5 text-white relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>

            <div className="flex justify-between items-start mb-6">
              <div className="flex flex-col items-start gap-3">
                {primaryOffer.isRecommended ? (
                  <span className="bg-teal-500/20 text-teal-200 border border-teal-500/30 text-[10px] uppercase font-bold tracking-wider py-1 px-2 rounded flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Recommended by RUPIVO
                  </span>
                ) : (
                  <span className="bg-white/10 text-white border border-white/20 text-[10px] uppercase font-bold tracking-wider py-1 px-2 rounded">Partner Offer</span>
                )}
                <div className="flex items-center gap-3">
                  <div className="bg-white p-1 rounded-lg h-10 w-10 flex items-center justify-center shrink-0">
                    <img src={primaryOffer.logo} alt={primaryOffer.lenderName} className="h-full w-full object-contain" />
                  </div>
                  <h3 className="text-xl font-bold text-white leading-tight">
                    {primaryOffer.lenderName}
                  </h3>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-blue-200 text-sm mb-1">Loan Amount</p>
              <h3 className="text-3xl font-bold font-display">
                ₹{(primaryOffer.minAmount / 1000).toFixed(0)}K - ₹{(primaryOffer.maxAmount / 100000).toFixed(1)}L
              </h3>
            </div>

            <div className="flex justify-between items-end mb-6">
              <div>
                <p className="text-blue-200 text-xs mb-1">Tenure</p>
                <p className="font-semibold">{primaryOffer.minTenure} - {primaryOffer.maxTenure} Months</p>
              </div>
              <div className="text-right">
                <p className="text-blue-200 text-xs mb-1">Interest</p>
                <p className="font-semibold">{primaryOffer.minInterest}% p.a.</p>
              </div>
            </div>

            <Button variant="primary" className="bg-white text-rupivo-primary hover:bg-slate-100 shadow-none w-full" onClick={() => navigate('/offer-details')}>
              View Details
            </Button>
          </div>
        </div>
      )}

      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 ml-1">Other Options</p>

      {/* Secondary Offers */}
      {secondaryOffers.map((offer) => (
        <div key={offer.id} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm mb-4 flex flex-col">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white border border-slate-100 p-1 flex items-center justify-center overflow-hidden">
                <img src={offer.logo} alt={offer.lenderName} className="h-full w-full object-contain" />
              </div>
              <h4 className="font-bold text-rupivo-dark">{offer.lenderName}</h4>
            </div>
            {offer.tag === 'Fastest Approval' ? (
              <span className="text-[10px] bg-orange-50 text-orange-600 border border-orange-100 px-2 py-1 rounded-full font-bold flex items-center gap-1">
                <Zap className="w-3 h-3 fill-current" /> Fastest Approval
              </span>
            ) : (
              offer.tag && <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded font-medium">{offer.tag}</span>
            )}
          </div>

          <div className="flex justify-between mb-4 text-sm">
            <div>
              <p className="text-slate-400 text-xs">Max Amount</p>
              <p className="font-bold text-slate-700">₹{(offer.maxAmount / 100000).toFixed(1)} Lakhs</p>
            </div>
            <div className="text-right">
              <p className="text-slate-400 text-xs">Interest</p>
              <p className="font-bold text-slate-700">{offer.minInterest}% p.a.</p>
            </div>
          </div>

          <button className="text-rupivo-accent text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all" onClick={() => navigate('/offer-details')}>
            Check Eligibility <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

// --- Screen 7: Offer Details ---
export const OfferDetails: React.FC = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState(200000);
  const [tenure, setTenure] = useState(24); // Months
  const interestRate = 12.5; // Fixed for demo

  // Simple EMI Calc
  const r = interestRate / 12 / 100;
  const emi = Math.round((amount * r * Math.pow(1 + r, tenure)) / (Math.pow(1 + r, tenure) - 1));

  return (
    <div className="min-h-screen pt-16 pb-32 px-6 flex flex-col bg-white">
      <Header showBack onBack={() => navigate(-1)} title="Customize Your Loan" />

      <div className="bg-rupivo-primary text-white p-6 rounded-2xl shadow-xl shadow-blue-900/20 mb-8 mt-2 text-center">
        <p className="text-blue-200 text-sm mb-1">Your Monthly EMI</p>
        <h2 className="text-4xl font-display font-bold mb-4">₹{emi.toLocaleString('en-IN')}</h2>
        <div className="inline-flex items-center gap-2 bg-blue-800/50 px-3 py-1 rounded-full text-xs">
          <span className="w-2 h-2 rounded-full bg-teal-400"></span>
          @ {interestRate}% Interest p.a.
        </div>
      </div>

      {/* Sliders */}
      <div className="space-y-8 mb-8">
        <div>
          <div className="flex justify-between mb-4">
            <label className="text-sm font-medium text-slate-500">Loan Amount</label>
            <span className="text-lg font-bold text-rupivo-dark">₹{amount.toLocaleString('en-IN')}</span>
          </div>
          <input
            type="range" min="50000" max="500000" step="10000"
            value={amount} onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-rupivo-accent"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-2">
            <span>₹50k</span>
            <span>₹5L</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-4">
            <label className="text-sm font-medium text-slate-500">Tenure</label>
            <span className="text-lg font-bold text-rupivo-dark">{tenure} Months</span>
          </div>
          <input
            type="range" min="6" max="48" step="6"
            value={tenure} onChange={(e) => setTenure(Number(e.target.value))}
            className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-rupivo-accent"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-2">
            <span>6M</span>
            <span>48M</span>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 p-4 rounded-xl mb-4 border border-slate-100">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-slate-500">Processing Fee</span>
          <span className="font-semibold">₹{(amount * 0.02).toLocaleString('en-IN')}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Disbursal Amount</span>
          <span className="font-semibold text-green-600">₹{(amount - (amount * 0.02)).toLocaleString('en-IN')}</span>
        </div>
      </div>

      <div className="flex-1"></div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-slate-100">
        <div className="flex items-start gap-3 mb-4 bg-slate-50 p-3 rounded-xl">
          <ShieldCheck className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-500 leading-relaxed">
            <strong>No Platform Fees:</strong> RUPIVO does not charge any fees. All processing fees are charged directly by the lending partner.
          </p>
        </div>
        <Button onClick={() => navigate('/documents')}>Confirm & Proceed</Button>
      </div>
    </div>
  );
};

// --- Screen 8: Documents (Modified for API Integration) ---
interface DocumentProps {
  user: UserProfile;
  updateUser: (data: Partial<UserProfile>) => void;
}

export const Documents: React.FC<DocumentProps> = ({ user, updateUser }) => {
  const navigate = useNavigate();
  const [modalType, setModalType] = useState<'aadhaar' | 'bank' | 'selfie' | null>(null);
  const [loading, setLoading] = useState(false);
  const [verifyingPan, setVerifyingPan] = useState(false);

  // Digilocker Simulation
  const handleDigilocker = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      updateUser({ isAadhaarVerified: true });
      setModalType(null);
    }, 2000);
  };

  // Bank Statement API Simulation
  const handleBankFetch = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      updateUser({ isIncomeVerified: true });
      setModalType(null);
    }, 2000);
  };

  // Selfie Simulation
  const handleSelfieCapture = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      updateUser({ isSelfieVerified: true });
      setModalType(null);
    }, 2000);
  };

  // Recovery for PAN if state was lost
  const handleVerifyPan = () => {
    setVerifyingPan(true);
    setTimeout(() => {
      setVerifyingPan(false);
      updateUser({ isPanVerified: true, verifiedName: 'RAHUL SHARMA', pan: 'ABCDE1234F' });
    }, 1500);
  };

  const isComplete = user.isPanVerified && user.isAadhaarVerified && user.isIncomeVerified && user.isSelfieVerified;

  return (
    <div className="min-h-screen pt-16 pb-6 px-6 flex flex-col bg-slate-50 relative">
      <Header title="Verify Identity" showBack onBack={() => navigate(-1)} />
      <ProgressBar current={4} total={4} />

      <p className="text-slate-500 mb-6 text-sm">Complete digital verification to get instant approval from <strong>CredPrime Bank</strong>.</p>

      <div className="space-y-4">
        {/* PAN Card - Dynamic Verification */}
        <div className={`bg-white p-4 rounded-xl border shadow-sm flex items-center justify-between ${user.isPanVerified ? 'border-green-200' : 'border-slate-100'}`}>
          <div>
            <h4 className="font-bold text-rupivo-dark flex items-center gap-2">
              PAN Card
              {user.isPanVerified ? (
                <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded uppercase">Verified</span>
              ) : (
                <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded uppercase">Pending</span>
              )}
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              {user.isPanVerified ? 'Verified via PAN API' : 'Instant API Check'}
            </p>
          </div>
          {user.isPanVerified ? (
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
              <CheckCircle className="w-6 h-6" />
            </div>
          ) : (
            <button
              onClick={handleVerifyPan}
              disabled={verifyingPan}
              className="px-4 py-2 bg-rupivo-primary text-white text-xs font-bold rounded-lg hover:bg-blue-800 transition-colors flex items-center gap-1"
            >
              {verifyingPan ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Verify'}
            </button>
          )}
        </div>

        {/* Aadhaar - Digilocker */}
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="font-bold text-rupivo-dark">Aadhaar Card</h4>
              <p className="text-xs text-slate-400">Verified via Digilocker API</p>
            </div>
            {user.isAadhaarVerified ? (
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                <CheckCircle className="w-6 h-6" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                <ScanFace className="w-5 h-5" />
              </div>
            )}
          </div>
          {!user.isAadhaarVerified && (
            <button
              onClick={() => setModalType('aadhaar')}
              className="w-full py-2 bg-blue-50 text-rupivo-primary text-sm font-bold rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/23/DigiLocker_logo.png" alt="Digilocker" className="h-4 object-contain" />
              Connect Digilocker
            </button>
          )}
        </div>

        {/* Selfie Verification */}
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="font-bold text-rupivo-dark">Selfie Verification</h4>
              <p className="text-xs text-slate-400">Live Face Check</p>
            </div>
            {user.isSelfieVerified ? (
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                <CheckCircle className="w-6 h-6" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                <Camera className="w-5 h-5" />
              </div>
            )}
          </div>
          {!user.isSelfieVerified && (
            <button
              onClick={() => setModalType('selfie')}
              className="w-full py-2 bg-slate-50 text-slate-700 text-sm font-bold rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
            >
              <Camera className="w-4 h-4" />
              Take Selfie
            </button>
          )}
        </div>

        {/* Income - Bank API */}
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="font-bold text-rupivo-dark">Bank Statement</h4>
              <p className="text-xs text-slate-400">Verified via Bank Statement API</p>
            </div>
            {user.isIncomeVerified ? (
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                <CheckCircle className="w-6 h-6" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                <Landmark className="w-5 h-5" />
              </div>
            )}
          </div>
          {!user.isIncomeVerified && (
            <button
              onClick={() => setModalType('bank')}
              className="w-full py-2 bg-slate-50 text-slate-700 text-sm font-bold rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
            >
              <Landmark className="w-4 h-4" />
              Fetch from Bank
            </button>
          )}
        </div>
      </div>

      <div className="flex-1"></div>

      <div className="flex items-center justify-center gap-2 mb-4">
        <Lock className="w-3 h-3 text-slate-400" />
        <span className="text-[10px] text-slate-400">Your data is encrypted & shared only with CredPrime</span>
      </div>

      <Button disabled={!isComplete} onClick={() => navigate('/handoff')}>
        Complete Application
      </Button>

      {/* Modals */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl relative">
            <button onClick={() => setModalType(null)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>

            {modalType === 'aadhaar' && (
              <div className="text-center">
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/23/DigiLocker_logo.png" alt="Digilocker" className="h-8 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-rupivo-dark mb-2">Digilocker Verification</h3>
                <p className="text-sm text-slate-500 mb-6">We will send an OTP to the mobile number linked with your Aadhaar.</p>

                {loading ? (
                  <div className="flex flex-col items-center py-4">
                    <Loader2 className="w-8 h-8 animate-spin text-rupivo-primary mb-2" />
                    <span className="text-xs font-medium text-slate-500">Verifying OTP...</span>
                  </div>
                ) : (
                  <Button onClick={handleDigilocker}>Send OTP</Button>
                )}
              </div>
            )}

            {modalType === 'bank' && (
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-rupivo-primary">
                  <Landmark className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-rupivo-dark mb-2">Connect Bank Account</h3>
                <p className="text-sm text-slate-500 mb-6">Select your primary bank account to fetch the last 3 months statement securely.</p>

                {loading ? (
                  <div className="flex flex-col items-center py-4">
                    <Loader2 className="w-8 h-8 animate-spin text-rupivo-primary mb-2" />
                    <span className="text-xs font-medium text-slate-500">Fetching Statement...</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <button onClick={handleBankFetch} className="w-full p-3 border border-slate-200 rounded-xl flex items-center gap-3 hover:bg-slate-50 font-medium text-sm">
                      <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white text-[8px] font-bold">H</div>
                      HDFC Bank
                    </button>
                    <button onClick={handleBankFetch} className="w-full p-3 border border-slate-200 rounded-xl flex items-center gap-3 hover:bg-slate-50 font-medium text-sm">
                      <div className="w-6 h-6 bg-blue-800 rounded-full flex items-center justify-center text-white text-[8px] font-bold">S</div>
                      SBI Bank
                    </button>
                    <button onClick={handleBankFetch} className="w-full p-3 border border-slate-200 rounded-xl flex items-center gap-3 hover:bg-slate-50 font-medium text-sm">
                      <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center text-white text-[8px] font-bold">I</div>
                      ICICI Bank
                    </button>
                  </div>
                )}
              </div>
            )}

            {modalType === 'selfie' && (
              <div className="text-center">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-700">
                  <Camera className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-rupivo-dark mb-2">Take a Selfie</h3>
                <p className="text-sm text-slate-500 mb-6">Make sure your face is clearly visible and well-lit.</p>

                {loading ? (
                  <div className="flex flex-col items-center py-4">
                    <Loader2 className="w-8 h-8 animate-spin text-rupivo-primary mb-2" />
                    <span className="text-xs font-medium text-slate-500">Processing Face Match...</span>
                  </div>
                ) : (
                  <Button onClick={handleSelfieCapture}>Capture Selfie</Button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// --- Screen 9 & 10: Handoff & Status ---
export const Handoff: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => {
      navigate('/dashboard');
    }, 4000);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center">
      <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 animate-pulse">
        <ShieldCheck className="w-10 h-10 text-green-600" />
      </div>
      <h2 className="text-xl font-bold font-display text-rupivo-dark mb-2">Securely redirecting...</h2>
      <p className="text-slate-500 mb-8">We are connecting you to CredPrime Bank to complete the loan agreement.</p>

      <div className="bg-slate-50 rounded-lg p-4 w-full max-w-xs border border-slate-100">
        <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-2">Next Steps</p>
        <div className="flex items-center gap-3 text-left mb-2">
          <Clock className="w-4 h-4 text-orange-500" />
          <span className="text-sm text-slate-700">e-Sign Agreement</span>
        </div>
        <div className="flex items-center gap-3 text-left">
          <Clock className="w-4 h-4 text-orange-500" />
          <span className="text-sm text-slate-700">Amount Disbursement</span>
        </div>
      </div>
    </div>
  );
};