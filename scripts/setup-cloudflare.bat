@echo off
chcp 65001 >nul
echo ========================================================
echo  🚀 THIẾT LẬP TOÀN BỘ HỆ SINH THÁI CLOUDFLARE CHO CLB STEM
echo ========================================================
echo.

echo [Bước 1/4] Đăng nhập vào tài khoản Cloudflare của bạn...
call npx wrangler login
if %errorlevel% neq 0 (
    echo [Lỗi] Đăng nhập Cloudflare thất bại.
    pause
    exit /b %errorlevel%
)
echo.

echo [Bước 2/4] Khởi tạo Cơ sở dữ liệu Cloudflare D1 (stem-club-db)...
call npx wrangler d1 create stem-club-db
echo.
echo * CHÚ Ý: Hãy copy mã "database_id" vừa hiển thị ở trên và dán vào file wrangler.toml!
pause
echo.

echo [Bước 3/4] Chạy cấu trúc bảng dữ liệu (schema.sql) lên Cloudflare D1...
call npx wrangler d1 execute stem-club-db --file=./schema.sql --remote
echo.

echo [Bước 4/4] Tạo thùng chứa ảnh Cloudflare R2 (stem-club-media)...
call npx wrangler r2 bucket create stem-club-media
echo.

echo ========================================================
echo  ✅ HOÀN TẤT THIẾT LẬP D1 & R2 TRÊN CLOUDFLARE!
echo ========================================================
echo Tiếp theo, bạn có thể đẩy code lên GitHub và kết nối với Cloudflare Pages
echo hoặc chạy lệnh: npx wrangler pages deploy
echo.
pause
