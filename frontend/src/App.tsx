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

export const App: React.FC = () => {
  // Authentication & Users state
  const [registeredUsers, setRegisteredUsers] = useState<User[]>(MockCorporateUsers);
  const [currentUser, setCurrentUser] = useState<User>(MockCorporateUsers[0]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

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

  // If not authenticated, show Enterprise Login & Register Page
  if (!isAuthenticated) {
    return (
      <AuthPage
        onLoginSuccess={handleLoginSuccess}
        departments={departments}
        availableUsers={registeredUsers}
        onRegisterUser={handleRegisterUser}
      />
    );
  }

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
        isAIPanelOpen={isAIPanelOpen}
        onToggleAIPanel={() => setIsAIPanelOpen((prev) => !prev)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onLogout={handleLogout}
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
            <div className="flex-1 flex overflow-hidden">
              <KnowledgeExplorer
                documents={filteredDocs}
                onSelectDocument={(doc) => setSelectedDoc(doc)}
                onOpenUpload={() => setIsUploadOpen(true)}
                onAskAI={(doc) => {
                  setPresetAIPrompt(`Tóm tắt các quy định chính và trích dẫn điều khoản trong tài liệu "${doc.title}"`);
                  setIsAIPanelOpen(true);
                }}
                currentTheme="harmonic"
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
                />
              )}
            </div>
          )}

          {activeTab === 'copilot' && (
            <AICopilot
              onCitationClick={handleCitationClick}
              currentTheme="harmonic"
              currentUser={currentUser}
            />
          )}

          {activeTab === 'analytics' && (
            <AdminDashboard currentTheme="harmonic" />
          )}
        </main>
      </div>

      {/* Modals & Overlay Viewers */}
      <SettingsModal
        isOpen={isSettingsOpen}
        currentUser={currentUser}
        onClose={() => setIsSettingsOpen(false)}
        onLogout={handleLogout}
        onUpdateUser={(u) => setCurrentUser(u)}
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
