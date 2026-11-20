import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Bóc tách Video ID từ bất kỳ định dạng link YouTube nào
 * (watch?v=, youtu.be/, shorts/, embed/)
 */
export function extractYouTubeId(url?: string | null): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  // Nếu người dùng chỉ nhập đúng 11 ký tự của ID (ví dụ: dQw4w9WgXcQ)
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Regex nhận diện các định dạng URL YouTube
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
  const match = trimmed.match(regExp);

  return match && match[2].length === 11 ? match[2] : null;
}

/**
 * Chuyển tiêu đề tiếng Việt có dấu thành URL slug thân thiện
 */
export function slugify(str: string): string {
  if (!str) return "";
  let slug = str.toLowerCase();

  // Đổi ký tự có dấu thành không dấu
  slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
  slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
  slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
  slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
  slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
  slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
  slug = slug.replace(/đ/gi, 'd');

  // Xóa các ký tự đặc biệt
  slug = slug.replace(/[^a-z0-9 -]/g, '');
  // Đổi khoảng trắng thành dấu gạch ngang
  slug = slug.replace(/\s+/g, '-');
  // Xóa gạch ngang kép
  slug = slug.replace(/-+/g, '-');
  // Cắt gạch ngang ở đầu và cuối
  slug = slug.replace(/^-+|-+$/g, '');

  return slug;
}

/**
 * Định dạng ngày theo chuẩn tiếng Việt
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  } catch {
    return dateString;
  }
}
