import { Post, SiteConfig } from './types';
import * as localDb from './db';

// Kiểu dữ liệu Cloudflare D1
interface D1Database {
  prepare: (query: string) => {
    bind: (...args: any[]) => {
      all: <T = any>() => Promise<{ results: T[] }>;
      first: <T = any>() => Promise<T | null>;
      run: () => Promise<{ success: boolean }>;
    };
  };
}

// Lấy D1 binding từ môi trường Cloudflare (nếu đang chạy trên Cloudflare Workers/Pages)
function getD1Binding(): D1Database | null {
  try {
    // @ts-ignore
    if (typeof globalThis !== 'undefined' && globalThis.DB) {
      // @ts-ignore
      return globalThis.DB as D1Database;
    }
    // @ts-ignore
    if (process.env.DB) {
      // @ts-ignore
      return process.env.DB as D1Database;
    }
  } catch {}
  return null;
}

/**
 * Lấy danh sách bài viết từ Cloudflare D1 hoặc Local DB
 */
export async function getPostsAsync(options?: {
  category?: string;
  search?: string;
  status?: string;
  limit?: number;
}): Promise<Post[]> {
  const d1 = getD1Binding();

  // Nếu không có D1 (đang chạy local dev), dùng local DB
  if (!d1) {
    let posts = localDb.getPosts();
    if (options?.status && options.status !== 'all') {
      posts = posts.filter((p) => p.status === options.status);
    }
    if (options?.category && options.category !== 'Tat-ca') {
      posts = posts.filter((p) => p.category === options.category);
    }
    if (options?.search) {
      const q = options.search.toLowerCase();
      posts = posts.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.summary.toLowerCase().includes(q) ||
          p.content.toLowerCase().includes(q)
      );
    }
    if (options?.limit) {
      posts = posts.slice(0, options.limit);
    }
    return posts;
  }

  // Truy vấn trên Cloudflare D1
  try {
    let query = 'SELECT * FROM posts WHERE 1=1';
    const params: any[] = [];

    if (options?.status && options.status !== 'all') {
      query += ' AND status = ?';
      params.push(options.status);
    }
    if (options?.category && options.category !== 'Tat-ca') {
      query += ' AND category = ?';
      params.push(options.category);
    }
    if (options?.search) {
      query += ' AND (title LIKE ? OR summary LIKE ? OR content LIKE ?)';
      const s = `%${options.search}%`;
      params.push(s, s, s);
    }

    query += ' ORDER BY created_at DESC';

    if (options?.limit) {
      query += ' LIMIT ?';
      params.push(options.limit);
    }

    const { results } = await d1.prepare(query).bind(...params).all<any>();

    return results.map((row: any) => ({
      id: row.id,
      title: row.title,
      slug: row.slug,
      summary: row.summary || '',
      content: row.content,
      category: row.category,
      thumbnail: row.thumbnail,
      youtubeUrl: row.youtube_url || '',
      youtubeId: row.youtube_id || '',
      gallery: row.gallery ? JSON.parse(row.gallery) : [],
      author: row.author,
      views: row.views || 0,
      featured: Boolean(row.featured),
      status: row.status as 'published' | 'draft',
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  } catch (err) {
    console.error('Lỗi khi truy vấn Cloudflare D1:', err);
    return localDb.getPosts();
  }
}

/**
 * Lấy chi tiết bài viết theo Slug từ Cloudflare D1
 */
export async function getPostBySlugAsync(slug: string): Promise<Post | null> {
  const d1 = getD1Binding();
  if (!d1) {
    return localDb.getPostBySlug(slug) || null;
  }

  try {
    const row = await d1
      .prepare('SELECT * FROM posts WHERE slug = ?')
      .bind(slug)
      .first<any>();

    if (!row) return null;

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
      gallery: row.gallery ? JSON.parse(row.gallery) : [],
      author: row.author,
      views: row.views || 0,
      featured: Boolean(row.featured),
      status: row.status as 'published' | 'draft',
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  } catch (err) {
    console.error('Lỗi lấy bài viết từ D1:', err);
    return localDb.getPostBySlug(slug) || null;
  }
}
