import { Post, SiteConfig, ScheduleEvent, DocumentResource } from './types';
import { extractYouTubeId, slugify } from './utils';

// Cấu hình mặc định cho Cổng Thông Tin CLB STEM
export const DEFAULT_CONFIG: SiteConfig = {
  clubName: "CLB Nghiên cứu khoa học, STEM và Robotics",
  shortName: "BSSRC",
  schoolName: "Trường THPT Bắc Đông Quan",
  slogan: "Khơi nguồn sáng tạo - Chinh phục đam mê",
  description: "Cổng thông tin điện tử Câu lạc bộ Nghiên cứu khoa học, STEM và Robotics trường THPT Bắc Đông Quan. Nơi cập nhật các thông báo, đề tài KHKT, chế tạo robot và tài nguyên học liệu số học đường.",
  email: "bdq.stemlab@gmail.com",
  phone: "0984 552 238",
  facebookUrl: "https://facebook.com/bdq.ssrc",
  youtubeChannelUrl: "https://www.youtube.com/@BDQSTEMLab",
  address: "Phòng Thực hành STEM - Tầng 3 Tòa C, Trường THPT Bắc Đông Quan",
};

// Dữ liệu Lịch hoạt động & Sự kiện CLB
export const INITIAL_SCHEDULE: ScheduleEvent[] = [
  {
    id: "sch-1",
    title: "Sinh hoạt chuyên đề: Kỹ thuật lập trình PID cho Robot dò line tốc độ cao",
    date: "Thứ Bảy, 22/11/2026",
    time: "14:00 - 17:00",
    location: "Phòng Thực hành STEM (Tầng 3 Tòa C)",
    type: "workshop",
    badge: "Buổi sinh hoạt"
  },
  {
    id: "sch-2",
    title: "Hạn cuối nộp Thuyết minh Đề tài Cuộc thi Sáng tạo KHKT cấp trường",
    date: "Thứ Hai, 25/11/2026",
    time: "Trước 17:00",
    location: "Hệ thống số pttp.id.vn / Văn phòng Đoàn trường",
    type: "deadline",
    badge: "Hạn chót"
  },
  {
    id: "sch-3",
    title: "Tập huấn an toàn phòng thí nghiệm và bảo trì máy in 3D FDM",
    date: "Chủ Nhật, 30/11/2026",
    time: "08:30 - 11:00",
    location: "Xưởng Chế tạo Robot (Lab C302)",
    type: "meeting",
    badge: "Tập huấn"
  },
  {
    id: "sch-4",
    title: "Vòng sơ loại Cuộc thi Chế tạo Xe đua thế năng trọng lực Khối 10 & 11",
    date: "Chủ Nhật, 07/12/2026",
    time: "07:30 - 11:30",
    location: "Sân đa năng Trường THPT Bắc Đông Quan",
    type: "contest",
    badge: "Hội thi"
  }
];

// Dữ liệu Văn bản, Biểu mẫu, Học liệu tải về
export const INITIAL_DOCUMENTS: DocumentResource[] = [
  {
    id: "doc-1",
    title: "Kế hoạch tổ chức Cuộc thi Sáng tạo Khoa học Kỹ thuật cấp trường năm học 2026 - 2027",
    code: "KH-BSSRC/2026-08",
    category: "Kế hoạch",
    fileType: "PDF",
    fileSize: "1.8 MB",
    publishDate: "18/11/2026",
    downloadUrl: "#"
  },
  {
    id: "doc-2",
    title: "Mẫu phiếu Đăng ký đề tài & Bản thuyết minh nghiên cứu KHKT dành cho học sinh",
    code: "BM-KHKT/01",
    category: "Biểu mẫu",
    fileType: "DOCX",
    fileSize: "68 KB",
    publishDate: "16/11/2026",
    downloadUrl: "#"
  },
  {
    id: "doc-3",
    title: "Quy chế an toàn điện, phòng cháy chữa cháy và nội quy sử dụng Phòng Thực hành STEM",
    code: "QC-LAB/2026",
    category: "Quy chế",
    fileType: "PDF",
    fileSize: "850 KB",
    publishDate: "01/10/2026",
    downloadUrl: "#"
  },
  {
    id: "doc-4",
    title: "Giáo trình nhập môn Lập trình Vi điều khiển ESP32 và Thư viện Cảm biến Arduino",
    code: "GT-STEM/ESP32",
    category: "Học liệu",
    fileType: "ZIP",
    fileSize: "14.5 MB",
    publishDate: "05/11/2026",
    downloadUrl: "#"
  },
  {
    id: "doc-5",
    title: "Phiếu đăng ký mượn linh kiện, board mạch và thiết bị đo kiểm Phòng Lab C302",
    code: "BM-MUON/2026",
    category: "Biểu mẫu",
    fileType: "DOCX",
    fileSize: "45 KB",
    publishDate: "12/11/2026",
    downloadUrl: "#"
  },
  {
    id: "doc-6",
    title: "Điều lệ và Tiêu chí đánh giá Cuộc thi Sáng chế Robot cứu hộ tự hành 2026",
    code: "DL-ROBOT/2026",
    category: "Thể lệ",
    fileType: "PDF",
    fileSize: "2.1 MB",
    publishDate: "28/10/2026",
    downloadUrl: "#"
  },
  {
    id: "doc-7",
    title: "Tài liệu hướng dẫn thiết kế mô hình cơ khí 3D bằng Autodesk Fusion 360",
    code: "HD-CAD3D/01",
    category: "Học liệu",
    fileType: "PDF",
    fileSize: "5.6 MB",
    publishDate: "20/10/2026",
    downloadUrl: "#"
  },
  {
    id: "doc-8",
    title: "Quyết định kiện toàn Ban Chủ nhiệm CLB Nghiên cứu khoa học, STEM và Robotics",
    code: "QD-BGH/2026-15",
    category: "Quyết định",
    fileType: "PDF",
    fileSize: "410 KB",
    publishDate: "15/09/2026",
    downloadUrl: "#"
  }
];

