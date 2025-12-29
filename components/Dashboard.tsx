import React, { useState, useEffect } from 'react';
import { Header } from './UI';
import { ApplicationStatus, ChatMessage } from '../types';
import { getSmartSupportResponse } from '../services/geminiService';
import { Home, MessageSquare, User, Send, ChevronRight, History, CreditCard, Shield, FileText, LogOut, Gauge, TrendingUp, AlertCircle, RefreshCw, CheckCircle2, AlertTriangle, ArrowUpRight, ShieldCheck, BarChart3, Lock, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TabBar: React.FC<{ active: string }> = ({ active }) => {
    const navigate = useNavigate();
    const tabs = [
        { id: 'dashboard', icon: Home, label: 'Home', path: '/dashboard' },
        { id: 'credit', icon: Gauge, label: 'Credit', path: '/credit-health' },
        { id: 'support', icon: MessageSquare, label: 'Support', path: '/support' },
        { id: 'profile', icon: User, label: 'Profile', path: '/profile' }
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 h-16 flex items-center justify-around px-2 z-20 safe-area-bottom">
            {tabs.map(t => (
                <button
                    key={t.id}
                    onClick={() => navigate(t.path)}
                    className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${active === t.id ? 'text-rupivo-primary' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    <t.icon className={`w-6 h-6 ${active === t.id ? 'fill-current opacity-20 stroke-[2.5px]' : ''}`} />
                    <span className="text-[10px] font-medium">{t.label}</span>
                </button>
            ))}
        </div>
    );
};

export const CreditHealthScreen: React.FC = () => {
    const targetScore = 785;
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState<'gauge' | 'history'>('gauge');

    useEffect(() => {
        // Animate score on mount
        let start = 0;
        const duration = 1500; // 1.5s
        const startTime = performance.now();

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const ease = 1 - Math.pow(1 - progress, 3);

            setScore(Math.floor(start + (targetScore - start) * ease));

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, []);

    const handleRefresh = () => {
        setLoading(true);
        setTimeout(() => setLoading(false), 2000);
    };

    // Gauge Calculation
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    // We only want a semi-circle (50%), but let's do a 220 degree arc for style
    const arcLength = circumference * (220 / 360);
    const strokeDashoffset = arcLength - (arcLength * ((score - 300) / 600)); // Normalize 300-900 range

    return (
        <div className="min-h-screen bg-slate-50 pt-16 pb-24 px-4">
            <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md z-10 border-b border-slate-100 px-4 h-14 flex items-center justify-between">
                <h1 className="text-lg font-display font-bold text-rupivo-dark">Credit Health</h1>
                <button
                    onClick={handleRefresh}
                    className={`p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-all ${loading ? 'animate-spin' : ''}`}
                >
                    <RefreshCw className="w-5 h-5" />
                </button>
            </header>

            {/* Main Gauge Card with Toggle */}
            <div className="bg-white rounded-3xl p-6 shadow-lg shadow-slate-200/50 border border-slate-100 mb-6 relative overflow-hidden transition-all">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-rupivo-accent to-transparent opacity-50"></div>

                {/* View Toggle */}
                <div className="flex justify-center mb-6">
                    <div className="bg-slate-100 p-1 rounded-xl flex">
                        <button
                            onClick={() => setViewMode('gauge')}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'gauge' ? 'bg-white text-rupivo-dark shadow-sm' : 'text-slate-500'}`}
                        >
                            Score
                        </button>
                        <button
                            onClick={() => setViewMode('history')}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'history' ? 'bg-white text-rupivo-dark shadow-sm' : 'text-slate-500'}`}
                        >
                            History
                        </button>
                    </div>
                </div>

                {viewMode === 'gauge' ? (
                    <div className="flex flex-col items-center animate-fade-in">
                        <div className="relative w-64 h-40 flex items-end justify-center mb-2">
                            {/* SVG Gauge */}
                            <svg className="w-full h-full overflow-visible" viewBox="0 0 200 120">
                                {/* Define Gradients */}
                                <defs>
                                    <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#ef4444" />
                                        <stop offset="50%" stopColor="#f59e0b" />
                                        <stop offset="100%" stopColor="#10b981" />
                                    </linearGradient>
                                </defs>
                                {/* Background Track */}
                                <path
                                    d="M 20 100 A 80 80 0 1 1 180 100"
                                    fill="none"
                                    stroke="#f1f5f9"
                                    strokeWidth="12"
                                    strokeLinecap="round"
                                />
                                {/* Value Arc */}
                                <path
                                    d="M 20 100 A 80 80 0 1 1 180 100"
                                    fill="none"
                                    stroke="url(#gaugeGradient)"
                                    strokeWidth="12"
                                    strokeLinecap="round"
                                    strokeDasharray={Math.PI * 160} // Full semi-circle length
                                    strokeDashoffset={(Math.PI * 160) * (1 - ((score - 300) / 600))} // Reveal based on score
                                    className="transition-all duration-1000 ease-out"
                                />
                            </svg>

                            {/* Score Text */}
                            <div className="absolute bottom-0 text-center flex flex-col items-center">
                                <div className="text-5xl font-display font-bold text-rupivo-dark tabular-nums tracking-tight">
                                    {score}
                                </div>
                                <div className={`text-sm font-bold px-3 py-1 rounded-full mt-1 flex items-center gap-1 ${score >= 750 ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'
                                    }`}>
                                    {score >= 750 ? 'Excellent' : 'Good'}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mt-4 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                            <TrendingUp className="w-4 h-4 text-green-500" />
                            <span className="text-xs text-slate-600 font-medium">Score is up <span className="text-green-600 font-bold">+15 points</span> from last month</span>
                        </div>
                    </div>
                ) : (
                    <div className="h-48 w-full flex items-end justify-between px-2 pt-4 pb-2 animate-fade-in">
                        {[
                            { m: 'Jun', s: 720 }, { m: 'Jul', s: 735 }, { m: 'Aug', s: 730 },
                            { m: 'Sep', s: 750 }, { m: 'Oct', s: 770 }, { m: 'Nov', s: 785 }
                        ].map((d, i) => {
                            const h = ((d.s - 600) / 300) * 100; // Normalize height
                            return (
                                <div key={i} className="flex flex-col items-center gap-2 group cursor-pointer w-1/6">
                                    <div className="relative w-full flex justify-center h-32 items-end">
                                        <div
                                            className={`w-3 rounded-t-full transition-all duration-500 group-hover:bg-rupivo-accent group-hover:w-4 ${i === 5 ? 'bg-rupivo-primary' : 'bg-slate-200'}`}
                                            style={{ height: `${h}%` }}
                                        ></div>
                                        {/* Tooltip on hover/active */}
                                        <div className="absolute -top-8 bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                                            {d.s}
                                        </div>
                                    </div>
                                    <span className={`text-[10px] font-bold ${i === 5 ? 'text-rupivo-dark' : 'text-slate-400'}`}>{d.m}</span>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* Loan Eligibility Power Card */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-5 border border-orange-100 mb-6 flex items-center justify-between shadow-sm">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Zap className="w-4 h-4 text-orange-500 fill-current" />
                        <h4 className="text-xs font-bold text-orange-700 uppercase tracking-wider">Loan Power</h4>
                    </div>
                    <p className="text-rupivo-dark font-bold text-lg leading-tight">You qualify for ₹10 Lakhs</p>
                    <p className="text-xs text-orange-800/70 mt-1 font-medium">Interest rates starting @ 10.99%</p>
                </div>
                <button className="bg-white text-orange-600 px-4 py-2 rounded-xl text-xs font-bold shadow-sm border border-orange-100">
                    View Offers
                </button>
            </div>

            {/* Detailed Insights - Enhanced */}
            <h3 className="font-bold text-lg text-rupivo-dark mb-4 px-1">Actionable Insights</h3>
            <div className="space-y-3 mb-8">
                {/* High Impact Insight */}
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex gap-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-red-50 rounded-bl-full -mr-8 -mt-8"></div>
                    <div className="bg-red-50 p-2.5 rounded-full h-fit shrink-0 z-10">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-1">
                            <h4 className="font-bold text-slate-800 text-sm">High Utilization</h4>
                            <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">Impact: High</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed mb-3">
                            Your HDFC Card utilization is <span className="font-bold text-slate-800">45%</span>. Paying down <span className="font-bold text-slate-800">₹15,000</span> can boost your score by <span className="text-green-600 font-bold">~20 points</span>.
                        </p>
                        <button className="text-xs font-bold text-white bg-rupivo-dark py-2 px-4 rounded-lg flex items-center gap-2 shadow-sm shadow-slate-200">
                            Pay Bill Now <ChevronRight className="w-3 h-3" />
                        </button>
                    </div>
                </div>

                {/* New: Simulator Insight */}
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-100 shadow-sm flex gap-4">
                    <div className="bg-white p-2.5 rounded-full h-fit shrink-0 shadow-sm">
                        <Zap className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                        <h4 className="font-bold text-indigo-900 text-sm mb-1">Score Simulator</h4>
                        <p className="text-xs text-indigo-800/80 leading-relaxed mb-2">
                            See how taking a new personal loan might affect your score before you apply.
                        </p>
                        <button className="text-xs font-bold text-indigo-700 flex items-center gap-1 hover:gap-2 transition-all">
                            Simulate Now <ChevronRight className="w-3 h-3" />
                        </button>
                    </div>
                </div>

                {/* On Track Insight */}
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex gap-4 opacity-80">
                    <div className="bg-green-50 p-2 rounded-full h-fit shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800 text-sm mb-1">Payment Streak</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                            Perfect! You've made 12/12 on-time payments. Keep this up for 3 more months to unlock lower interest rates.
                        </p>
                    </div>
                </div>
            </div>

            {/* Score Factors Grid */}
            <h3 className="font-bold text-lg text-rupivo-dark mb-4 px-1">Score Factors</h3>
            <div className="grid gap-3 mb-6">
                {[
                    { label: 'Payment History', value: '100%', impact: 'High', status: 'Excellent', icon: History, color: 'text-green-500', bg: 'bg-green-50' },
                    { label: 'Credit Utilization', value: '12%', impact: 'High', status: 'Excellent', icon: Gauge, color: 'text-green-500', bg: 'bg-green-50' },
                    { label: 'Credit Age', value: '4y 3m', impact: 'Medium', status: 'Good', icon: ArrowUpRight, color: 'text-blue-500', bg: 'bg-blue-50' },
                    { label: 'Total Accounts', value: '4 Active', impact: 'Low', status: 'Average', icon: FileText, color: 'text-orange-500', bg: 'bg-orange-50' }
                ].map((factor, i) => (
                    <div key={i} className="bg-white p-4 rounded-xl border border-slate-100 flex items-center justify-between shadow-sm active:scale-[0.99] transition-transform">
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full ${factor.bg} flex items-center justify-center`}>
                                <factor.icon className={`w-5 h-5 ${factor.color}`} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-rupivo-dark">{factor.label}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-xs font-semibold text-slate-900">{factor.value}</span>
                                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                    <span className={`text-[10px] font-bold uppercase tracking-wider ${factor.impact === 'High' ? 'text-red-500' : factor.impact === 'Medium' ? 'text-orange-500' : 'text-slate-400'
                                        }`}>{factor.impact} Impact</span>
                                </div>
                            </div>
                        </div>
                        {factor.status === 'Excellent' ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : factor.status === 'Good' ? (
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        ) : (
                            <AlertTriangle className="w-4 h-4 text-orange-400" />
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-6 text-center pb-8">
                <div className="flex items-center justify-center gap-2 text-slate-400 mb-2">
                    <Lock className="w-3 h-3" />
                    <span className="text-[10px] font-medium uppercase tracking-widest">Bank Grade Security</span>
                </div>
                <p className="text-[10px] text-slate-400">
                    Report provided by CIBIL • Updated today
                </p>
            </div>

            <TabBar active="credit" />
        </div>
    );
};

export const DashboardHome: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50 pt-16 pb-20 px-4">
            <Header />

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 mb-6">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Application Status</p>
                        <h2 className="text-xl font-bold text-rupivo-dark">In Progress</h2>
                    </div>
                    <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold">
                        Pending
                    </span>
                </div>

                <div className="space-y-6 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                    <div className="relative pl-8">
                        <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-green-500 border-2 border-white flex items-center justify-center text-white z-10">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm">Application Submitted</h4>
                        <p className="text-xs text-slate-500">To CredPrime Bank • Today</p>
                    </div>
                    <div className="relative pl-8">
                        <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-white border-2 border-rupivo-accent flex items-center justify-center z-10">
                            <div className="w-2 h-2 bg-rupivo-accent rounded-full"></div>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm">Lender Review</h4>
                        <p className="text-xs text-slate-500">Expected in 2 hours</p>
                    </div>
                    <div className="relative pl-8 opacity-50">
                        <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-slate-200 border-2 border-white z-10"></div>
                        <h4 className="font-bold text-slate-900 text-sm">Disbursement</h4>
                        <p className="text-xs text-slate-500">₹1,96,000</p>
                    </div>
                </div>
            </div>

            <div className="bg-blue-900 rounded-2xl p-6 text-white relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="font-bold text-lg mb-2">Need Help?</h3>
                    <p className="text-blue-200 text-sm mb-4">Chat with our Smart Assistant to understand your loan terms better.</p>
                    <button className="bg-white text-blue-900 py-2 px-4 rounded-lg text-sm font-bold">Start Chat</button>
                </div>
                <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4">
                    <MessageSquare className="w-32 h-32" />
                </div>
            </div>

            <TabBar active="dashboard" />
        </div>
    );
};

export const SupportChat: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: '1', role: 'model', text: 'Hello! I am RUPIVO\'s Smart Assistant. How can I help you with your loan application today?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        const replyText = await getSmartSupportResponse(input);

        const botMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: replyText };
        setMessages(prev => [...prev, botMsg]);
        setLoading(false);
    };

    return (
        <div className="flex flex-col h-screen bg-slate-50">
            <Header title="Smart Support" showBack={false} />

            <div className="flex-1 overflow-y-auto p-4 pt-20 pb-24 space-y-4 no-scrollbar">
                {messages.map(m => (
                    <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${m.role === 'user'
                            ? 'bg-rupivo-primary text-white rounded-br-none'
                            : 'bg-white border border-slate-100 text-slate-700 shadow-sm rounded-bl-none'
                            }`}>
                            {m.text}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-white border border-slate-100 p-3 rounded-2xl rounded-bl-none shadow-sm flex gap-1">
                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></span>
                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></span>
                        </div>
                    </div>
                )}
            </div>

            <div className="fixed bottom-16 left-0 right-0 p-4 bg-white border-t border-slate-200 flex gap-2">
                <input
                    className="flex-1 bg-slate-100 rounded-full px-4 py-2 focus:outline-none focus:ring-1 focus:ring-rupivo-primary"
                    placeholder="Ask about EMI, Interest, etc..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                />
                <button
                    onClick={handleSend}
                    disabled={!input.trim() || loading}
                    className="w-10 h-10 bg-rupivo-accent rounded-full flex items-center justify-center text-white disabled:opacity-50"
                >
                    <Send className="w-5 h-5" />
                </button>
            </div>

            <TabBar active="support" />
        </div>
    );
};

// Sub-components for Profile View
const PersonalDetailsView: React.FC<{ onBack: () => void }> = ({ onBack }) => (
    <div className="min-h-screen bg-slate-50 pt-16 px-4">
        <Header title="Personal Details" showBack onBack={onBack} />
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-6">
            <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                <p className="text-lg font-semibold text-rupivo-dark">Rahul Sharma</p>
            </div>
            <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mobile Number</label>
                <p className="text-lg font-semibold text-rupivo-dark">+91 98765 43210</p>
            </div>
            <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                <p className="text-lg font-semibold text-rupivo-dark">rahul.sharma@gmail.com</p>
            </div>
            <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Employment Type</label>
                <p className="text-lg font-semibold text-rupivo-dark">Salaried</p>
            </div>
            <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                    <ShieldCheck className="w-4 h-4 text-green-500" />
                    KYC Verified via Aadhaar & PAN
                </div>
            </div>
        </div>
    </div>
);

const LoanHistoryView: React.FC<{ onBack: () => void }> = ({ onBack }) => (
    <div className="min-h-screen bg-slate-50 pt-16 px-4">
        <Header title="Loan History" showBack onBack={onBack} />
        <div className="space-y-4">
            <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-rupivo-dark">CredPrime Bank</h4>
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded font-bold">Active</span>
                </div>
                <div className="flex justify-between text-sm mb-3">
                    <span className="text-slate-500">Loan Amount</span>
                    <span className="font-semibold">₹2,00,000</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-green-500 w-3/4 h-full"></div>
                </div>
                <p className="text-xs text-slate-400 mt-2">18 of 24 EMIs paid</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm opacity-75">
                <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-rupivo-dark">QuickFunds NBFC</h4>
                    <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded font-bold">Closed</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Loan Amount</span>
                    <span className="font-semibold">₹50,000</span>
                </div>
                <p className="text-xs text-green-600 mt-3 font-medium flex items-center gap-1">
                    <History className="w-3 h-3" /> Fully Repaid on Dec 2023
                </p>
            </div>
        </div>
    </div>
);

const BankAccountsView: React.FC<{ onBack: () => void }> = ({ onBack }) => (
    <div className="min-h-screen bg-slate-50 pt-16 px-4">
        <Header title="Linked Accounts" showBack onBack={onBack} />
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm mb-4">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700">
                    <CreditCard className="w-5 h-5" />
                </div>
                <div>
                    <h4 className="font-bold text-rupivo-dark">HDFC Bank</h4>
                    <p className="text-sm text-slate-500">Savings Account •••• 8821</p>
                </div>
            </div>
            <div className="mt-4 flex gap-2">
                <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded font-medium">Primary for E-Mandate</span>
            </div>
        </div>
        <button className="w-full py-3 border border-dashed border-slate-300 rounded-xl text-slate-500 text-sm font-medium hover:bg-slate-50 hover:border-slate-400 transition-colors">
            + Add New Bank Account
        </button>
    </div>
);

const TextContentView: React.FC<{ title: string; onBack: () => void; type: 'privacy' | 'terms' }> = ({ title, onBack, type }) => (
    <div className="min-h-screen bg-slate-50 pt-16 px-4">
        <Header title={title} showBack onBack={onBack} />
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-sm text-slate-600 leading-relaxed space-y-4">
            {type === 'privacy' ? (
                <>
                    <p>At RUPIVO, we take your privacy seriously. We only share your data with RBI-regulated lending partners for the purpose of loan processing.</p>
                    <h4 className="font-bold text-slate-900">Data Collection</h4>
                    <p>We collect basic profile information and financial details to assess eligibility.</p>
                    <h4 className="font-bold text-slate-900">Data Security</h4>
                    <p>All data is encrypted using 256-bit SSL encryption.</p>
                </>
            ) : (
                <>
                    <p>By using RUPIVO, you agree to the following terms and conditions.</p>
                    <h4 className="font-bold text-slate-900">1. Eligibility</h4>
                    <p>You must be an Indian citizen above 21 years of age.</p>
                    <h4 className="font-bold text-slate-900">2. Loan Disbursal</h4>
                    <p>Loan approval is at the sole discretion of our lending partners.</p>
                </>
            )}
        </div>
    </div>
);

export const UserProfileScreen: React.FC = () => {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState<string | null>(null);

    if (activeSection === 'Personal Details') return <PersonalDetailsView onBack={() => setActiveSection(null)} />;
    if (activeSection === 'Loan History') return <LoanHistoryView onBack={() => setActiveSection(null)} />;
    if (activeSection === 'Bank Accounts') return <BankAccountsView onBack={() => setActiveSection(null)} />;
    if (activeSection === 'Privacy Policy') return <TextContentView title="Privacy Policy" type="privacy" onBack={() => setActiveSection(null)} />;
    if (activeSection === 'Terms & Conditions') return <TextContentView title="Terms & Conditions" type="terms" onBack={() => setActiveSection(null)} />;

    return (
        <div className="min-h-screen bg-slate-50 pt-16 pb-24 px-4">
            <Header title="My Profile" />

            {/* Profile Header Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <div className="flex items-center gap-5 relative z-10">
                    <div className="w-20 h-20 bg-gradient-to-br from-rupivo-primary to-blue-600 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-blue-900/20 border-4 border-white">
                        RS
                    </div>
                    <div>
                        <h3 className="font-display font-bold text-xl text-rupivo-dark">Rahul Sharma</h3>
                        <p className="text-slate-500 text-sm font-medium mb-2">+91 98765 43210</p>
                        <div className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border border-green-100">
                            <ShieldCheck className="w-3 h-3" /> KYC Verified
                        </div>
                    </div>
                </div>
            </div>

            {/* Menu Sections */}
            <div className="space-y-6">

                {/* Account Settings */}
                <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 ml-2">Account</h4>
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        {[
                            { label: 'Personal Details', icon: User, action: () => setActiveSection('Personal Details') },
                            { label: 'Loan History', icon: History, action: () => setActiveSection('Loan History') },
                            { label: 'Bank Accounts', icon: CreditCard, action: () => setActiveSection('Bank Accounts') }
                        ].map((item, i, arr) => (
                            <button
                                key={item.label}
                                onClick={item.action}
                                className={`w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors ${i !== arr.length - 1 ? 'border-b border-slate-50' : ''}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center text-slate-600">
                                        <item.icon className="w-5 h-5" />
                                    </div>
                                    <span className="text-slate-700 font-semibold text-sm">{item.label}</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-300" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Legal & App */}
                <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 ml-2">Legal & Support</h4>
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        {[
                            { label: 'Privacy Policy', icon: Shield, action: () => setActiveSection('Privacy Policy') },
                            { label: 'Terms & Conditions', icon: FileText, action: () => setActiveSection('Terms & Conditions') },
                            { label: 'Help & Support', icon: MessageSquare, action: () => navigate('/support') }
                        ].map((item, i, arr) => (
                            <button
                                key={item.label}
                                onClick={item.action}
                                className={`w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors ${i !== arr.length - 1 ? 'border-b border-slate-50' : ''}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center text-slate-600">
                                        <item.icon className="w-5 h-5" />
                                    </div>
                                    <span className="text-slate-700 font-semibold text-sm">{item.label}</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-300" />
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <button
                onClick={() => navigate('/login')}
                className="w-full mt-8 p-4 text-red-500 font-bold bg-white border border-red-100 rounded-2xl hover:bg-red-50 transition-all flex items-center justify-center gap-2 shadow-sm active:scale-[0.98]"
            >
                <LogOut className="w-5 h-5" />
                Log Out
            </button>

            <div className="text-center mt-6 mb-4">
                <p className="text-[10px] text-slate-400 font-medium">RUPIVO v1.0.0</p>
            </div>

            <TabBar active="profile" />
        </div>
    )
}