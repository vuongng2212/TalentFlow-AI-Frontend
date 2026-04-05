# Kế hoạch Kiểm thử Giao diện (UI/UX Test Plan) - TalentFlow AI

Tài liệu này cung cấp danh sách chi tiết các API đã được tích hợp và các luồng nghiệp vụ (workflows) cần được kiểm thử thủ công trên giao diện Frontend để đảm bảo hệ thống TalentFlow AI hoạt động ổn định.

## 📋 Thông tin Môi trường & Tài khoản Test
- **URL Frontend**: `http://localhost:3000` (hoặc cổng cấu hình tương ứng của Next.js)
- **Tài khoản Admin (Seed Data)**:
  - Email: `seed-admin@talentflow.invalid`
  - Password: `SeedPassword123!`

---

## 1. 🔐 Module Xác thực & Tài khoản (Auth & Users)
**Các API liên quan:** `POST /auth/login`, `POST /auth/signup`, `POST /auth/logout`, `GET /auth/me`, `GET /users`, `PATCH /users/:id`

### 1.1. Đăng nhập & Đăng xuất
- [ ] Mở trang Đăng nhập (`/login`).
- [ ] Nhập sai tài khoản/mật khẩu -> Kiểm tra hiển thị thông báo lỗi.
- [ ] Nhập đúng tài khoản Admin -> Chuyển hướng thành công vào Dashboard.
- [ ] Tải lại trang (F5) -> Đảm bảo phiên đăng nhập vẫn được giữ (nhờ HTTP-only cookie & API `/auth/me`).
- [ ] Click nút Đăng xuất -> Đăng xuất thành công, bị đẩy về trang Login, không thể truy cập lại Dashboard bằng nút Back của trình duyệt.

### 1.2. Đăng ký (Signup)
- [ ] Mở trang Đăng ký.
- [ ] Nhập thông tin hợp lệ -> Đăng ký thành công và tự động đăng nhập vào hệ thống.
- [ ] Nhập email đã tồn tại -> Kiểm tra hiển thị thông báo lỗi trùng email.

### 1.3. Quản lý Người dùng (User Management - Dành cho Admin)
- [ ] Truy cập trang quản lý Users.
- [ ] Danh sách Users hiển thị đầy đủ, phân trang hoạt động tốt.
- [ ] Chỉnh sửa thông tin User (Tên, Role) -> Lưu thành công, dữ liệu cập nhật trên UI.

---

## 2. 💼 Module Quản lý Công việc (Jobs)
**Các API liên quan:** `GET /jobs`, `POST /jobs`, `GET /jobs/:id`, `PUT /jobs/:id`, `DELETE /jobs/:id`

### 2.1. Xem danh sách & Chi tiết
- [ ] Truy cập trang danh sách Jobs.
- [ ] Kiểm tra bộ lọc (Filter) theo Trạng thái (OPEN, DRAFT, CLOSED...), Loại hình (FULL_TIME, PART_TIME...).
- [ ] Phân trang (Pagination) hoạt động trơn tru.
- [ ] Click vào một Job -> Hiển thị đầy đủ chi tiết công việc.

### 2.2. Tạo mới & Cập nhật Job
- [ ] Mở Form tạo Job mới.
- [ ] Bỏ trống các trường bắt buộc (Title) -> Form báo lỗi validation.
- [ ] Điền đầy đủ: Title, Department, Location, EmploymentType, Salary (Min/Max), Status -> Lưu thành công.
- [ ] Mở Edit một Job -> Đổi trạng thái từ `DRAFT` sang `OPEN` -> Lưu và kiểm tra thay đổi trên danh sách.

### 2.3. Xóa Job
- [ ] Thử xóa một Job -> Hiển thị popup xác nhận (Confirm dialog).
- [ ] Đồng ý xóa -> Job biến mất khỏi danh sách.

---

## 3. 📄 Module Hồ sơ Ứng viên (Applications & Candidates)
**Các API liên quan:** `POST /applications`, `POST /applications/upload`, `GET /applications`, `GET /candidates`

### 3.1. Danh sách Ứng viên & Hồ sơ
- [ ] Xem danh sách Candidates -> Kiểm tra các trường thông tin cơ bản.
- [ ] Xem danh sách Applications (có thể dạng bảng hoặc Kanban board).
- [ ] Thay đổi trạng thái/vòng (Stage/Status) của một hồ sơ -> Dữ liệu cập nhật thành công.

### 3.2. Luồng Nộp Hồ Sơ (Upload CV)
- [ ] Thực hiện quy trình Apply cho một Job.
- [ ] Test tính năng Upload CV (File PDF/DOCX). Đảm bảo file được tải lên thành công.
- [ ] Điền Cover Letter và nộp đơn. Xác nhận Application mới xuất hiện trong Dashboard của HR.

---

## 4. 🤝 Module Phỏng vấn (Interviews)
**Các API liên quan:** `POST /interviews`, `GET /interviews`, `PATCH /interviews/:id`, `DELETE /interviews/:id`

### 4.1. Lên lịch Phỏng vấn (Create)
- [ ] Mở Form "Schedule Interview".
- [ ] **Kiểm tra Dropdown Application**: Đảm bảo danh sách Application (Hồ sơ) xổ xuống load thành công (Hiển thị dạng: `Tên ứng viên - Tên Job`).
- [ ] Chọn ngày giờ (`scheduledAt`), Thời lượng (`duration`), Loại (`type` - VIDEO, IN_PERSON...), Link/Địa điểm.
- [ ] Lưu lại -> Buổi phỏng vấn hiển thị trong danh sách/lịch.

### 4.2. Cập nhật & Ghi chú (Update)
- [ ] Chọn một buổi phỏng vấn đã lên lịch -> Mở form Edit.
- [ ] Đổi trạng thái sang `COMPLETED` (Hoàn thành).
- [ ] Viết nhận xét vào ô **Notes** -> Lưu thành công (Không bị lỗi 400 Bad Request).

### 4.3. Hủy Phỏng vấn (Delete/Cancel)
- [ ] Thao tác Hủy (Cancel/Delete) một buổi phỏng vấn.
- [ ] Buổi phỏng vấn bị xóa hoặc đổi trạng thái thành `CANCELLED` trên UI.

---

## 5. 📊 Module Báo cáo & Thống kê (Analytics)
**Các API liên quan:** `GET /analytics/overview`, `GET /analytics/pipeline`, `GET /analytics/trends`, `GET /analytics/top-jobs`

### 5.1. Dashboard Overview
- [ ] Truy cập trang chủ/Dashboard.
- [ ] Các thẻ thống kê (Tổng số Jobs, số ứng viên, tỷ lệ chuyển đổi...) load số liệu thành công (không bị NaN hoặc trạng thái loading treo).
- [ ] Các biểu đồ (Charts) hiển thị đúng dữ liệu từ API Trends và Pipeline.

---

## 🛑 Các Lưu ý Quan trọng cho Tester
1. **Lỗi Validation ngầm**: Nếu bạn bấm Lưu/Submit mà không thấy UI phản hồi, hãy mở **DevTools (F12) -> tab Network** để xem API có trả về lỗi `400 Bad Request` hay không. Nếu có, hãy chụp ảnh lại Response JSON báo cho Dev.
2. **Trạng thái Loading & Error**: Chú ý quan sát xem các nút bấm có bị disable (hiển thị trạng thái xoay/loading) trong lúc chờ API không, để tránh trường hợp user click double tạo ra 2 bản ghi.
3. **Responsive**: Thử co giãn trình duyệt để kiểm tra các bảng biểu (Tables) và Form có bị vỡ bố cục trên màn hình nhỏ không.