// Dữ liệu bài viết khởi tạo chuẩn Cổng Thông Tin
export const INITIAL_POSTS: Post[] = [
  {
    id: "stem-tb-1",
    title: "Thông báo Kế hoạch tổ chức Cuộc thi Sáng tạo Khoa học Kỹ thuật cấp trường năm học 2026 - 2027",
    slug: "thong-bao-ke-hoach-to-chuc-cuoc-thi-sang-tao-khkt-cap-truong-nam-hoc-2026-2027",
    summary: "Ban Giám hiệu nhà trường và Ban Chủ nhiệm CLB BSSRC chính thức ban hành kế hoạch triển khai cuộc thi Sáng tạo KHKT cấp trường. Toàn thể học sinh có ý tưởng nghiên cứu đăng ký trước ngày 25/11/2026.",
    content: `## Kế hoạch phát động phong trào Nghiên cứu Sáng tạo KHKT năm học 2026 - 2027

Thực hiện nhiệm vụ năm học và nhằm khích lệ tinh thần say mê sáng tạo của học sinh, Ban Chủ nhiệm CLB phối hợp cùng Đoàn trường THPT Bắc Đông Quan thông báo kế hoạch tổ chức cuộc thi thường niên:

### 1. Lĩnh vực dự thi:
- **Nhóm 1:** Robot và máy thông minh, Hệ thống nhúng, Internet vạn vật (IoT).
- **Nhóm 2:** Kỹ thuật cơ khí, Tự động hóa, Năng lượng tái tạo và Mô hình thông minh.
- **Nhóm 3:** Khoa học môi trường, Ứng dụng sinh hóa xử lý rác thải học đường.
- **Nhóm 4:** Phần mềm hệ thống, Chuyển đổi số và Ứng dụng AI phục vụ giáo dục.

### 2. Thời gian và các mốc quan trọng:
1. **Tiếp nhận hồ sơ đăng ký:** Từ ngày 15/11/2026 đến hết 17:00 ngày 25/11/2026 qua cổng trực tuyến hoặc tại Phòng Thực hành STEM.
2. **Xét duyệt ý tưởng & Phân công giáo viên hướng dẫn:** 26/11 - 30/11/2026.
3. **Chế tạo mô hình thử nghiệm tại Lab C302:** Tháng 12/2026 đến tháng 01/2027 (CLB hỗ trợ máy in 3D, máy cắt laser và kho linh kiện).
4. **Vòng Chung kết cấp trường:** Dự kiến trung tuần tháng 02/2027.

### 3. Hồ sơ đính kèm:
Các nhóm tải mẫu đơn đăng ký và bản thuyết minh đề tài tại mục văn bản biểu mẫu cuối bài viết này.`,
    category: "Thong-bao",
    thumbnail: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80",
    author: "Ban Chủ nhiệm BSSRC",
    views: 890,
    featured: false,
    isPinned: true,
    isUrgent: true,
    attachments: [
      { name: "Ke-hoach-KHKT-2026-2027.pdf", url: "#", size: "1.8 MB", type: "PDF" },
      { name: "Mau-phieu-dang-ky-de-tai.docx", url: "#", size: "68 KB", type: "DOCX" }
    ],
    status: "published",
    createdAt: "2026-11-18T07:30:00.000Z",
    updatedAt: "2026-11-18T07:30:00.000Z"
  },
  {
    id: "stem-post-1",
    title: "Đội tuyển STEM trường xuất sắc giành Huy chương Vàng tại Hội thi Sáng chế Robot 2026",
    slug: "doi-tuyen-stem-truong-xuat-sac-gianh-huy-chuong-vang-tai-hoi-thi-sang-che-robot-2026",
    summary: "Với mô hình Robot cứu hộ tự hành tích hợp thị giác máy tính và cảm biến nhiệt, đội tuyển STEM BSSRC đã vượt qua hơn 40 đội thi toàn quốc để giành ngôi vị quán quân bảng sáng chế.",
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
    views: 1250,
    featured: true,
    isPinned: true,
    status: "published",
    createdAt: "2026-11-16T08:30:00.000Z",
    updatedAt: "2026-11-16T08:30:00.000Z"
  },
  {
    id: "stem-hl-1",
    title: "Tài liệu học tập: Hướng dẫn lập trình vi điều khiển ESP32 và kết nối cảm biến IoT",
    slug: "tai-lieu-hoc-tap-huong-dan-lap-trinh-vi-dieu-khien-esp32-va-ket-noi-cam-bien-iot",
    summary: "Bộ tài liệu chuyên đề chuẩn hóa dành cho học sinh mới gia nhập CLB: từ cài đặt môi trường Arduino IDE, giao thức kết nối WiFi, đọc cảm biến môi trường đến hiển thị Dashboard qua Internet.",
    content: `## Nền tảng vi điều khiển IoT trong nghiên cứu KHKT

Vi điều khiển ESP32 hiện là lựa chọn hàng đầu cho các dự án nghiên cứu khoa học kỹ thuật cấp THPT nhờ cấu hình mạnh mẽ (lõi kép 240MHz, tích hợp sẵn Wi-Fi và Bluetooth BLE) với giá thành hợp lý.

### Các bài học thực hành trọng tâm:
- **Bài 1:** Cài đặt Driver CH340 / CP2102 và cấu hình Board ESP32 trên Arduino IDE.
- **Bài 2:** Giao tiếp GPIO kỹ thuật số: Đọc nút nhấn, điều khiển đèn LED và còi buzzer cảnh báo.
- **Bài 3:** Đọc dữ liệu Analog: Cảm biến quang trở LDR, cảm biến độ ẩm đất và cảm biến nồng độ khí gas MQ-2.
- **Bài 4:** Hiển thị thông số lên màn hình OLED I2C 0.96 inch.
- **Bài 5:** Kết nối mạng Wi-Fi và truyền dữ liệu lên Web Server / MQTT Broker (Adafruit IO, Blynk IoT).

Toàn bộ sơ đồ nối dây (Fritzing) và mã nguồn mẫu được đính kèm ở file nén phía dưới.`,
    category: "Hoc-lieu-stem",
    thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    author: "Ban Kỹ thuật Lập trình",
    views: 642,
    featured: false,
    isPinned: false,
    attachments: [
      { name: "Giao-trinh-ESP32-BSSRC-2026.pdf", url: "#", size: "4.2 MB", type: "PDF" },
      { name: "Source-Code-Mau-Arduino.zip", url: "#", size: "8.5 MB", type: "ZIP" }
    ],
    status: "published",
    createdAt: "2026-11-14T10:15:00.000Z",
    updatedAt: "2026-11-14T10:15:00.000Z"
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
    thumbnail: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80",
    youtubeUrl: "https://www.youtube.com/watch?v=1F_b-1i1b3U",
    youtubeId: "1F_b-1i1b3U",
    gallery: [
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=80"
    ],
    author: "Thầy Nguyễn Văn An - Cố vấn CLB",
    views: 520,
    featured: false,
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
    views: 410,
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
    views: 388,
    featured: false,
    status: "published",
    createdAt: "2026-10-28T16:20:00.000Z",
    updatedAt: "2026-10-28T16:20:00.000Z"
  },
  {
    id: "stem-tb-2",
    title: "Thông báo Lịch kiểm tra & Hiệu chuẩn linh kiện Phòng thực hành STEM tháng 11/2026",
    slug: "thong-bao-lich-kiem-tra-hieu-chuan-linh-kien-phong-thuc-hanh-stem-thang-11-2026",
    summary: "Nhằm chuẩn bị tốt nhất cho đợt cao điểm nghiên cứu KHKT, Ban Quản trị phòng Lab tiến hành kiểm kê toàn bộ linh kiện điện tử, bàn giao trang thiết bị và bảo dưỡng máy in 3D.",
    content: `## Kế hoạch bảo trì và kiểm kê thiết bị Lab Tòa C

Ban Quản trị Phòng Thực hành STEM thông báo lịch tạm dừng mượn thiết bị trong 02 ngày để tiến hành kiểm kê:

- **Thời gian tạm đóng cửa mượn trả:** 17:00 ngày 28/11/2026 đến 12:00 ngày 30/11/2026.
- **Nội dung kiểm tra:** Hiệu chuẩn nhiệt độ đầu đùn máy in 3D, kiểm tra nguồn một chiều đa năng, sắp xếp lại ngăn tủ linh kiện vi điều khiển.
- Các bạn đang mượn board mạch và kit thử nghiệm xin vui lòng đăng nhập vào hệ thống số **pttp.id.vn** để kiểm tra hạn trả.`,
    category: "Thong-bao",
    thumbnail: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80",
    author: "Ban Quản lý Phòng Lab",
    views: 310,
    featured: false,
    isPinned: false,
    isUrgent: false,
    status: "published",
    createdAt: "2026-11-08T09:00:00.000Z",
    updatedAt: "2026-11-08T09:00:00.000Z"
  }
];

