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
  status: 'published' | 'draft';
  createdAt: string;
  updatedAt: string;
}

export type Category = 
  | 'Tat-ca'
  | 'Sang-che-robot'
  | 'Nghien-cuu-khoa-hoc'
  | 'Hoi-thi-stem'
  | 'Workshop-trai-nghiem'
  | 'Tin-hoat-dong';

export interface CategoryInfo {
  id: Category;
  label: string;
  color: string;
  bgColor: string;
}

export const CATEGORIES: CategoryInfo[] = [
  { id: 'Tat-ca', label: 'Tất cả bài viết', color: 'text-gray-700', bgColor: 'bg-gray-100' },
  { id: 'Sang-che-robot', label: 'Sáng chế & Robot', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  { id: 'Nghien-cuu-khoa-hoc', label: 'Nghiên cứu khoa học', color: 'text-purple-700', bgColor: 'bg-purple-100' },
  { id: 'Hoi-thi-stem', label: 'Hội thi & Giải thưởng', color: 'text-amber-700', bgColor: 'bg-amber-100' },
  { id: 'Workshop-trai-nghiem', label: 'Workshop & Trải nghiệm', color: 'text-emerald-700', bgColor: 'bg-emerald-100' },
  { id: 'Tin-hoat-dong', label: 'Tin tức & Hoạt động', color: 'text-rose-700', bgColor: 'bg-rose-100' },
];

export interface SiteConfig {
  clubName: string;
  schoolName: string;
  slogan: string;
  description: string;
  email: string;
  phone: string;
  facebookUrl?: string;
  youtubeChannelUrl?: string;
  address: string;
}
