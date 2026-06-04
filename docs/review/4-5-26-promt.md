# Nhóm Các Issue & Prompt Thực Hiện Cho AI

Dưới đây là các vấn đề đã được nhóm lại theo tính chất kỹ thuật và cấu trúc component, kèm theo **Prompt ngắn gọn** được thiết kế riêng để AI có thể hiểu ngay ngữ cảnh và thực hiện chỉnh sửa chính xác.

---

## Nhóm 1: Hệ Thống Màu Sắc & CSS Variables (Global Styles)
*   **Vấn đề:** Lạm dụng màu tím thương hiệu (`#7C3AED`) cho cả các phần không phải AI và đổ bóng phát sáng tím tạo cảm giác thiếu chuyên nghiệp.
*   **Tệp tin ảnh hưởng:** [globals.css](file:///home/vuongnguyen/Projects/TalentFlow/TalentFlow-AI-Frontend/app/globals.css)

> **PROMPT CHO AI:**
> ```text
> Hãy cập nhật hệ thống màu sắc (CSS variables) trong `app/globals.css` để nâng cao tính tin cậy của giao diện doanh nghiệp (Enterprise Trust):
> 1. Đổi màu chủ đạo thương hiệu `--primary` từ màu tím (#7C3AED) sang màu xanh indigo (#4F46E5) và cập nhật tương ứng `--primary-hover` (#4338CA), `--primary-soft` (#EEF2FF).
> 2. Đặt một biến màu riêng cho các tính năng AI: `--ai-accent: #0D9488` (màu xanh teal) và `--ai-accent-soft: #CCFBF1`.
> 3. Cập nhật class `.ai-chip` sử dụng gradient từ teal-600 sang teal-700 thay vì gradient tím.
> 4. Xóa hiệu ứng bóng đổ phát sáng tím `--shadow-ai` khỏi các phần không phải AI (thiết lập về `none` hoặc dùng bóng đổ xám nhạt trung tính). Thay thế bóng phát sáng của `.mockup` thành bóng đổ thông thường thanh lịch: `box-shadow: 0 4px 24px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.06)`.
> 5. Điều chỉnh line-height toàn cục của body lên 1.6 để tăng độ dễ đọc.
> ```

---

## Nhóm 2: Section Hero & Hiệu Ứng Kanban Mockup (Hero & Mobile Responsiveness)
*   **Vấn đề:** Chữ tiêu đề dạng gradient tím, lạm dụng ký tự lấp lánh `✦` và lỗi tràn khung chuyển động Kanban trên thiết bị di động.
*   **Tệp tin ảnh hưởng:** [HeroSection.tsx](file:///home/vuongnguyen/Projects/TalentFlow/TalentFlow-AI-Frontend/components/landing/HeroSection.tsx), [globals.css](file:///home/vuongnguyen/Projects/TalentFlow/TalentFlow-AI-Frontend/app/globals.css)

> **PROMPT CHO AI:**
> ```text
> Hãy tối ưu hóa phần Hero và sửa lỗi responsive của Kanban mockup:
> 1. Trong `HeroSection.tsx`, đổi dòng chữ tiêu đề "AI-Powered Recruiting" từ dạng gradient sang màu chữ phẳng tối (`text-slate-900` hoặc dùng màu tối trong CSS `--text-1`).
> 2. Thay đổi nội dung chip ở Hero thành "Candidate intelligence" (bỏ tiền tố "AI ✦").
> 3. Trong mockup Kanban, đổi nhãn điểm số từ dạng "AI ✦ 98" thành "AI · 98" (thay ngôi sao lấp lánh bằng dấu chấm tròn).
> 4. Liên kết nút "Watch Guided Demo" cuộn xuống phần hoạt động `#how` thay vì `#demo-tour` (hoặc đổi tên nút thành "See How It Works").
> 5. Sửa lỗi CSS trên thiết bị di động (<820px): Thẻ Kanban chuyển động `.animate-kanban-card` đang bị tràn khung chiều ngang. Hãy sửa `@keyframes kanban-card-move-mobile` hoặc tắt animation trên di động (đặt `animation: none`) và hiển thị thẻ tĩnh ở cột cuối cùng để tránh lỗi tràn layout.
> ```

---

## Nhóm 3: Bảng Giá & Nút Kêu Gọi Hành Động (Pricing & CTAs)
*   **Vấn đề:** Bảng giá thiếu danh sách tính năng dạng bullet-point; viền nổi bật của gói Plus quá phát sáng; nút bấm Final CTA bị chìm trên nền gradient.
*   **Tệp tin ảnh hưởng:** [PricingSection.tsx](file:///home/vuongnguyen/Projects/TalentFlow/TalentFlow-AI-Frontend/components/landing/PricingSection.tsx), [FinalCta.tsx](file:///home/vuongnguyen/Projects/TalentFlow/TalentFlow-AI-Frontend/components/landing/FinalCta.tsx)

> **PROMPT CHO AI:**
> ```text
> Hãy tối ưu hóa phần Pricing và Final CTA để tăng tỷ lệ chuyển đổi (CRO):
> 1. Trong `PricingSection.tsx`, hãy duyệt qua mảng `features` của từng gói trong file dữ liệu (đã định nghĩa sẵn dạng string array) và render chúng thành danh sách các dòng có dấu tích xanh (checkmark list) dưới phần mô tả của mỗi thẻ giá.
> 2. Sửa viền của thẻ giá "Plus" (nổi bật nhất): Thay vì dùng viền phát sáng tím và bóng đổ AI, hãy đổi thành viền xanh indigo (`ring-2 ring-indigo-600`) kèm bóng đổ thường (`shadow-md`). Thêm một badge nhỏ ghi "Most Popular" ở trên cùng thẻ Plus.
> 3. Trong `FinalCta.tsx`, sửa nút bấm từ `btn secondary` (màu trắng viền nhạt) thành một nút bấm có nền trắng đặc, chữ đậm màu primary để tăng độ tương phản rõ rệt trên nền gradient.
> ```

---

## Nhóm 4: Cấu Trúc Các Section & Social Proof (Logos, Features, Testimonials)
*   **Vấn đề:** Một số section thiếu tiêu đề; hàng logo chuyển động liên tục gây rối mắt; testimonials thiếu hình ảnh minh họa khiến cảm giác giả lập.
*   **Tệp tin ảnh hưởng:** [FeaturesSection.tsx](file:///home/vuongnguyen/Projects/TalentFlow/TalentFlow-AI-Frontend/components/landing/FeaturesSection.tsx), [WorkflowSection.tsx](file:///home/vuongnguyen/Projects/TalentFlow/TalentFlow-AI-Frontend/components/landing/WorkflowSection.tsx), [TrustedLogos.tsx](file:///home/vuongnguyen/Projects/TalentFlow/TalentFlow-AI-Frontend/components/landing/TrustedLogos.tsx), [TestimonialsSection.tsx](file:///home/vuongnguyen/Projects/TalentFlow/TalentFlow-AI-Frontend/components/landing/TestimonialsSection.tsx)

> **PROMPT CHO AI:**
> ```text
> Hãy hoàn thiện cấu trúc tiêu đề các phần và làm gọn phần social proof:
> 1. Thêm component `<SectionHeader>` vào đầu `FeaturesSection.tsx` với tiêu đề "Everything your recruiting team needs" và phụ đề ngắn gọn để làm rõ tính năng.
> 2. Thêm `<SectionHeader>` vào `WorkflowSection.tsx` với tiêu đề "From resume intake to decision-ready shortlist" có thuộc tính `centered`.
> 3. Trong `TrustedLogos.tsx`, thay thế hiệu ứng cuộn chạy liên tục (`.animate-infinite-scroll`) bằng một hàng logo tĩnh, phẳng của 5 công ty (giống phong cách Stripe/Linear). Thêm tiêu đề nhỏ phía trên: "Trusted by recruiting teams at". Thu nhỏ kích thước các thẻ logo.
> 4. Trong `TestimonialsSection.tsx`, thêm vòng tròn avatar giả lập (có thể hiển thị chữ cái đầu tên người đánh giá) kế bên tên tác giả, đặt tên công ty trong thẻ badge nhỏ và thêm định dạng dấu nháy kép lớn để khối trích dẫn trông chân thực và sinh động hơn.
> ```

---

## Nhóm 5: Menu Điều Hướng Di Động (Mobile Nav & FAQ Chevron)
*   **Vấn đề:** Khi co màn hình lại, menu điều hướng bị xếp chồng lộn xộn; FAQ không có biểu tượng đóng/mở.
*   **Tệp tin ảnh hưởng:** [Header.tsx](file:///home/vuongnguyen/Projects/TalentFlow/TalentFlow-AI-Frontend/components/landing/Header.tsx), [FaqSection.tsx](file:///home/vuongnguyen/Projects/TalentFlow/TalentFlow-AI-Frontend/components/landing/FaqSection.tsx), [globals.css](file:///home/vuongnguyen/Projects/TalentFlow/TalentFlow-AI-Frontend/app/globals.css)

> **PROMPT CHO AI:**
> ```text
> Hãy bổ sung các thành phần tương tác trên di động và chỉ hướng người dùng:
> 1. Trong `Header.tsx`, trên giao diện di động (<820px), hãy ẩn các link điều hướng tĩnh ("Features", "Pricing", "How it works") và thay thế bằng một nút Hamburger Menu (3 gạch) để người dùng bấm đóng/mở menu điều hướng. Chỉ hiển thị Logo và duy nhất nút bấm CTA hành động chính ở góc.
> 2. Trong CSS liên quan đến FAQ (`.faq-q`), hãy thêm biểu tượng mũi tên xuống (chevron) ở bên phải tiêu đề câu hỏi. Thiết lập thuộc tính xoay mũi tên 180 độ khi câu hỏi được mở ra (`.faq-item.open .faq-q svg/icon`).
> ```
