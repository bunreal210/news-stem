'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Post, CATEGORIES } from '@/lib/types';
import { extractYouTubeId } from '@/lib/utils';
import YouTubePlayer from '@/components/YouTubePlayer';
import { 
  Upload, 
  Video, 
  Image as ImageIcon, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Eye, 
  Save, 
  ArrowLeft,
  Bold,
  Heading,
  List,
  Quote,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

interface PostFormProps {
  initialData?: Post;
  isEdit?: boolean;
}

export default function PostForm({ initialData, isEdit = false }: PostFormProps) {
  const router = useRouter();

  // Form states
  const [title, setTitle] = useState(initialData?.title || '');
  const [summary, setSummary] = useState(initialData?.summary || '');
  const [category, setCategory] = useState(initialData?.category || 'Tin-hoat-dong');
  const [thumbnail, setThumbnail] = useState(initialData?.thumbnail || '');
  const [youtubeUrl, setYoutubeUrl] = useState(initialData?.youtubeUrl || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [gallery, setGallery] = useState<string[]>(initialData?.gallery || []);
  const [author, setAuthor] = useState(initialData?.author || 'Ban Truyền thông STEM');
  const [featured, setFeatured] = useState(initialData?.featured ?? false);
  const [status, setStatus] = useState<'published' | 'draft'>(initialData?.status || 'published');

  // UI states
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [previewTab, setPreviewTab] = useState<'edit' | 'preview'>('edit');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
      } catch (err) {
        console.error(err);
      }
    }

    setGallery((prev) => [...prev, ...newUrls]);
    setUploadingGallery(false);
  };

  // Xóa ảnh khỏi Gallery
  const removeGalleryImage = (indexToRemove: number) => {
    setGallery((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Chèn cú pháp định dạng nhanh vào textarea
  const insertFormat = (prefix: string, suffix: string = '') => {
    const textarea = document.getElementById('content-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end) || 'nội dung';

    const replacement = `${prefix}${selectedText}${suffix}`;
    const newText = text.substring(0, start) + replacement + text.substring(end);
    setContent(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 50);
  };

  // Submit bài viết
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!title.trim()) {
      setError('Vui lòng nhập tiêu đề bài viết.');
      return;
    }

    if (!content.trim()) {
      setError('Vui lòng nhập nội dung bài viết.');
      return;
    }

    setLoading(true);

    const payload = {
      title,
      summary,
      category,
      thumbnail: thumbnail || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
      youtubeUrl,
      content,
      gallery,
      author,
      featured,
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

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Có lỗi xảy ra khi lưu bài viết.');
        setLoading(false);
        return;
      }

      setSuccess(isEdit ? 'Cập nhật bài viết thành công!' : 'Tạo bài viết mới thành công!');
      setTimeout(() => {
        router.push('/admin/dashboard');
      }, 1000);
    } catch {
      setError('Lỗi kết nối máy chủ.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto pb-20">
      
      {/* Top back bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại Bảng điều khiển
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 disabled:opacity-50 transition-all"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Đang lưu...' : isEdit ? 'Cập Nhật Bài Viết' : 'Xuất Bản / Lưu Bài'}
          </button>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-center gap-2">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Main card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
        
        {/* Tiêu đề */}
        <div>
          <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-1.5">
            Tiêu đề bài viết *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ví dụ: Đội tuyển STEM trường đạt giải Nhất Hội thi Khoa học Kỹ thuật 2026..."
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-base font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Chuyên mục & Tác giả */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-1.5">
              Chuyên mục *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {CATEGORIES.filter(c => c.id !== 'Tat-ca').map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-1.5">
              Tác giả / Ban thực hiện
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Ví dụ: Ban Truyền thông STEM, Thầy Cố vấn..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Tóm tắt ngắn */}
        <div>
          <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-1.5">
            Tóm tắt ngắn (Excerpt)
          </label>
          <textarea
            rows={2}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Một đoạn mô tả ngắn 2-3 câu giới thiệu nhanh nội dung bài viết..."
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
              {/* Option 1: Upload file */}
              <div className="flex items-center gap-3">
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold border border-blue-200 transition-colors">
                  <Upload className="w-4 h-4" />
                  {uploadingThumb ? 'Đang tải ảnh lên...' : 'Tải ảnh từ máy tính'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                    disabled={uploadingThumb}
                    className="hidden"
                  />
                </label>
                <span className="text-xs text-slate-400">hoặc</span>
              </div>

              {/* Option 2: Enter URL */}
              <input
                type="url"
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                placeholder="Dán đường link ảnh trực tiếp (https://...)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Preview ảnh bìa */}
            <div className="md:col-span-5">
              {thumbnail ? (
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden border border-slate-200 bg-slate-50 group">
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
                  <span>Chưa chọn ảnh bìa</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 🎬 Gắn link Video YouTube */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider">
              Gắn Link Video YouTube (Tùy chọn)
            </label>
            {detectedYouTubeId && (
              <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                Hợp lệ: ID {detectedYouTubeId}
              </span>
            )}
          </div>

          <div className="relative">
            <input
              type="text"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="Ví dụ: https://www.youtube.com/watch?v=... hoặc https://youtu.be/..."
              className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <Video className="w-5 h-5 text-red-500 absolute left-3 top-1/2 -translate-y-1/2" />
            {youtubeUrl && (
              <button
                type="button"
                onClick={() => setYoutubeUrl('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Live YouTube Player Preview */}
          {detectedYouTubeId ? (
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-xs text-red-400 font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Xem thử Video YouTube trực tiếp:
              </span>
              <YouTubePlayer
                youtubeId={detectedYouTubeId}
                title={title || 'Xem thử video hoạt động CLB'}
              />
            </div>
          ) : youtubeUrl ? (
            <p className="text-xs text-amber-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              Đường dẫn chưa hợp lệ. Vui lòng kiểm tra lại link YouTube (dạng watch?v=, youtu.be/ hoặc shorts/).
            </p>
          ) : null}
        </div>

        {/* 📝 Nội dung bài viết */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider">
              Nội dung bài viết *
            </label>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setPreviewTab('edit')}
                className={`px-3 py-1 rounded-lg transition-colors ${previewTab === 'edit' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'}`}
              >
                Soạn thảo
              </button>
              <button
                type="button"
                onClick={() => setPreviewTab('preview')}
                className={`px-3 py-1 rounded-lg transition-colors ${previewTab === 'preview' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'}`}
              >
                Xem trước
              </button>
            </div>
          </div>

          {/* Quick Toolbar */}
          {previewTab === 'edit' && (
            <div className="flex items-center gap-1 p-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
              <button
                type="button"
                onClick={() => insertFormat('## ')}
                className="p-1.5 rounded-lg hover:bg-slate-200 font-bold flex items-center gap-1"
                title="Tiêu đề H2"
              >
                <Heading className="w-4 h-4" />
                H2
              </button>
              <button
                type="button"
                onClick={() => insertFormat('### ')}
                className="p-1.5 rounded-lg hover:bg-slate-200 font-bold flex items-center gap-1"
                title="Tiêu đề H3"
              >
                <Heading className="w-3.5 h-3.5" />
                H3
              </button>
              <button
                type="button"
                onClick={() => insertFormat('**', '**')}
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

        {/* 🖼️ Bộ sưu tập ảnh phụ (Gallery) */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider">
              Bộ sưu tập ảnh hoạt động ({gallery.length} ảnh)
            </label>
            <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold border border-blue-200 transition-colors">
              <Upload className="w-3.5 h-3.5" />
              {uploadingGallery ? 'Đang tải...' : 'Thêm nhiều ảnh'}
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

        {/* ⚙️ Cài đặt xuất bản & Nổi bật */}
        <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-1.5">
              Trạng thái bài viết
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'published' | 'draft')}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="published">Xuất bản ngay (Công khai cho người xem)</option>
              <option value="draft">Lưu làm bản nháp (Chỉ admin xem được)</option>
            </select>
          </div>

          <div className="flex items-center pt-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
              />
              <span className="text-sm font-bold text-slate-800">
                Đặt làm bài viết nổi bật (Hiển thị đầu trang chủ)
              </span>
            </label>
          </div>
        </div>

      </div>

      {/* Bottom submit button */}
      <div className="flex items-center justify-end gap-3">
        <Link
          href="/admin/dashboard"
          className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors"
        >
          Hủy bỏ
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 disabled:opacity-50 transition-all"
        >
          {loading ? 'Đang xử lý...' : isEdit ? 'Cập Nhật Bài Viết' : 'Xuất Bản Bài Viết'}
        </button>
      </div>

    </form>
  );
}
