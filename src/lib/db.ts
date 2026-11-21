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

// Lấy Cloudflare D1 Database binding
export function getD1(): any {
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
  try {
    if (typeof globalThis !== 'undefined') {
      const g = globalThis as any;
      if (g.DB) return g.DB;
      if (g.DATABASE) return g.DATABASE;
      if (g.d1) return g.d1;
      if (g.D1) return g.D1;
    }
  } catch {}
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

    // 2. Tạo bảng documents nếu chưa có
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

    d1Initialized = true;
  } catch (err) {
    console.error('D1 table creation notice:', err);
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

// -------------------------------------------------------------
// POSTS CRUD (CHỈ LẤY & GHI VÀO DB)
// -------------------------------------------------------------

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
    } catch (err) {
      console.error('Lỗi khi truy vấn Cloudflare D1:', err);
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
      console.error('Lỗi tìm bài viết theo slug D1:', err);
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
      console.error('Lỗi tìm bài viết theo id D1:', err);
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

export async function createPost(data: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'views'>): Promise<Post> {
  const posts = await getPosts();
  const id = `post-${Date.now()}`;
  const now = new Date().toISOString();
  
  let slug = data.slug || slugify(data.title);
  let finalSlug = slug;
  let counter = 1;
  while (posts.some(p => p.slug === finalSlug)) {
    finalSlug = `${slug}-${counter}`;
    counter++;
  }

  const youtubeId = extractYouTubeId(data.youtubeUrl) || undefined;

  const newPost: Post = {
    ...data,
    id,
    slug: finalSlug,
    youtubeId,
    views: 0,
    createdAt: now,
    updatedAt: now,
  };

  // 1. Lưu vào D1 Database
  const d1 = getD1();
  if (d1) {
    try {
      await ensureD1Tables(d1);
      await d1.prepare(`
        INSERT INTO posts (id, title, slug, summary, content, category, thumbnail, youtube_url, youtube_id, gallery, author, views, featured, is_pinned, is_urgent, attachments, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        newPost.id, newPost.title, newPost.slug, newPost.summary || '', newPost.content, newPost.category, newPost.thumbnail,
        newPost.youtubeUrl || '', newPost.youtubeId || '', JSON.stringify(newPost.gallery || []),
        newPost.author, newPost.views || 0, newPost.featured ? 1 : 0, newPost.isPinned ? 1 : 0, newPost.isUrgent ? 1 : 0,
        JSON.stringify(newPost.attachments || []), newPost.status, newPost.createdAt, newPost.updatedAt
      ).run();
    } catch (err) {
      console.error('Lỗi khi INSERT vào Cloudflare D1:', err);
    }
  }

  // 2. Cập nhật cache
  posts.unshift(newPost);
  globalStore.__POSTS_CACHE__ = posts;
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

  // 1. Cập nhật D1
  const d1 = getD1();
  if (d1) {
    try {
      await ensureD1Tables(d1);
      await d1.prepare(`
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
    } catch (err) {
      console.error('Lỗi khi UPDATE vào Cloudflare D1:', err);
    }
  }

  // 2. Cập nhật cache
  posts[index] = updated;
  globalStore.__POSTS_CACHE__ = posts;
  return updated;
}

export async function deletePost(id: string): Promise<boolean> {
  const posts = await getPosts();
  const filtered = posts.filter((p) => p.id !== id);

  // 1. Xóa trong D1
  const d1 = getD1();
  if (d1) {
    try {
      await ensureD1Tables(d1);
      await d1.prepare('DELETE FROM posts WHERE id = ?').bind(id).run();
    } catch (err) {
      console.error('Lỗi khi DELETE từ Cloudflare D1:', err);
    }
  }

  // 2. Cập nhật cache
  globalStore.__POSTS_CACHE__ = filtered;
  return true;
}

export async function incrementViews(id: string): Promise<void> {
  const posts = await getPosts();
  const post = posts.find((p) => p.id === id);
  if (post) {
    post.views = (post.views || 0) + 1;
    const d1 = getD1();
    if (d1) {
      try {
        await d1.prepare('UPDATE posts SET views = views + 1 WHERE id = ?').bind(id).run();
      } catch {}
    }
  }
}

// -------------------------------------------------------------
// DOCUMENTS CRUD (CHỈ LẤY & GHI VÀO DB)
// -------------------------------------------------------------

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
    } catch (err) {
      console.error('Lỗi khi truy vấn documents từ D1:', err);
    }
  }
  return globalStore.__DOCUMENTS_CACHE__ || [];
}

export async function createDocument(data: Omit<DocumentResource, 'id'>): Promise<DocumentResource> {
  const docs = await getDocumentResources();
  const id = `doc-${Date.now()}`;
  const newDoc: DocumentResource = { ...data, id };

  const d1 = getD1();
  if (d1) {
    try {
      await ensureD1Tables(d1);
      await d1.prepare(`
        INSERT INTO documents (id, title, code, category, file_type, file_size, publish_date, download_url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        newDoc.id, newDoc.title, newDoc.code, newDoc.category,
        newDoc.fileType, newDoc.fileSize, newDoc.publishDate, newDoc.downloadUrl
      ).run();
    } catch (err) {
      console.error('Lỗi khi INSERT document vào D1:', err);
    }
  }

  docs.unshift(newDoc);
  globalStore.__DOCUMENTS_CACHE__ = docs;
  return newDoc;
}

export async function deleteDocument(id: string): Promise<boolean> {
  const docs = await getDocumentResources();
  const filtered = docs.filter((d) => d.id !== id);

  const d1 = getD1();
  if (d1) {
    try {
      await ensureD1Tables(d1);
      await d1.prepare('DELETE FROM documents WHERE id = ?').bind(id).run();
    } catch (err) {
      console.error('Lỗi khi DELETE document từ D1:', err);
    }
  }

  globalStore.__DOCUMENTS_CACHE__ = filtered;
  return true;
}

// -------------------------------------------------------------
// SCHEDULE & CONFIG
// -------------------------------------------------------------

export function getScheduleEvents(): ScheduleEvent[] {
  return globalStore.__SCHEDULE_CACHE__ || [...INITIAL_SCHEDULE];
}

export function getSiteConfig(): SiteConfig {
  return DEFAULT_CONFIG;
}
