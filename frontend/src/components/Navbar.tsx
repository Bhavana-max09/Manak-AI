import React from 'react';
import {
  ShieldCheck,
  Search,
  Sparkles,
  Award,
  FlaskConical,
  Gem,
  FileText,
  Activity,
  LogOut
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole?: string;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  userRole = 'manufacturer',
  onLogout
}) => {
  const tabs = [
    { id: 'dashboard',    label: 'Overview',        icon: Activity },
    { id: 'chat',         label: 'Ask MANAK AI',    icon: Sparkles,    badge: 'RAG' },
    { id: 'standards',    label: 'Standards',       icon: Search },
    { id: 'recommender',  label: 'Product Matcher', icon: ShieldCheck },
    { id: 'certification',label: 'Certification',   icon: Award },
    { id: 'laboratories', label: 'LIMS Labs',       icon: FlaskConical },
    { id: 'hallmarking',  label: 'Hallmarking',     icon: Gem },
    { id: 'analyzer',     label: 'Spec Analyzer',   icon: FileText },
    { id: 'admin',        label: 'Traceability',    icon: Activity },
  ];

  const roleLabel: Record<string, string> = {
    manufacturer: 'Manufacturer',
    consumer: 'Consumer',
    admin: 'BIS Officer',
  };

  const roleColor: Record<string, string> = {
    manufacturer: 'bg-blue-50 text-blue-700 border-blue-200',
    consumer: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    admin: 'bg-orange-50 text-orange-700 border-orange-200',
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* Ministry Banner — clean, no SIH code */}
      <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white text-[11px] px-4 py-1.5 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
          <span className="font-medium tracking-wide">
            Bureau of Indian Standards (BIS) — Compliance Intelligence Platform
          </span>
        </div>
        <span className="hidden md:inline bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full text-[10px] font-medium border border-emerald-500/30">
          ✓ 100% Authorized Evidence
        </span>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            className="flex items-center space-x-3 cursor-pointer select-none shrink-0"
            onClick={() => setActiveTab('dashboard')}
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-blue-900 via-blue-800 to-orange-500 flex items-center justify-center shadow-md text-white font-black text-xl">
              M
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">
                  MANAK <span className="text-blue-700">AI</span>
                </span>
                <span className="bg-orange-100 text-orange-800 text-[10px] font-bold px-1.5 py-0.5 rounded border border-orange-200">
                  BIS v1.0
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Indian Standards &amp; Compliance Decision Engine
              </p>
            </div>
          </div>

          {/* Desktop Nav Tabs */}
          <nav className="hidden lg:flex items-center space-x-0.5 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 whitespace-nowrap ${
                    isActive
                      ? 'bg-blue-50 text-blue-800 shadow-sm border border-blue-200/80 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-700' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className="ml-1 text-[9px] bg-blue-100 text-blue-700 px-1 py-0.5 rounded font-bold">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right: Role badge + Logout */}
          <div className="flex items-center space-x-2 shrink-0">
            <span className={`hidden md:inline text-[11px] font-semibold px-2.5 py-1 rounded-full border ${roleColor[userRole] || roleColor.manufacturer}`}>
              {roleLabel[userRole] || userRole}
            </span>
            {onLogout && (
              <button
                onClick={onLogout}
                title="Sign out"
                className="flex items-center space-x-1 text-xs text-slate-500 hover:text-red-600 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Tab Bar */}
      <div className="lg:hidden flex overflow-x-auto py-2 px-3 border-t border-slate-100 space-x-1 bg-slate-50 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`whitespace-nowrap px-2.5 py-1.5 text-xs rounded-md font-medium flex items-center space-x-1 ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'text-slateate-600 bg-white border border-slate-200 text-slate-600'
            }`}
          >
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </header>
  );
};
