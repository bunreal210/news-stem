import { Post, SiteConfig, ScheduleEvent, DocumentResource } from './types';
import { extractYouTubeId, slugify } from './utils';
import { getRequestContext } from '@cloudflare/next-on-pages';

// Cấu hình mặc định cho Cổng Thông Tin CLB STEM
export const DEFAULT_CONFIG: SiteConfig = {
  clubName: "CLB Nghiên cứu khoa học, STEM và Robotics",
  shortName: "BSSRC",
  schoolName: "Trường THPT Bắc Đông Quan",
  slogan: "Khơi nguồn sáng tạo - Chinh phục đam mê",
  description: "Cổng thông tin điện tử Câu lạc bộ Nghiên cứu khoa học, STEM và Robotics trường THPT Bắc Đông Quan. Nơi cập nhật các thông báo, đề tài KHKT, chế tạo robot và tài nguyên học liệu số học đường.",
  email: "bdq.stemlab@gmail.com",
  phone: "0984 552 238",
  facebookUrl: "https://facebook.com/bdq.ssrc",
  youtubeChannelUrl: "https://www.youtube.com/@BDQSTEMLab",
  address: "Phòng Thực hành STEM - Tầng 3 Tòa C, Trường THPT Bắc Đông Quan",
};

// Dữ liệu Lịch hoạt động & Sự kiện CLB
export const INITIAL_SCHEDULE: ScheduleEvent[] = [
  {
    id: "sch-1",
    title: "Sinh hoạt chuyên đề: Kỹ thuật lập trình PID cho Robot dò line tốc độ cao",
    date: "Thứ Bảy, 22/11/2026",
    time: "14:00 - 17:00",
    location: "Phòng Thực hành STEM (Tầng 3 Tòa C)",
    type: "workshop",
    badge: "Buổi sinh hoạt"
  }
];

// Không dùng bài viết và tài liệu mặc định trong code (chỉ lấy từ DB)
export const INITIAL_DOCUMENTS: DocumentResource[] = [];
export const INITIAL_POSTS: Post[] = [];

// Global in-memory cache shared across modules in the same isolate
const globalStore = globalThis as unknown as {
  __POSTS_CACHE__?: Post[];
  __DOCUMENTS_CACHE__?: DocumentResource[];
  __SCHEDULE_CACHE__?: ScheduleEvent[];
};

if (!globalStore.__POSTS_CACHE__) {
  globalStore.__POSTS_CACHE__ = [];
}
if (!globalStore.__DOCUMENTS_CACHE__) {
  globalStore.__DOCUMENTS_CACHE__ = [];
}
if (!globalStore.__SCHEDULE_CACHE__) {
  globalStore.__SCHEDULE_CACHE__ = [...INITIAL_SCHEDULE];
}

// ====================================================================
// LẤY CLOUDFLARE D1 DATABASE BINDING
// ====================================================================

export function getD1(): any {
  // 1. Kiểm tra trực tiếp qua Symbol RequestContext của Cloudflare
  try {
    const symbol = Symbol.for('__cloudflare-request-context__');
    const directCtx = (globalThis as any)[symbol];
    if (directCtx && directCtx.env) {
      const env = directCtx.env as any;
      if (env.DB) return env.DB;
      if (env.DATABASE) return env.DATABASE;
      if (env.d1) return env.d1;
      if (env.D1) return env.D1;
      if (env.stem_club_db) return env.stem_club_db;
    }
  } catch {}

  // 2. Kiểm tra qua helper getRequestContext() của @cloudflare/next-on-pages
  try {
    const ctx = getRequestContext();
    if (ctx && ctx.env) {
      const env = ctx.env as any;
      if (env.DB) return env.DB;
      if (env.DATABASE) return env.DATABASE;
      if (env.d1) return env.d1;
      if (env.D1) return env.D1;
      if (env.stem_club_db) return env.stem_club_db;
    }
  } catch {}

  // 3. Kiểm tra binding được inject trực tiếp trên globalThis
  try {
    if (typeof globalThis !== 'undefined') {
      const g = globalThis as any;
      if (g.DB) return g.DB;
      if (g.DATABASE) return g.DATABASE;
      if (g.d1) return g.d1;
      if (g.D1) return g.D1;
      if (g.__env__ && g.__env__.DB) return g.__env__.DB;
    }
  } catch {}

  // 4. Kiểm tra qua process.env
  try {
    if (typeof process !== 'undefined' && process.env) {
      const p = process.env as any;
      if (p.DB) return p.DB;
      if (p.DATABASE) return p.DATABASE;
    }
  } catch {}

  return null;
}

