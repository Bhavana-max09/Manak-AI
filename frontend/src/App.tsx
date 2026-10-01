import React, { useState } from 'react';
import { LandingPage } from './pages/LandingPage';
import { Navbar } from './components/Navbar';
import { DashboardView } from './pages/DashboardView';
import { ChatView } from './pages/ChatView';
import { StandardsView } from './pages/StandardsView';
import { RecommenderView } from './pages/RecommenderView';
import { CertificationView } from './pages/CertificationView';
import { LaboratoriesView } from './pages/LaboratoriesView';
import { HallmarkingView } from './pages/HallmarkingView';
import { DocumentAnalyzerView } from './pages/DocumentAnalyzerView';
import { AdminView } from './pages/AdminView';
import { ExternalLink } from 'lucide-react';

type UserRole = 'manufacturer' | 'consumer' | 'admin';

export function App() {
  // Auth state: null = not logged in (show landing)
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [chatInitialQuery, setChatInitialQuery] = useState<string | undefined>();
  const [labFilterStandard, setLabFilterStandard] = useState<string | undefined>();
  const [selectedStandardId, setSelectedStandardId] = useState<string | undefined>();

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setUserRole(null);
    setActiveTab('dashboard');
    setChatInitialQuery(undefined);
    setLabFilterStandard(undefined);
    setSelectedStandardId(undefined);
  };

  const handleNavigate = (tab: string, param?: string) => {
    if (tab === 'chat') {
      setChatInitialQuery(param);
    } else if (tab === 'laboratories') {
      setLabFilterStandard(param);
    } else if (tab === 'standards') {
      setSelectedStandardId(param);
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Show landing page if not logged in
  if (!userRole) {
    return <LandingPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={userRole}
        onLogout={handleLogout}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'dashboard' && (
          <DashboardView onNavigate={handleNavigate} />
        )}

        {activeTab === 'chat' && (
          <ChatView
            initialQuery={chatInitialQuery}
            language={selectedLanguage}
            onNavigate={handleNavigate}
          />
        )}

        {activeTab === 'standards' && (
          <StandardsView
            initialStandardId={selectedStandardId}
            onAskAI={(q) => handleNavigate('chat', q)}
            onFindLabs={(code) => handleNavigate('laboratories', code)}
          />
        )}

        {activeTab === 'recommender' && (
          <RecommenderView
            onAskAI={(q) => handleNavigate('chat', q)}
            onExploreCertification={() => handleNavigate('certification')}
          />
        )}

        {activeTab === 'certification' && (
          <CertificationView />
        )}

        {activeTab === 'laboratories' && (
          <LaboratoriesView
            initialStandardFilter={labFilterStandard}
            onAskAI={(q) => handleNavigate('chat', q)}
          />
        )}

        {activeTab === 'hallmarking' && (
          <HallmarkingView />
        )}

        {activeTab === 'analyzer' && (
          <DocumentAnalyzerView />
        )}

        {activeTab === 'admin' && (
          <AdminView />
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 mt-12 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded bg-blue-900 text-white font-black flex items-center justify-center text-xs">
              M
            </div>
            <div>
              <span className="font-bold text-slate-900">MANAK AI</span>
              <span className="text-slate-400 ml-1.5">— Decision Assistant for Indian Standards (BIS)</span>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-[11px]">
            <a href="https://www.bis.gov.in" target="_blank" rel="noreferrer"
              className="hover:text-blue-700 flex items-center space-x-1">
              <span>BIS Official Portal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span>•</span>
            <a href="https://www.manakonline.in" target="_blank" rel="noreferrer"
              className="hover:text-blue-700 flex items-center space-x-1">
              <span>Manakonline</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span>•</span>
            <a href="https://lims.bis.gov.in" target="_blank" rel="noreferrer"
              className="hover:text-blue-700 flex items-center space-x-1">
              <span>LIMS Portal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="text-[11px] text-slate-400">
            Department of Consumer Affairs • Bureau of Indian Standards
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
