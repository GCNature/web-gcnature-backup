import news1 from "@/assets/news-1.jpg";
import news2 from "@/assets/news-2.jpg";
import news3 from "@/assets/news-3.jpg";

export interface Article {
  slug: string;
  image: string | null;
  date: string;
  month: string;
  fullDate: string;
  title: string;
  excerpt: string;
  content: string;
  views: number;
  comments: number;
  author: string;
  category: string;
}

// Bypassed: Local Mock Data is disabled. Fetch from /api/articles instead.
/*
export const articles: Article[] = [
  {
    slug: "gcnature-dong-hanh-ngay-hoi-viec-lam-thu-duc-2025",
    image: news1,
    date: "6",
    month: "THÁNG MƯỜI MỘT",
    fullDate: "06/11/2025",
    title: "Công Ty TNHH Công Nghệ GCnature Đồng Hành Cùng Ngày Hội Việc Làm Phường Thủ Đức TP. HCM 2025",
    excerpt: "GCnature – Thương hiệu công nghệ Việt mở rộng cơ hội việc làm cho giới trẻ Sáng ngày 06/11/2025, Công ty TNHH Công Nghệ GCnature – thương hiệu tiên phong…",
    content: `## GCnature – Thương hiệu công nghệ Việt mở rộng cơ hội việc làm cho giới trẻ

Sáng ngày 06/11/2025, Công ty TNHH Công Nghệ GCnature – thương hiệu tiên phong trong lĩnh vực kính mắt thông minh và phụ kiện công nghệ tại Việt Nam – đã vinh dự tham gia **Ngày Hội Việc Làm Phường Thủ Đức TP. HCM 2025**.

### Mở rộng cơ hội cho giới trẻ

Tại sự kiện, GCnature đã giới thiệu nhiều vị trí tuyển dụng hấp dẫn trong lĩnh vực công nghệ, marketing và kinh doanh. Đây là cơ hội tuyệt vời để các bạn trẻ có đam mê với công nghệ được trải nghiệm môi trường làm việc năng động, sáng tạo.

### Cam kết phát triển nguồn nhân lực

GCnature không chỉ tìm kiếm nhân tài mà còn cam kết đào tạo và phát triển đội ngũ nhân sự chất lượng cao, góp phần xây dựng hệ sinh thái công nghệ Việt Nam ngày càng vững mạnh.

Ban lãnh đạo GCnature chia sẻ: *"Chúng tôi tin rằng con người là tài sản quý giá nhất của doanh nghiệp. Việc tham gia Ngày Hội Việc Làm không chỉ giúp chúng tôi tìm được những ứng viên phù hợp mà còn thể hiện trách nhiệm của GCnature với cộng đồng."*

### Về GCnature

GCnature là thương hiệu Việt tiên phong trong lĩnh vực phụ kiện công nghệ thông minh, nổi bật với dòng sản phẩm Kính Thông Minh MCK 5.0 tích hợp Camera, AI, Bluetooth và nhiều tính năng hiện đại khác.`,
    views: 217,
    comments: 0,
    author: "GCnature Team",
    category: "Sự kiện",
  },
  {
    slug: "thu-ngo-giam-doc-gcnature-vy-thien-hung",
    image: news2,
    date: "30",
    month: "THÁNG 10",
    fullDate: "30/10/2025",
    title: "THƯ NGỎ TỪ GIÁM ĐỐC GCNATURE – VY THIÊN HÙNG",
    excerpt: "\"Công nghệ chỉ thật sự thông minh, hữu ích khi được sử dụng đúng cách, đúng pháp luật.\" — Vy Thiên Hùng, Giám đốc Công Ty TNHH Công Nghệ GCnature…",
    content: `## "Công nghệ chỉ thật sự thông minh, hữu ích khi được sử dụng đúng cách, đúng pháp luật."

*— Vy Thiên Hùng, Giám đốc Công Ty TNHH Công Nghệ GCnature*

### Kính gửi Quý khách hàng, Đối tác và Cộng đồng,

Trong thời đại công nghệ phát triển không ngừng, GCnature luôn tâm niệm rằng: **sáng tạo phải đi đôi với trách nhiệm**. Mỗi sản phẩm mà chúng tôi tạo ra không chỉ mang lại tiện ích cho người dùng, mà còn phải tuân thủ pháp luật và đạo đức xã hội.

### Cam kết của GCnature

1. **Sử dụng công nghệ có trách nhiệm** – Mọi sản phẩm của GCnature đều được thiết kế để phục vụ mục đích chính đáng, nâng cao chất lượng cuộc sống.

2. **Bảo vệ quyền riêng tư** – Chúng tôi tôn trọng quyền riêng tư của mỗi cá nhân và cam kết không sử dụng công nghệ vào mục đích xâm phạm đời tư.

3. **Đồng hành cùng pháp luật** – GCnature luôn hoạt động trong khuôn khổ pháp luật Việt Nam và khuyến khích khách hàng sử dụng sản phẩm đúng quy định.

### Lời kết

GCnature sẽ tiếp tục nỗ lực mang đến những sản phẩm công nghệ thông minh, chất lượng và có trách nhiệm. Cảm ơn Quý khách hàng đã tin tưởng và đồng hành cùng chúng tôi.

*Trân trọng,*
*Vy Thiên Hùng – Giám đốc Công Ty TNHH Công Nghệ GCnature*`,
    views: 154,
    comments: 0,
    author: "Vy Thiên Hùng",
    category: "Thương hiệu",
  },
  {
    slug: "huong-dan-su-dung-my-pham-gcnature",
    image: null,
    date: "",
    month: "",
    fullDate: "25/10/2025",
    title: "HƯỚNG DẪN SỬ DỤNG MỸ PHẨM GCNATURE",
    excerpt: "Hướng dẫn sử dụng Kính thông minh GCnature MCK 5.0 – Chi tiết A-Z cho người mới bắt đầu…",
    content: `## Hướng dẫn sử dụng Kính thông minh GCnature MCK 5.0

Chào mừng bạn đến với hướng dẫn sử dụng chi tiết dành cho Kính Thông Minh GCnature MCK 5.0 – sản phẩm công nghệ hàng đầu Việt Nam.

### 1. Mở hộp & Phụ kiện

- Kính Thông Minh MCK 5.0
- Cáp sạc USB-C
- Hộp đựng kính cao cấp
- Khăn lau kính
- Sách hướng dẫn sử dụng

### 2. Sạc pin lần đầu

Sạc đầy pin trước khi sử dụng lần đầu (khoảng 1.5 - 2 giờ). Đèn LED sẽ chuyển sang màu xanh khi pin đầy.

### 3. Kết nối Bluetooth

1. Bật Bluetooth trên điện thoại
2. Nhấn giữ nút nguồn trên kính 3 giây
3. Tìm và kết nối thiết bị "GCnature MCK 5.0" trong danh sách Bluetooth

### 4. Sử dụng Camera

- **Chụp ảnh**: Nhấn nút camera 1 lần
- **Quay video**: Nhấn giữ nút camera 2 giây
- **Dừng quay**: Nhấn nút camera 1 lần

### 5. Tính năng AI

- Hỗ trợ nhận diện đối tượng
- Dịch thuật theo thời gian thực
- Trợ lý giọng nói thông minh

### 6. Nghe nhạc & Gọi điện

Kính tích hợp loa và micro, cho phép nghe nhạc và nghe/gọi điện thoại hands-free.

### Lưu ý quan trọng

- Không sử dụng khi đang lái xe
- Sử dụng đúng mục đích, tuân thủ pháp luật
- Bảo quản nơi khô ráo, tránh va đập mạnh`,
    views: 254,
    comments: 0,
    author: "GCnature Team",
    category: "Hướng dẫn",
  },
  {
    slug: "so-sanh-my-pham-han-quoc-va-gcnature",
    image: news3,
    date: "11",
    month: "THÁNG 10",
    fullDate: "11/10/2025",
    title: "So sánh Kính Thông Minh Xiaomi AI Glasses và Kính Thông Minh GCnature",
    excerpt: "Xiaomi vừa ra mắt kính thông minh AI Glasses với nhiều tính năng cao cấp. Tuy nhiên, Kính Thông Minh GCnature MCK 5.0 lại là lựa chọn thực tế hơn…",
    content: `## So sánh Kính Thông Minh Xiaomi AI Glasses và Kính Thông Minh GCnature MCK 5.0

Xiaomi vừa ra mắt kính thông minh AI Glasses với nhiều tính năng cao cấp. Tuy nhiên, Kính Thông Minh GCnature MCK 5.0 lại là lựa chọn thực tế hơn cho người dùng Việt Nam. Hãy cùng so sánh chi tiết!

### Thiết kế

| Tiêu chí | Xiaomi AI Glasses | GCnature MCK 5.0 |
|-----------|-------------------|---------------|
| Trọng lượng | 47g | 42g |
| Chất liệu | Nhựa cao cấp | Nhựa + Kim loại |
| Kiểu dáng | Thời trang | Thời trang, đa dạng |

### Tính năng Camera

| Tiêu chí | Xiaomi AI Glasses | GCnature MCK 5.0 |
|-----------|-------------------|---------------|
| Độ phân giải | 50MP | 13MP |
| Quay video | 1080p | 1080p |
| Chống rung | Có (EIS) | Có |

### Tính năng AI

Cả hai đều tích hợp AI, tuy nhiên GCnature MCK 5.0 được tối ưu cho người dùng Việt Nam với hỗ trợ tiếng Việt tốt hơn.

### Giá cả

- **Xiaomi AI Glasses**: ~8.000.000 VNĐ (dự kiến)
- **GCnature MCK 5.0**: 2.590.000 VNĐ

### Kết luận

Nếu bạn đang tìm kiếm một chiếc kính thông minh với **giá cả hợp lý**, **hỗ trợ tiếng Việt tốt**, và **bảo hành tại Việt Nam**, thì GCnature MCK 5.0 là lựa chọn tối ưu. Xiaomi AI Glasses phù hợp hơn nếu bạn ưu tiên camera chất lượng cao và hệ sinh thái Xiaomi.`,
    views: 469,
    comments: 0,
    author: "GCnature Team",
    category: "So sánh",
  }
];

// export const getArticleBySlug = (slug: string): Article | undefined => {
//   return articles.find((a) => a.slug === slug);
// };
// 
// export const getRelatedArticles = (slug: string, limit: number = 3): Article[] => {
//   return articles
//     .filter((a) => a.slug !== slug)
//     .sort(() => 0.5 - Math.random())
//     .slice(0, limit);
// };
*/