// In-memory posts array for zero-dependency edge compatibility
let memoryPosts: Post[] = [...INITIAL_POSTS];
let memorySchedule: ScheduleEvent[] = [...INITIAL_SCHEDULE];
let memoryDocuments: DocumentResource[] = [...INITIAL_DOCUMENTS];

export function getPosts(): Post[] {
  return memoryPosts;
}

export function savePosts(posts: Post[]) {
  memoryPosts = posts;
}

export function getPostBySlug(slug: string): Post | undefined {
  return memoryPosts.find((p) => p.slug === slug);
}

export function getPostById(id: string): Post | undefined {
  return memoryPosts.find((p) => p.id === id);
}

export function getAnnouncements(): Post[] {
  return memoryPosts
    .filter((p) => p.status === 'published' && p.category === 'Thong-bao')
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
}

export function getScheduleEvents(): ScheduleEvent[] {
  return memorySchedule;
}

export function getDocumentResources(): DocumentResource[] {
  return memoryDocuments;
}

export function createDocument(data: Omit<DocumentResource, 'id'>): DocumentResource {
  const id = `doc-${Date.now()}`;
  const newDoc: DocumentResource = { ...data, id };
  memoryDocuments.unshift(newDoc);
  return newDoc;
}

export function deleteDocument(id: string): boolean {
  const prevLen = memoryDocuments.length;
  memoryDocuments = memoryDocuments.filter((d) => d.id !== id);
  return memoryDocuments.length < prevLen;
}

