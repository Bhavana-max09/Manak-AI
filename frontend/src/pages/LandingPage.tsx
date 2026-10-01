import React, { useState } from 'react';
import {
  ShieldCheck, Sparkles, Search, Award, FlaskConical, Gem,
  FileText, Activity, ArrowRight, CheckCircle2, Lock,
  Eye, EyeOff, User, Building2, Globe, Star, Zap, BookOpen
} from 'lucide-react';

interface LandingPageProps {
  onLogin: (role: 'manufacturer' | 'consumer' | 'admin') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'manufacturer' | 'consumer' | 'admin'>('manufacturer');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin(role);
    }, 1200);
  };

  const features = [
    {
      icon: Sparkles,
      color: 'blue',
      title: 'RAG-Powered AI Chat',
      desc: 'Ask any BIS/standards question and get 100% evidence-grounded answers with citations from authorized IS documents and QCOs.',
      tag: 'Core'
    },
    {
      icon: ShieldCheck,
      color: 'emerald',
      title: 'Product to Standard Matcher',
      desc: 'Enter your product name, material and specs. Get the exact Indian Standard, QCO mandates, and certification scheme automatically.',
      tag: 'Smart'
    },
    {
      icon: Search,
      color: 'indigo',
      title: 'Standards Directory',
      desc: 'Browse all indexed Indian Standards clause-by-clause. Filter by category, mandatory status, or IS code.',
      tag: 'Browse'
    },
    {
      icon: Award,
      color: 'amber',
      title: 'Certification Roadmap',
      desc: 'Step-by-step interactive guide through Scheme I (ISI Mark), Scheme II (CRS), factory audit prep and document checklists.',
      tag: 'Guide'
    },
    {
      icon: FlaskConical,
      color: 'purple',
      title: 'LIMS Lab Finder',
      desc: 'Locate authorized BIS testing laboratories by IS code, state, lab type and testing fee across the national LIMS network.',
      tag: 'Labs'
    },
    {
      icon: Gem,
      color: 'yellow',
      title: 'Hallmarking and HUID Portal',
      desc: 'Verify 6-digit HUID authenticity, check gold karatage (24K/22K/18K), and get jeweller registration guidance.',
      tag: 'Gold'
    },
    {
      icon: FileText,
      color: 'rose',
      title: 'Spec Document Analyzer',
      desc: 'Upload a product specification PDF to extract attributes and get an instant BIS compliance gap analysis report.',
      tag: 'AI'
    },
    {
      icon: Activity,
      color: 'slate',
      title: 'Audit Traceability Log',
      desc: 'Every AI answer is logged with evidence strength, source citations and query audit trail for regulatory accountability.',
      tag: 'Trust'
    },
  ];

  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-700 border-blue-100',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-100',
    purple: 'bg-purple-50 text-purple-700 border-purple-100',
    yellow: 'bg-yellow-50 text-yellow-700 border-yellow-100',
    rose: 'bg-rose-50 text-rose-700 border-rose-100',
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const tagColorMap: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-700',
    emerald: 'bg-emerald-100 text-emerald-700',
    indigo: 'bg-indigo-100 text-indigo-700',
    amber: 'bg-amber-100 text-amber-700',
    purple: 'bg-purple-100 text-purple-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    rose: 'bg-rose-100 text-rose-700',
    slate: 'bg-slate-100 text-slate-700',
  };

  const stats = [
    { value: '10+', label: 'Indian Standards Indexed', icon: BookOpen },
    { value: '9', label: 'Active QCOs Tracked', icon: ShieldCheck },
    { value: '6', label: 'LIMS Labs Listed', icon: FlaskConical },
    { value: '100%', label: 'Evidence Grounded', icon: CheckCircle2 },
    { value: '3', label: 'Languages Supported', icon: Globe },
    { value: '0', label: 'Hallucinations Tolerated', icon: Zap },
  ];

  const steps = [
    { step: '01', title: 'You Ask', desc: 'Submit your product name, IS code, or compliance question in English, Hindi or Kannada.', icon: User },
    { step: '02', title: 'Hybrid Retrieval', desc: 'The RAG engine performs keyword and semantic search across Standards, QCOs, and LIMS data.', icon: Search },
    { step: '03', title: 'Evidence Guardrail', desc: 'Every candidate is validated. If confidence is below threshold, a transparent refusal is issued - no hallucination.', icon: ShieldCheck },
    { step: '04', title: 'Grounded Answer', desc: 'You receive a structured, cited response with mandatory status, test requirements, and lab recommendations.', icon: CheckCircle2 },
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* TOP NAV */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-900 to-orange-500 flex items-center justify-center text-white font-black text-lg shadow">
              M
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900">
                MANAK <span className="text-blue-700">AI</span>
              </span>
              <span className="ml-2 bg-orange-100 text-orange-700 text-[10px] font-bold px-1.5 py-0.5 rounded border border-orange-200">
                BIS v1.0
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className="hidden md:inline text-xs text-slate-500">
              Bureau of Indian Standards - Compliance Intelligence Platform
            </span>
            <button
              onClick={() => setShowLogin(true)}
              className="flex items-center space-x-1.5 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow transition"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 text-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute inset-0 opacity-5"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 md:py-28">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur px-3 py-1.5 rounded-full text-xs font-semibold text-orange-300 border border-white/15 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span>India's First RAG-Powered BIS Standards Assistant</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight mb-6 max-w-4xl">
            Navigate Indian Standards and
            <br />
            <span className="text-orange-400">BIS Certification</span> with AI Confidence.
          </h1>

          <p className="text-base md:text-lg text-slate-300 max-w-2xl mb-10 leading-relaxed">
            MANAK AI is an evidence-grounded decision assistant for manufacturers, consumers, and compliance officers. It answers standards questions, recommends QCOs, finds labs, and guides hallmarking through authorized Bureau of Indian Standards documentation.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowLogin(true)}
              className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3.5 rounded-xl shadow-lg transition text-sm"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowLogin(true)}
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3.5 rounded-xl border border-white/20 transition text-sm"
            >
              <span>Sign In to Dashboard</span>
            </button>
          </div>

          <div className="mt-10 flex flex-wrap gap-3 text-xs text-slate-300">
            {['Anti-Hallucination Guardrail', 'Official BIS Sources Only', 'QCO Gazette Verified', 'Multilingual EN / HI / KN'].map(b => (
              <span key={b} className="bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
                <CheckCircle2 className="w-3 h-3 inline mr-1 text-emerald-400" />{b}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="text-center">
                <Icon className="w-5 h-5 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-black text-slate-900">{s.value}</div>
                <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-bold border border-blue-100 mb-4">
            <Star className="w-3.5 h-3.5" />
            <span>Complete BIS Ecosystem - 8 Modules</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
            Everything You Need for Indian Standards Compliance
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto text-sm leading-relaxed">
            From product classification to lab testing, certification roadmaps to hallmarking - MANAK AI covers the complete BIS compliance journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f) => {
            const Icon = f.icon;
            const iconCls = colorMap[f.color] || colorMap.slate;
            const tagCls = tagColorMap[f.color] || tagColorMap.slate;
            return (
              <div
                key={f.title}
                className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-100 transition group cursor-pointer"
                onClick={() => setShowLogin(true)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${iconCls} group-hover:scale-105 transition`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${tagCls}`}>{f.tag}</span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm mb-2 leading-snug">{f.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
                <div className="mt-4 flex items-center text-xs font-semibold text-blue-700 group-hover:translate-x-1 transition">
                  <span>Explore</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-gradient-to-br from-slate-900 to-blue-950 text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold mb-3">How MANAK AI Works</h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">
              A strict Retrieval-Augmented Generation pipeline guarantees every answer is backed by authorized BIS documentation.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.step} className="relative">
                  <div className="text-5xl font-black text-white/10 absolute -top-2 -left-1 select-none">{s.step}</div>
                  <div className="relative pt-8">
                    <div className="w-10 h-10 rounded-xl bg-blue-700/40 border border-blue-600/30 flex items-center justify-center mb-3">
                      <Icon className="w-5 h-5 text-orange-300" />
                    </div>
                    <h3 className="font-bold text-white mb-2">{s.title}</h3>
                    <p className="text-slate-400 text-xs leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-gradient-to-r from-blue-700 to-indigo-700 rounded-2xl p-10 text-center text-white shadow-xl">
          <h2 className="text-3xl font-extrabold mb-3">Ready to simplify BIS compliance?</h2>
          <p className="text-blue-100 text-sm mb-6 max-w-lg mx-auto">
            Join manufacturers, quality officers, and consumers who rely on MANAK AI for accurate, accountable BIS standards guidance.
          </p>
          <button
            onClick={() => setShowLogin(true)}
            className="inline-flex items-center space-x-2 bg-white text-blue-700 font-bold px-8 py-3.5 rounded-xl shadow-lg hover:bg-blue-50 transition text-sm"
          >
            <span>Sign In and Start Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-100 py-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <span className="font-bold text-slate-600">MANAK AI - Bureau of Indian Standards Compliance Platform</span>
          <div className="flex items-center gap-4">
            <a href="https://www.bis.gov.in" target="_blank" rel="noreferrer" className="hover:text-blue-600">bis.gov.in</a>
            <a href="https://www.manakonline.in" target="_blank" rel="noreferrer" className="hover:text-blue-600">manakonline.in</a>
            <a href="https://lims.bis.gov.in" target="_blank" rel="noreferrer" className="hover:text-blue-600">LIMS Portal</a>
          </div>
        </div>
      </footer>

      {/* LOGIN MODAL */}
      {showLogin && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowLogin(false)}>
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-blue-900 to-orange-500 flex items-center justify-center text-white font-black text-lg">
                M
              </div>
              <div>
                <div className="font-extrabold text-slate-900 text-lg">Sign in to MANAK AI</div>
                <div className="text-xs text-slate-500">Bureau of Indian Standards Platform</div>
              </div>
              <button
                onClick={() => setShowLogin(false)}
                className="ml-auto text-slate-400 hover:text-slate-700 text-2xl leading-none"
              >
                x
              </button>
            </div>

            <div className="mb-5">
              <label className="block text-xs font-bold text-slate-600 mb-2">I am a...</label>
              <div className="grid grid-cols-3 gap-2">
                {([
                  { id: 'manufacturer', label: 'Manufacturer', icon: Building2 },
                  { id: 'consumer', label: 'Consumer', icon: User },
                  { id: 'admin', label: 'BIS Officer', icon: ShieldCheck },
                ] as const).map((r) => {
                  const Icon = r.icon;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRole(r.id)}
                      className={`flex flex-col items-center p-3 rounded-xl border-2 text-xs font-semibold transition ${
                        role === r.id
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-slate-200 text-slate-600 hover:border-blue-200'
                      }`}
                    >
                      <Icon className={`w-5 h-5 mb-1 ${role === r.id ? 'text-blue-600' : 'text-slate-400'}`} />
                      {r.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-700 hover:bg-blue-800 disabled:opacity-60 text-white font-bold py-3 rounded-xl text-sm transition flex items-center justify-center space-x-2 shadow"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Sign In to MANAK AI</span>
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-[11px] text-slate-400 mt-4">
              For demo, any email and password works. Role determines dashboard context.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
