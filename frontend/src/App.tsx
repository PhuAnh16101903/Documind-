import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { KnowledgeExplorer } from './components/KnowledgeExplorer';
import { AICopilot } from './components/AICopilot';
import { AdminDashboard } from './components/AdminDashboard';
import { UploadModal } from './components/UploadModal';
import { HybridSearchBar } from './components/HybridSearchBar';
import { DocumentReader } from './components/DocumentReader';
import { SettingsModal } from './components/SettingsModal';
import { AuthPage } from './components/AuthPage';
import { ApiService, MockCorporateUsers, MockData } from './services/api';
import { Department, Document, Citation, User } from './types';
import { Language, translations } from './services/i18n';

export const App: React.FC = () => {
  // Authentication & Users state
  const [registeredUsers, setRegisteredUsers] = useState<User[]>(MockCorporateUsers);
  const [currentUser, setCurrentUser] = useState<User>(MockCorporateUsers[0]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Language state: 'vi' | 'en' (Full bilingual support)
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('documind_lang');
    return saved === 'en' || saved === 'vi' ? saved : 'vi';
  });

  const toggleLang = () => {
    setLang((prev) => {
      const next = prev === 'vi' ? 'en' : 'vi';
      localStorage.setItem('documind_lang', next);
      return next;
    });
  };

  const t = translations[lang];

  // Theme state: 'light' | 'dark' (Default to light matching reference images)
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('documind_theme');
    return saved === 'dark' || saved === 'light' ? saved : 'light';
  });

  const toggleTheme = () => {
    setThemeMode((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('documind_theme', next);
      return next;
    });
  };

  // Departments & Documents state
  const [departments, setDepartments] = useState<Department[]>(MockData.departments);
  const [selectedDeptId, setSelectedDeptId] = useState<number | null>(null);
  const [documents, setDocuments] = useState<Document[]>(MockData.documents);
  const [activeTab, setActiveTab] = useState<'knowledge' | 'copilot' | 'analytics'>('knowledge');

  // AI Docked Panel State
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(true);
  const [presetAIPrompt, setPresetAIPrompt] = useState<string | null>(null);

  // Modals state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [activeCitation, setActiveCitation] = useState<Citation | null>(null);

  useEffect(() => {
    // Keyboard shortcut Ctrl+K / Cmd+K for Universal Hybrid Search
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsSettingsOpen(false);
        setSelectedDoc(null);
        setActiveCitation(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCitationClick = (citation: Citation) => {
    setActiveCitation(citation);
    setSelectedDoc(null);
  };

  const handleSelectResult = (docId: number) => {
    const doc = documents.find((d) => d.id === docId);
    if (doc) setSelectedDoc(doc);
  };

  const handleUploadSuccess = async () => {
    const updatedDocs = await ApiService.getDocuments(selectedDeptId || undefined, currentUser);
    setDocuments(updatedDocs);
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    // Auto select department view if regular employee
    if (user.role !== 'ADMIN' && user.department_id) {
      setSelectedDeptId(user.department_id);
    } else {
      setSelectedDeptId(null);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setSelectedDoc(null);
    setActiveCitation(null);
    setIsSettingsOpen(false);
  };

  const handleRegisterUser = (newUser: User) => {
    setRegisteredUsers((prev) => [...prev, newUser]);
  };

  // 1. Filter by selected department in sidebar
  const deptFiltered = selectedDeptId
    ? documents.filter((d) => d.department_id === selectedDeptId || d.is_public)
    : documents;

  // 2. Automatically enforce RBAC security boundary based on logged-in currentUser
  const filteredDocs =
    currentUser.role === 'ADMIN'
      ? deptFiltered
      : deptFiltered.filter(
          (d) => d.is_public || d.department_id === currentUser.department_id
        );

  // If not authenticated, show Enterprise Login & Register Page with animated aquatic cube
  if (!isAuthenticated) {
    return (
      <div className={themeMode === 'dark' ? 'dark' : ''}>
        <AuthPage
          onLoginSuccess={handleLoginSuccess}
          departments={departments}
          availableUsers={registeredUsers}
          onRegisterUser={handleRegisterUser}
          themeMode={themeMode}
          onToggleTheme={toggleTheme}
          onOpenSearch={() => setIsSearchOpen(true)}
          lang={lang}
          onToggleLang={toggleLang}
        />
        <HybridSearchBar
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          onSelectResult={handleSelectResult}
          lang={lang}
        />
      </div>
    );
  }

  const isLight = themeMode === 'light';

  return (
    <div
      className={`h-screen w-screen flex flex-col overflow-hidden font-sans selection:bg-indigo-500/20 selection:text-indigo-900 relative transition-colors duration-200 ${
        themeMode === 'dark' ? 'dark bg-[#060c18] text-slate-100' : 'bg-[#f4f7fb] text-slate-900'
      }`}
    >
      {/* Top Header */}
      <Header
        user={currentUser}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        isAIPanelOpen={isAIPanelOpen}
        onToggleAIPanel={() => setIsAIPanelOpen((prev) => !prev)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onLogout={handleLogout}
        themeMode={themeMode}
        onToggleTheme={toggleTheme}
        lang={lang}
        onToggleLang={toggleLang}
      />

      {/* Main Layout Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <Sidebar
          departments={departments}
          selectedDeptId={selectedDeptId}
          onSelectDept={(id) => setSelectedDeptId(id)}
          activeTab={activeTab}
          onSelectTab={(tab) => setActiveTab(tab)}
          user={currentUser}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onLogout={handleLogout}
          themeMode={themeMode}
          lang={lang}
        />

        {/* Active View Screen */}
        <main className="flex-1 flex overflow-hidden relative">
          {activeTab === 'knowledge' && (
            <div className="flex-1 flex overflow-hidden">
              <KnowledgeExplorer
                documents={filteredDocs}
                onSelectDocument={(doc) => setSelectedDoc(doc)}
                onOpenUpload={() => setIsUploadOpen(true)}
                onAskAI={(doc) => {
                  setPresetAIPrompt(
                    lang === 'vi'
                      ? `Tóm tắt các quy định chính và trích dẫn điều khoản trong tài liệu ${doc.title}`
                      : `Summarize the core provisions and citations in document ${doc.title}`
                  );
                  setIsAIPanelOpen(true);
                }}
                currentTheme="harmonic"
                themeMode={themeMode}
                lang={lang}
              />
              {isAIPanelOpen && (
                <AICopilot
                  isDocked={true}
                  onClose={() => setIsAIPanelOpen(false)}
                  presetPrompt={presetAIPrompt}
                  onClearPresetPrompt={() => setPresetAIPrompt(null)}
                  onCitationClick={handleCitationClick}
                  currentTheme="harmonic"
                  currentUser={currentUser}
                  lang={lang}
                />
              )}
            </div>
          )}

          {activeTab === 'copilot' && (
            <AICopilot
              onCitationClick={handleCitationClick}
              currentTheme="harmonic"
              currentUser={currentUser}
              lang={lang}
            />
          )}

          {activeTab === 'analytics' && (
            <AdminDashboard currentTheme="harmonic" />
          )}
        </main>
      </div>

      {/* Floating Shortcut Pill "Đi đến... Ctrl / ⌘ K" */}
      <div
        className={`fixed bottom-5 z-40 transition-all duration-300 ${
          isAIPanelOpen && activeTab === 'knowledge' ? 'right-[405px]' : 'right-6'
        }`}
      >
        <button
          onClick={() => setIsSearchOpen(true)}
          className={`h-10 px-4 rounded-xl border text-xs font-semibold flex items-center gap-2 shadow-lg hover:border-indigo-500 hover:scale-105 active:scale-95 transition-all cursor-pointer ${
            isLight
              ? 'bg-white/95 text-slate-800 border-slate-300'
              : 'bg-slate-900/95 text-slate-200 border-slate-700'
          }`}
          title={t.searchPlaceholder}
        >
          <span>{t.goTo}</span>
          <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">
            Ctrl / ⌘ K
          </kbd>
        </button>
      </div>

      {/* Modals & Overlay Viewers */}
      <SettingsModal
        isOpen={isSettingsOpen}
        currentUser={currentUser}
        onClose={() => setIsSettingsOpen(false)}
        onLogout={handleLogout}
        onUpdateUser={(u) => setCurrentUser(u)}
        lang={lang}
      />

      <UploadModal
        isOpen={isUploadOpen}
        departments={departments}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />

      <HybridSearchBar
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectResult={handleSelectResult}
        lang={lang}
      />

      {(selectedDoc || activeCitation) && (
        <DocumentReader
          document={selectedDoc}
          citation={activeCitation}
          onClose={() => {
            setSelectedDoc(null);
            setActiveCitation(null);
          }}
        />
      )}
    </div>
  );
};

export default App;
