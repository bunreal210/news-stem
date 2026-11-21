import React from 'react';
import { getDocumentResources } from '@/lib/db';
import Link from 'next/link';
import { 
  FileText, 
  Download, 
  Search, 
  FolderDown, 
  ExternalLink, 
  CheckCircle2, 
  FileCheck, 
  Layers,
  ChevronRight,
  ShieldCheck,
  FileCode,
  Archive
} from 'lucide-react';

interface DocumentsPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
  }>;
}

export const runtime = 'edge';
export const revalidate = 0;

export default async function DocumentsPage({ searchParams }: DocumentsPageProps) {
  const { category = 'Tat-ca', search = '' } = await searchParams;
  const allDocs = getDocumentResources();

  // Extract unique categories
  const categoriesList = ['Tat-ca', ...Array.from(new Set(allDocs.map((d) => d.category)))];

  // Filtering
  let filteredDocs = allDocs;

  if (category && category !== 'Tat-ca') {
    filteredDocs = filteredDocs.filter((d) => d.category === category);
  }

  if (search && search.trim() !== '') {
    const q = search.toLowerCase().trim();
    filteredDocs = filteredDocs.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.code.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q)
    );
  }

  const getFormatBadge = (type: string) => {
    switch (type.toUpperCase()) {
      case 'PDF':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'DOCX':
      case 'DOC':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'ZIP':
      case 'RAR':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
          <FolderDown className="w-3.5 h-3.5 text-blue-600" />
          <span>Hệ thống Văn bản & Biểu mẫu BSSRC</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-tech">
          Kho Văn Bản, Biểu Mẫu & Tài Liệu Tải Về
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Nơi lưu trữ và ban hành các kế hoạch hoạt động, mẫu phiếu thuyết minh đề tài KHKT, quy chế sử dụng phòng lab và học liệu chế tạo STEM dành cho học sinh, giáo viên.
        </p>
      </div>

      {/* Search & Categories Filter */}
      <div className="space-y-4 max-w-3xl mx-auto">
        {/* Search bar */}
        <form method="GET" action="/documents" className="relative">
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="Tìm theo tên văn bản, mã số hiệu (VD: KHKT, ESP32, Quy chế...)..."
            className="w-full pl-11 pr-24 py-3 rounded-2xl bg-white border border-slate-200 shadow-xs text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          {category && category !== 'Tat-ca' && (
            <input type="hidden" name="category" value={category} />
          )}
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors"
          >
            Tìm kiếm
          </button>
        </form>

        {/* Category Pills */}
        <div className="flex items-center justify-center gap-2 flex-wrap pt-1">
          {categoriesList.map((cat) => {
            const isSelected = category === cat;
            const label = cat === 'Tat-ca' ? 'Tất cả văn bản' : cat;
            return (
              <Link
                key={cat}
                href={`/documents?category=${cat}${search ? `&search=${encodeURIComponent(search)}` : ''}`}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Documents Status */}
      <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-200 pb-3">
        <span>
          Đang hiển thị:{' '}
          <strong className="text-slate-800">
            {category === 'Tat-ca' ? 'Tất cả danh mục' : category}
          </strong>
          {search && (
            <span>
              {' '}với từ khóa &ldquo;<strong className="text-blue-600">{search}</strong>&rdquo;
            </span>
          )}
        </span>
        <span>
          Tổng số: <strong className="text-slate-800">{filteredDocs.length}</strong> văn bản
        </span>
      </div>

      {/* Table of Documents (Desktop) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-700">
                <th className="py-3 px-4 font-bold w-12 text-center">STT</th>
                <th className="py-3 px-4 font-bold">Tên Văn Bản / Biểu Mẫu</th>
                <th className="py-3 px-4 font-bold hidden sm:table-cell">Số Hiệu</th>
                <th className="py-3 px-4 font-bold hidden md:table-cell">Phân Loại</th>
                <th className="py-3 px-4 font-bold hidden lg:table-cell">Ngày Ban Hành</th>
                <th className="py-3 px-4 font-bold text-center w-32">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDocs.length > 0 ? (
                filteredDocs.map((doc, idx) => (
                  <tr key={doc.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="py-3 px-4 text-center text-slate-400 font-semibold">{idx + 1}</td>
                    
                    <td className="py-3 px-4">
                      <div className="flex items-start gap-2.5">
                        <FileText className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors block text-xs sm:text-sm">
                            {doc.title}
                          </span>
                          <div className="sm:hidden flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                            <span>{doc.code}</span>
                            <span>•</span>
                            <span>{doc.publishDate}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-slate-600 font-mono text-[11px] hidden sm:table-cell">
                      {doc.code}
                    </td>

                    <td className="py-3 px-4 hidden md:table-cell">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-semibold">
                        {doc.category}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-500 hidden lg:table-cell">
                      {doc.publishDate}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <a
                        href={doc.downloadUrl}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-2xs ${getFormatBadge(
                          doc.fileType
                        )} hover:scale-105`}
                        title={`Tải file ${doc.fileType} (${doc.fileSize})`}
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{doc.fileType}</span>
                        <span className="font-normal text-[10px] opacity-80">({doc.fileSize})</span>
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <FolderDown className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold text-sm text-slate-700">Không tìm thấy văn bản phù hợp</p>
                    <p className="text-xs text-slate-400 mt-1">Vui lòng thử tìm với từ khóa hoặc chuyên mục khác.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Support Box: Quy trình nộp đề tài */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2">
          <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
            <span>Hướng Dẫn Nộp Đề Tài & Thuyết Minh KHKT</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Học sinh tải mẫu thuyết minh (BM-KHKT/01), điền đầy đủ thông tin đề xuất và xin chữ ký của giáo viên bảo trợ. Hồ sơ có thể nộp trực tuyến qua <strong>Hệ thống quản lý phòng lab (pttp.id.vn)</strong> hoặc nộp trực tiếp tại Văn phòng Đoàn trường.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
          <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Nội Quy Mượn Trả Thiết Bị Phòng Thực Hành</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Học sinh thực hiện đúng quy chế an toàn điện và phòng cháy. Mọi thiết bị, máy in 3D và linh kiện cảm biến phải được kiểm tra tình trạng trước khi bàn giao và ký nhận theo mẫu quy định.
          </p>
        </div>
      </div>

    </div>
  );
}