let d1Initialized = false;
async function ensureD1Tables(d1: any) {
  if (d1Initialized) return;
  try {
    // 1. Tạo bảng posts nếu chưa có
    await d1.prepare(`
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
        gallery TEXT,
        author TEXT,
        views INTEGER DEFAULT 0,
        featured INTEGER DEFAULT 0,
        is_pinned INTEGER DEFAULT 0,
        is_urgent INTEGER DEFAULT 0,
        attachments TEXT,
        status TEXT DEFAULT 'published',
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      );
    `).run();

    // 2. Tự động thêm các cột mới nếu bảng posts đã tồn tại từ schema cũ
    const columnsToEnsure = [
      'ALTER TABLE posts ADD COLUMN is_pinned INTEGER DEFAULT 0',
      'ALTER TABLE posts ADD COLUMN is_urgent INTEGER DEFAULT 0',
      'ALTER TABLE posts ADD COLUMN attachments TEXT',
      'ALTER TABLE posts ADD COLUMN youtube_url TEXT',
      'ALTER TABLE posts ADD COLUMN youtube_id TEXT',
      'ALTER TABLE posts ADD COLUMN gallery TEXT',
      'ALTER TABLE posts ADD COLUMN author TEXT DEFAULT "CLB STEM"',
      'ALTER TABLE posts ADD COLUMN views INTEGER DEFAULT 0',
      'ALTER TABLE posts ADD COLUMN featured INTEGER DEFAULT 0',
      'ALTER TABLE posts ADD COLUMN status TEXT DEFAULT "published"'
    ];

    for (const sql of columnsToEnsure) {
      try {
        await d1.prepare(sql).run();
      } catch {
        // Bỏ qua lỗi duplicate column name nếu cột đã tồn tại sẵn
      }
    }

    // 3. Tạo bảng documents nếu chưa có
    await d1.prepare(`
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
    `).run();

    // 4. Tạo chỉ mục tối ưu tìm kiếm
    try {
      await d1.prepare('CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug)').run();
      await d1.prepare('CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category)').run();
      await d1.prepare('CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status)').run();
      await d1.prepare('CREATE INDEX IF NOT EXISTS idx_documents_category ON documents(category)').run();
    } catch {}

    d1Initialized = true;
  } catch (err) {
    console.error('[ensureD1Tables] Error initializing tables:', err);
    throw err;
  }
}

