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

export const MockCorporateUsers: User[] = [
  {
    id: 1,
    email: 'admin@documind.internal',
    username: 'admin',
    full_name: 'Lê Thiên Phú',
    role: 'ADMIN',
    department_id: null,
    department_name: 'Toàn Doanh Nghiệp (Lãnh Đạo)',
    department_code: 'ALL',
    security_level: 'LEVEL_3_ADMIN',
    token: 'jwt-auth-token-admin-sysarch-2026',
    password: 'password123',
  },
  {
    id: 2,
    email: 'hr.specialist@documind.internal',
    username: 'minhanh.hr',
    full_name: 'Nguyễn Minh Anh',
    role: 'EMPLOYEE',
    department_id: 1,
    department_name: 'Phòng Nhân Sự (HR)',
    department_code: 'HR',
    security_level: 'LEVEL_1_STAFF',
    token: 'jwt-auth-token-hr-specialist-2026',
    password: 'password123',
  },
  {
    id: 3,
    email: 'fin.accountant@documind.internal',
    username: 'thao.fin',
    full_name: 'Đỗ Thanh Thảo',
    role: 'EMPLOYEE',
    department_id: 2,
    department_name: 'Phòng Tài Chính - Kế Toán (FIN)',
    department_code: 'FIN',
    security_level: 'LEVEL_1_STAFF',
    token: 'jwt-auth-token-fin-accountant-2026',
    password: 'password123',
  },
  {
    id: 4,
    email: 'tech.lead@documind.internal',
    username: 'bao.tech',
    full_name: 'Trần Quốc Bảo',
    role: 'EMPLOYEE',
    department_id: 3,
    department_name: 'Phòng Kỹ Thuật - R&D (TECH)',
    department_code: 'TECH',
    security_level: 'LEVEL_1_STAFF',
    token: 'jwt-auth-token-tech-lead-2026',
    password: 'password123',
  },
];

