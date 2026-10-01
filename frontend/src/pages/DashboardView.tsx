import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  ShieldCheck,
  Award,
  FlaskConical,
  Gem,
  FileText,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  FileCheck,
  Building2,
  ExternalLink
} from 'lucide-react';

interface DashboardViewProps {
  onNavigate: (tab: string, initialQuery?: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const [heroSearch, setHeroSearch] = useState('');

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      onNavigate('chat', heroSearch.trim());
    }
  };

  const quickPills = [
    { label: 'Electric Kettle (1500W)', query: 'I want to manufacture an electric kettle in India. What standard applies?' },
    { label: 'Packaged Drinking Water', query: 'Is BIS certification mandatory for packaged drinking water?' },
    { label: 'Children Toys Safety', query: 'What are the mechanical safety tests for children plastic toys?' },
    { label: 'HUID & Gold Purity', query: 'What is HUID and what does 22K916 hallmark mean?' },
    { label: 'Domestic Pressure Cooker', query: 'Which standard and tests apply to domestic pressure cookers?' },
  ];

  const popularStandards = [
    {
      code: 'IS 302-2-15',
      is_number: 'IS 302 (Part 2/Sec 15) : 2009',
      title: 'Appliances for Heating Liquids (Electric Kettles)',
      category: 'Electrical Appliances',
      mandatory: true,
      qco: 'Electrical Appliances QCO 2023'
    },
    {
      code: 'IS 14543',
      is_number: 'IS 14543 : 2024',
      title: 'Packaged Drinking Water (Other than Natural Mineral Water)',
      category: 'Food & Beverages',
      mandatory: true,
      qco: 'FSSAI Statutory Mandate'
    },
    {
      code: 'IS 9873-1',
      is_number: 'IS 9873 (Part 1) : 2019',
      title: 'Safety of Toys - Mechanical and Physical Properties',
      category: 'Consumer Goods',
      mandatory: true,
      qco: 'Toys (Quality Control) Order 2020'
    },
    {
      code: 'IS 2347',
      is_number: 'IS 2347 : 2017',
      title: 'Domestic Pressure Cookers - Specification',
      category: 'Kitchen Utensils',
      mandatory: true,
      qco: 'Pressure Cookers QCO 2020'
    },
    {
      code: 'IS 4151',
      is_number: 'IS 4151 : 2020',
      title: 'Protective Helmets for Two-Wheeler Riders',
      category: 'Automotive Safety',
      mandatory: true,
      qco: 'Helmets (Quality Control) Order 2020'
    },
    {
      code: 'IS 1417',
      is_number: 'IS 1417 : 2016',
      title: 'Gold and Gold Alloys, Jewellery/Artefacts Fineness & Marking',
      category: 'Hallmarking',
      mandatory: true,
      qco: 'Mandatory Gold Hallmarking Order'
    }
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 text-white p-8 md:p-12 shadow-elevation">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-orange-300 border border-white/15 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span>AI-Powered Decision Support for Indian Standards & Compliance</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight font-heading leading-tight mb-4">
            Navigate Indian Standards, QCOs & BIS Certification with Confidence.
          </h1>

          <p className="text-sm md:text-base text-slate-300 font-normal mb-8 max-w-2xl leading-relaxed">
            Instant product-to-standard recommendations, Quality Control Order verifications, testing lab discovery, and hallmarking guidance—grounded strictly in authorized Bureau of Indian Standards documentation.
          </p>

          {/* Search Box */}
          <form onSubmit={handleHeroSubmit} className="relative max-w-2xl">
            <div className="relative flex items-center">
              <input
                type="text"
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                placeholder="Ask about a standard, product, or compliance requirement (e.g. 'IS 302-2-15' or 'electric kettle')..."
                className="w-full bg-white text-slate-900 placeholder:text-slate-400 px-5 py-4 pl-12 pr-32 rounded-xl text-sm font-medium shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
              />
              <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
              <button
                type="submit"
                className="absolute right-2 bg-blue-700 hover:bg-blue-800 text-white px-5 py-2.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 shadow"
              >
                <span>Ask AI</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Sample Query Chips */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Try asking:</span>
            {quickPills.map((pill, idx) => (
              <button
                key={idx}
                onClick={() => onNavigate('chat', pill.query)}
                className="bg-white/10 hover:bg-white/20 text-slate-200 px-2.5 py-1 rounded-md transition text-[11px] border border-white/10"
              >
                {pill.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* KPI Cards */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-subtle flex items-center space-x-4">
          <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 font-heading">10+ Domains</div>
            <div className="text-xs text-slate-500 font-medium">Core Indian Standards Indexed</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-subtle flex items-center space-x-4">
          <div className="w-12 h-12 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 font-heading">9 Orders</div>
            <div className="text-xs text-slate-500 font-medium">Compulsory QCOs Active</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-subtle flex items-center space-x-4">
          <div className="w-12 h-12 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
            <FlaskConical className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 font-heading">6 Labs</div>
            <div className="text-xs text-slate-500 font-medium">BIS Central & LIMS Network</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-subtle flex items-center space-x-4">
          <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 font-heading">100%</div>
            <div className="text-xs text-slate-500 font-medium">Evidence Grounded (Anti-Hallucination)</div>
          </div>
        </div>
      </section>

      {/* Quick Action Navigation Grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-heading">
              Comprehensive BIS Ecosystem Services
            </h2>
            <p className="text-xs text-slate-500">
              Select an area to explore guidance, technical standards, or certification steps.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Product Matcher */}
          <div
            onClick={() => onNavigate('recommender')}
            className="group bg-white p-6 rounded-xl border border-slate-200 shadow-subtle hover:shadow-premium hover:border-blue-300 transition cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center mb-4 group-hover:scale-105 transition">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1 font-heading group-hover:text-blue-700 transition">
              Product → Standard Recommender
            </h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Enter your product description, material, wattage, and operating use case to automatically identify applicable standards and mandatory QCOs.
            </p>
            <div className="flex items-center space-x-1 text-xs font-bold text-blue-700 group-hover:translate-x-1 transition">
              <span>Run Recommender Wizard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 2: Certification Roadmap */}
          <div
            onClick={() => onNavigate('certification')}
            className="group bg-white p-6 rounded-xl border border-slate-200 shadow-subtle hover:shadow-premium hover:border-blue-300 transition cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4 group-hover:scale-105 transition">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1 font-heading group-hover:text-emerald-700 transition">
              Certification Workflow Guide
            </h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Step-by-step interactive roadmap for Scheme I (ISI Mark), Scheme II (CRS), factory audit requirements, document checklists, and fee schedules.
            </p>
            <div className="flex items-center space-x-1 text-xs font-bold text-emerald-700 group-hover:translate-x-1 transition">
              <span>Explore Certification Steps</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 3: Laboratory Finder */}
          <div
            onClick={() => onNavigate('laboratories')}
            className="group bg-white p-6 rounded-xl border border-slate-200 shadow-subtle hover:shadow-premium hover:border-blue-300 transition cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center mb-4 group-hover:scale-105 transition">
              <FlaskConical className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1 font-heading group-hover:text-purple-700 transition">
              BIS LIMS Laboratory Finder
            </h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Find authorized testing laboratories by IS code, state (Karnataka, Delhi, Maharashtra, Tamil Nadu), testing capability, and fee schedule.
            </p>
            <div className="flex items-center space-x-1 text-xs font-bold text-purple-700 group-hover:translate-x-1 transition">
              <span>Search Testing Facilities</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 4: Hallmarking */}
          <div
            onClick={() => onNavigate('hallmarking')}
            className="group bg-white p-6 rounded-xl border border-slate-200 shadow-subtle hover:shadow-premium hover:border-amber-300 transition cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center mb-4 group-hover:scale-105 transition">
              <Gem className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1 font-heading group-hover:text-amber-700 transition">
              Hallmarking & HUID Portal
            </h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Verify 6-digit HUID authenticity, calculate karatage purity (24K, 22K, 18K, 14K), view jeweller registration guidelines, and consumer redressal.
            </p>
            <div className="flex items-center space-x-1 text-xs font-bold text-amber-700 group-hover:translate-x-1 transition">
              <span>Verify HUID & Karatage</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 5: Document Analyzer */}
          <div
            onClick={() => onNavigate('analyzer')}
            className="group bg-white p-6 rounded-xl border border-slate-200 shadow-subtle hover:shadow-premium hover:border-indigo-300 transition cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center mb-4 group-hover:scale-105 transition">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1 font-heading group-hover:text-indigo-700 transition">
              Product Spec Analyzer (PDF)
            </h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Upload a technical specification sheet to extract attributes (voltage, power, materials) and receive an instant compliance checklist.
            </p>
            <div className="flex items-center space-x-1 text-xs font-bold text-indigo-700 group-hover:translate-x-1 transition">
              <span>Upload Specification</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 6: Standards Catalog */}
          <div
            onClick={() => onNavigate('standards')}
            className="group bg-white p-6 rounded-xl border border-slate-200 shadow-subtle hover:shadow-premium hover:border-blue-300 transition cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center mb-4 group-hover:scale-105 transition">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1 font-heading group-hover:text-blue-700 transition">
              Browse Standards Directory
            </h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Direct access to Indian Standards with clause-by-clause inspection, reaffirmation status, technical committee details, and gazette orders.
            </p>
            <div className="flex items-center space-x-1 text-xs font-bold text-slate-700 group-hover:translate-x-1 transition">
              <span>Search Indian Standards</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* Popular Standards Showcase */}
      <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-subtle">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-blue-700" />
            <h2 className="text-base font-bold text-slate-900 font-heading">
              Frequently Queried Indian Standards
            </h2>
          </div>
          <button
            onClick={() => onNavigate('standards')}
            className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center space-x-1"
          >
            <span>View All Standards</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {popularStandards.map((std, idx) => (
            <div
              key={idx}
              onClick={() => onNavigate('chat', `Which requirements apply under ${std.is_number}?`)}
              className="p-4 rounded-lg bg-slate-50 hover:bg-blue-50/50 border border-slate-200 hover:border-blue-200 transition cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-xs font-bold text-blue-800 bg-blue-100/70 px-2 py-0.5 rounded">
                    {std.code}
                  </span>
                  {std.mandatory && (
                    <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full border border-rose-200">
                      Mandatory QCO
                    </span>
                  )}
                </div>
                <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                  {std.title}
                </h4>
                <p className="text-[11px] text-slate-500 mt-1">
                  Category: {std.category}
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-blue-700 font-semibold">
                <span>Ask AI About This Standard</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
