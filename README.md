# 🚀 CỔNG THÔNG TIN HOẠT ĐỘNG CLB STEM TRƯỜNG HỌC

Trang web đăng tải tin tức, bài viết, hình ảnh và video hoạt động của Câu lạc bộ STEM với đầy đủ trang quản trị (Admin Dashboard) thân thiện, hiện đại và chuẩn SEO.

---

## 🌟 TÍNH NĂNG NỔI BẬT

1. **Hiển thị Đa phương tiện Hoàn hảo**:
   - **Video YouTube**: Nhúng trực tiếp link YouTube (watch, youtu.be, shorts), tự động nhận diện ID và phát video responsive 16:9 với thumbnail mượt mà.
   - **Hình ảnh sắc nét**: Upload ảnh bìa (thumbnail) trực tiếp từ máy tính hoặc link URL; hỗ trợ Album ảnh (Gallery) với chế độ phóng to Lightbox.

2. **Trang Người xem (Public Portal)**:
   - **Trang chủ**: Banner khoa học công nghệ, chỉ số ấn tượng, 4 trụ cột STEM, bài viết tiêu điểm nổi bật, video hoạt động thực tế, bản tin mới nhất.
   - **Trang Tin tức & Chuyên mục**: Lọc theo chuyên mục (*Sáng chế & Robot, Nghiên cứu KHKT, Hội thi & Giải thưởng, Workshop & Trải nghiệm, Tin hoạt động*), tìm kiếm nhanh theo từ khóa.
   - **Trang Chi tiết bài viết**: Nội dung phong phú, chia sẻ bài viết lên Facebook, bài viết liên quan.
   - **Trang Giới thiệu & Liên hệ**: Sứ mệnh CLB, phòng thực hành STEM Makerspace, form đăng ký tham gia CLB cho học sinh.

3. **Trang Quản trị (Admin Dashboard)**:
   - Đăng nhập bảo mật qua HTTP-Only Cookie.
   - Quản lý toàn bộ bài viết (Xem, Thêm mới, Chỉnh sửa, Xóa).
   - Trình soạn thảo trực quan: Soạn bài, tải ảnh, chèn link YouTube với **trình phát xem thử video trực tiếp ngay trong trang soạn thảo** trước khi xuất bản!
   - Chế độ "Xuất bản" (công khai) hoặc "Bản nháp".

---

## 💻 HƯỚNG DẪN CHẠY TRÊN MÁY TÍNH (LOCALHOST)

### 1. Mở thư mục dự án trong Terminal / PowerShell:
```bash
cd "d:\News STEM"
```

### 2. Khởi chạy máy chủ phát triển (Development Server):
```bash
npm run dev
```

### 3. Mở trình duyệt và truy cập:
- **Trang người xem**: [http://localhost:3000](http://localhost:3000)
- **Trang Quản trị (Admin)**: [http://localhost:3000/admin](http://localhost:3000/admin)

### 🔑 Tài khoản Quản trị viên mặc định:
- **Tên đăng nhập**: `admin`
- **Mật khẩu**: `stem123@admin`

*(Bạn có thể thay đổi tài khoản và mật khẩu này bất kỳ lúc nào trong file `.env.local`)*

---

## ☁️ HƯỚNG DẪN ĐƯA LÊN MẠNG INTERNET (FREE 100%)

Để đưa trang web lên mạng cho toàn trường và phụ huynh truy cập mà không tốn chi phí server:

### Cách 1: Đưa lên Vercel (Khuyên dùng - Nhanh nhất)
1. Đăng ký tài khoản miễn phí tại [vercel.com](https://vercel.com) (đăng nhập bằng GitHub).
2. Tạo 1 repository trên GitHub và đẩy code trong thư mục `d:\News STEM` lên:
   ```bash
   git init
   git add .
   git commit -m "Khoi tao web CLB STEM"
   git branch -M main
   git remote add origin <link_repo_cua_ban>
   git push -u origin main
   ```
3. Trên Vercel, chọn **"Add New Project"** -> Chọn repository vừa tạo.
4. Thêm các biến môi trường (Environment Variables) trong mục Cài đặt:
   - `ADMIN_USERNAME`: `admin`
   - `ADMIN_PASSWORD`: `<mật_khẩu_của_bạn>`
   - `ADMIN_SECRET_TOKEN`: `<chuỗi_bí_mật>`
5. Bấm **Deploy**. Sau 1-2 phút, trang web sẽ hoạt động với đường dẫn miễn phí dạng:
   `https://stem-club-school.vercel.app` (có thể gắn tên miền của trường nếu muốn).

---

## 📁 CẤU TRÚC THƯ MỤC DỰ ÁN

```
d:\News STEM\
├── data/                  # Lưu trữ dữ liệu bài viết (JSON Database)
├── public/
│   └── uploads/           # Thư mục lưu ảnh người dùng upload
├── src/
│   ├── app/
│   │   ├── page.tsx       # Trang chủ CLB
│   │   ├── posts/         # Danh sách & chi tiết bài viết
│   │   ├── about/         # Giới thiệu CLB & liên hệ
│   │   ├── admin/         # Đăng nhập & Bảng điều khiển quản trị
│   │   └── api/           # API đăng bài, upload ảnh, xác thực
│   ├── components/        # YouTubePlayer, PostCard, PostForm, Navbar, Footer...
│   └── lib/               # CSDL db.ts, utils.ts, types.ts, auth.ts
├── .env.local             # Cấu hình tài khoản & bảo mật
└── package.json
```
