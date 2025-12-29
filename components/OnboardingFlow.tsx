import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Select, ProgressBar, Header, TrustBadge } from './UI';
import { UserProfile, EmploymentType } from '../../rupivo Cus_final app version/types';
import { CheckSquare, Square, CreditCard, MapPin, Briefcase, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface Props {
  user: UserProfile;
  updateUser: (data: Partial<UserProfile>) => void;
}

export const BasicProfile: React.FC<Props> = ({ user, updateUser }) => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [verifyingPan, setVerifyingPan] = useState(false);

  const validatePAN = (pan: string) => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan);
  };

  const handlePanChange = async (val: string) => {
    const upperVal = val.toUpperCase();
    updateUser({ pan: upperVal, isPanVerified: false, verifiedName: '' });
    if (errors.pan) setErrors({ ...errors, pan: '' });

    // Auto-trigger verification if 10 chars
    if (validatePAN(upperVal)) {
      setVerifyingPan(true);
      // Simulate API Call
      setTimeout(() => {
        setVerifyingPan(false);
        updateUser({
          pan: upperVal,
          isPanVerified: true,
          verifiedName: 'RAHUL SHARMA'
        });
      }, 1500);
    }
  };

  const handleNext = () => {
    const newErrors: { [key: string]: string } = {};

    if (!user.pan || !validatePAN(user.pan)) {
      newErrors.pan = "Please enter a valid PAN Number (e.g. ABCDE1234F)";
    }
    if (!user.monthlyIncome) newErrors.income = "Required";
    if (!user.city) newErrors.city = "Required";
    if (!user.pincode || user.pincode.length !== 6) newErrors.pincode = "Invalid Pincode";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      navigate('/work-details');
    }
  };

  return (
    <div className="min-h-screen pt-16 pb-6 px-6 flex flex-col bg-white">
      <Header />
      <ProgressBar current={1} total={4} />

      <div className="mb-6">
        <h2 className="text-2xl font-display font-bold text-rupivo-dark mb-2">Tell us about yourself</h2>
        <p className="text-slate-500 text-sm">We verify your PAN via NSDL to fetch accurate offers.</p>
      </div>

      <div className="space-y-6 flex-1">
        {/* Financial Details Section */}
        <div className="space-y-5">
          <div>
            <div className="relative">
              <Input
                label="PAN Number"
                placeholder="ABCDE1234F"
                value={user.pan}
                maxLength={10}
                disabled={verifyingPan}
                className={`uppercase font-medium tracking-wide ${errors.pan ? 'border-red-300 focus:ring-red-200' : ''} ${user.isPanVerified ? 'border-green-500 bg-green-50/30' : ''}`}
                onChange={(e) => handlePanChange(e.target.value)}
              />
              <div className="absolute right-4 top-[38px] pointer-events-none">
                {verifyingPan ? (
                  <Loader2 className="w-5 h-5 text-rupivo-primary animate-spin" />
                ) : user.isPanVerified ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <CreditCard className="w-5 h-5 text-slate-400" />
                )}
              </div>
            </div>

            {/* PAN Verification Status */}
            {user.isPanVerified && (
              <div className="flex items-center gap-2 mt-[-10px] ml-1 animate-fade-in">
                <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold uppercase tracking-wide">
                  Verified
                </span>
                <span className="text-xs text-slate-600 font-medium">
                  {user.verifiedName}
                </span>
              </div>
            )}
            {errors.pan && <p className="text-red-500 text-xs mt-1 ml-1">{errors.pan}</p>}
          </div>

          <Select
            label="Monthly Income"
            value={user.monthlyIncome}
            onChange={(e) => updateUser({ monthlyIncome: e.target.value })}
            options={['₹15,000 - ₹25,000', '₹25,000 - ₹50,000', '₹50,000 - ₹1,00,000', 'Above ₹1,00,000']}
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <Input
                label="City"
                placeholder="Mumbai"
                value={user.city}
                onChange={(e) => updateUser({ city: e.target.value })}
              />
              <MapPin className="absolute right-4 top-[38px] w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
            <Input
              label="Pincode"
              placeholder="400001"
              type="tel"
              maxLength={6}
              value={user.pincode}
              onChange={(e) => updateUser({ pincode: e.target.value })}
            />
          </div>
        </div>

        {/* Employment Type Section */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 ml-1">Employment Type</label>
          <div className="grid grid-cols-2 gap-4">
            {[EmploymentType.SALARIED, EmploymentType.SELF_EMPLOYED].map((type) => (
              <button
                key={type}
                onClick={() => updateUser({ employmentType: type })}
                className={`py-4 px-4 rounded-xl border text-sm font-semibold transition-all flex flex-col items-center gap-2 ${user.employmentType === type
                    ? 'border-rupivo-primary bg-blue-50 text-rupivo-primary shadow-sm'
                    : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
                  }`}
              >
                <Briefcase className={`w-5 h-5 ${user.employmentType === type ? 'text-rupivo-primary' : 'text-slate-400'}`} />
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 pt-4 border-t border-slate-100">
        <Button onClick={handleNext} disabled={!user.employmentType || !user.isPanVerified}>
          Next Step
        </Button>
      </div>
    </div>
  );
};

export const WorkDetails: React.FC<Props> = ({ user, updateUser }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-16 pb-6 px-6 flex flex-col bg-white">
      <Header showBack onBack={() => navigate(-1)} />
      <ProgressBar current={2} total={4} />

      <h2 className="text-2xl font-display font-bold text-rupivo-dark mb-2">Work Details</h2>
      <p className="text-slate-500 mb-8">Lenders require this to verify stability.</p>

      <div className="space-y-4 flex-1">
        {user.employmentType === EmploymentType.SALARIED ? (
          <>
            <Input
              label="Employer Name"
              placeholder="e.g. TCS, HDFC Bank"
              value={user.employerName || ''}
              onChange={(e) => updateUser({ employerName: e.target.value })}
            />
            <Select
              label="Job Type"
              value={user.jobType || ''}
              onChange={(e) => updateUser({ jobType: e.target.value })}
              options={['Private Limited', 'Public Sector / Govt', 'MNC', 'Partnership / LLP']}
            />
            <Select
              label="Salary Mode"
              value="" // Mock
              onChange={() => { }}
              options={['Bank Transfer', 'Cheque', 'Cash']}
            />
            <Select
              label="Total Work Experience"
              value={user.workExperience || ''}
              onChange={(e) => updateUser({ workExperience: e.target.value })}
              options={['Less than 1 year', '1-3 years', '3-5 years', '5+ years']}
            />
          </>
        ) : (
          <>
            <Select
              label="Business Type"
              value={user.businessType || ''}
              onChange={(e) => updateUser({ businessType: e.target.value })}
              options={['Retail Shop', 'Wholesale', 'Manufacturing', 'Services / Consulting', 'Freelance']}
            />
            <Select
              label="Business Vintage (Age)"
              value={user.vintage || ''}
              onChange={(e) => updateUser({ vintage: e.target.value })}
              options={['Less than 1 year', '1-3 years', '3+ years']}
            />
          </>
        )}
      </div>

      <div className="mt-6">
        <Button onClick={() => navigate('/credit-consent')}>
          Next Step
        </Button>
      </div>
    </div>
  );
};

export const CreditConsent: React.FC = () => {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="min-h-screen pt-16 pb-6 px-6 flex flex-col">
      <Header showBack onBack={() => navigate(-1)} />
      <ProgressBar current={3} total={4} />

      <h2 className="text-2xl font-display font-bold text-rupivo-dark mb-6">One final check</h2>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm mb-6">
        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-2xl">
          🔍
        </div>
        <h3 className="text-lg font-bold text-rupivo-dark mb-2">We check your eligibility</h3>
        <p className="text-slate-600 leading-relaxed text-sm">
          RUPIVO will use your PAN to check your credit report to find the best lender match. This is a soft inquiry and has <strong>no impact</strong> on your credit score.
        </p>
      </div>

      <div className="flex-1"></div>

      <div
        className="flex gap-3 mb-6 cursor-pointer"
        onClick={() => setAgreed(!agreed)}
      >
        <div className={`mt-0.5 ${agreed ? 'text-rupivo-accent' : 'text-slate-300'}`}>
          {agreed ? <CheckSquare className="w-6 h-6" /> : <Square className="w-6 h-6" />}
        </div>
        <p className="text-xs text-slate-500 leading-tight select-none">
          I hereby appoint RUPIVO as my authorized representative to receive my credit information from CIBIL/Experian for the purpose of loan eligibility.
        </p>
      </div>

      <Button disabled={!agreed} onClick={() => navigate('/processing')}>
        Check Eligibility
      </Button>

      <TrustBadge />
    </div>
  );
};