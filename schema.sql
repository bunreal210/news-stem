-- =======================================================
-- BẢNG DỮ LIỆU CLOUDFLARE D1 CHO CỔNG THÔNG TIN CLB STEM
-- =======================================================

-- 1. Bảng bài viết & thông báo (posts)
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
  is_pinned INTEGER DEFAULT 0, -- 1: Ghim lên đầu, 0: Bình thường
  is_urgent INTEGER DEFAULT 0, -- 1: Thông báo khẩn, 0: Bình thường
  attachments TEXT, -- JSON Array các file đính kèm [{name, url, size, type}]
  status TEXT DEFAULT 'published', -- 'published' hoặc 'draft'
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Chỉ mục tìm kiếm cho bảng posts
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);

-- 2. Bảng kho văn bản & biểu mẫu tải về (documents)
CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  code TEXT NOT NULL,
  category TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size TEXT,
  publish_date TEXT,
  download_url TEXT
);

CREATE INDEX IF NOT EXISTS idx_documents_category ON documents(category);

-- 3. Bảng cấu hình website CLB (site_config)
CREATE TABLE IF NOT EXISTS site_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

INSERT OR IGNORE INTO site_config (key, value) VALUES
  ('clubName', 'CLB Nghiên cứu khoa học, STEM và Robotics'),
  ('shortName', 'BSSRC'),
  ('schoolName', 'Trường THPT Bắc Đông Quan'),
  ('slogan', 'Khơi nguồn sáng tạo - Chinh phục đam mê'),
  ('description', 'Cổng thông tin điện tử Câu lạc bộ Nghiên cứu khoa học, STEM và Robotics trường THPT Bắc Đông Quan.'),
  ('email', 'bdq.stemlab@gmail.com'),
  ('phone', '0984 552 238'),
  ('address', 'Phòng Thực hành STEM - Tầng 3 Tòa C, Trường THPT Bắc Đông Quan');