function mapRowToPost(row: any): Post {
  let gallery: string[] = [];
  try {
    gallery = row.gallery ? JSON.parse(row.gallery) : [];
  } catch {}

  let attachments: any[] = [];
  try {
    attachments = row.attachments ? JSON.parse(row.attachments) : [];
  } catch {}

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    summary: row.summary || '',
    content: row.content,
    category: row.category,
    thumbnail: row.thumbnail,
    youtubeUrl: row.youtube_url || '',
    youtubeId: row.youtube_id || '',
    gallery,
    author: row.author || 'CLB STEM',
    views: Number(row.views) || 0,
    featured: Boolean(row.featured),
    isPinned: Boolean(row.is_pinned),
    isUrgent: Boolean(row.is_urgent),
    attachments,
    status: (row.status as 'published' | 'draft') || 'published',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ====================================================================
// POSTS CRUD — D1 LÀ NGUỒN DUY NHẤT
// ====================================================================

export async function getPosts(): Promise<Post[]> {
  const d1 = getD1();
  if (d1) {
    try {
      await ensureD1Tables(d1);
      const { results } = await d1.prepare('SELECT * FROM posts ORDER BY created_at DESC').all();
      if (Array.isArray(results)) {
        const posts = results.map(mapRowToPost);
        globalStore.__POSTS_CACHE__ = posts;
        return posts;
      }
      return [];
    } catch (err) {
      console.error('[getPosts] D1 query error:', err);
      return globalStore.__POSTS_CACHE__ || [];
    }
  }
  return globalStore.__POSTS_CACHE__ || [];
}

export function savePosts(posts: Post[]) {
  globalStore.__POSTS_CACHE__ = posts;
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const d1 = getD1();
  if (d1) {
    try {
      await ensureD1Tables(d1);
      const row = await d1.prepare('SELECT * FROM posts WHERE slug = ?').bind(slug).first();
      if (row) return mapRowToPost(row);
    } catch (err) {
      console.error('[getPostBySlug] D1 error:', err);
    }
  }
  const posts = await getPosts();
  return posts.find((p) => p.slug === slug);
}

export async function getPostById(id: string): Promise<Post | undefined> {
  const d1 = getD1();
  if (d1) {
    try {
      await ensureD1Tables(d1);
      const row = await d1.prepare('SELECT * FROM posts WHERE id = ?').bind(id).first();
      if (row) return mapRowToPost(row);
    } catch (err) {
      console.error('[getPostById] D1 error:', err);
    }
  }
  const posts = await getPosts();
  return posts.find((p) => p.id === id);
}

export async function getAnnouncements(): Promise<Post[]> {
  const posts = await getPosts();
  return posts
    .filter((p) => p.status === 'published' && p.category === 'Thong-bao')
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
}

/**
 * Tạo bài viết mới — BẮT BUỘC phải ghi vào Cloudflare D1 thành công.
 * Nếu D1 chưa kết nối hoặc INSERT lỗi, throw Error để báo lỗi rõ ràng cho Admin.
 */
export async function createPost(data: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'views'>): Promise<Post> {
  const id = `post-${Date.now()}`;
  const now = new Date().toISOString();

  // Tạo slug duy nhất
  let slug = data.slug || slugify(data.title);
  if (!slug) slug = `post-${Date.now()}`;
  
  const d1 = getD1();

  // Kiểm tra slug trùng lặp
  if (d1) {
    try {
      await ensureD1Tables(d1);
      let finalSlug = slug;
      let counter = 1;
      while (true) {
        const existing = await d1.prepare('SELECT id FROM posts WHERE slug = ?').bind(finalSlug).first();
        if (!existing) break;
        finalSlug = `${slug}-${counter}`;
        counter++;
      }
      slug = finalSlug;
    } catch (err) {
      console.error('[createPost] Slug check error:', err);
    }
  }

  const youtubeId = extractYouTubeId(data.youtubeUrl) || undefined;

  const newPost: Post = {
    ...data,
    id,
    slug,
    youtubeId,
    views: 0,
    createdAt: now,
    updatedAt: now,
  };

  // GHI VÀO D1
  if (d1) {
    try {
      await ensureD1Tables(d1);
      const result = await d1.prepare(`
        INSERT INTO posts (id, title, slug, summary, content, category, thumbnail, youtube_url, youtube_id, gallery, author, views, featured, is_pinned, is_urgent, attachments, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        newPost.id, newPost.title, newPost.slug, newPost.summary || '', newPost.content, newPost.category, newPost.thumbnail,
        newPost.youtubeUrl || '', newPost.youtubeId || '', JSON.stringify(newPost.gallery || []),
        newPost.author, newPost.views || 0, newPost.featured ? 1 : 0, newPost.isPinned ? 1 : 0, newPost.isUrgent ? 1 : 0,
        JSON.stringify(newPost.attachments || []), newPost.status, newPost.createdAt, newPost.updatedAt
      ).run();

      if (!result || (typeof result.success === 'boolean' && !result.success)) {
        throw new Error(`D1 INSERT thất bại: ${JSON.stringify(result)}`);
      }

      console.log(`[createPost] Thành công: Đã lưu bài viết "${newPost.title}" (${newPost.id}) vào D1`);
    } catch (err) {
      console.error('[createPost] LỖI INSERT D1:', err);
      throw new Error(`Không thể lưu bài viết vào Cloudflare D1: ${err instanceof Error ? err.message : String(err)}`);
    }
  } else {
    // Không tìm thấy D1 binding
    const errorMsg = 'Website chưa được liên kết với Cloudflare D1 Database! Vui lòng vào Cloudflare Dashboard -> Workers & Pages -> news-stem -> Settings -> Functions -> D1 Database Bindings và thêm biến DB trỏ vào stem-club-db.';
    console.error('[createPost] LỖI:', errorMsg);
    throw new Error(errorMsg);
  }

  // Cập nhật cache cục bộ
  const cached = globalStore.__POSTS_CACHE__ || [];
  cached.unshift(newPost);
  globalStore.__POSTS_CACHE__ = cached;

  return newPost;
}

export async function updatePost(id: string, updates: Partial<Post>): Promise<Post | null> {
  const posts = await getPosts();
  const index = posts.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const oldPost = posts[index];
  let finalSlug = oldPost.slug;
  if (updates.title && updates.title !== oldPost.title && !updates.slug) {
    finalSlug = slugify(updates.title);
    let counter = 1;
    while (posts.some(p => p.id !== id && p.slug === finalSlug)) {
      finalSlug = `${slugify(updates.title)}-${counter}`;
      counter++;
    }
  } else if (updates.slug) {
    finalSlug = updates.slug;
  }

  const youtubeUrl = updates.youtubeUrl !== undefined ? updates.youtubeUrl : oldPost.youtubeUrl;
  const youtubeId = extractYouTubeId(youtubeUrl) || undefined;

  const updated: Post = {
    ...oldPost,
    ...updates,
    id: oldPost.id,
    slug: finalSlug,
    youtubeId,
    updatedAt: new Date().toISOString(),
  };

  const d1 = getD1();
  if (d1) {
    try {
      await ensureD1Tables(d1);
      const result = await d1.prepare(`
        UPDATE posts SET 
          title = ?, slug = ?, summary = ?, content = ?, category = ?, thumbnail = ?, 
          youtube_url = ?, youtube_id = ?, gallery = ?, author = ?, featured = ?, 
          is_pinned = ?, is_urgent = ?, attachments = ?, status = ?, updated_at = ?
        WHERE id = ?
      `).bind(
        updated.title, updated.slug, updated.summary || '', updated.content, updated.category, updated.thumbnail,
        updated.youtubeUrl || '', updated.youtubeId || '', JSON.stringify(updated.gallery || []),
        updated.author, updated.featured ? 1 : 0, updated.isPinned ? 1 : 0, updated.isUrgent ? 1 : 0,
        JSON.stringify(updated.attachments || []), updated.status, updated.updatedAt, id
      ).run();

      if (!result || (typeof result.success === 'boolean' && !result.success)) {
        throw new Error(`D1 UPDATE thất bại: ${JSON.stringify(result)}`);
      }
    } catch (err) {
      console.error('[updatePost] LỖI UPDATE D1:', err);
      throw new Error(`Không thể cập nhật bài viết trong Cloudflare D1: ${err instanceof Error ? err.message : String(err)}`);
    }
  } else {
    throw new Error('Chưa kết nối Cloudflare D1 Database!');
  }

  posts[index] = updated;
  globalStore.__POSTS_CACHE__ = posts;
  return updated;
}

export async function deletePost(id: string): Promise<boolean> {
  const d1 = getD1();
  if (d1) {
    try {
      await ensureD1Tables(d1);
      const result = await d1.prepare('DELETE FROM posts WHERE id = ?').bind(id).run();

      if (!result || (typeof result.success === 'boolean' && !result.success)) {
        throw new Error(`D1 DELETE thất bại: ${JSON.stringify(result)}`);
      }
    } catch (err) {
      console.error('[deletePost] LỖI DELETE D1:', err);
      throw new Error(`Không thể xóa bài viết trong Cloudflare D1: ${err instanceof Error ? err.message : String(err)}`);
    }
  } else {
    throw new Error('Chưa kết nối Cloudflare D1 Database!');
  }

  const posts = globalStore.__POSTS_CACHE__ || [];
  globalStore.__POSTS_CACHE__ = posts.filter((p) => p.id !== id);
  return true;
}

export async function incrementViews(id: string): Promise<void> {
  const d1 = getD1();
  if (d1) {
    try {
      await d1.prepare('UPDATE posts SET views = views + 1 WHERE id = ?').bind(id).run();
    } catch {}
  }
  const posts = globalStore.__POSTS_CACHE__ || [];
  const post = posts.find((p) => p.id === id);
  if (post) {
    post.views = (post.views || 0) + 1;
  }
}

// ====================================================================
// DOCUMENTS CRUD — D1 LÀ NGUỒN DUY NHẤT
// ====================================================================

export async function getDocumentResources(): Promise<DocumentResource[]> {
  const d1 = getD1();
  if (d1) {
    try {
      await ensureD1Tables(d1);
      const { results } = await d1.prepare('SELECT * FROM documents').all();
      if (Array.isArray(results)) {
        const docs: DocumentResource[] = results.map((r: any) => ({
          id: r.id,
          title: r.title,
          code: r.code,
          category: r.category,
          fileType: r.file_type,
          fileSize: r.file_size || '1.0 MB',
          publishDate: r.publish_date || '',
          downloadUrl: r.download_url || '#',
        }));
        globalStore.__DOCUMENTS_CACHE__ = docs;
        return docs;
      }
      return [];
    } catch (err) {
      console.error('[getDocumentResources] D1 query error:', err);
      return globalStore.__DOCUMENTS_CACHE__ || [];
    }
  }
  return globalStore.__DOCUMENTS_CACHE__ || [];
}

export async function createDocument(data: Omit<DocumentResource, 'id'>): Promise<DocumentResource> {
  const id = `doc-${Date.now()}`;
  const newDoc: DocumentResource = { ...data, id };

  const d1 = getD1();
  if (d1) {
    try {
      await ensureD1Tables(d1);
      const result = await d1.prepare(`
        INSERT INTO documents (id, title, code, category, file_type, file_size, publish_date, download_url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        newDoc.id, newDoc.title, newDoc.code, newDoc.category,
        newDoc.fileType, newDoc.fileSize, newDoc.publishDate, newDoc.downloadUrl
      ).run();

      if (!result || (typeof result.success === 'boolean' && !result.success)) {
        throw new Error(`D1 INSERT document thất bại: ${JSON.stringify(result)}`);
      }
    } catch (err) {
      console.error('[createDocument] LỖI INSERT D1:', err);
      throw new Error(`Không thể lưu tài liệu vào Cloudflare D1: ${err instanceof Error ? err.message : String(err)}`);
    }
  } else {
    throw new Error('Chưa kết nối Cloudflare D1 Database!');
  }

  const cached = globalStore.__DOCUMENTS_CACHE__ || [];
  cached.unshift(newDoc);
  globalStore.__DOCUMENTS_CACHE__ = cached;
  return newDoc;
}

export async function deleteDocument(id: string): Promise<boolean> {
  const d1 = getD1();
  if (d1) {
    try {
      await ensureD1Tables(d1);
      const result = await d1.prepare('DELETE FROM documents WHERE id = ?').bind(id).run();

      if (!result || (typeof result.success === 'boolean' && !result.success)) {
        throw new Error(`D1 DELETE document thất bại: ${JSON.stringify(result)}`);
      }
    } catch (err) {
      console.error('[deleteDocument] LỖI DELETE D1:', err);
      throw new Error(`Không thể xóa tài liệu trong Cloudflare D1: ${err instanceof Error ? err.message : String(err)}`);
    }
  } else {
    throw new Error('Chưa kết nối Cloudflare D1 Database!');
  }

  const docs = globalStore.__DOCUMENTS_CACHE__ || [];
  globalStore.__DOCUMENTS_CACHE__ = docs.filter((d) => d.id !== id);
  return true;
}

// ====================================================================
// SCHEDULE & CONFIG
// ====================================================================

export function getScheduleEvents(): ScheduleEvent[] {
  return globalStore.__SCHEDULE_CACHE__ || [...INITIAL_SCHEDULE];
}

export function getSiteConfig(): SiteConfig {
  return DEFAULT_CONFIG;
}
