'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Post, CATEGORIES } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit, 
  Eye, 
  LogOut, 
  FileText, 
  CheckCircle, 
  Clock, 
  Play, 
  Video,
  ExternalLink,
  AlertTriangle,
  RefreshCw,
  FolderOpen
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  // Tải danh sách bài viết
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/posts?status=all');
      if (res.status === 401) {
        router.replace('/admin');
        return;
      }
      const data = await res.json();
      setPosts(data.posts || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Đăng xuất
  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin');
  };

  // Xác nhận xóa bài viết
  const handleDeletePost = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/posts/${deleteId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== deleteId));
        setDeleteId(null);
      } else {
        alert('Không thể xóa bài viết, vui lòng thử lại.');
      }
    } catch {
      alert('Đã xảy ra lỗi khi xóa bài viết.');
    } finally {
      setDeleting(false);
    }
  };

  // Thống kê nhanh
  const totalPosts = posts.length;
  const publishedCount = posts.filter((p) => p.status === 'published').length;
  const draftCount = posts.filter((p) => p.status === 'draft').length;
  const totalViews = posts.reduce((sum, p) => sum + (p.views || 0), 0);

  // Lọc bài viết
  const filteredPosts = posts.filter((p) => {
    const matchesSearch =
      search === '' ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.author.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-slate-50/60 min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Bảng Điều Khiển
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">
              Quản Trị Bài Viết & Hoạt Động
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Đăng tải, chỉnh sửa bài viết và quản lý video YouTube của CLB STEM.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/posts/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              Đăng Bài Mới
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-700 text-sm font-semibold transition-colors border border-slate-200"
              title="Đăng xuất"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Đăng xuất</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold">Tổng bài viết</span>
              <FileText className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">{totalPosts}</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold">Đã xuất bản</span>
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-emerald-600">{publishedCount}</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold">Bản nháp</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-black text-amber-600">{draftCount}</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold">Tổng lượt xem</span>
              <Eye className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-black text-purple-600">{totalViews}</div>
          </div>
        </div>

        {/* Search, Filter & Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tiêu đề hoặc tác giả..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="published">Đã xuất bản</option>
              <option value="draft">Bản nháp</option>
            </select>

            <button
              onClick={fetchPosts}
              className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-slate-50 shadow-sm transition-colors"
              title="Làm mới danh sách"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Posts Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-20 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
              <p className="text-xs text-slate-500 mt-3">Đang tải danh sách bài viết...</p>
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50/80 text-xs font-bold uppercase text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">Bài viết & Chuyên mục</th>
                    <th className="px-6 py-4">Đa phương tiện</th>
                    <th className="px-6 py-4">Trạng thái</th>
                    <th className="px-6 py-4">Lượt xem</th>
                    <th className="px-6 py-4">Ngày đăng</th>
                    <th className="px-6 py-4 text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPosts.map((post) => {
                    const cat = CATEGORIES.find((c) => c.id === post.category);
                    const hasVideo = Boolean(post.youtubeUrl || post.youtubeId);

                    return (
                      <tr key={post.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* Title & Thumbnail */}
                        <td className="px-6 py-4 max-w-sm">
                          <div className="flex items-center gap-3">
                            <img
                              src={post.thumbnail}
                              alt=""
                              className="w-14 h-11 object-cover rounded-lg shrink-0 border border-slate-200"
                            />
                            <div>
                              <p className="font-bold text-slate-900 line-clamp-1 hover:text-blue-600">
                                {post.title}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${cat?.bgColor || 'bg-slate-100'} ${cat?.color || 'text-slate-700'}`}>
                                  {cat?.label || post.category}
                                </span>
                                <span className="text-[11px] text-slate-400">
                                  Bởi: {post.author}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Media badge (Video / Gallery) */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {hasVideo && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-red-100 text-red-700">
                                <Video className="w-3 h-3 text-red-600" />
                                Video YT
                              </span>
                            )}
                            {post.gallery && post.gallery.length > 0 && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-blue-100 text-blue-700">
                                {post.gallery.length} ảnh
                              </span>
                            )}
                            {!hasVideo && (!post.gallery || post.gallery.length === 0) && (
                              <span className="text-slate-400 text-xs">Chỉ có ảnh bìa</span>
                            )}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {post.status === 'published' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle className="w-3.5 h-3.5" />
                              Xuất bản
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                              <Clock className="w-3.5 h-3.5" />
                              Bản nháp
                            </span>
                          )}
                        </td>

                        {/* Views */}
                        <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-slate-600">
                          {post.views || 0}
                        </td>

                        {/* Date */}
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">
                          {formatDate(post.createdAt)}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Nút Xem bài viết ngoài trang web */}
                            <Link
                              href={`/posts/${post.slug}`}
                              target="_blank"
                              className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                              title="Xem trang hiển thị"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>

                            {/* Nút Sửa */}
                            <Link
                              href={`/admin/posts/${post.id}/edit`}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                              title="Chỉnh sửa bài viết"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>

                            {/* Nút Xóa */}
                            <button
                              onClick={() => setDeleteId(post.id)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                              title="Xóa bài viết"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-16 text-center space-y-3">
              <FolderOpen className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-600">
                Không tìm thấy bài viết nào
              </p>
              <Link
                href="/admin/posts/new"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
              >
                <Plus className="w-4 h-4" />
                Tạo bài viết đầu tiên ngay
              </Link>
            </div>
          )}
        </div>

      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-slate-900">Xác nhận xóa bài viết?</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Hành động này sẽ xóa vĩnh viễn bài viết khỏi hệ thống và không thể khôi phục lại. Bạn có chắc chắn muốn tiếp tục?
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteId(null)}
                disabled={deleting}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleDeletePost}
                disabled={deleting}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs shadow-md shadow-red-500/20 disabled:opacity-50"
              >
                {deleting ? 'Đang xóa...' : 'Đồng ý xóa'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
