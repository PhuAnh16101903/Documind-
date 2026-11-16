import axios from 'axios';
import { User, Department, Folder, Document, SearchResult, ChatMessage, Citation } from '../types';

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
  ] as Department[],
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
  ] as Document[],
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
      const q = query.toLowerCase();
      return MockData.documents
        .filter((d) => d.title.toLowerCase().includes(q) || q.includes('công tác') || q.includes('làm việc') || q.includes('bảo mật'))
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

  async queryCopilot(question: string, deptScopeId?: number): Promise<{ answer: string; citations?: Citation[] }> {
    try {
      const res = await api.post('/copilot/query', {
        question,
        department_scope_id: deptScopeId,
      });
      return res.data;
    } catch {
      const q = question.toLowerCase();

      // 1. Unrelated / Out-of-scope questions detection
      const isUnrelated =
        q.includes('nấu') ||
        q.includes('phở') ||
        q.includes('thời tiết') ||
        q.includes('world cup') ||
        q.includes('bóng đá') ||
        q.includes('bài hát') ||
        q.includes('chuyện cười') ||
        q.includes('du lịch sapa') ||
        q.includes('ai là tổng thống');

      if (isUnrelated) {
        return {
          answer: `⚠️ **Phát hiện câu hỏi ngoài phạm vi tri thức doanh nghiệp (Scope Guardrail Active)**:\n\nCâu hỏi này không nằm trong cơ sở dữ liệu quy chế, văn bản hoặc tài liệu nội bộ của công ty.\n\n• **Quy chuẩn DocuMind**: Hệ thống được tối ưu để ngăn ngừa ảo giác (Hallucination) và chỉ trích dẫn các tài liệu có chữ ký số/hiệu lực nội bộ.\n• **Giải đáp thông tin chung**: Nếu bạn cần thông tin về vấn đề này cho mục đích cá nhân, đây là kiến thức phổ quát bên ngoài hệ thống. Tuy nhiên, hệ thống khuyến nghị bạn nên sử dụng DocuMind cho các nhu cầu công việc như tra cứu quy trình, chính sách nhân sự, hạn mức tài chính hoặc tài liệu kỹ thuật!`,
          citations: [],
        };
      }

      // 2. Questions about WHERE a file is located ("ở đâu", "thư mục nào", "đường dẫn")
      if (q.includes('ở đâu') || q.includes('đường dẫn') || q.includes('thư mục') || q.includes('vị trí tệp') || q.includes('nằm ở đâu')) {
        if (q.includes('tài chính') || q.includes('công tác') || q.includes('tiền') || q.includes('khách sạn')) {
          return {
            answer: `📍 **Vị Trí Lưu Trữ Của Tài Liệu**:
• **Tên tệp tin**: \`Quy_Dinh_Cong_Tac_Phi_FIN_v2.docx\`
• **Phòng ban quản lý**: **Phòng Tài Chính - Kế Toán (FIN)** [Nguồn 1]
• **Đường dẫn thư mục**: \`/DoanhNghiep/TaiChinh/2026/Quy_Dinh_Cong_Tac_Phi_FIN_v2.docx\`
• **Dung lượng**: 820 KB • Phiên bản hiện hành: **v2.0**
• **Quyền truy cập**: Nội bộ phòng Tài chính & Nhân viên có phân quyền xem (RBAC Scoped).`,
            citations: [
              {
                citation_index: 1,
                document_id: 2,
                document_title: 'Hạn Mức Công Tác Phí & Tiếp Khách Nội Bộ',
                page_number: 1,
                heading: 'Mục 1. Căn cứ ban hành & Thẩm quyền lưu trữ',
                exact_quoted_text: 'Văn bản được lưu trữ chính thức tại kho dữ liệu Phòng Tài Chính - Kế Toán theo mã hiệu FIN-2026-V2...',
              },
            ],
          };
        } else {
          return {
            answer: `📍 **Vị Trí Lưu Trữ Của Tài Liệu**:
• **Tên tệp tin**: \`Quy_Che_Lam_Viec_Tu_Xa_2026.pdf\`
• **Phòng ban quản lý**: **Phòng Nhân Sự (HR)** [Nguồn 1]
• **Đường dẫn thư mục**: \`/DoanhNghiep/NhanSu/ChinhSachLaoDong/Quy_Che_Lam_Viec_Tu_Xa_2026.pdf\`
• **Dung lượng**: 1.45 MB • Phiên bản: **v1.0**
• **Quyền truy cập**: Công khai toàn doanh nghiệp (Public Document - Mọi nhân viên đều được đọc).`,
            citations: [
              {
                citation_index: 1,
                document_id: 1,
                document_title: 'Quy Chế Làm Việc Từ Xa & Chấm Công 2026',
                page_number: 1,
                heading: 'Điều 1. Phạm vi điều chỉnh & Đơn vị phụ trách',
                exact_quoted_text: 'Quy chế này do Phòng Nhân Sự chủ trì biên soạn và lưu trữ tại hệ sinh thái tri thức DocuMind...',
              },
            ],
          };
        }
      }

      // 3. Questions about WHICH SECTION / CHAPTER / HEADING ("mục nào", "chương nào", "trang mấy")
      if (q.includes('mục nào') || q.includes('chương nào') || q.includes('trang mấy') || q.includes('điều nào') || q.includes('nằm ở mục')) {
        if (q.includes('công tác') || q.includes('khách sạn') || q.includes('tiền')) {
          return {
            answer: `📑 **Vị Trí Mục Lục & Cấu Trúc Điều Khoản**:
Quy định về hạn mức lưu trú và chi phí công tác nằm tại:
• **Chương III: Định Mức Thanh Toán Công Tác Phí Trong Nước**
• **Mục cụ thể**: **Khoản 3 (Tiêu chuẩn khách sạn & phụ cấp lưu trú)** [Nguồn 1]
• **Vị trí trang**: **Trang 5**
• **Trích dẫn điều khoản**: *"Tiêu chuẩn lưu trú tại Hà Nội, TP.HCM và Đà Nẵng áp dụng mức trần thanh toán 1.200.000 VNĐ/ngày theo hóa đơn VAT hợp lệ."*`,
            citations: [
              {
                citation_index: 1,
                document_id: 2,
                document_title: 'Hạn Mức Công Tác Phí & Tiếp Khách Nội Bộ',
                page_number: 5,
                heading: 'Khoản 3. Tiêu chuẩn khách sạn',
                exact_quoted_text: 'Tiêu chuẩn lưu trú tại Hà Nội, TP.HCM và Đà Nẵng áp dụng mức trần thanh toán 1.200.000 VNĐ/ngày...',
              },
            ],
          };
        } else {
          return {
            answer: `📑 **Vị Trí Mục Lục & Cấu Trúc Điều Khoản**:
Quy định này nằm chính xác tại:
• **Chương II: Chế Độ Làm Việc Linh Hoạt & Quy Trình Đăng Ký**
• **Điều khoản**: **Điều 4 (Chế độ làm việc linh hoạt - Remote/Hybrid)** [Nguồn 1]
• **Vị trí trang**: **Trang 3** của tài liệu \`Quy Chế Làm Việc Từ Xa & Chấm Công 2026\`
• **Trích dẫn điều khoản**: *"Cán bộ nhân viên được đăng ký làm việc linh hoạt tối đa 02 ngày trong tuần sau khi hoàn thành thời gian thử việc..."*`,
            citations: [
              {
                citation_index: 1,
                document_id: 1,
                document_title: 'Quy Chế Làm Việc Từ Xa & Chấm Công 2026',
                page_number: 3,
                heading: 'Điều 4. Chế độ làm việc linh hoạt',
                exact_quoted_text: 'Cán bộ nhân viên được đăng ký làm việc linh hoạt (Remote/Hybrid) tối đa 02 ngày trong tuần...',
              },
            ],
          };
        }
      }

      // 4. Questions about WHAT THE CONTENT IS / SUMMARY ("nội dung như thế nào", "tóm tắt", "nội dung ntn")
      if (q.includes('nội dung ntn') || q.includes('nội dung như thế nào') || q.includes('tóm tắt') || q.includes('nội dung là gì')) {
        return {
          answer: `📋 **Tóm Tắt Tổng Quan Nội Dung Văn Bản**:
Dựa trên tài liệu đã lập chỉ mục, các nội dung cốt lõi bao gồm:

1. **Điều kiện áp dụng**: Dành cho nhân viên chính thức hoàn thành thử việc [Nguồn 1].
2. **Quy định thời gian & Hạn mức**: Tối đa 02 ngày làm việc từ xa mỗi tuần; phải đăng ký trước 17:00 ngày Thứ Sáu của tuần trước đó.
3. **Tiêu chuẩn bảo mật**: Bắt buộc kết nối VPN doanh nghiệp, không sử dụng mạng Wi-Fi công cộng không có mật khẩu.
4. **Cơ chế chấm công**: Check-in trên hệ sinh thái nội bộ trước 08:30 sáng [Nguồn 1].`,
          citations: [
            {
              citation_index: 1,
              document_id: 1,
              document_title: 'Quy Chế Làm Việc Từ Xa & Chấm Công 2026',
              page_number: 3,
              heading: 'Điều 4. Chế độ làm việc linh hoạt',
              exact_quoted_text: 'Cán bộ nhân viên được đăng ký làm việc linh hoạt (Remote/Hybrid) tối đa 02 ngày trong tuần...',
            },
          ],
        };
      }

      // 5. Default RAG Answer
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
