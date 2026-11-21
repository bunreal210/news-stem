export interface Attachment {
  name: string;
  url: string;
  size?: string;
  type?: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string; // Markdown / HTML formatted text
  category: string;
  thumbnail: string;
  youtubeUrl?: string;
  youtubeId?: string;
  gallery?: string[]; // Array of image URLs
  author: string;
  views: number;
  featured: boolean;
  isPinned?: boolean; // Ghim lên bảng thông báo / cổng chính
  isUrgent?: boolean; // Thông báo khẩn / quan trọng
  attachments?: Attachment[]; // Tài liệu đính kèm
  status: 'published' | 'draft';
  createdAt: string;
  updatedAt: string;
}

export type Category = 
  | 'Tat-ca'
  | 'Thong-bao'
  | 'Sang-che-robot'
  | 'Nghien-cuu-khoa-hoc'
  | 'Hoi-thi-stem'
  | 'Hoc-lieu-stem'
  | 'Workshop-trai-nghiem'
  | 'Tin-hoat-dong';

export interface CategoryInfo {
  id: Category;
  label: string;
  color: string;
  bgColor: string;
  borderColor?: string;
}

export const CATEGORIES: CategoryInfo[] = [
  { id: 'Tat-ca', label: 'Tất cả bài viết', color: 'text-gray-700', bgColor: 'bg-gray-100', borderColor: 'border-gray-200' },
  { id: 'Thong-bao', label: 'Thông báo & Kế hoạch', color: 'text-red-700', bgColor: 'bg-red-50', borderColor: 'border-red-200' },
  { id: 'Sang-che-robot', label: 'Sáng chế & Robot', color: 'text-blue-700', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
  { id: 'Nghien-cuu-khoa-hoc', label: 'Nghiên cứu khoa học', color: 'text-purple-700', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' },
  { id: 'Hoi-thi-stem', label: 'Hội thi & Giải thưởng', color: 'text-amber-700', bgColor: 'bg-amber-50', borderColor: 'border-amber-200' },
  { id: 'Hoc-lieu-stem', label: 'Học liệu & Hướng dẫn', color: 'text-teal-700', bgColor: 'bg-teal-50', borderColor: 'border-teal-200' },
  { id: 'Workshop-trai-nghiem', label: 'Workshop & Trải nghiệm', color: 'text-emerald-700', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200' },
  { id: 'Tin-hoat-dong', label: 'Tin tức & Hoạt động', color: 'text-indigo-700', bgColor: 'bg-indigo-50', borderColor: 'border-indigo-200' },
];

export interface ScheduleEvent {
  id: string;
  title: string;
  date: string; // VD: "25/11/2026" hoặc "Thứ 7 hàng tuần"
  time: string; // VD: "08:00 - 11:30"
  location: string; // VD: "Phòng Thực hành STEM - Tầng 3 Tòa C"
  type: 'meeting' | 'workshop' | 'contest' | 'deadline';
  badge: string;
}

export interface DocumentResource {
  id: string;
  title: string;
  code: string; // Số hiệu / Mã văn bản
  category: string;
  fileType: 'PDF' | 'DOCX' | 'ZIP';
  fileSize: string;
  publishDate: string;
  downloadUrl: string;
}

export interface SiteConfig {
  clubName: string;
  shortName?: string;
  schoolName: string;
  slogan: string;
  description: string;
  email: string;
  phone: string;
  facebookUrl?: string;
  youtubeChannelUrl?: string;
  address: string;
}
