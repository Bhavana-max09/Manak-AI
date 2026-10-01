import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  BookOpen,
  FileCheck,
  Scale,
  X,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Building
} from 'lucide-react';
import { api } from '../services/api';
import { StandardItem, ClauseDetail } from '../types';

interface StandardsViewProps {
  initialStandardId?: string;
  onAskAI: (query: string) => void;
  onFindLabs: (isCode: string) => void;
}

export const StandardsView: React.FC<StandardsViewProps> = ({
  initialStandardId,
  onAskAI,
  onFindLabs
}) => {
  const [standards, setStandards] = useState<StandardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [mandatoryOnly, setMandatoryOnly] = useState(false);
  const [selectedStandard, setSelectedStandard] = useState<StandardItem | null>(null);

  const categories = [
    { id: 'all', label: 'All Departments' },
    { id: 'electrical', label: 'Electrical Appliances' },
    { id: 'food', label: 'Food & Drinking Water' },
    { id: 'consumer', label: 'Toys & Consumer Safety' },
    { id: 'household', label: 'Pressure Cookers & Cookware' },
    { id: 'automotive', label: 'Helmets & Transport' },
    { id: 'textiles', label: 'Footwear & Leather' },
    { id: 'metallurgical', label: 'Steel & TMT Rebars' },
    { id: 'civil', label: 'Cement & Construction' },
    { id: 'hallmarking', label: 'Gold & Silver Hallmarking' }
  ];

  const fetchStandards = async () => {
    setLoading(true);
    try {
      const data = await api.searchStandards(searchQuery, selectedCategory, mandatoryOnly);
      setStandards(data.standards);

      // If initialStandardId passed, open modal
      if (initialStandardId) {
        const found = data.standards.find(
          (s) => s.id === initialStandardId || s.code.toLowerCase() === initialStandardId.toLowerCase()
        );
        if (found) setSelectedStandard(found);
      }
    } catch (err) {
      console.error('Error fetching standards:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStandards();
  }, [searchQuery, selectedCategory, mandatoryOnly]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-heading">
            Directory of Indian Standards
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse official BIS specifications, technical committees, and compulsory Quality Control Orders (QCO).
          </p>
        </div>

        {/* Mandatory Toggle */}
        <div className="flex items-center space-x-2 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-subtle">
          <input
            type="checkbox"
            id="mandatoryToggle"
            checked={mandatoryOnly}
            onChange={(e) => setMandatoryOnly(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-slate-300"
          />
          <label htmlFor="mandatoryToggle" className="text-xs font-bold text-slate-700 cursor-pointer select-none">
            Mandatory QCOs Only
          </label>
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="space-y-3">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search standards by IS number, product, or keyword (e.g. 'IS 302', 'kettle', 'water', 'cement')..."
            className="w-full bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 px-5 py-3.5 pl-12 rounded-xl text-sm font-medium shadow-subtle focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5 pointer-events-none" />
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedCategory === cat.id
                  ? 'bg-blue-800 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Standards Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs">
          Loading Indian Standards catalog...
        </div>
      ) : standards.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-xl border border-slate-200">
          <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <h3 className="font-bold text-sm text-slate-700">No standards found</h3>
          <p className="text-xs text-slate-400 mt-1">Try adjusting your keyword or department filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {standards.map((std) => (
            <div
              key={std.id}
              className="bg-white rounded-xl border border-slate-200 shadow-subtle hover:shadow-premium hover:border-blue-300 transition p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-mono text-xs font-bold bg-blue-50 text-blue-800 px-2.5 py-1 rounded border border-blue-200/80">
                    {std.code}
                  </span>
                  {std.is_mandatory ? (
                    <span className="text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>Compulsory QCO</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                      Voluntary
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 mb-1.5 font-heading">
                  {std.title}
                </h3>

                <div className="text-[11px] text-slate-500 space-y-1 mb-3">
                  <div>
                    <strong className="text-slate-700">Products: </strong>
                    <span className="line-clamp-1">{std.product}</span>
                  </div>
                  <div>
                    <strong className="text-slate-700">Committee: </strong>
                    <span className="line-clamp-1">{std.committee}</span>
                  </div>
                  <div>
                    <strong className="text-slate-700">Status: </strong>
                    <span className="text-emerald-700 font-semibold">{std.status}</span> (Reaffirmed {std.reaffirmation_year})
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-3 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  {std.scope}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedStandard(std)}
                  className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center space-x-1"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>Inspect Clauses</span>
                </button>

                <button
                  onClick={() => onAskAI(`What are the certification and testing requirements for ${std.is_number}?`)}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center space-x-1"
                >
                  <span>Ask AI ➔</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Clause & Standard Inspector */}
      {selectedStandard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-elevation border border-slate-200 max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/80 flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-mono text-xs font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
                    {selectedStandard.is_number}
                  </span>
                  {selectedStandard.is_mandatory && (
                    <span className="text-[11px] font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full border border-rose-200">
                      Compulsory QCO Enforced
                    </span>
                  )}
                </div>
                <h2 className="text-base font-bold text-slate-900 font-heading">
                  {selectedStandard.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedStandard(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200/50 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
              {/* Scope Box */}
              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-1.5 flex items-center space-x-1.5">
                  <BookOpen className="w-4 h-4 text-blue-700" />
                  <span>Official Scope & Purpose</span>
                </h4>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 leading-relaxed">
                  {selectedStandard.scope}
                </div>
              </div>

              {/* Indexed Clauses */}
              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2 flex items-center space-x-1.5">
                  <FileCheck className="w-4 h-4 text-blue-700" />
                  <span>Key Clauses & Technical Requirements ({selectedStandard.clauses.length})</span>
                </h4>
                <div className="space-y-2.5">
                  {selectedStandard.clauses.map((c, idx) => (
                    <div key={idx} className="p-3 bg-white border border-slate-200 rounded-lg shadow-subtle">
                      <div className="flex items-center space-x-2 font-bold text-slate-900 mb-1">
                        <span className="bg-blue-50 text-blue-800 px-1.5 py-0.5 rounded font-mono text-[11px]">
                          Clause {c.clause}
                        </span>
                        <span>{c.title}</span>
                      </div>
                      <p className="text-slate-600 text-xs leading-relaxed">{c.requirement}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Required Testing Scope */}
              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2 flex items-center space-x-1.5">
                  <Scale className="w-4 h-4 text-purple-700" />
                  <span>Mandatory Laboratory Tests</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedStandard.required_tests.map((test, idx) => (
                    <div key={idx} className="p-2.5 bg-purple-50/50 border border-purple-100 rounded-lg flex items-center space-x-2 text-purple-950 font-medium text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-700 shrink-0" />
                      <span>{test}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <a
                href={selectedStandard.source_url}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center space-x-1"
              >
                <span>View on BIS Know Your Standards Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    const code = selectedStandard.code;
                    setSelectedStandard(null);
                    onFindLabs(code);
                  }}
                  className="bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 px-3.5 py-2 rounded-lg text-xs font-bold transition"
                >
                  Find LIMS Labs
                </button>
                <button
                  onClick={() => {
                    const query = `Which standard applies and what is the certification process for ${selectedStandard.is_number}?`;
                    setSelectedStandard(null);
                    onAskAI(query);
                  }}
                  className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-xs font-bold transition"
                >
                  Ask AI About This
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
