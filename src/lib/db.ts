import fs from 'fs';
import path from 'path';
import { Post, SiteConfig } from './types';
import { extractYouTubeId, slugify } from './utils';

const DATA_DIR = path.join(process.cwd(), 'data');
const POSTS_FILE = path.join(DATA_DIR, 'posts.json');
const CONFIG_FILE = path.join(DATA_DIR, 'config.json');

// Đảm bảo thư mục data luôn tồn tại
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Cấu hình mặc định cho CLB STEM
const DEFAULT_CONFIG: SiteConfig = {
  clubName: "CLB STEM & SÁNG TẠO TRẺ",
  schoolName: "Trường THPT Chuyên / THPT Khoa Học",
  slogan: "Khơi nguồn đam mê - Chinh phục công nghệ - Sáng tạo tương lai",
  description: "Không gian kết nối những học sinh đam mê Khoa học, Công nghệ, Kỹ thuật và Toán học. Nơi biến những ý tưởng sáng tạo thành các sản phẩm công nghệ thực tế.",
  email: "stemclub.school@gmail.com",
  phone: "0912 345 678",
  facebookUrl: "https://facebook.com",
  youtubeChannelUrl: "https://youtube.com",
  address: "Phòng Thực hành STEM - Tầng 3 Nhà A, Trường THPT",
};

