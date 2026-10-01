import React, { useState } from 'react';
import {
  Gem,
  Search,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Smartphone,
  Scale,
  Award,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { api } from '../services/api';

export const HallmarkingView: React.FC = () => {
  const [huidInput, setHuidInput] = useState('AB1234');
  const [loading, setLoading] = useState(false);
  const [huidResult, setHuidResult] = useState<any>(null);

  const sampleHuids = [
    { code: 'AB1234', desc: '22K Gold Bangle (Bengaluru)' },
    { code: 'KA5678', desc: '18K Diamond Ring (Mysuru)' },
    { code: 'MH9988', desc: '24K Gold Coin (Mumbai)' },
    { code: 'DL3344', desc: '22K Bridal Necklace (Delhi)' }
  ];

  const handleVerify = async (codeToVerify?: string) => {
    const code = (codeToVerify || huidInput).trim();
    if (!code || loading) return;

    setLoading(true);
    try {
      const data = await api.verifyHuid(code);
      setHuidResult(data);
    } catch (err) {
      console.error('HUID verification error:', err);
    } finally {
      setLoading(false);
    }
  };

  const purityGrades = [
    { karat: '24K', fineness: '999', percent: '99.9%', desc: 'Pure bullion coins, minted artefacts', color: 'bg-amber-100 text-amber-900 border-amber-300' },
    { karat: '23K', fineness: '958', percent: '95.8%', desc: 'Traditional handcrafted ornaments', color: 'bg-amber-50 text-amber-900 border-amber-200' },
    { karat: '22K', fineness: '916', percent: '91.6%', desc: 'Primary standard for Indian bridal jewellery', color: 'bg-yellow-100 text-yellow-900 border-yellow-300 font-bold ring-2 ring-yellow-400' },
    { karat: '20K', fineness: '833', percent: '83.3%', desc: 'Durable gold ornaments and temple art', color: 'bg-yellow-50 text-yellow-900 border-yellow-200' },
    { karat: '18K', fineness: '750', percent: '75.0%', desc: 'Diamond and gemstone studded jewellery', color: 'bg-orange-50 text-orange-900 border-orange-200' },
    { karat: '14K', fineness: '585', percent: '58.5%', desc: 'Lightweight western and daily wear', color: 'bg-slate-100 text-slate-800 border-slate-200' }
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center space-x-2 text-amber-800 text-xs font-bold uppercase tracking-wider mb-1">
          <Gem className="w-4 h-4 text-amber-600" />
          <span>Consumer Protection & Precious Metals</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 font-heading">
          Gold & Silver Hallmarking (HUID) Verification
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Verify 6-digit Hallmark Unique Identification (HUID) numbers, inspect certified karatage fineness, and understand mandatory hallmarking regulations.
        </p>
      </div>

      {/* HUID Simulator Box */}
      <div className="bg-gradient-to-br from-amber-950 via-slate-900 to-blue-950 text-white p-8 rounded-2xl shadow-elevation relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center space-x-2 bg-amber-400/20 text-amber-300 px-3 py-1 rounded-full text-xs font-bold border border-amber-400/30">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Official 6-Digit Alphanumeric Traceability Simulator</span>
          </div>

          <h2 className="text-2xl font-extrabold font-heading">
            Verify Hallmark Unique Identification (HUID)
          </h2>

          <p className="text-xs text-slate-300 leading-relaxed">
            Every piece of hallmarked gold jewellery sold by registered jewellers in notified districts is laser engraved with a unique 6-digit code linked to central BIS servers.
          </p>

          {/* Input & Samples */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 max-w-md">
              <input
                type="text"
                maxLength={6}
                value={huidInput}
                onChange={(e) => setHuidInput(e.target.value.toUpperCase())}
                placeholder="e.g. AB1234"
                className="w-full bg-white text-slate-900 font-mono font-bold tracking-widest text-center px-4 py-3 rounded-xl uppercase focus:ring-2 focus:ring-amber-500 focus:outline-none text-base shadow"
              />
              <button
                onClick={() => handleVerify()}
                disabled={loading || huidInput.length < 4}
                className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold px-6 py-3 rounded-xl text-xs transition shadow flex items-center space-x-1.5"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Verify</span>}
              </button>
            </div>

            {/* Quick Sample Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px]">
              <span className="text-slate-400">Test Samples:</span>
              {sampleHuids.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setHuidInput(s.code);
                    handleVerify(s.code);
                  }}
                  className="bg-white/10 hover:bg-white/20 text-amber-200 px-2 py-0.5 rounded font-mono text-xs border border-white/10 transition"
                >
                  {s.code}
                </button>
              ))}
            </div>
          </div>

          {/* Verification Result Card */}
          {huidResult && (
            <div className="mt-4 p-5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-xs space-y-3 animate-fade-in">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-sm text-emerald-300 font-heading">
                    {huidResult.message}
                  </span>
                </div>
                <span className="font-mono bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded font-bold">
                  {huidResult.huid}
                </span>
              </div>

              {huidResult.record && (
                <div className="grid grid-cols-2 gap-3 text-slate-200">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Article Type:</span>
                    <strong className="text-white">{huidResult.record.article_type}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Certified Karatage & Purity:</span>
                    <strong className="text-amber-300">{huidResult.record.purity}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Assaying & Hallmarking Centre:</span>
                    <span className="text-white">{huidResult.record.ahc_centre}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Registered Jeweller:</span>
                    <span className="text-white">{huidResult.record.jeweller_name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Gross Weight:</span>
                    <span className="text-white">{huidResult.record.gross_weight_g} grams</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Date of Hallmarking:</span>
                    <span className="text-white">{huidResult.record.hallmarked_date}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* The 3 Official Hallmark Signs */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-subtle space-y-4">
        <h2 className="text-base font-bold text-slate-900 font-heading">
          The 3 Mandatory Marks on Genuine Gold Jewellery
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-lg">
              ▲
            </div>
            <h3 className="font-bold text-slate-900 text-sm font-heading">1. BIS Standard Mark</h3>
            <p className="text-slate-600 leading-relaxed">
              Triangular emblem certifying conformity to the National Standard (IS 1417).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-yellow-100 text-yellow-800 flex items-center justify-center font-bold text-xs font-mono">
              22K916
            </div>
            <h3 className="font-bold text-slate-900 text-sm font-heading">2. Purity & Karat Grade</h3>
            <p className="text-slate-600 leading-relaxed">
              Karat and fineness in parts per thousand (e.g. 22K916, 18K750, 14K585).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-xs font-mono">
              AB1234
            </div>
            <h3 className="font-bold text-slate-900 text-sm font-heading">3. 6-Digit HUID</h3>
            <p className="text-slate-600 leading-relaxed">
              Laser engraved alphanumeric code enabling non-repudiable tracing on BIS CARE.
            </p>
          </div>
        </div>
      </div>

      {/* Karatage Purity Table */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-subtle space-y-4">
        <h2 className="text-base font-bold text-slate-900 font-heading">
          Recognized Karatage & Fineness Grades (IS 1417 : 2016)
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          {purityGrades.map((g, idx) => (
            <div key={idx} className={`p-3.5 rounded-xl border ${g.color} space-y-1`}>
              <div className="text-lg font-black font-heading">{g.karat}</div>
              <div className="font-mono text-xs font-bold">{g.fineness} Fineness</div>
              <div className="text-[11px] opacity-90">{g.percent}</div>
              <p className="text-[10px] pt-1 opacity-80 leading-tight">{g.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Consumer Protection Rights */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-xs text-emerald-950 space-y-3">
        <div className="flex items-center space-x-2 text-emerald-800 font-bold text-sm font-heading">
          <Scale className="w-5 h-5 text-emerald-700" />
          <span>Statutory Consumer Compensation & Redressal Rights</span>
        </div>
        <p className="leading-relaxed">
          Under the Bureau of Indian Standards (Hallmarking) Regulations, any consumer can get their hallmarked jewellery tested at any BIS-recognized Assaying & Hallmarking Centre by paying a nominal fee of ₹45 per article.
        </p>
        <div className="p-3 bg-white/70 rounded-xl border border-emerald-300 font-medium">
          <strong>Legal Compensation Guarantee:</strong> If the jewellery is found to be of lesser purity than marked, the registered jeweller is legally bound to refund the difference amount to the customer, reimburse the testing fee, and pay <strong>two times (2x) the compensation</strong> of the shortfall calculated on prevailing market rates!
        </div>
      </div>
    </div>
  );
};
