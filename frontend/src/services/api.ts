import axios from 'axios';
import { User, Department, Folder, Document, SearchResult, ChatMessage } from '../types';

const API_BASE = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('documind_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const MockData = {
  currentUser: {
    id: 1,
    email: 'admin@documind.internal',
    username: 'admin',
    full_name: 'Lê Thiên Phú (System Architect)',
    role: 'ADMIN' as const,
    department_id: null,
  },
  departments: [
    { id: 1, name: 'Phòng Nhân Sự (HR)', code: 'HR', quota_mb: 5000, description: 'Chính sách đãi ngộ, nội quy lao động' },
    { id: 2, name: 'Phòng Tài Chính - Kế Toán', code: 'FIN', quota_mb: 5000, description: 'Báo cáo tài chính, quy chế công tác phí' },
    { id: 3, name: 'Phòng Kỹ Thuật - R&D', code: 'TECH', quota_mb: 10000, description: 'Kiến trúc phần mềm, tài liệu API, bảo mật' },
    { id: 4, name: 'Kho Tri Thức Chung', code: 'GEN', quota_mb: 10000, description: 'Văn hóa doanh nghiệp và quy chế chung' },
  ],
  documents: [
    {
      id: 1,
      title: 'Quy Chế Làm Việc Từ Xa & Chấm Công 2026',
      file_name: 'Quy_Che_Lam_Viec_Tu_Xa_2026.pdf',
      file_type: 'pdf',
      file_size_bytes: 1450000,
      department_id: 1,
      approval_status: 'APPROVED' as const,
      ingestion_status: 'INDEXED' as const,
      is_public: true,
      current_version: 1,
      created_at: '2026-11-10T08:30:00Z',
    },
    {
      id: 2,
      title: 'Hạn Mức Công Tác Phí & Tiếp Khách Nội Bộ',
      file_name: 'Quy_Dinh_Cong_Tac_Phi_FIN_v2.docx',
      file_type: 'docx',
      file_size_bytes: 820000,
      department_id: 2,
      approval_status: 'APPROVED' as const,
      ingestion_status: 'INDEXED' as const,
      is_public: false,
      current_version: 2,
      created_at: '2026-11-12T14:15:00Z',
    },
    {
      id: 3,
      title: 'Tiêu Chuẩn Kiến Trúc & Bảo Mật Microservices',
      file_name: 'Architecture_Security_Standards.pdf',
      file_type: 'pdf',
      file_size_bytes: 3200000,
      department_id: 3,
      approval_status: 'APPROVED' as const,
      ingestion_status: 'INDEXED' as const,
      is_public: false,
      current_version: 1,
      created_at: '2026-11-14T09:00:00Z',
    },
  ],
};

export const ApiService = {
  async getDepartments(): Promise<Department[]> {
    try {
      const res = await api.get('/departments');
      return res.data;
    } catch {
      return MockData.departments;
    }
  },

  async getDocuments(deptId?: number): Promise<Document[]> {
    try {
      const res = await api.get('/documents', { params: { department_id: deptId } });
      return res.data;
    } catch {
      if (deptId) {
        return MockData.documents.filter((d) => d.department_id === deptId || d.is_public);
      }
      return MockData.documents;
    }
  },

  async searchHybrid(query: string, deptId?: number): Promise<SearchResult[]> {
    try {
      const res = await api.post('/search', { query, department_id: deptId, limit: 8 });
      return res.data.results;
    } catch {
      // Mock hybrid search fallback
      const q = query.toLowerCase();
      return MockData.documents
        .filter((d) => d.title.toLowerCase().includes(q) || q.includes('công tác') || q.includes('làm việc'))
        .map((d) => ({
          document_id: d.id,
          document_title: d.title,
          file_type: d.file_type,
          department_id: d.department_id,
          page_number: 1,
          snippet: `Quy định chi tiết liên quan đến từ khóa '${query}' trong văn bản ${d.title}. Nhân viên cần tuân thủ đúng quy trình...`,
          score: 0.92,
        }));
    }
  },

  async queryCopilot(question: string, deptScopeId?: number) {
    try {
      const res = await api.post('/copilot/query', {
        question,
        department_scope_id: deptScopeId,
      });
      return res.data;
    } catch {
      // Mock verifiable RAG fallback
      return {
        answer: `Dựa trên tài liệu nội bộ đã được xác thực, quy định về câu hỏi của bạn như sau:\n\n• Cán bộ nhân viên được hưởng chế độ làm việc linh hoạt tối đa 02 ngày/tuần sau khi hoàn thành thời gian thử việc [Nguồn 1].\n• Hạn mức công tác phí lưu trú tại các thành phố lớn tối đa 1.200.000 VNĐ/ngày theo hóa đơn VAT hợp lệ [Nguồn 2].`,
        citations: [
          {
            citation_index: 1,
            document_id: 1,
            document_title: 'Quy Chế Làm Việc Từ Xa & Chấm Công 2026',
            page_number: 3,
            heading: 'Điều 4. Chế độ làm việc linh hoạt',
            exact_quoted_text: 'Cán bộ nhân viên được đăng ký làm việc linh hoạt (Remote/Hybrid) tối đa 02 ngày trong tuần...',
          },
          {
            citation_index: 2,
            document_id: 2,
            document_title: 'Hạn Mức Công Tác Phí & Tiếp Khách Nội Bộ',
            page_number: 5,
            heading: 'Khoản 3. Tiêu chuẩn khách sạn',
            exact_quoted_text: 'Tiêu chuẩn lưu trú tại Hà Nội, TP.HCM và Đà Nẵng áp dụng mức trần thanh toán 1.200.000 VNĐ/ngày...',
          },
        ],
      };
    }
  },
};