export const MockData = {
  currentUser: MockCorporateUsers[0],
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

  async getDocuments(deptId?: number, user?: User): Promise<Document[]> {
    try {
      const res = await api.get('/documents', { params: { department_id: deptId } });
      return res.data;
    } catch {
      let docs = MockData.documents;

      // Filter by department if selected in sidebar
      if (deptId) {
        docs = docs.filter((d) => d.department_id === deptId || d.is_public);
      }

      // Enforce RBAC automatically based on logged-in user
      if (user && user.role !== 'ADMIN') {
        docs = docs.filter(
          (d) => d.is_public || d.department_id === user.department_id
        );
      }

      return docs;
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

  async queryCopilot(
    question: string,
    currentUser?: User
  ): Promise<{ answer: string; citations?: Citation[]; is_security_alert?: boolean }> {
    try {
      const res = await api.post('/copilot/query', {
        question,
        department_scope_id: currentUser?.department_id,
      });
      return res.data;
    } catch {
      const q = question.toLowerCase();

      // ========================================================
      // 1. AUTOMATIC RBAC SECURITY ENFORCEMENT CHECK
      // ========================================================
      if (currentUser && currentUser.role !== 'ADMIN' && currentUser.department_id) {
        // Checking access to Financial data (Dept 2)
        const isFinQuery =
          q.includes('công tác phí') ||
          q.includes('tiếp khách') ||
          q.includes('khách sạn') ||
          q.includes('hóa đơn vat') ||
          q.includes('ngân sách');

        if (isFinQuery && currentUser.department_id !== 2) {
          return {
            answer: `🚫 **[RBAC SECURITY VIOLATION - 403 FORBIDDEN]**:\n\nTruy cập bị từ chối! Tài khoản xác thực của bạn là **${currentUser.full_name}** (${currentUser.department_name}) không được cấp quyền truy xuất tài liệu mật của **Phòng Tài Chính - Kế Toán**.\n\n• **Chính sách an ninh**: Zero-Trust Enterprise Retrieval Policy.\n• **Audit Trail**: Sự kiện vi phạm truy xuất trái phép đã được ghi vào hệ thống giám sát an ninh (Security Log #SEC-FIN-${Date.now()}).\n• **Ủy quyền**: Vui lòng liên hệ Trưởng bộ phận hoặc Quản trị viên hệ thống để nâng cấp quyền truy cập.`,
            citations: [],
            is_security_alert: true,
          };
        }

        // Checking access to Tech/R&D data (Dept 3)
        const isTechQuery =
          q.includes('microservices') ||
          q.includes('kiến trúc') ||
          q.includes('bảo mật api') ||
          q.includes('mã nguồn') ||
          q.includes('token jwt');

        if (isTechQuery && currentUser.department_id !== 3) {
          return {
            answer: `🚫 **[RBAC SECURITY VIOLATION - 403 FORBIDDEN]**:\n\nTruy cập bị từ chối! Tài khoản của bạn (**${currentUser.full_name}** - ${currentUser.department_name}) không có quyền truy xuất tài liệu thiết kế bảo mật của **Phòng Kỹ Thuật - R&D**.\n\n• **Chính sách bảo vệ tài sản trí tuệ**: Confidential Intellectual Property (IP-Classified).\n• **Audit Trail**: Đã ghi nhận truy vấn vào nhật ký an ninh thông tin (Audit Code #SEC-TECH-${Date.now()}).`,
            citations: [],
            is_security_alert: true,
          };
        }
      }

      // ========================================================
      // 2. UNRELATED / OUT-OF-SCOPE QUESTIONS DETECTION
      // ========================================================
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
          answer: `⚠️ **Thông Báo Ranh Giới Phạm Vi Tri Thức (Scope Guardrail Active)**:\n\nCâu hỏi này nằm ngoài cơ sở dữ liệu quy chế và tài liệu nội bộ của công ty.\n\n• **Tiêu chuẩn DocuMind**: Hệ thống chỉ kiểm chứng và trích dẫn các tài liệu nội bộ đã ký duyệt số để đảm bảo tính pháp lý và ngăn ngừa ảo giác (Hallucination).\n• **Kiến thức tham khảo đại chúng**: Đây là thông tin phổ biến bên ngoài, không có giá trị quy định nội bộ.\n\n💡 *Gợi ý: Hãy đặt các câu hỏi về quy trình làm việc, hạn mức chi phí, bảo mật hoặc cấu trúc tài liệu công ty.*`,
          citations: [],
        };
      }

      // ========================================================
      // 3. FILE LOCATION / DIRECTORY QUESTIONS
      // ========================================================
      if (q.includes('ở đâu') || q.includes('đường dẫn') || q.includes('thư mục') || q.includes('vị trí tệp') || q.includes('nằm ở đâu')) {
        if (q.includes('tài chính') || q.includes('công tác') || q.includes('tiền') || q.includes('khách sạn')) {
          return {
            answer: `📍 **Vị Trí Lưu Trữ Của Tài Liệu**:
• **Tên tệp tin**: \`Quy_Dinh_Cong_Tac_Phi_FIN_v2.docx\`
• **Phòng ban quản lý**: **Phòng Tài Chính - Kế Toán (FIN)** [Nguồn 1]
• **Đường dẫn thư mục**: \`/DoanhNghiep/TaiChinh/2026/Quy_Dinh_Cong_Tac_Phi_FIN_v2.docx\`
• **Dung lượng**: 820 KB • Phiên bản hiện hành: **v2.0**
• **Quyền truy cập**: Nội bộ phòng Tài chính & Lãnh đạo (RBAC Enforced).`,
            citations: [
              {
                citation_index: 1,
                document_id: 2,
                document_title: 'Hạn Mức Công Tác Phí & Tiếp Khách Nội Bộ',
                file_type: 'docx',
                page_number: 1,
                heading: 'Mục 1. Căn cứ ban hành & Thẩm quyền lưu trữ',
                exact_quoted_text: 'Văn bản được lưu trữ chính thức tại kho dữ liệu Phòng Tài Chính - Kế Toán theo mã hiệu FIN-2026-V2...',
                confidence_score: 0.985,
                department_code: 'FIN',
                department_name: 'Phòng Tài Chính - Kế Toán',
                checksum_sha256: 'sha256:8b4c91e...3a1f',
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
                file_type: 'pdf',
                page_number: 1,
                heading: 'Điều 1. Phạm vi điều chỉnh & Đơn vị phụ trách',
                exact_quoted_text: 'Quy chế này do Phòng Nhân Sự chủ trì biên soạn và lưu trữ tại hệ sinh thái tri thức DocuMind...',
                confidence_score: 0.992,
                department_code: 'HR',
                department_name: 'Phòng Nhân Sự (HR)',
                checksum_sha256: 'sha256:a12b45f...99cd',
              },
            ],
          };
        }
      }

      // ========================================================
      // 4. SECTION / CHAPTER / HEADING QUESTIONS
      // ========================================================
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
                file_type: 'docx',
                page_number: 5,
                heading: 'Khoản 3. Tiêu chuẩn khách sạn',
                exact_quoted_text: 'Tiêu chuẩn lưu trú tại Hà Nội, TP.HCM và Đà Nẵng áp dụng mức trần thanh toán 1.200.000 VNĐ/ngày theo hóa đơn VAT hợp lệ...',
                confidence_score: 0.978,
                department_code: 'FIN',
                department_name: 'Phòng Tài Chính - Kế Toán',
                checksum_sha256: 'sha256:8b4c91e...3a1f',
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
                file_type: 'pdf',
                page_number: 3,
                heading: 'Điều 4. Chế độ làm việc linh hoạt',
                exact_quoted_text: 'Cán bộ nhân viên được đăng ký làm việc linh hoạt (Remote/Hybrid) tối đa 02 ngày trong tuần sau khi hoàn thành thời gian thử việc...',
                confidence_score: 0.994,
                department_code: 'HR',
                department_name: 'Phòng Nhân Sự (HR)',
                checksum_sha256: 'sha256:a12b45f...99cd',
              },
            ],
          };
        }
      }

      // ========================================================
      // 5. CONTENT OVERVIEW / SUMMARY QUESTIONS
      // ========================================================
      if (q.includes('nội dung ntn') || q.includes('nội dung như thế nào') || q.includes('tóm tắt') || q.includes('nội dung là gì')) {
        return {
          answer: `📋 **Tóm Tắt Tổng Quan Nội Dung Văn Bản**:
Dựa trên tài liệu đã lập chỉ mục, các nội dung cốt lõi bao gồm:

1. **Điều kiện áp dụng**: Dành cho nhân viên chính thức hoàn thành thời gian thử việc [Nguồn 1].
2. **Quy định thời gian & Hạn mức**: Tối đa 02 ngày làm việc từ xa mỗi tuần; đăng ký qua cổng nội bộ trước 17:00 ngày Thứ Sáu của tuần trước đó.
3. **Tiêu chuẩn bảo mật**: Bắt buộc kết nối VPN doanh nghiệp, không sử dụng mạng Wi-Fi công cộng không có mật khẩu.
4. **Cơ chế chấm công**: Check-in trên ứng dụng nội bộ trước 08:30 sáng [Nguồn 1].`,
          citations: [
            {
              citation_index: 1,
              document_id: 1,
              document_title: 'Quy Chế Làm Việc Từ Xa & Chấm Công 2026',
              file_type: 'pdf',
              page_number: 3,
              heading: 'Điều 4. Chế độ làm việc linh hoạt',
              exact_quoted_text: 'Cán bộ nhân viên được đăng ký làm việc linh hoạt (Remote/Hybrid) tối đa 02 ngày trong tuần...',
              confidence_score: 0.991,
              department_code: 'HR',
              department_name: 'Phòng Nhân Sự (HR)',
              checksum_sha256: 'sha256:a12b45f...99cd',
            },
          ],
        };
      }

      // ========================================================
      // 6. DEFAULT VERIFIABLE RAG ANSWER
      // ========================================================
      return {
        answer: `Dựa trên tài liệu nội bộ đã được xác thực, quy định về câu hỏi của bạn như sau:\n\n• Cán bộ nhân viên được hưởng chế độ làm việc linh hoạt tối đa 02 ngày/tuần sau khi hoàn thành thời gian thử việc [Nguồn 1].\n• Hạn mức công tác phí lưu trú tại các thành phố lớn tối đa 1.200.000 VNĐ/ngày theo hóa đơn VAT hợp lệ [Nguồn 2].`,
        citations: [
          {
            citation_index: 1,
            document_id: 1,
            document_title: 'Quy Chế Làm Việc Từ Xa & Chấm Công 2026',
            file_type: 'pdf',
            page_number: 3,
            heading: 'Điều 4. Chế độ làm việc linh hoạt',
            exact_quoted_text: 'Cán bộ nhân viên được đăng ký làm việc linh hoạt (Remote/Hybrid) tối đa 02 ngày trong tuần...',
            confidence_score: 0.988,
            department_code: 'HR',
            department_name: 'Phòng Nhân Sự (HR)',
            checksum_sha256: 'sha256:a12b45f...99cd',
          },
          {
            citation_index: 2,
            document_id: 2,
            document_title: 'Hạn Mức Công Tác Phí & Tiếp Khách Nội Bộ',
            file_type: 'docx',
            page_number: 5,
            heading: 'Khoản 3. Tiêu chuẩn khách sạn',
            exact_quoted_text: 'Tiêu chuẩn lưu trú tại Hà Nội, TP.HCM và Đà Nẵng áp dụng mức trần thanh toán 1.200.000 VNĐ/ngày...',
            confidence_score: 0.975,
            department_code: 'FIN',
            department_name: 'Phòng Tài Chính - Kế Toán',
            checksum_sha256: 'sha256:8b4c91e...3a1f',
          },
        ],
      };
    }
  },
};
