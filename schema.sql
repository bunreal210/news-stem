-- =======================================================
-- BẢNG DỮ LIỆU CLOUDFLARE D1 (SQLITE SERVERLESS) CHO CLB STEM
-- =======================================================

-- 1. Bảng bài viết & hoạt động (posts)
CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  summary TEXT,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  thumbnail TEXT NOT NULL,
  youtube_url TEXT,
  youtube_id TEXT,
  gallery TEXT, -- JSON Array các URL ảnh [url1, url2...]
  author TEXT DEFAULT 'Ban Truyền thông STEM',
  views INTEGER DEFAULT 0,
  featured INTEGER DEFAULT 0, -- 1: Nổi bật, 0: Bình thường
  status TEXT DEFAULT 'published', -- 'published' hoặc 'draft'
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Tạo chỉ mục tìm kiếm nhanh theo slug và category
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);

-- 2. Bảng cấu hình website CLB
CREATE TABLE IF NOT EXISTS site_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Dữ liệu cấu hình ban đầu
INSERT OR IGNORE INTO site_config (key, value) VALUES
  ('clubName', 'CLB STEM & SÁNG TẠO TRẺ'),
  ('schoolName', 'Trường THPT Chuyên / THPT Khoa Học'),
  ('slogan', 'Khơi nguồn đam mê - Chinh phục công nghệ - Sáng tạo tương lai'),
  ('description', 'Không gian kết nối những học sinh đam mê Khoa học, Công nghệ, Kỹ thuật và Toán học.'),
  ('email', 'stemclub.school@gmail.com'),
  ('phone', '0912 345 678'),
  ('address', 'Phòng Thực hành STEM - Tầng 3 Nhà A, Trường THPT');

-- 3. Dữ liệu bài viết mẫu khởi tạo
INSERT OR IGNORE INTO posts (
  id, title, slug, summary, content, category, thumbnail, youtube_url, youtube_id, gallery, author, views, featured, status, created_at, updated_at
) VALUES (
  'stem-post-1',
  'Đội tuyển STEM trường xuất sắc giành Huy chương Vàng tại Hội thi Sáng chế Robot 2026',
  'doi-tuyen-stem-truong-xuat-sac-gianh-huy-chuong-vang-tai-hoi-thi-sang-che-robot-2026',
  'Với mô hình Robot cứu hộ tự hành tích hợp thị giác máy tính và cảm biến nhiệt, đội tuyển STEM đã vượt qua hơn 40 đội thi toàn quốc để giành ngôi vị quán quân.',
  '## Vinh quang từ tinh thần đồng đội và nỗ lực bền bỉ

Ngày 15/11/2026 vừa qua, tại Nhà thi đấu Thể thao & Công nghệ, vòng chung kết Hội thi Sáng chế Robot Trẻ toàn quốc đã diễn ra với sự tranh tài của hơn 40 đội thi xuất sắc đến từ các trường THPT trên toàn quốc.

Đội tuyển CLB STEM đại diện cho nhà trường gồm 5 thành viên với đề tài **"Robot cứu hộ địa hình gập ghềnh tích hợp AI nhận diện nạn nhân"**.

### Những điểm đột phá của mô hình:
1. **Khung gầm bánh xích linh hoạt:** Khả năng vượt dốc 35 độ và lội bùn nước nhẹ.
2. **Hệ thống AI biên (Edge AI):** Sử dụng chip xử lý mini nhận diện cử chỉ và thân nhiệt nạn nhân trong điều kiện khói bụi.
3. **Bộ truyền sóng tầm xa:** Cho phép điều khiển và truyền dữ liệu video trực tiếp về trạm chỉ huy từ khoảng cách lên đến 1.5km.

> *"Chúng em đã thức nhiều đêm tại phòng lab STEM để tối ưu từng dòng code thuật toán PID và cân chỉnh động cơ. Khoảnh khắc robot hoàn thành bài thi sa bàn giả định chỉ sau 2 phút 15 giây, cả đội đã ôm nhau vỡ òa trong hạnh phúc!"* - Bạn Hoàng Nam, Đội trưởng chia sẻ.

Chiến thắng này tiếp tục khẳng định phong trào học tập và nghiên cứu khoa học kỹ thuật mạnh mẽ của học sinh nhà trường, là nguồn cảm hứng lớn cho các bạn khóa dưới đam mê lĩnh vực Robotics & Tự động hóa.',
  'Hoi-thi-stem',
  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
  'https://www.youtube.com/watch?v=7Pq-S557XQU',
  '7Pq-S557XQU',
  '["https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80","https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1000&q=80"]',
  'Ban Truyền thông STEM',
  428,
  1,
  'published',
  datetime('now', '-4 days'),
  datetime('now', '-4 days')
), (
  'stem-post-2',
  'Workshop trải nghiệm: Lập trình vi điều khiển ESP32 và công nghệ IoT trong nhà thông minh',
  'workshop-trai-nghiem-lap-trinh-vi-dieu-khien-esp32-va-cong-nghe-iot-trong-nha-thong-minh',
  'Hơn 80 học sinh khối 10 và 11 đã được tự tay đấu nối linh kiện, lập trình cảm biến khí gas, đo độ ẩm đất và điều khiển đèn qua smartphone trong buổi workshop cuối tuần.',
  '## Đưa lý thuyết vật lý & tin học vào ứng dụng đời sống

Nhằm mang lại trải nghiệm thực tế cho các thành viên mới, CLB STEM đã phối hợp với các thầy cô tổ Vật lý - Tin học tổ chức buổi Workshop **"Khám phá IoT cùng Vi điều khiển ESP32"**.

### Nội dung thực hành thú vị:
- Tìm hiểu nguyên lý hoạt động của các loại cảm biến: DHT11 (đo nhiệt độ/độ ẩm), Cảm biến quang trở LDR, Cảm biến siêu âm HC-SR04.
- Làm quen với ngôn ngữ C++ trên môi trường Arduino IDE.
- Lập trình truyền dữ liệu qua giao thức Wi-Fi và MQTT lên nền tảng Dashboard di động.

Mỗi nhóm gồm 3-4 bạn được cấp một bộ KIT thực hành hoàn chỉnh. Dưới sự hướng dẫn tận tình của các anh chị khóa trên, chỉ sau 3 giờ đồng hồ, 100% các nhóm đã hoàn thành mạch đo tự động kích hoạt tưới cây khi đất khô và cảnh báo cháy sớm qua còi báo động!',
  'Workshop-trai-nghiem',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
  'https://www.youtube.com/watch?v=1F_b-1i1b3U',
  '1F_b-1i1b3U',
  '["https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1000&q=80"]',
  'Thầy Nguyễn Văn An - Cố vấn CLB',
  315,
  1,
  'published',
  datetime('now', '-10 days'),
  datetime('now', '-10 days')
);
