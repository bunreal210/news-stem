export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { getD1 } from '@/lib/db';
import { getRequestContext } from '@cloudflare/next-on-pages';

export async function GET() {
  let envKeys: string[] = [];
  let requestContextAvailable = false;
  let requestContextError: string | null = null;

  try {
    const symbol = Symbol.for('__cloudflare-request-context__');
    const directCtx = (globalThis as any)[symbol];
    if (directCtx?.env) {
      envKeys = Object.keys(directCtx.env);
      requestContextAvailable = true;
    }
  } catch {}

  if (!requestContextAvailable) {
    try {
      const ctx = getRequestContext();
      if (ctx?.env) {
        envKeys = Object.keys(ctx.env);
        requestContextAvailable = true;
      }
    } catch (err: any) {
      requestContextError = err?.message || 'Không thể lấy Cloudflare RequestContext';
    }
  }

  const d1 = getD1();
  let d1Status: 'connected' | 'disconnected' | 'error' = 'disconnected';
  let postsCount = 0;
  let documentsCount = 0;
  let d1Error: string | null = null;
  let postsColumns: string[] = [];

  if (d1) {
    try {
      // Thử truy vấn bảng posts
      const pRes = await d1.prepare('SELECT count(*) as total FROM posts').first();
      postsCount = Number(pRes?.total || 0);

      // Thử truy vấn bảng documents
      const dRes = await d1.prepare('SELECT count(*) as total FROM documents').first();
      documentsCount = Number(dRes?.total || 0);

      // Kiểm tra cột của bảng posts
      try {
        const colInfo = await d1.prepare('PRAGMA table_info(posts)').all();
        if (Array.isArray(colInfo.results)) {
          postsColumns = colInfo.results.map((c: any) => c.name);
        }
      } catch {}

      d1Status = 'connected';
    } catch (err: any) {
      d1Status = 'error';
      d1Error = err?.message || 'Lỗi truy vấn D1 database';
    }
  }

  return NextResponse.json({
    d1Status,
    d1Connected: d1Status === 'connected',
    requestContextAvailable,
    requestContextError,
    envKeys,
    postsCount,
    documentsCount,
    postsColumns,
    d1Error,
    timestamp: new Date().toISOString(),
  });
}
