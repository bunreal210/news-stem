# ⚡ HƯỚNG DẪN TRIỂN KHAI TOÀN BỘ TRÊN HỆ SINH THÁI CLOUDFLARE

Hệ thống đã được thiết kế sẵn sàng để chạy **Full Stack trên Cloudflare**:
- **Hosting & Edge Functions**: Cloudflare Pages
- **Cơ sở dữ liệu SQL Serverless**: Cloudflare D1
- **Lưu trữ hình ảnh bài viết**: Cloudflare R2
- **Video hoạt động**: Nhúng YouTube Player + Cloudflare Global CDN Caching
- **Bảo mật truy cập Admin**: Cloudflare Zero Trust / Access

---

## 🛠️ CÁC BƯỚC THIẾT LẬP (CHỈ MẤT 3 - 5 PHÚT)

### Bước 1: Đăng nhập Cloudflare bằng Wrangler
Mở PowerShell hoặc Command Prompt tại thư mục dự án `d:\News STEM` và gõ:
```bash
npx wrangler login
```
*(Trình duyệt sẽ tự động mở lên, bạn chỉ cần bấm **"Allow"** để cấp quyền cho máy tính của bạn).*

---

### Bước 2: Tạo Cơ sở dữ liệu Cloudflare D1
Chạy lệnh tạo CSDL tên `stem-club-db`:
```bash
npx wrangler d1 create stem-club-db
```
Sau khi tạo, terminal sẽ in ra thông tin dạng:
```toml
[[d1_databases]]
binding = "DB"
database_name = "stem-club-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```
👉 Hãy copy đoạn `database_id` trên và dán vào file `wrangler.toml` của bạn.

---

### Bước 3: Nạp cấu trúc bảng dữ liệu (schema.sql) vào D1
Chạy lệnh nạp bảng `posts` và các bài viết mẫu vào D1 trên Cloudflare:
```bash
npx wrangler d1 execute stem-club-db --file=./schema.sql --remote
```

---

### Bước 4: Tạo Thùng chứa ảnh Cloudflare R2
Chạy lệnh tạo bucket R2 tên `stem-club-media`:
```bash
npx wrangler r2 bucket create stem-club-media
```
*(Lưu ý: Cloudflare R2 hoàn toàn miễn phí 10GB lưu trữ và 0đ phí băng thông tải ảnh).*

---

### Bước 5: Đưa trang web lên Cloudflare Pages

#### Cách 1: Đẩy qua GitHub (Khuyên dùng - Tự động cập nhật mỗi khi sửa code)
1. Đẩy mã nguồn dự án lên GitHub.
2. Vào trang quản trị Cloudflare: [dash.cloudflare.com](https://dash.cloudflare.com)
3. Chọn menu **Workers & Pages** -> **Create application** -> **Pages** -> **Connect to Git**.
4. Chọn repository GitHub vừa tạo.
5. Cài đặt Build:
   - **Framework preset**: `Next.js`
   - **Build command**: `npx @cloudflare/next-on-pages` hoặc `npm run build`
   - **Output directory**: `.vercel/output/static`
6. Trong mục **Settings** -> **Functions** của dự án trên Cloudflare:
   - Gắn **D1 database bindings**: Tên biến `DB` -> chọn `stem-club-db`.
   - Gắn **R2 bucket bindings**: Tên biến `R2_BUCKET` -> chọn `stem-club-media`.
7. Bấm **Save and Deploy**. Trang web của CLB STEM sẽ có ngay một địa chỉ miễn phí cực đẹp dạng:
   👉 `https://stem-club-news.pages.dev`

#### Cách 2: Triển khai trực tiếp từ máy tính (Deploy trực tiếp bằng lệnh)
```bash
npx wrangler pages deploy
```

---

## 🔒 BẬT BẢO VỆ TRANG ADMIN BẰNG CLOUDFLARE ZERO TRUST (TÙY CHỌN CAO CẤP)

Bạn có thể khóa đường dẫn `/admin` để chỉ những ai có email đuôi trường (ví dụ `@truong.edu.vn`) hoặc email cá nhân được cấp phép mới mở được:
1. Vào **Cloudflare Zero Trust** trên Dashboard.
2. Chọn **Access** -> **Applications** -> **Add an application** -> **Self-hosted**.
3. Điền Application name: `STEM Club Admin`.
4. Domain: `stem-club-news.pages.dev`, Path: `/admin*`.
5. Tạo chính sách (Policy): Chọn hành động **Allow**, chọn quy tắc chỉ cho phép danh sách Email của các thầy cô & học sinh trong ban quản trị nhận mã OTP qua hòm thư.
*(Bảo mật 100%, không lo bị hack hay dò pass)*!
