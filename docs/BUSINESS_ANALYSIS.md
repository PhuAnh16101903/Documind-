# BUSINESS ANALYSIS DOCUMENT
# DOCUMIND – ENTERPRISE KNOWLEDGE BASE & VERIFIABLE AI RETRIEVAL SYSTEM

**Phiên bản:** 1.1  
**Loại tài liệu:** Business Analysis Specification  
**Trạng thái:** Đề xuất – Baseline để phát triển  
**Đối tượng sử dụng:** Ban quản lý, nhân viên, quản trị viên doanh nghiệp  
**Định hướng:** Fullstack Web Application – AI-powered Knowledge Management  
**Quy mô triển khai ban đầu:** Một doanh nghiệp, nhiều phòng ban, nhiều người dùng

---

# PHẦN I. TỔNG QUAN DỰ ÁN

## 1.1. Bối cảnh nghiệp vụ
Trong doanh nghiệp, tài liệu thường được lưu trữ tại nhiều vị trí khác nhau như Google Drive, máy tính cá nhân, email, hệ thống quản lý nội bộ và các thư mục dùng chung.

Điều này dẫn đến các vấn đề:
- Nhân viên mất nhiều thời gian tìm kiếm thông tin.
- Tài liệu bị phân tán, trùng lặp và khó kiểm soát phiên bản.
- Nhân viên không biết tài liệu nào là bản chính thức.
- Việc tìm kiếm bằng từ khóa truyền thống không hiểu được ý nghĩa câu hỏi.
- Nhân viên có thể không biết hoặc không được phép truy cập tài liệu của phòng ban khác.
- Ban quản lý khó nắm bắt nhu cầu thông tin của nhân viên.
- Việc hỏi đáp nội bộ phụ thuộc nhiều vào kinh nghiệm của từng cá nhân.

Do đó, doanh nghiệp cần một hệ thống tập trung để quản lý, tổ chức, tìm kiếm và khai thác tri thức từ tài liệu nội bộ.

## 1.2. Tuyên ngôn sản phẩm
DocuMind là nền tảng quản trị tri thức doanh nghiệp kết hợp trí tuệ nhân tạo, giúp chuyển đổi tài liệu nội bộ thành nguồn tri thức có thể tìm kiếm, truy xuất và khai thác thông qua ngôn ngữ tự nhiên.

Hệ thống cung cấp khả năng:
- Quản lý tài liệu tập trung theo phòng ban.
- Kiểm soát quyền truy cập theo người dùng và nhóm (RBAC + ACL).
- Tự động trích xuất, phân tích và lập chỉ mục tài liệu.
- Tìm kiếm bằng từ khóa và ngữ nghĩa (Hybrid Search).
- Hỏi đáp với AI dựa trên tài liệu được cấp quyền.
- Trích dẫn nguồn có thể kiểm chứng (Verifiable Citation).
- Theo dõi lịch sử hoạt động và thống kê khai thác tri thức (Audit Log & Dashboard).

## 1.3. Mục tiêu kinh doanh
| Mã | Mục tiêu | Kết quả mong muốn |
|---|---|---|
| OBJ01 | Tập trung hóa dữ liệu | Tài liệu được quản lý tại một nền tảng thống nhất |
| OBJ02 | Rút ngắn thời gian tìm kiếm | Nhân viên tìm được thông tin nhanh hơn |
| OBJ03 | Tăng khả năng khai thác dữ liệu | Có thể hỏi đáp bằng ngôn ngữ tự nhiên |
| OBJ04 | Bảo mật thông tin | Người dùng chỉ tiếp cận dữ liệu được cấp quyền |
| OBJ05 | Nâng cao độ tin cậy | Câu trả lời AI có nguồn dẫn chứng có kiểm chứng |
| OBJ06 | Tăng hiệu quả quản trị | Ban quản lý theo dõi được hoạt động khai thác tài liệu |
| OBJ07 | Giảm công việc thủ công | Tự động xử lý và lập chỉ mục tài liệu |

## 1.4. Chỉ số đánh giá thành công (KPI)
| KPI | Mục tiêu đề xuất |
|---|---|
| Tỷ lệ upload tài liệu thành công | ≥ 98% với file hợp lệ |
| Tỷ lệ tìm thấy tài liệu liên quan | ≥ 85% trên bộ dữ liệu đánh giá |
| Recall@10 của tìm kiếm | ≥ 85% trên bộ truy vấn chuẩn |
| Tỷ lệ câu trả lời có trích dẫn hợp lệ | ≥ 95% trên bộ câu hỏi có đủ nguồn |
| Tỷ lệ truy cập trái phép thành công | 0 (Zero Security Breach) |
| Tỷ lệ tác vụ ingestion được xử lý thành công | ≥ 98%, không tính file không hợp lệ |
| Tỷ lệ truy vấn được ghi nhận đầy đủ | ≥ 99% |
| Mức độ hài lòng của người dùng | ≥ 80% đánh giá tích cực |

---

# PHẦN II. PHẠM VI SẢN PHẨM (12 PHÂN HỆ)

| STT | Phân hệ | Mức độ |
|---|---|---|
| 1 | Quản lý tài khoản và xác thực (Auth & Profile) | P0 |
| 2 | Quản lý phòng ban và phân quyền (RBAC & ACL) | P0 |
| 3 | Quản trị kho tri thức và thư mục (Knowledge & Folders) | P0 |
| 4 | Upload và xử lý tài liệu (Multi-format Ingestion Pipeline) | P0 |
| 5 | Quản lý vòng đời và phiên bản tài liệu (Lifecycle & Versioning) | P0 |
| 6 | Tìm kiếm tài liệu Hybrid Search (BM25 + Vector Search) | P0 |
| 7 | AI Copilot và hỏi đáp RAG (Strict Grounding & SSE) | P0 |
| 8 | Citation Viewer và Document Reader (Highlight & Source Jump) | P0 |
| 9 | Quản lý hội thoại và lịch sử truy vấn | P1 |
| 10 | Dashboard và báo cáo quản trị | P1 |
| 11 | Audit Log và thông báo | P1 |
| 12 | Quản trị cấu hình và hiệu suất hệ thống | P1 |

---

# PHẦN III. MA TRẬN PHÂN QUYỀN VÀ ACTORS

### Danh sách Actor:
- **ACT01 – System Administrator:** Quản trị viên toàn hệ thống.
- **ACT02 – Department Manager:** Trưởng phòng ban (Quản lý kho tài liệu, duyệt tài liệu, xem báo cáo phòng ban).
- **ACT03 – Employee:** Nhân viên (Tìm kiếm, hỏi đáp AI, xem trích dẫn, quản lý hội thoại cá nhân).
- **ACT04 – Background Processing Worker:** Thành phần xử lý ngầm (Trích xuất, chunking, embedding, indexing, retry).

---

*(Bản đặc tả chi tiết đầy đủ 13 phần tuân thủ nghiêm ngặt theo tài liệu BA v1.1)*
