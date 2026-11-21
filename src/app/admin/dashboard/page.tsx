'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Post, CATEGORIES, DocumentResource } from '@/lib/types';
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
  ExternalLink,
  AlertTriangle,
  RefreshCw,
  Bell,
  Newspaper,
  Pin,
  Download,
  FolderDown,
  ShieldCheck,
  PlusCircle,
  X,
  Filter,
  Sparkles,
  Layers,
  Check
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [documents, setDocuments] = useState<DocumentResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Category sub-filter for news tab
  const [newsCategoryFilter, setNewsCategoryFilter] = useState<string>('all');
  
  // Tabs: 'news' | 'announcements' | 'documents' | 'drafts'
  const [activeTab, setActiveTab] = useState<'news' | 'announcements' | 'documents' | 'drafts'>('news');
  
  // Delete modals
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  
  // Add Document Modal
  const [showAddDocModal, setShowAddDocModal] = useState(false);
  const [docTitle, setDocTitle] = useState('');
  const [docCode, setDocCode] = useState('');
  const [docCategory, setDocCategory] = useState('Kế hoạch');
  const [docFileType, setDocFileType] = useState('PDF');
  const [docFileSize, setDocFileSize] = useState('1.5 MB');
  const [docUrl, setDocUrl] = useState('#');
  const [addingDoc, setAddingDoc] = useState(false);

  const router = useRouter();

  // Tải danh sách bài viết & văn bản
  const fetchData = async () => {
    setLoading(true);
    try {
      const [resPosts, resDocs] = await Promise.all([
        fetch('/api/posts?status=all'),
        fetch('/api/documents'),
      ]);

      if (resPosts.status === 401) {
        router.replace('/admin');
        return;
      }

      const dataPosts = await resPosts.json();
      setPosts(dataPosts.posts || []);

      if (resDocs.ok) {
        const dataDocs = await resDocs.json();
        setDocuments(dataDocs.documents || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
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

  // Thêm văn bản mới
  const handleAddDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle.trim() || !docCode.trim()) {
      alert('Vui lòng nhập tên văn bản và mã số hiệu.');
      return;
    }

    setAddingDoc(true);
    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: docTitle.trim(),
          code: docCode.trim(),
          category: docCategory,
          fileType: docFileType,
          fileSize: docFileSize,
          downloadUrl: docUrl,
        }),
      });

      const data = await res.json();
      if (res.ok && data.document) {
        setDocuments((prev) => [data.document, ...prev]);
        setShowAddDocModal(false);
        setDocTitle('');
        setDocCode('');
        setDocUrl('#');
      } else {
        alert(data.error || 'Lỗi khi thêm văn bản.');
      }
    } catch {
      alert('Lỗi kết nối khi thêm văn bản.');
    } finally {
      setAddingDoc(false);
    }
  };

  // Xóa văn bản
  const handleDeleteDocument = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa văn bản này khỏi hệ thống?')) return;
    try {
      const res = await fetch(`/api/documents/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setDocuments((prev) => prev.filter((d) => d.id !== id));
      } else {
        alert('Không thể xóa văn bản.');
      }
    } catch {
      alert('Lỗi kết nối khi xóa văn bản.');
    }
  };

  // Thống kê phân loại
  const newsPosts = posts.filter((p) => p.category !== 'Thong-bao' && p.status === 'published');
  const announcementPosts = posts.filter((p) => p.category === 'Thong-bao' && p.status === 'published');
  const draftPosts = posts.filter((p) => p.status === 'draft');
  const totalViews = posts.reduce((sum, p) => sum + (p.views || 0), 0);

  // Danh sách hiển thị theo tab
  const getTabItems = () => {
    let items: Post[] = [];
    if (activeTab === 'news') {
      items = newsPosts;
      if (newsCategoryFilter !== 'all') {
        items = items.filter((p) => p.category === newsCategoryFilter);
      }
    } else if (activeTab === 'announcements') {
      items = announcementPosts;
    } else if (activeTab === 'drafts') {
      items = draftPosts;
    }

    if (search.trim() !== '') {
      const q = search.toLowerCase().trim();
      items = items.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.author.toLowerCase().includes(q) ||
          p.summary.toLowerCase().includes(q)
      );
    }

    return items;
  };

  const filteredDocs = documents.filter((d) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase().trim();
    return (
      d.title.toLowerCase().includes(q) ||
      d.code.toLowerCase().includes(q) ||
      d.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* ================= 1. TRUNG TÂM TÁC VỤ & ĐIỀU KHIỂN TẬP TRUNG (ALL-IN-ONE ACTION HUB) ================= */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 sm:p-8 relative overflow-hidden transition-all">
        {/* Subtle accent corner glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-blue-100/50 via-cyan-50/20 to-transparent rounded-bl-full pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Header Title & Status */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Trung Tâm Quản Trị Cổng BSSRC</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500 font-medium lowercase">admin session active</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1.5 font-tech tracking-tight">
                Bảng Điều Khiển Nội Dung & Hệ Thống
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
                Quản lý tập trung toàn diện: Soạn thảo tin tức, phát hành thông báo khẩn, quản lý văn bản biểu mẫu tải về và giám sát hoạt động cổng thông tin.
              </p>
            </div>

            {/* Quick System Badge */}
            <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200/80 shrink-0 self-start md:self-auto">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              <div className="text-left">
                <div className="text-[11px] font-bold text-slate-800">THPT Bắc Đông Quan</div>
                <div className="text-[10px] text-slate-500">Cổng Thông Tin Điện Tử</div>
              </div>
            </div>
          </div>

          {/* DÃY NÚT CHỨC NĂNG TẬP TRUNG TẠI 1 CHỖ (UNIFIED ACTION TOOLBAR) */}
          <div className="bg-slate-50/90 border border-slate-200/90 rounded-2xl p-3 sm:p-4 flex flex-wrap items-center gap-2.5 sm:gap-3">
            
            {/* 1. Nút Đăng Tin Tức Mới */}
            <Link
              href="/admin/posts/new?category=Tin-hoat-dong"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-sm hover:shadow-md shadow-blue-500/20 transition-all group"
            >
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
              <span>+ Đăng Tin Tức Mới</span>
            </Link>

            {/* 2. Nút Tạo Thông Báo Mới */}
            <Link
              href="/admin/posts/new?category=Thong-bao"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-sm hover:shadow-md shadow-red-500/20 transition-all group"
            >
              <Bell className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>+ Tạo Thông Báo Mới</span>
            </Link>

            {/* 3. Nút Ban Hành Văn Bản Mới */}
            <button
              onClick={() => setShowAddDocModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-sm hover:shadow-md shadow-emerald-500/20 transition-all group"
            >
              <FolderDown className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
              <span>+ Thêm Văn Bản Tải Về</span>
            </button>

            {/* Divider */}
            <div className="hidden lg:block w-px h-7 bg-slate-200 mx-1" />

            {/* 4. Nút Làm Mới Dữ Liệu */}
            <button
              onClick={fetchData}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold shadow-2xs transition-all disabled:opacity-50"
              title="Làm mới toàn bộ dữ liệu"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-600' : 'text-slate-500'}`} />
              <span>Làm mới</span>
            </button>

            {/* 5. Nút Xem Cổng Public */}
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold shadow-2xs transition-all"
              title="Mở cổng thông tin công khai trong tab mới"
            >
              <span>Xem Cổng Public</span>
              <ExternalLink className="w-3.5 h-3.5 text-blue-500" />
            </Link>

            {/* 6. Nút Đăng Xuất */}
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white hover:bg-red-50 text-red-600 border border-red-200 text-xs font-semibold shadow-2xs transition-all sm:ml-auto"
              title="Đăng xuất khỏi phiên quản trị"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Đăng xuất</span>
            </button>

          </div>
        </div>
      </div>

      {/* ================= 2. THỐNG KÊ TRỰC QUAN & CHUYỂN TAB NHANH (METRICS & QUICK FILTERS) ================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Thẻ 1: Tin Tức */}
        <div 
          onClick={() => setActiveTab('news')}
          className={`p-5 sm:p-6 rounded-3xl border transition-all cursor-pointer relative overflow-hidden group ${
            activeTab === 'news' 
              ? 'bg-blue-50/80 border-blue-400 ring-2 ring-blue-500/20 shadow-xs' 
              : 'bg-white border-slate-200/90 hover:border-blue-300 hover:shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">Tin Tức Bài Viết</span>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
              activeTab === 'news' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-100'
            }`}>
              <Newspaper className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-3 font-tech">
            {newsPosts.length}
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
            <p className="text-[11px] text-slate-500">Đã công khai trên Cổng</p>
            <span className={`text-[10px] font-bold ${activeTab === 'news' ? 'text-blue-700' : 'text-slate-400 group-hover:text-blue-600'}`}>
              {activeTab === 'news' ? '● Đang xem' : 'Xem danh sách →'}
            </span>
          </div>
        </div>

        {/* Thẻ 2: Bảng Thông Báo */}
        <div 
          onClick={() => setActiveTab('announcements')}
          className={`p-5 sm:p-6 rounded-3xl border transition-all cursor-pointer relative overflow-hidden group ${
            activeTab === 'announcements' 
              ? 'bg-red-50/80 border-red-400 ring-2 ring-red-500/20 shadow-xs' 
              : 'bg-white border-slate-200/90 hover:border-red-300 hover:shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-red-700 uppercase tracking-wide">Bảng Thông Báo</span>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
              activeTab === 'announcements' ? 'bg-red-600 text-white' : 'bg-red-50 text-red-600 group-hover:bg-red-100'
            }`}>
              <Bell className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-3 font-tech">
            {announcementPosts.length}
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
            <p className="text-[11px] text-slate-500">Chỉ đạo & Kế hoạch</p>
            <span className={`text-[10px] font-bold ${activeTab === 'announcements' ? 'text-red-700' : 'text-slate-400 group-hover:text-red-600'}`}>
              {activeTab === 'announcements' ? '● Đang xem' : 'Xem danh sách →'}
            </span>
          </div>
        </div>

        {/* Thẻ 3: Văn Bản Tải Về */}
        <div 
          onClick={() => setActiveTab('documents')}
          className={`p-5 sm:p-6 rounded-3xl border transition-all cursor-pointer relative overflow-hidden group ${
            activeTab === 'documents' 
              ? 'bg-emerald-50/80 border-emerald-400 ring-2 ring-emerald-500/20 shadow-xs' 
              : 'bg-white border-slate-200/90 hover:border-emerald-300 hover:shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Văn Bản Tải Về</span>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
              activeTab === 'documents' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100'
            }`}>
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-3 font-tech">
            {documents.length}
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
            <p className="text-[11px] text-slate-500">Biểu mẫu, học liệu, quy chế</p>
            <span className={`text-[10px] font-bold ${activeTab === 'documents' ? 'text-emerald-700' : 'text-slate-400 group-hover:text-emerald-600'}`}>
              {activeTab === 'documents' ? '● Đang xem' : 'Xem danh sách →'}
            </span>
          </div>
        </div>

        {/* Thẻ 4: Bản Nháp & Lượt Đọc */}
        <div 
          onClick={() => setActiveTab('drafts')}
          className={`p-5 sm:p-6 rounded-3xl border transition-all cursor-pointer relative overflow-hidden group ${
            activeTab === 'drafts' 
              ? 'bg-slate-100/90 border-slate-400 ring-2 ring-slate-500/20 shadow-xs' 
              : 'bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Bản Nháp / Tổng Đọc</span>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
              activeTab === 'drafts' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
            }`}>
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-3">
            <span className="text-3xl font-extrabold text-slate-900 font-tech">{draftPosts.length}</span>
            <span className="text-xs text-slate-400 font-medium">bản nháp</span>
            <span className="text-slate-300">•</span>
            <span className="text-base font-bold text-slate-700 font-tech">{totalViews}</span>
            <span className="text-[10px] text-slate-400">lượt đọc</span>
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
            <p className="text-[11px] text-slate-500">Nội dung chưa công khai</p>
            <span className={`text-[10px] font-bold ${activeTab === 'drafts' ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-700'}`}>
              {activeTab === 'drafts' ? '● Đang xem' : 'Xem danh sách →'}
            </span>
          </div>
        </div>

      </div>

      {/* ================= 3. THANH ĐIỀU HƯỚNG TAB & TÌM KIẾM (TAB CONTROLS & SEARCH) ================= */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Navigation Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveTab('news')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'news'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Newspaper className="w-4 h-4" />
            <span>Tin tức ({newsPosts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('announcements')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'announcements'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Thông báo ({announcementPosts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('documents')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'documents'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Văn bản & Biểu mẫu ({documents.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('drafts')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'drafts'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Bản nháp ({draftPosts.length})</span>
          </button>
        </div>

        {/* Search Input with Clear Button */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tiêu đề, tác giả, số hiệu..."
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Sub-category Filter for News Tab */}
      {activeTab === 'news' && (
        <div className="flex items-center gap-1.5 flex-wrap text-xs">
          <span className="text-slate-500 font-semibold flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" />
            Phân loại tin:
          </span>
          <button
            onClick={() => setNewsCategoryFilter('all')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
              newsCategoryFilter === 'all'
                ? 'bg-blue-100 text-blue-700 font-bold border border-blue-200'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Tất cả danh mục ({newsPosts.length})
          </button>
          {CATEGORIES.filter(c => c.id !== 'Thong-bao').map((c) => {
            const count = newsPosts.filter(p => p.category === c.id).length;
            return (
              <button
                key={c.id}
                onClick={() => setNewsCategoryFilter(c.id)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  newsCategoryFilter === c.id
                    ? 'bg-blue-100 text-blue-700 font-bold border border-blue-200'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {c.label} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* ================= 4. NỘI DUNG DỮ LIỆU BẢNG (CONTENT DATA TABLES) ================= */}
      {activeTab === 'documents' ? (
        /* ================= BẢNG QUẢN LÝ VĂN BẢN & BIỂU MẪU ================= */
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900">
                Kho Văn Bản & Biểu Mẫu Hệ Thống ({filteredDocs.length})
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Các tệp quy chế, kế hoạch hoạt động và mẫu đơn để học sinh, giáo viên tải về từ cổng thông tin.
              </p>
            </div>
            <button
              onClick={() => setShowAddDocModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-2xs transition-colors shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Thêm văn bản mới</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                  <th className="py-3 px-4 w-12 text-center">STT</th>
                  <th className="py-3 px-4">Tên Văn Bản / Biểu Mẫu</th>
                  <th className="py-3 px-4 hidden sm:table-cell">Số Hiệu</th>
                  <th className="py-3 px-4 hidden md:table-cell">Chuyên Mục</th>
                  <th className="py-3 px-4 hidden lg:table-cell">Định Dạng</th>
                  <th className="py-3 px-4 hidden lg:table-cell">Ngày Ban Hành</th>
                  <th className="py-3 px-4 text-center w-28">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDocs.length > 0 ? (
                  filteredDocs.map((doc, idx) => (
                    <tr key={doc.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="py-3 px-4 text-center text-slate-400 font-semibold">{idx + 1}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          <span className="line-clamp-1">{doc.title}</span>
                          {doc.downloadUrl && doc.downloadUrl !== '#' && (
                            <a
                              href={doc.downloadUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-600 hover:text-emerald-700 p-1 hover:bg-emerald-50 rounded"
                              title="Tải thử văn bản"
                            >
                              <Download className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                        <div className="sm:hidden text-[10px] text-slate-400 font-normal mt-0.5">
                          {doc.code} • {doc.category} • {doc.fileType}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-mono hidden sm:table-cell">{doc.code}</td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-[10px] font-semibold">
                          {doc.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 hidden lg:table-cell">
                        <span className="font-bold text-blue-700">{doc.fileType}</span> ({doc.fileSize})
                      </td>
                      <td className="py-3 px-4 text-slate-500 hidden lg:table-cell">{doc.publishDate}</td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleDeleteDocument(doc.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Xóa văn bản này"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500">
                      Chưa có văn bản nào phù hợp với tìm kiếm.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* ================= BẢNG QUẢN LÝ BÀI VIẾT & THÔNG BÁO ================= */
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900">
                {activeTab === 'news' && `Danh Sách Tin Tức Bài Viết (${getTabItems().length})`}
                {activeTab === 'announcements' && `Danh Sách Bảng Thông Báo (${getTabItems().length})`}
                {activeTab === 'drafts' && `Danh Sách Bản Nháp Chưa Công Khai (${getTabItems().length})`}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {activeTab === 'news' && 'Hiển thị các bài viết truyền thông, hoạt động nghiên cứu STEM công khai trên Cổng.'}
                {activeTab === 'announcements' && 'Hiển thị các thông báo nội bộ, văn bản chỉ đạo khẩn cấp và kế hoạch hoạt động.'}
                {activeTab === 'drafts' && 'Bài viết hoặc thông báo đang soạn dở, chưa được xuất bản ra ngoài cổng public.'}
              </p>
            </div>

            {/* Context action */}
            {activeTab === 'news' && (
              <Link
                href="/admin/posts/new?category=Tin-hoat-dong"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-2xs transition-colors shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Đăng tin mới</span>
              </Link>
            )}
            {activeTab === 'announcements' && (
              <Link
                href="/admin/posts/new?category=Thong-bao"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-2xs transition-colors shrink-0"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>+ Tạo thông báo</span>
              </Link>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                  <th className="py-3.5 px-4 w-12 text-center">STT</th>
                  <th className="py-3.5 px-4">Tiêu Đề & Phân Loại</th>
                  <th className="py-3.5 px-4 hidden md:table-cell">Tác Giả</th>
                  <th className="py-3.5 px-4 hidden sm:table-cell">Ngày Đăng</th>
                  <th className="py-3.5 px-4 text-center">Lượt Đọc</th>
                  <th className="py-3.5 px-4 text-center">Trạng Thái</th>
                  <th className="py-3.5 px-4 text-center w-32">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {getTabItems().length > 0 ? (
                  getTabItems().map((post, idx) => {
                    const isNotice = post.category === 'Thong-bao';
                    return (
                      <tr key={post.id} className="hover:bg-blue-50/30 transition-colors">
                        <td className="py-3.5 px-4 text-center text-slate-400 font-semibold">{idx + 1}</td>
                        
                        <td className="py-3.5 px-4">
                          <div className="flex items-start gap-3">
                            <div className="w-14 h-10 rounded-lg overflow-hidden shrink-0 border border-slate-200 hidden sm:block bg-slate-100">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={post.thumbnail} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap mb-1">
                                {isNotice ? (
                                  <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-red-100 text-red-700 border border-red-200">
                                    Thông Báo
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-200">
                                    {CATEGORIES.find((c) => c.id === post.category)?.label || post.category}
                                  </span>
                                )}

                                {post.isUrgent && (
                                  <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase bg-red-600 text-white animate-pulse">
                                    Khẩn
                                  </span>
                                )}

                                {post.isPinned && (
                                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-0.5">
                                    <Pin className="w-2.5 h-2.5" />
                                    Ghim
                                  </span>
                                )}

                                {post.featured && (
                                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-purple-100 text-purple-700 border border-purple-200">
                                    Tiêu điểm
                                  </span>
                                )}

                                {post.attachments && post.attachments.length > 0 && (
                                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-0.5">
                                    <FileText className="w-2.5 h-2.5" />
                                    {post.attachments.length} file
                                  </span>
                                )}
                              </div>

                              <Link
                                href={`/posts/${post.slug}`}
                                target="_blank"
                                className="font-bold text-slate-900 hover:text-blue-600 transition-colors line-clamp-2 leading-snug"
                              >
                                {post.title}
                              </Link>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-slate-600 hidden md:table-cell">{post.author}</td>
                        <td className="py-3.5 px-4 text-slate-500 hidden sm:table-cell">{formatDate(post.createdAt)}</td>

                        <td className="py-3.5 px-4 text-center font-tech font-bold text-slate-700">
                          {post.views || 0}
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          {post.status === 'published' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              Công khai
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                              Bản nháp
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            {/* Xem bài viết trên public */}
                            <Link
                              href={`/posts/${post.slug}`}
                              target="_blank"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                              title="Xem trước bài viết trên cổng"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>

                            {/* Chỉnh sửa */}
                            <Link
                              href={`/admin/posts/${post.id}/edit`}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                              title="Chỉnh sửa bài viết"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>

                            {/* Xóa */}
                            <button
                              onClick={() => setDeleteId(post.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                              title="Xóa bài viết"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500">
                      Chưa có bài viết hoặc thông báo nào trong mục này.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= 5. MODAL XÁC NHẬN XÓA BÀI VIẾT ================= */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h4 className="text-base font-bold text-slate-900">Xác Nhận Xóa Bài Viết?</h4>
              <p className="text-xs text-slate-500 mt-1">
                Thao tác này sẽ xóa bài viết vĩnh viễn khỏi Cổng Thông Tin. Bạn không thể hoàn tác.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setDeleteId(null)}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleDeletePost}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors"
              >
                {deleting ? 'Đang xóa...' : 'Xóa vĩnh viễn'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= 6. MODAL THÊM VĂN BẢN / BIỂU MẪU MỚI ================= */}
      {showAddDocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FolderDown className="w-5 h-5 text-emerald-600" />
                <h4 className="text-base font-bold text-slate-900">Thêm Văn Bản / Biểu Mẫu Tải Về</h4>
              </div>
              <button onClick={() => setShowAddDocModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDocument} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên văn bản / Biểu mẫu *</label>
                <input
                  type="text"
                  required
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  placeholder="Ví dụ: Kế hoạch Cuộc thi Khoa học Kỹ thuật năm học 2026 - 2027"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mã số hiệu *</label>
                  <input
                    type="text"
                    required
                    value={docCode}
                    onChange={(e) => setDocCode(e.target.value)}
                    placeholder="KH-BSSRC/2026"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phân loại danh mục</label>
                  <select
                    value={docCategory}
                    onChange={(e) => setDocCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs bg-white font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Kế hoạch">Kế hoạch</option>
                    <option value="Biểu mẫu">Biểu mẫu</option>
                    <option value="Quy chế">Quy chế</option>
                    <option value="Học liệu">Học liệu</option>
                    <option value="Thể lệ">Thể lệ</option>
                    <option value="Quyết định">Quyết định</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Định dạng file</label>
                  <select
                    value={docFileType}
                    onChange={(e) => setDocFileType(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs bg-white font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="PDF">PDF</option>
                    <option value="DOCX">DOCX</option>
                    <option value="ZIP">ZIP</option>
                    <option value="XLSX">XLSX</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Dung lượng ước tính</label>
                  <input
                    type="text"
                    value={docFileSize}
                    onChange={(e) => setDocFileSize(e.target.value)}
                    placeholder="1.5 MB"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Link tải về (URL)</label>
                  <input
                    type="text"
                    value={docUrl}
                    onChange={(e) => setDocUrl(e.target.value)}
                    placeholder="https://... hoặc #"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddDocModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={addingDoc}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors disabled:opacity-50"
                >
                  {addingDoc ? 'Đang thêm...' : 'Lưu Văn Bản'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
