import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { KnowledgeExplorer } from './components/KnowledgeExplorer';
import { AICopilot } from './components/AICopilot';
import { AdminDashboard } from './components/AdminDashboard';
import { UploadModal } from './components/UploadModal';
import { HybridSearchBar } from './components/HybridSearchBar';
import { DocumentReader } from './components/DocumentReader';
import { ApiService, MockData } from './services/api';
import { Department, Document, Citation } from './types';

export const App: React.FC = () => {
  const [currentUser] = useState(MockData.currentUser);
  const [departments, setDepartments] = useState<Department[]>(MockData.departments);
  const [selectedDeptId, setSelectedDeptId] = useState<number | null>(null);
  const [documents, setDocuments] = useState<Document[]>(MockData.documents);
  const [activeTab, setActiveTab] = useState<'knowledge' | 'copilot' | 'analytics'>('knowledge');

  // Modals state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
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
    <div className="h-screen w-screen flex flex-col bg-slate-100 text-slate-900 overflow-hidden font-sans selection:bg-indigo-500/20 selection:text-indigo-900 relative">
      {/* Floating Gentle Ambient Light Orbs */}
      <div className="ambient-orb-indigo" />
      <div className="ambient-orb-cyan" />
      <div className="ambient-orb-rose" />

      {/* Top Header */}
      <Header
        user={currentUser}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
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
          currentTheme="harmonic"
        />

        {/* Active View Screen */}
        <main className="flex-1 flex overflow-hidden bg-slate-100">
          {activeTab === 'knowledge' && (
            <KnowledgeExplorer
              documents={filteredDocs}
              onSelectDocument={(doc) => setSelectedDoc(doc)}
              onOpenUpload={() => setIsUploadOpen(true)}
              currentTheme="harmonic"
            />
          )}

          {activeTab === 'copilot' && (
            <AICopilot
              onCitationClick={handleCitationClick}
              currentTheme="harmonic"
            />
          )}

          {activeTab === 'analytics' && (
            <AdminDashboard currentTheme="harmonic" />
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
