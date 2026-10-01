import React, { useState } from 'react';
import {
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  Award,
  Zap,
  RotateCcw,
  Loader2
} from 'lucide-react';
import { api } from '../services/api';
import { ProductSpecResponse } from '../types';

interface RecommenderViewProps {
  onAskAI: (query: string) => void;
  onExploreCertification: () => void;
}

export const RecommenderView: React.FC<RecommenderViewProps> = ({
  onAskAI,
  onExploreCertification
}) => {
  const [productName, setProductName] = useState('Electric Kettle');
  const [material, setMaterial] = useState('Stainless Steel Body + Plastic Handle');
  const [powerWattage, setPowerWattage] = useState('1500 W');
  const [voltage, setVoltage] = useState('230 V AC');
  const [intendedUse, setIntendedUse] = useState('Household');
  const [capacity, setCapacity] = useState('1.8 Litres');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ProductSpecResponse | null>(null);

  const presets = [
    {
      name: 'Electric Kettle',
      material: 'Stainless Steel & Polypropylene',
      wattage: '1500 W',
      voltage: '230 V AC Single Phase',
      use: 'Household',
      capacity: '1.8 L'
    },
    {
      name: 'Packaged Drinking Water',
      material: 'PET Food Grade Plastic Container',
      wattage: 'N/A',
      voltage: 'N/A',
      use: 'Direct Human Consumption',
      capacity: '1 Litre Bottle & 20L Jar'
    },
    {
      name: 'Children Educational Toy Car',
      material: 'Moulded ABS Plastic & Rubber Wheels',
      wattage: 'N/A',
      voltage: 'N/A',
      use: 'Children Under 36 Months',
      capacity: 'N/A'
    },
    {
      name: 'Domestic Pressure Cooker',
      material: 'Grade 304 Stainless Steel (SS304)',
      wattage: 'N/A',
      voltage: 'Gas & Induction Stove compatible',
      use: 'Household Cooking',
      capacity: '5 Litres'
    },
    {
      name: 'Two-Wheeler Motorcycle Helmet',
      material: 'Polycarbonate Shell with EPS Liner',
      wattage: 'N/A',
      voltage: 'N/A',
      use: 'Road Safety / Two-Wheeler Riders',
      capacity: 'Weight <= 1.2 kg'
    }
  ];

  const applyPreset = (p: typeof presets[0]) => {
    setProductName(p.name);
    setMaterial(p.material);
    setPowerWattage(p.wattage);
    setVoltage(p.voltage);
    setIntendedUse(p.use);
    setCapacity(p.capacity);
  };

  const handleRecommend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim() || loading) return;

    setLoading(true);
    try {
      const data = await api.recommendStandards({
        product_name: productName,
        material,
        power_wattage: powerWattage,
        voltage,
        intended_use: intendedUse,
        capacity
      });
      setResult(data);
    } catch (err) {
      console.error('Recommendation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center space-x-2 text-blue-800 text-xs font-bold uppercase tracking-wider mb-1">
          <Sparkles className="w-4 h-4 text-orange-500" />
          <span>Product Classification Engine</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 font-heading">
          Product → Indian Standard Recommender
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Map physical characteristics, intended applications, and electrical parameters to matching Indian Standards and statutory QCO mandates.
        </p>
      </div>

      {/* Main Form & Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Form (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-subtle space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm font-heading">
              Product Specification Form
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">Quick Presets:</span>
          </div>

          {/* Preset Buttons */}
          <div className="flex flex-wrap gap-1.5 pb-2 border-b border-slate-100">
            {presets.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => applyPreset(p)}
                className="text-[11px] bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-900 px-2.5 py-1 rounded-md font-medium transition"
              >
                {p.name}
              </button>
            ))}
          </div>

          <form onSubmit={handleRecommend} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Product Name / Category *
              </label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g. Electric Kettle, Water Heater, Cement..."
                className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Primary Material
                </label>
                <input
                  type="text"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  placeholder="e.g. Stainless Steel, Plastic..."
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Power / Wattage
                </label>
                <input
                  type="text"
                  value={powerWattage}
                  onChange={(e) => setPowerWattage(e.target.value)}
                  placeholder="e.g. 1500 W"
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Operating Voltage
                </label>
                <input
                  type="text"
                  value={voltage}
                  onChange={(e) => setVoltage(e.target.value)}
                  placeholder="e.g. 230 V AC Single Phase"
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Capacity / Rating
                </label>
                <input
                  type="text"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  placeholder="e.g. 1.8 Litres / 53 Grade"
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Intended Application / Target Consumer
              </label>
              <select
                value={intendedUse}
                onChange={(e) => setIntendedUse(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
              >
                <option value="Household">Household / Domestic Consumer Use</option>
                <option value="Commercial">Commercial / Food Service / Hospitality</option>
                <option value="Industrial">Heavy Industrial & Infrastructure</option>
                <option value="Children">Children / Infant Use (Toy Safety)</option>
                <option value="Direct Human Consumption">Food & Direct Human Consumption</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white font-bold py-3 px-4 rounded-xl shadow-md transition flex items-center justify-center space-x-2 text-xs"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-orange-400" />
                  <span>Evaluating Product against BIS Ontology...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-orange-400" />
                  <span>Identify Applicable Standards & QCOs</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Window (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {!result ? (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center h-full flex flex-col items-center justify-center">
              <ShieldCheck className="w-12 h-12 text-slate-300 mb-3" />
              <h3 className="font-bold text-sm text-slate-700 font-heading">
                Awaiting Product Submission
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mt-1">
                Enter your product specification on the left or select a sample preset to view matched standards and compliance steps.
              </p>
            </div>
          ) : (
            <div className="space-y-4 animate-fade-in">
              {/* Verdict Banner */}
              <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-5 rounded-2xl shadow-subtle">
                <div className="flex items-center space-x-2 text-orange-300 text-[11px] font-bold uppercase tracking-wider mb-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Classification Verdict</span>
                </div>
                <h3 className="text-lg font-bold font-heading mb-1">
                  Product Identified: {result.product_identified}
                </h3>
                <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl text-xs text-slate-200 mt-2 font-medium border border-white/10 leading-relaxed">
                  {result.mandatory_verdict}
                </div>
                <div className="mt-3 flex items-center space-x-4 text-xs text-slate-300">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-orange-400" />
                    <span>Timeline: <strong>{result.estimated_licence_timeline}</strong></span>
                  </div>
                </div>
              </div>

              {/* Matched Standards Cards */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
                  <Layers className="w-3.5 h-3.5 text-blue-700" />
                  <span>Potentially Applicable Indian Standards ({result.candidates.length})</span>
                </h4>

                {result.candidates.map((cand, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-slate-200 rounded-xl p-5 shadow-subtle hover:border-blue-300 transition space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-mono text-xs font-bold bg-blue-100 text-blue-900 px-2 py-0.5 rounded">
                            {cand.is_number}
                          </span>
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                            {cand.match_score}% Match Confidence
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm font-heading">
                          {cand.title}
                        </h4>
                      </div>
                    </div>

                    {/* Why It Matched */}
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs space-y-1">
                      <span className="font-bold text-slate-700 block mb-1">Why this matched:</span>
                      {cand.why_matched.map((reason, rIdx) => (
                        <div key={rIdx} className="flex items-start space-x-1.5 text-slate-600">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                          <span>{reason}</span>
                        </div>
                      ))}
                    </div>

                    {/* Tests required */}
                    <div>
                      <span className="text-[11px] font-bold text-slate-700 block mb-1">Key Prescribed Tests:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {cand.key_tests.map((test, tIdx) => (
                          <span key={tIdx} className="bg-purple-50 text-purple-900 border border-purple-100 px-2 py-0.5 rounded text-[11px] font-medium">
                            {test}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom CTA */}
                    <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-100">
                      <button
                        onClick={onExploreCertification}
                        className="font-bold text-emerald-700 hover:text-emerald-900 flex items-center space-x-1"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>View Certification Roadmap</span>
                      </button>

                      <button
                        onClick={() => onAskAI(`What is the step by step process to get BIS certification for ${cand.is_number}?`)}
                        className="font-bold text-blue-700 hover:text-blue-900 flex items-center space-x-1"
                      >
                        <span>Ask AI Detailed Guidance ➔</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