// Dữ liệu mẫu ban đầu để web có ngay giao diện sống động
const INITIAL_POSTS: Post[] = [
  {
    id: "stem-post-1",
    title: "Đội tuyển STEM trường xuất sắc giành Huy chương Vàng tại Hội thi Sáng chế Robot 2026",
    slug: "doi-tuyen-stem-truong-xuat-sac-gianh-huy-chuong-vang-tai-hoi-thi-sang-che-robot-2026",
    summary: "Với mô hình Robot cứu hộ tự hành tích hợp thị giác máy tính và cảm biến nhiệt, đội tuyển STEM đã vượt qua hơn 40 đội thi toàn quốc để giành ngôi vị quán quân.",
    content: `## Vinh quang từ tinh thần đồng đội và nỗ lực bền bỉ

Ngày 15/11/2026 vừa qua, tại Nhà thi đấu Thể thao & Công nghệ, vòng chung kết Hội thi Sáng chế Robot Trẻ toàn quốc đã diễn ra với sự tranh tài của hơn 40 đội thi xuất sắc đến từ các trường THPT trên toàn quốc.

Đội tuyển CLB STEM đại diện cho nhà trường gồm 5 thành viên với đề tài **"Robot cứu hộ địa hình gập ghềnh tích hợp AI nhận diện nạn nhân"**.

### Những điểm đột phá của mô hình:
1. **Khung gầm bánh xích linh hoạt:** Khả năng vượt dốc 35 độ và lội bùn nước nhẹ.
2. **Hệ thống AI biên (Edge AI):** Sử dụng chip xử lý mini nhận diện cử chỉ và thân nhiệt nạn nhân trong điều kiện khói bụi.
3. **Bộ truyền sóng tầm xa:** Cho phép điều khiển và truyền dữ liệu video trực tiếp về trạm chỉ huy từ khoảng cách lên đến 1.5km.

> *"Chúng em đã thức nhiều đêm tại phòng lab STEM để tối ưu từng dòng code thuật toán PID và cân chỉnh động cơ. Khoảnh khắc robot hoàn thành bài thi sa bàn giả định chỉ sau 2 phút 15 giây, cả đội đã ôm nhau vỡ òa trong hạnh phúc!"* - Bạn Hoàng Nam, Đội trưởng chia sẻ.

Chiến thắng này tiếp tục khẳng định phong trào học tập và nghiên cứu khoa học kỹ thuật mạnh mẽ của học sinh nhà trường, là nguồn cảm hứng lớn cho các bạn khóa dưới đam mê lĩnh vực Robotics & Tự động hóa.`,
    category: "Hoi-thi-stem",
    thumbnail: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80",
    youtubeUrl: "https://www.youtube.com/watch?v=7Pq-S557XQU",
    youtubeId: "7Pq-S557XQU",
    gallery: [
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1000&q=80"
    ],
    author: "Ban Truyền thông STEM",
    views: 428,
    featured: true,
    status: "published",
    createdAt: "2026-11-16T08:30:00.000Z",
    updatedAt: "2026-11-16T08:30:00.000Z"
  },
  {
    id: "stem-post-2",
    title: "Workshop trải nghiệm: Lập trình vi điều khiển ESP32 và công nghệ IoT trong nhà thông minh",
    slug: "workshop-trai-nghiem-lap-trinh-vi-dieu-khien-esp32-va-cong-nghe-iot-trong-nha-thong-minh",
    summary: "Hơn 80 học sinh khối 10 và 11 đã được tự tay đấu nối linh kiện, lập trình cảm biến khí gas, đo độ ẩm đất và điều khiển đèn qua smartphone trong buổi workshop cuối tuần.",
    content: `## Đưa lý thuyết vật lý & tin học vào ứng dụng đời sống

Nhằm mang lại trải nghiệm thực tế cho các thành viên mới, CLB STEM đã phối hợp với các thầy cô tổ Vật lý - Tin học tổ chức buổi Workshop **"Khám phá IoT cùng Vi điều khiển ESP32"**.

### Nội dung thực hành thú vị:
- Tìm hiểu nguyên lý hoạt động của các loại cảm biến: DHT11 (đo nhiệt độ/độ ẩm), Cảm biến quang trở LDR, Cảm biến siêu âm HC-SR04.
- Làm quen với ngôn ngữ C++ trên môi trường Arduino IDE.
- Lập trình truyền dữ liệu qua giao thức Wi-Fi và MQTT lên nền tảng Dashboard di động.

Mỗi nhóm gồm 3-4 bạn được cấp một bộ KIT thực hành hoàn chỉnh. Dưới sự hướng dẫn tận tình của các anh chị khóa trên, chỉ sau 3 giờ đồng hồ, 100% các nhóm đã hoàn thành mạch đo tự động kích hoạt tưới cây khi đất khô và cảnh báo cháy sớm qua còi báo động!`,
    category: "Workshop-trai-nghiem",
    thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    youtubeUrl: "https://www.youtube.com/watch?v=1F_b-1i1b3U",
    youtubeId: "1F_b-1i1b3U",
    gallery: [
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=80"
    ],
    author: "Thầy Nguyễn Văn An - Cố vấn CLB",
    views: 315,
    featured: true,
    status: "published",
    createdAt: "2026-11-10T14:00:00.000Z",
    updatedAt: "2026-11-10T14:00:00.000Z"
  },
  {
    id: "stem-post-3",
    title: "Dự án nghiên cứu: Hệ thống lọc không khí sinh học từ rêu và vi tảo dành cho lớp học",
    slug: "du-an-nghien-cuu-he-thong-loc-khong-khi-sinh-hoc-tu-reu-va-vi-tao-danh-cho-lop-hoc",
    summary: "Dự án kết hợp giữa Sinh học và Kỹ thuật chế tạo nhằm giảm nồng độ bụi mịn PM2.5 và khí CO2 trong các phòng học đóng kín máy lạnh.",
    content: `## Sáng tạo xanh vì sức khỏe học đường

Ý tưởng xuất phát từ thực tế nhiều lớp học vào mùa hè thường xuyên đóng kín cửa bật máy lạnh, dẫn đến không khí bí bách và lượng CO2 tăng cao khiến học sinh dễ buồn ngủ, mệt mỏi.

Nhóm nghiên cứu Sinh - Hóa của CLB STEM đã tận dụng đặc tính quang hợp siêu hấp thụ khí cacbonic của các mảng rêu tự nhiên kết hợp cùng bể nuôi cấy vi tảo Chlorella.

### Quy trình vận hành:
1. Quạt hút siêu êm (DC 12V chạy bằng pin năng lượng mặt trời mini) hút không khí phòng qua màng lọc rêu sống.
2. Không khí tiếp tục sục qua dung dịch vi tảo để hấp thụ CO2 và nhả khí oxy tươi.
3. Cảm biến chất lượng không khí MQ-135 hiển thị chỉ số trực tiếp lên màn hình LCD nhỏ ngoài thân hộp.

Dự án hiện đang được lắp đặt thử nghiệm tại 2 phòng học bộ môn và nhận được nhiều đánh giá tích cực từ Ban giám hiệu nhà trường.`,
    category: "Nghien-cuu-khoa-hoc",
    thumbnail: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80",
    youtubeUrl: "https://www.youtube.com/watch?v=kJQP7kiw5Fk",
    youtubeId: "kJQP7kiw5Fk",
    gallery: [
      "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=1000&q=80"
    ],
    author: "Nhóm STEM Bio-Tech",
    views: 189,
    featured: false,
    status: "published",
    createdAt: "2026-11-05T09:15:00.000Z",
    updatedAt: "2026-11-05T09:15:00.000Z"
  },
  {
    id: "stem-post-4",
    title: "Chế tạo mô hình cánh tay robot 4 bậc tự do từ công nghệ in 3D và động cơ Servo",
    slug: "che-tao-mo-hinh-canh-tay-robot-4-bac-tu-do-tu-cong-nghe-in-3d-va-dong-co-servo",
    summary: "Sản phẩm tốt nghiệp khóa tập huấn hè của nhóm cơ khí chế tạo, có khả năng gắp phân loại vật phẩm theo màu sắc với độ chính xác cao.",
    content: `## Làm chủ kỹ năng thiết kế 3D CAD và gia công hiện đại

Để chế tạo cánh tay robot này, các thành viên trong nhóm đã sử dụng phần mềm Autodesk Fusion 360 để thiết kế từng chi tiết khớp nối, trục quay và ngàm kẹp.

Sau khi hoàn thành bản vẽ, các chi tiết được in trên máy in 3D FDM của phòng thí nghiệm trường bằng vật liệu nhựa sinh học PLA thân thiện môi trường.

Cánh tay robot được điều khiển thông qua 4 động cơ Servo MG996R có lực kéo khỏe, kết hợp camera cảm biến màu sắc TCS3200 để phân loại bóng bàn theo 3 màu: Đỏ, Xanh và Vàng.`,
    category: "Sang-che-robot",
    thumbnail: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80",
    youtubeUrl: "https://www.youtube.com/watch?v=fHk49-eFp3U",
    youtubeId: "fHk49-eFp3U",
    gallery: [],
    author: "Ban Kỹ thuật Chế tạo",
    views: 247,
    featured: false,
    status: "published",
    createdAt: "2026-10-28T16:20:00.000Z",
    updatedAt: "2026-10-28T16:20:00.000Z"
  }
];