export function createPost(data: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'views'>): Post {
  const id = `post-${Date.now()}`;
  const now = new Date().toISOString();
  
  let slug = data.slug || slugify(data.title);
  let finalSlug = slug;
  let counter = 1;
  while (memoryPosts.some(p => p.slug === finalSlug)) {
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

  memoryPosts.unshift(newPost);
  return newPost;
}

export function updatePost(id: string, updates: Partial<Post>): Post | null {
  const index = memoryPosts.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const oldPost = memoryPosts[index];
  let finalSlug = oldPost.slug;
  if (updates.title && updates.title !== oldPost.title && !updates.slug) {
    finalSlug = slugify(updates.title);
    let counter = 1;
    while (memoryPosts.some(p => p.id !== id && p.slug === finalSlug)) {
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

  memoryPosts[index] = updated;
  return updated;
}

export function deletePost(id: string): boolean {
  const filtered = memoryPosts.filter((p) => p.id !== id);
  if (filtered.length === memoryPosts.length) return false;
  memoryPosts = filtered;
  return true;
}

export function incrementViews(id: string): void {
  const post = memoryPosts.find((p) => p.id === id);
  if (post) {
    post.views = (post.views || 0) + 1;
  }
}

export function getSiteConfig(): SiteConfig {
  return DEFAULT_CONFIG;
}
