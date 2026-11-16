import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { KnowledgeExplorer } from './components/KnowledgeExplorer';
import { AICopilot } from './components/AICopilot';
import { AdminDashboard } from './components/AdminDashboard';
import { UploadModal } from './components/UploadModal';
import { HybridSearchBar } from './components/HybridSearchBar';
import { DocumentReader } from './components/DocumentReader';
import { ThemePillBar } from './components/ThemePillBar';
import { ApiService, MockData } from './services/api';
import { Department, Document, Citation, UIThemeId } from './types';
import { THEMES } from './theme/themes';

export const App: React.FC = () => {
  const [currentUser] = useState(MockData.currentUser);
  const [departments, setDepartments] = useState<Department[]>(MockData.departments);
  const [selectedDeptId, setSelectedDeptId] = useState<number | null>(null);
  const [documents, setDocuments] = useState<Document[]>(MockData.documents);
  const [activeTab, setActiveTab] = useState<'knowledge' | 'copilot' | 'analytics'>('knowledge');

  // Dynamic Theme state: Evondev | Impeccable | Huashu | Vibe | ProMax
  const [currentTheme, setCurrentTheme] = useState<UIThemeId>('evondev');

  // Modals state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [activeCitation, setActiveCitation] = useState<Citation | null>(null);

  const activeTheme = THEMES[currentTheme];

  useEffect(() => {
    // Keyboard shortcut Ctrl+K / Cmd+K for Universal Hybrid Search
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
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
    const updatedDocs = await ApiService.getDocuments(selectedDeptId || undefined);
    setDocuments(updatedDocs);
  };

  const filteredDocs = selectedDeptId
    ? documents.filter((d) => d.department_id === selectedDeptId || d.is_public)
    : documents;

  return (
    <div className={`h-screen w-screen flex flex-col ${activeTheme.bgClass} text-slate-100 overflow-hidden font-sans selection:bg-indigo-500/30 selection:text-indigo-200 transition-colors duration-300`}>
      {/* Top Header */}
      <Header
        user={currentUser}
        currentTheme={currentTheme}
        onSelectTheme={setCurrentTheme}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* 5-Theme Quick Pill Strip & Inspector Trigger */}
      <ThemePillBar
        currentTheme={currentTheme}
        onSelectTheme={setCurrentTheme}
      />

      {/* Main Layout Body */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar Navigation */}
        <Sidebar
          departments={departments}
          selectedDeptId={selectedDeptId}
          onSelectDept={(id) => setSelectedDeptId(id)}
          activeTab={activeTab}
          onSelectTab={(tab) => setActiveTab(tab)}
          currentTheme={currentTheme}
        />

        {/* Active View Screen */}
        <main className={`flex-1 flex overflow-hidden ${activeTheme.bgClass} relative transition-colors duration-300`}>
          {activeTab === 'knowledge' && (
            <KnowledgeExplorer
              documents={filteredDocs}
              onSelectDocument={(doc) => setSelectedDoc(doc)}
              onOpenUpload={() => setIsUploadOpen(true)}
              currentTheme={currentTheme}
            />
          )}

          {activeTab === 'copilot' && (
            <AICopilot
              onCitationClick={handleCitationClick}
              currentTheme={currentTheme}
            />
          )}

          {activeTab === 'analytics' && (
            <AdminDashboard currentTheme={currentTheme} />
          )}
        </main>
      </div>

      {/* Modals & Overlay Viewers */}
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