export function getPosts(): Post[] {
  ensureDataDir();
  if (!fs.existsSync(POSTS_FILE)) {
    fs.writeFileSync(POSTS_FILE, JSON.stringify(INITIAL_POSTS, null, 2), 'utf-8');
    return INITIAL_POSTS;
  }

  try {
    const raw = fs.readFileSync(POSTS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Lỗi khi đọc file posts.json:', err);
    return INITIAL_POSTS;
  }
}

export function savePosts(posts: Post[]) {
  ensureDataDir();
  fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2), 'utf-8');
}

export function getPostBySlug(slug: string): Post | undefined {
  const posts = getPosts();
  return posts.find((p) => p.slug === slug);
}

export function getPostById(id: string): Post | undefined {
  const posts = getPosts();
  return posts.find((p) => p.id === id);
}

export function createPost(data: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'views'>): Post {
  const posts = getPosts();
  const id = `post-${Date.now()}`;
  const now = new Date().toISOString();
  
  // Tự động tạo slug nếu chưa có hoặc cập nhật từ title
  let slug = data.slug || slugify(data.title);
  // Đảm bảo slug là duy nhất
  let finalSlug = slug;
  let counter = 1;
  while (posts.some(p => p.slug === finalSlug)) {
    finalSlug = `${slug}-${counter}`;
    counter++;
  }

  const youtubeId = extractYouTubeId(data.youtubeUrl) || undefined;

  const newPost: Post = {
    ...data,
    id,
    slug: finalSlug,
    youtubeId,
    views: 0,
    createdAt: now,
    updatedAt: now,
  };

  posts.unshift(newPost);
  savePosts(posts);
  return newPost;
}

export function updatePost(id: string, updates: Partial<Post>): Post | null {
  const posts = getPosts();
  const index = posts.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const oldPost = posts[index];
  let finalSlug = oldPost.slug;
  if (updates.title && updates.title !== oldPost.title && !updates.slug) {
    finalSlug = slugify(updates.title);
    let counter = 1;
    while (posts.some(p => p.id !== id && p.slug === finalSlug)) {
      finalSlug = `${slugify(updates.title)}-${counter}`;
      counter++;
    }
  } else if (updates.slug) {
    finalSlug = updates.slug;
  }

  const youtubeUrl = updates.youtubeUrl !== undefined ? updates.youtubeUrl : oldPost.youtubeUrl;
  const youtubeId = extractYouTubeId(youtubeUrl) || undefined;

  const updated: Post = {
    ...oldPost,
    ...updates,
    id: oldPost.id,
    slug: finalSlug,
    youtubeId,
    updatedAt: new Date().toISOString(),
  };

  posts[index] = updated;
  savePosts(posts);
  return updated;
}

export function deletePost(id: string): boolean {
  const posts = getPosts();
  const filtered = posts.filter((p) => p.id !== id);
  if (filtered.length === posts.length) return false;
  savePosts(filtered);
  return true;
}

export function incrementViews(id: string): void {
  const posts = getPosts();
  const post = posts.find((p) => p.id === id);
  if (post) {
    post.views = (post.views || 0) + 1;
    savePosts(posts);
  }
}

export function getSiteConfig(): SiteConfig {
  ensureDataDir();
  if (!fs.existsSync(CONFIG_FILE)) {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(DEFAULT_CONFIG, null, 2), 'utf-8');
    return DEFAULT_CONFIG;
  }
  try {
    return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
  } catch {
    return DEFAULT_CONFIG;
  }
}
