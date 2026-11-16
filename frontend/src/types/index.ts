export type SystemRole = 'ADMIN' | 'MANAGER' | 'EMPLOYEE';

export interface User {
  id: number;
  email: string;
  username: string;
  full_name: string;
  role: SystemRole;
  department_id: number | null;
}

export interface Department {
  id: number;
  name: string;
  code: string;
  description?: string;
  quota_mb: number;
}

export interface Folder {
  id: number;
  name: string;
  department_id: number;
  parent_id?: number | null;
}

export interface Document {
  id: number;
  title: string;
  file_name: string;
  file_type: string;
  file_size_bytes: number;
  department_id: number;
  folder_id?: number | null;
  approval_status: 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'ARCHIVED';
  ingestion_status: 'QUEUED' | 'PARSING' | 'CHUNKING' | 'EMBEDDING' | 'INDEXING' | 'INDEXED' | 'FAILED';
  is_public: boolean;
  current_version: number;
  created_at: string;
}

export interface Citation {
  citation_index: number;
  document_id: number;
  document_title: string;
  page_number?: number | null;
  heading?: string | null;
  sheet_name?: string | null;
  exact_quoted_text: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: Citation[];
  timestamp: string;
}

export interface SearchResult {
  document_id: number;
  document_title: string;
  file_type: string;
  department_id: number;
  page_number?: number | null;
  heading?: string | null;
  sheet_name?: string | null;
  snippet: string;
  score: number;
}

export type UIThemeId = 'harmonic' | 'evondev' | 'impeccable' | 'huashu' | 'vibe' | 'promax';

export interface UIThemeInfo {
  id: UIThemeId;
  name: string;
  author: string;
  stars?: string;
  tagline: string;
  badge: string;
  accentColor: string;
  bgClass: string;
  surfaceClass: string;
  cardClass: string;
  borderClass: string;
  buttonClass: string;
  activePillClass: string;
  fontHeading: string;
}

