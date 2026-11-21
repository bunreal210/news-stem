'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Post, CATEGORIES, Attachment } from '@/lib/types';
import { extractYouTubeId } from '@/lib/utils';
import YouTubePlayer from '@/components/YouTubePlayer';
import { 
  Upload, 
  Video, 
  Image as ImageIcon, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Save, 
  ArrowLeft,
  Bold,
  Heading,
  List,
  Quote,
  Bell,
  Pin,
  FileText,
  Plus,
  Trash2,
  FileCheck
} from 'lucide-react';
import Link from 'next/link';

interface PostFormProps {
  initialData?: Post;
  isEdit?: boolean;
  defaultCategory?: string;
}

export default function PostForm({ initialData, isEdit = false, defaultCategory }: PostFormProps) {
  const router = useRouter();

  // Form states
  const [title, setTitle] = useState(initialData?.title || '');
  const [summary, setSummary] = useState(initialData?.summary || '');
  const [category, setCategory] = useState(initialData?.category || defaultCategory || 'Tin-hoat-dong');
  const [thumbnail, setThumbnail] = useState(initialData?.thumbnail || '');
  const [youtubeUrl, setYoutubeUrl] = useState(initialData?.youtubeUrl || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [gallery, setGallery] = useState<string[]>(initialData?.gallery || []);
  const [author, setAuthor] = useState(initialData?.author || 'Ban Truyền thông STEM');
  const [featured, setFeatured] = useState(initialData?.featured ?? false);
  const [isPinned, setIsPinned] = useState(initialData?.isPinned ?? false);
  const [isUrgent, setIsUrgent] = useState(initialData?.isUrgent ?? false);
  const [status, setStatus] = useState<'published' | 'draft'>(initialData?.status || 'published');
  
  // Attachments state
  const [attachments, setAttachments] = useState<Attachment[]>(initialData?.attachments || []);
  const [newAttName, setNewAttName] = useState('');
  const [newAttUrl, setNewAttUrl] = useState('');
  const [newAttSize, setNewAttSize] = useState('1.5 MB');
  const [newAttType, setNewAttType] = useState('PDF');
  const [showAddAtt, setShowAddAtt] = useState(false);

  // UI states
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [previewTab, setPreviewTab] = useState<'edit' | 'preview'>('edit');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isAuthValid, setIsAuthValid] = useState<boolean | null>(null);
  const [isD1Connected, setIsD1Connected] = useState<boolean | null>(null);

  // Kiểm tra phiên đăng nhập admin và kết nối D1 khi mở form
  useEffect(() => {
    fetch('/api/auth/check')
      .then((res) => res.json())
      .then((data) => {
        setIsAuthValid(Boolean(data.authenticated));
      })
      .catch(() => {
        setIsAuthValid(true);
      });

    fetch('/api/system/status')
      .then((res) => res.json())
      .then((data) => {
        setIsD1Connected(Boolean(data.d1Connected));
      })
      .catch(() => {});
  }, []);

  // Live extracted YouTube ID
  const detectedYouTubeId = extractYouTubeId(youtubeUrl);

  // Xử lý upload ảnh bìa
  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingThumb(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Upload ảnh thất bại.');
      } else {
        setThumbnail(data.url);
      }
    } catch {
      setError('Lỗi khi tải ảnh lên.');
    } finally {
      setUploadingThumb(false);
    }
  };

  // Xử lý upload ảnh vào Gallery
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingGallery(true);
    setError('');

    const newUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append('file', files[i]);

      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (res.ok && data.url) {
          newUrls.push(data.url);
        }
      } catch {
        // continue with other files
      }
    }

    if (newUrls.length > 0) {
      setGallery((prev) => [...prev, ...newUrls]);
    }
    setUploadingGallery(false);
  };

  const removeGalleryImage = (indexToRemove: number) => {
    setGallery((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  const insertFormat = (prefix: string) => {
    const textarea = document.getElementById('content-textarea') as HTMLTextAreaElement | null;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const replacement = `${prefix}${selectedText}`;

    const newContent = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  // Thêm tài liệu đính kèm
  const handleAddAttachment = () => {
    if (!newAttName.trim() || !newAttUrl.trim()) {
      alert('Vui lòng nhập tên tài liệu và đường dẫn tải về.');
      return;
    }
    setAttachments((prev) => [
      ...prev,
      {
        name: newAttName.trim(),
        url: newAttUrl.trim(),
        size: newAttSize.trim() || '1.0 MB',
        type: newAttType.trim().toUpperCase() || 'FILE',
      },
    ]);
    setNewAttName('');
    setNewAttUrl('');
    setShowAddAtt(false);
  };

  const handleRemoveAttachment = (idx: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!title.trim()) {
      setError('Vui lòng nhập tiêu đề bài viết / thông báo.');
      const el = document.getElementById('post-title-input');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.focus();
      }
      return;
    }

    if (!content.trim()) {
      setError('Vui lòng nhập nội dung chi tiết bài viết / thông báo.');
      const el = document.getElementById('content-textarea');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.focus();
      }
      return;
    }

    setLoading(true);

    const payload = {
      title: title.trim(),
      summary: summary.trim(),
      category,
      thumbnail: thumbnail.trim() || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
      youtubeUrl: youtubeUrl.trim(),
      content: content.trim(),
      gallery,
      author: author.trim() || 'CLB STEM',
      featured,
      isPinned,
      isUrgent,
      attachments,
      status,
    };

    try {
      const url = isEdit ? `/api/posts/${initialData?.id}` : '/api/posts';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.status === 401) {
        setError('Phiên làm việc quản trị viên đã hết hạn hoặc chưa đăng nhập.');
        alert('Phiên làm việc quản trị viên đã hết hạn. Hệ thống sẽ chuyển hướng bạn đến trang đăng nhập.');
        router.push('/admin');
        setLoading(false);
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Có lỗi xảy ra khi lưu bài viết. Vui lòng thử lại.');
        setLoading(false);
        return;
      }

      // Kiểm tra D1 connection status
      if (data.d1_connected === false) {
        setError('⚠️ Cảnh báo: Bài viết chỉ được lưu vào bộ nhớ tạm (D1 chưa kết nối). Dữ liệu có thể mất khi hệ thống khởi động lại.');
        setLoading(false);
        return;
      }

      setSuccess(isEdit ? 'Cập nhật bài viết thành công! Đã lưu vào cơ sở dữ liệu.' : 'Xuất bản bài viết thành công! Đã lưu vào cơ sở dữ liệu.');
      setTimeout(() => {
        router.push('/admin/dashboard');
        router.refresh();
      }, 800);
    } catch {
      setError('Lỗi kết nối máy chủ. Vui lòng kiểm tra lại mạng hoặc thử lại.');
      setLoading(false);
    }
  };

  const isNoticeCategory = category === 'Thong-bao';

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto pb-20">
      
      {/* Top back bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Bảng điều khiển</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 disabled:opacity-50 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Đang lưu...' : isEdit ? 'Cập Nhật' : 'Xuất Bản / Lưu Bài'}</span>
          </button>
        </div>
      </div>

      {/* Cảnh báo phiên đăng nhập nếu chưa auth */}
      {isAuthValid === false && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs sm:text-sm flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0 text-amber-600" />
            <span>
              <strong>Cảnh báo:</strong> Phiên đăng nhập quản trị viên chưa được xác thực hoặc đã hết hạn. Bạn cần đăng nhập để có quyền xuất bản bài viết.
            </span>
          </div>
          <Link
            href="/admin"
            className="px-3.5 py-1.5 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 whitespace-nowrap shadow-xs"
          >
            Đăng nhập lại
          </Link>
        </div>
      )}

      {/* Cảnh báo D1 chưa kết nối */}
      {isD1Connected === false && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs sm:text-sm flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0 text-amber-600" />
            <span>
              <strong>Cảnh báo D1:</strong> Cloudflare Pages chưa được gán biến liên kết <code>DB</code>. Hãy cấu hình D1 binding trên Cloudflare Dashboard để bài viết được lưu vĩnh viễn!
            </span>
          </div>
          <Link
            href="/admin/dashboard"
            className="px-3.5 py-1.5 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 whitespace-nowrap shadow-xs"
          >
            Xem hướng dẫn
          </Link>
        </div>
      )}

      {/* Alerts */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2 shadow-xs animate-fadeIn">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
          <span className="font-semibold">{error}</span>
        </div>
      )}
      {success && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-center gap-2 shadow-xs animate-fadeIn">
          <CheckCircle className="w-5 h-5 shrink-0 text-emerald-600" />
          <span className="font-semibold">{success}</span>
        </div>
      )}

      {/* Main card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        
        {/* Tiêu đề */}
        <div>
          <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-1.5">
            Tiêu đề bài viết / Thông báo *
          </label>
          <input
            id="post-title-input"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={isNoticeCategory ? "Ví dụ: Thông báo Kế hoạch tổ chức Cuộc thi Sáng tạo KHKT 2026..." : "Ví dụ: Đội tuyển STEM đạt giải Nhất tại Hội thi Khoa học Kỹ thuật..."}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-base font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Chuyên mục & Tác giả */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-1.5">
              Chuyên mục phân loại *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <optgroup label="Cổng Thông Báo Chính Quy">
                <option value="Thong-bao">📢 Thông báo & Kế hoạch (Hiển thị Bảng Thông Báo)</option>
              </optgroup>
              <optgroup label="Kho Tin Tức & Nghiên Cứu">
                {CATEGORIES.filter(c => c.id !== 'Tat-ca' && c.id !== 'Thong-bao').map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-1.5">
              Tác giả / Ban ban hành
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Ban Chủ nhiệm BSSRC, Ban Giám hiệu, Thầy Cố vấn..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* 🔔 Đặc quyền cấu hình riêng cho THÔNG BÁO & GHIM CỔNG */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
            <Pin className="w-4 h-4 text-blue-600" />
            <span>Cấu hình Vị trí hiển thị trên Cổng Thông Tin</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <label className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-slate-200 cursor-pointer hover:border-blue-300 transition-colors">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="text-xs font-bold text-slate-800">
                Bài viết Tiêu điểm (Màn hình đầu)
              </span>
            </label>

            <label className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-slate-200 cursor-pointer hover:border-red-300 transition-colors">
              <input
                type="checkbox"
                checked={isPinned}
                onChange={(e) => setIsPinned(e.target.checked)}
                className="w-4 h-4 rounded text-red-600 focus:ring-red-500"
              />
              <span className="text-xs font-bold text-slate-800">
                Ghim lên đầu Bảng thông báo
              </span>
            </label>

            <label className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-slate-200 cursor-pointer hover:border-red-300 transition-colors">
              <input
                type="checkbox"
                checked={isUrgent}
                onChange={(e) => setIsUrgent(e.target.checked)}
                className="w-4 h-4 rounded text-red-600 focus:ring-red-500"
              />
              <span className="text-xs font-bold text-red-700">
                Thông báo khẩn (Nhãn đỏ)
              </span>
            </label>
          </div>
        </div>

        {/* Tóm tắt ngắn (Excerpt / Sapo) */}
        <div>
          <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-1.5">
            Tóm tắt ngắn (Đoạn Sapo mở đầu bài viết)
          </label>
          <textarea
            rows={2}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Một đoạn mô tả ngắn 2-3 câu giới thiệu nhanh nội dung bài viết hoặc thông báo..."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 📸 Ảnh bìa (Thumbnail) */}
        <div className="pt-2 border-t border-slate-100">
          <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-2">
            Ảnh bìa bài viết (Thumbnail)
          </label>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
            <div className="md:col-span-7 space-y-3">
              <div className="flex items-center gap-3">
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold border border-blue-200 transition-colors">
                  <Upload className="w-4 h-4" />
                  <span>{uploadingThumb ? 'Đang tải ảnh...' : 'Tải ảnh từ máy tính'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                    disabled={uploadingThumb}
                    className="hidden"
                  />
                </label>
                <span className="text-xs text-slate-400">hoặc dán liên kết ảnh trực tiếp:</span>
              </div>

              <input
                type="text"
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                placeholder="Dán đường link ảnh (https://...)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Preview ảnh bìa */}
            <div className="md:col-span-5">
              {thumbnail ? (
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden border border-slate-200 bg-slate-50 group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={thumbnail}
                    alt="Ảnh bìa xem thử"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setThumbnail('')}
                    className="absolute top-2 right-2 p-1 rounded-full bg-red-600 text-white shadow-md hover:bg-red-700 transition-colors"
                    title="Xóa ảnh bìa"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="aspect-[16/10] rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 text-xs p-4 text-center">
                  <ImageIcon className="w-8 h-8 mb-1 stroke-1" />
                  <span>Chưa có ảnh bìa</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 🎬 Video YouTube đính kèm */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider">
            Video YouTube Phóng Sự / Trực Nghiệm (Tùy chọn)
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="Ví dụ: https://www.youtube.com/watch?v=7Pq-S557XQU"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <Video className="w-4 h-4 text-red-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
            {youtubeUrl && (
              <button
                type="button"
                onClick={() => setYoutubeUrl('')}
                className="p-2 text-slate-400 hover:text-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {detectedYouTubeId && (
            <div className="mt-3 max-w-sm rounded-xl overflow-hidden border border-slate-200 shadow-xs">
              <YouTubePlayer youtubeId={detectedYouTubeId} title="Xem trước video YouTube" />
            </div>
          )}
        </div>

        {/* 📝 Trình soạn thảo nội dung */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider">
              Nội dung chi tiết bài viết *
            </label>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
              <button
                type="button"
                onClick={() => setPreviewTab('edit')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  previewTab === 'edit' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
                }`}
              >
                Soạn thảo
              </button>
              <button
                type="button"
                onClick={() => setPreviewTab('preview')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  previewTab === 'preview' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
                }`}
              >
                Xem trước
              </button>
            </div>
          </div>

          {previewTab === 'edit' && (
            <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 rounded-xl border border-slate-200 text-xs text-slate-600">
              <button
                type="button"
                onClick={() => insertFormat('## ')}
                className="p-1.5 rounded-lg hover:bg-slate-200 font-bold flex items-center gap-1"
                title="Tiêu đề mục lớn (Heading 2)"
              >
                <Heading className="w-4 h-4" />
                <span>H2</span>
              </button>
              <button
                type="button"
                onClick={() => insertFormat('### ')}
                className="p-1.5 rounded-lg hover:bg-slate-200 font-bold flex items-center gap-1"
                title="Tiêu đề mục con (Heading 3)"
              >
                <Heading className="w-3.5 h-3.5" />
                <span>H3</span>
              </button>
              <button
                type="button"
                onClick={() => insertFormat('**')}
                className="p-1.5 rounded-lg hover:bg-slate-200 font-bold"
                title="In đậm"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertFormat('- ')}
                className="p-1.5 rounded-lg hover:bg-slate-200"
                title="Danh sách gạch đầu dòng"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertFormat('> ')}
                className="p-1.5 rounded-lg hover:bg-slate-200"
                title="Đoạn trích dẫn"
              >
                <Quote className="w-4 h-4" />
              </button>
            </div>
          )}

          {previewTab === 'edit' ? (
            <textarea
              id="content-textarea"
              required
              rows={12}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Nhập nội dung bài viết chi tiết tại đây. Có thể dùng cú pháp ## cho tiêu đề lớn, - cho danh sách gạch đầu dòng, > cho trích dẫn..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 min-h-[300px] prose-stem text-sm">
              {content ? (
                content.split('\n').map((line, idx) => {
                  const t = line.trim();
                  if (!t) return <div key={idx} className="h-3" />;
                  if (t.startsWith('## ')) return <h2 key={idx}>{t.replace('## ', '')}</h2>;
                  if (t.startsWith('### ')) return <h3 key={idx}>{t.replace('### ', '')}</h3>;
                  if (t.startsWith('> ')) return <blockquote key={idx}>{t.replace('> ', '')}</blockquote>;
                  if (t.startsWith('- ')) return <ul key={idx}><li>{t.substring(2)}</li></ul>;
                  return <p key={idx}>{t}</p>;
                })
              ) : (
                <p className="text-slate-400 italic">Chưa có nội dung xem trước.</p>
              )}
            </div>
          )}
        </div>

        {/* 📥 QUẢN LÝ TÀI LIỆU & BIỂU MẪU ĐÍNH KÈM (ATTACHMENTS) */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider">
                Tài Liệu & Biểu Mẫu Tải Về Đính Kèm ({attachments.length})
              </label>
              <p className="text-[11px] text-slate-500">
                Đính kèm file PDF, Word hoặc Zip để học sinh tải về trực tiếp từ bài viết.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAddAtt(!showAddAtt)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold border border-blue-200 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm file</span>
            </button>
          </div>

          {/* Form thêm attachment */}
          {showAddAtt && (
            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-3 animate-fadeIn">
              <h5 className="text-xs font-bold text-blue-900">Thêm file đính kèm mới:</h5>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-5">
                  <input
                    type="text"
                    value={newAttName}
                    onChange={(e) => setNewAttName(e.target.value)}
                    placeholder="Tên file (VD: Mau-dang-ky-de-tai.docx)"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white"
                  />
                </div>
                <div className="sm:col-span-4">
                  <input
                    type="text"
                    value={newAttUrl}
                    onChange={(e) => setNewAttUrl(e.target.value)}
                    placeholder="Link tải về (URL file hoặc #)"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white"
                  />
                </div>
                <div className="sm:col-span-3 flex items-center gap-2">
                  <select
                    value={newAttType}
                    onChange={(e) => setNewAttType(e.target.value)}
                    className="px-2 py-2 text-xs rounded-lg border border-slate-200 bg-white font-bold"
                  >
                    <option value="PDF">PDF</option>
                    <option value="DOCX">DOCX</option>
                    <option value="ZIP">ZIP</option>
                  </select>
                  <button
                    type="button"
                    onClick={handleAddAttachment}
                    className="px-3 py-2 rounded-lg bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 whitespace-nowrap"
                  >
                    Lưu
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Danh sách attachment hiện có */}
          {attachments.length > 0 && (
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
              {attachments.map((att, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700">
                      {att.type || 'FILE'}
                    </span>
                    <span className="font-semibold text-slate-800 truncate">{att.name}</span>
                    <span className="text-slate-400 text-[11px]">({att.size || '1.0 MB'})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveAttachment(idx)}
                    className="text-slate-400 hover:text-red-600 p-1"
                    title="Xóa file đính kèm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 🖼️ Bộ sưu tập ảnh phụ (Gallery) */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider">
              Bộ sưu tập ảnh hoạt động ({gallery.length} ảnh)
            </label>
            <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold border border-blue-200 transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span>{uploadingGallery ? 'Đang tải...' : 'Thêm ảnh'}</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleGalleryUpload}
                disabled={uploadingGallery}
                className="hidden"
              />
            </label>
          </div>

          {gallery.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {gallery.map((imgUrl, index) => (
                <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(index)}
                    className="absolute top-1.5 right-1.5 p-1 rounded-full bg-red-600 text-white shadow-md hover:bg-red-700 transition-colors"
                    title="Xóa ảnh này"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ⚙️ Cài đặt trạng thái xuất bản */}
        <div className="pt-4 border-t border-slate-100">
          <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-1.5">
            Trạng thái bài viết / Thông báo
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as 'published' | 'draft')}
            className="w-full sm:w-80 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="published">Xuất bản ngay (Công khai trên Cổng Thông Tin)</option>
            <option value="draft">Lưu làm bản nháp (Chỉ Admin xem được)</option>
          </select>
        </div>

      </div>

      {/* Bottom Alert Feedback */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2 shadow-xs animate-fadeIn">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
          <span className="font-semibold">{error}</span>
        </div>
      )}
      {success && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-center gap-2 shadow-xs animate-fadeIn">
          <CheckCircle className="w-5 h-5 shrink-0 text-emerald-600" />
          <span className="font-semibold">{success}</span>
        </div>
      )}

      {/* Bottom submit button */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Link
          href="/admin/dashboard"
          className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors"
        >
          Hủy bỏ
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 disabled:opacity-50 transition-all flex items-center gap-2"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Đang xử lý & lưu bài...</span>
            </>
          ) : isEdit ? (
            'Cập Nhật Bài Viết'
          ) : (
            'Xuất Bản Ngay'
          )}
        </button>
      </div>

    </form>
  );
}
