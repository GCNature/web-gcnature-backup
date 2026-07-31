import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const pdfParse = require('pdf-parse');

async function run() {
  const jdDir = 'c:/Users/WEB GCNATURE/Web - GCnature/Tuyển dụng';
  const files = fs.readdirSync(jdDir);

  const rawMap: Record<string, string> = {};
  for (const f of files) {
    if (f.endsWith('.pdf')) {
      const buf = fs.readFileSync(path.join(jdDir, f));
      const parsed = await pdfParse(buf);
      rawMap[f] = parsed.text.trim();
    }
  }

  function textToHtml(text: string) {
    if (!text) return '<p>Chưa có nội dung mô tả bổ sung.</p>';
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    let html = '';
    let inList = false;

    for (let line of lines) {
      if (/^[0-9]+\.\s+/.test(line) || /^[A-ZÀÁẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬĐÈÉẺẼẸÊẾỀỂỄỆÌÍỈĨỊÒÓỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÙÚỦŨỤƯỨỪỬỮỰỲÝỶỸỴ\s]{4,}$/.test(line)) {
        if (inList) { html += '</ul>'; inList = false; }
        html += `<h3 class="text-sm md:text-base font-extrabold text-slate-900 mt-4 mb-2">${line}</h3>`;
      } else if (line.startsWith('-') || line.startsWith('•') || line.startsWith('+')) {
        if (!inList) { html += '<ul class="list-disc pl-5 space-y-1.5 text-slate-700 text-sm mb-3">'; inList = true; }
        const content = line.replace(/^[-•+]\s*/, '');
        html += `<li>${content}</li>`;
      } else {
        if (inList) { html += '</ul>'; inList = false; }
        html += `<p class="text-slate-700 leading-relaxed text-sm mb-2">${line}</p>`;
      }
    }
    if (inList) html += '</ul>';
    return html;
  }

  const jobMappings = [
    {
      id: 'job-1',
      title: 'Thực tập sinh Thương mại điện tử (E-commerce Intern)',
      department: 'ecom',
      departmentName: 'TMĐT',
      location: 'S1.06 Vinsmart City & 111 Phố Trung Phụng, Hà Nội',
      type: 'Ca linh hoạt / Toàn thời gian',
      excerpt: 'Đam mê vận hành gian hàng Shopee, TikTok Shop, Lazada, hỗ trợ flashsale, quản lý kho & tối ưu doanh số mỹ phẩm Hàn Quốc.',
      pdfKey: '[GC NATURE] TUYỂN DỤNG_ THỰC TẬP SINH THƯƠNG MẠI ĐIỆN TỬ.pdf',
      asciiUrl: '/uploads/jd/jd-ecom-intern.pdf'
    },
    {
      id: 'job-2',
      title: 'Thực tập sinh SEO Websites',
      department: 'seo',
      departmentName: 'SEO',
      location: 'S1.06 Vinsmart City & 111 Phố Trung Phụng, Hà Nội',
      type: 'Ca linh hoạt / Toàn thời gian',
      excerpt: 'Nghiên cứu bộ từ khóa xu hướng mỹ phẩm Hàn Quốc, viết bài chuẩn SEO Onpage và tối ưu thứ hạng website GCnature.',
      pdfKey: '[GC NATURE] TUYỂN DỤNG_ THỰC TẬP SINH SEO.pdf',
      asciiUrl: '/uploads/jd/jd-seo-intern.pdf'
    },
    {
      id: 'job-3',
      title: 'Thực tập sinh Marketing / Content',
      department: 'marketing',
      departmentName: 'Marketing',
      location: 'S1.06 Vinsmart City & 111 Phố Trung Phụng, Hà Nội',
      type: 'Ca linh hoạt / Toàn thời gian',
      excerpt: 'Sáng tạo nội dung Fanpage, Instagram, thiết kế hình ảnh banner & xây dựng kịch bản truyền thông mỹ phẩm.',
      pdfKey: 'TUYỂN DỤNG_ THỰC TẬP SINH MARKETING.pdf',
      asciiUrl: '/uploads/jd/jd-mkt-intern.pdf'
    },
    {
      id: 'job-4',
      title: 'Thực tập sinh Truyền thông & Thương hiệu',
      department: 'media',
      departmentName: 'Truyền thông',
      location: 'S1.06 Vinsmart City & 111 Phố Trung Phụng, Hà Nội',
      type: 'Ca linh hoạt / Toàn thời gian',
      excerpt: 'Kết nối KOC/KOL làm đẹp, gửi mẫu trải nghiệm sản phẩm, hỗ trợ PR sự kiện thương hiệu mỹ phẩm.',
      pdfKey: 'TUYỂN DỤNG_ THỰC TẬP SINH TRUYỀN THÔNG.pdf',
      asciiUrl: '/uploads/jd/jd-media-intern.pdf'
    },
    {
      id: 'job-5',
      title: 'Nhân viên Truyền thông (Chính thức)',
      department: 'media',
      departmentName: 'Truyền thông',
      location: 'S1.06 Vinsmart City & 111 Phố Trung Phụng, Hà Nội',
      type: 'Toàn thời gian (Full-time)',
      excerpt: 'Lập kế hoạch chiến dịch truyền thông tổng thể, định vị thương hiệu mỹ phẩm Hàn Quốc GCnature trên đa kênh.',
      pdfKey: 'TUYỂN DỤNG_ NHÂN VIÊN TRUYỀN THÔNG.pdf',
      asciiUrl: '/uploads/jd/jd-media-staff.pdf'
    },
    {
      id: 'job-6',
      title: 'Thực tập sinh Livestream TikTok / Shopee',
      department: 'livestream',
      departmentName: 'Livestream',
      location: 'S1.06 Vinsmart City & 111 Phố Trung Phụng, Hà Nội',
      type: 'Ca linh hoạt / Toàn thời gian',
      excerpt: 'Hỗ trợ setup phòng stream, chuẩn bị mẫu thử mỹ phẩm, tương tác với người xem và chốt đơn trực tiếp trên live.',
      pdfKey: 'TUYỂN DỤNG_ THỰC TẬP SINH LIVESTREAM.pdf',
      asciiUrl: '/uploads/jd/jd-live-intern.pdf'
    },
    {
      id: 'job-7',
      title: 'Nhân viên Thiết kế Đồ họa (Graphic Designer)',
      department: 'design',
      departmentName: 'Thiết kế',
      location: 'S1.06 Vinsmart City & 111 Phố Trung Phụng, Hà Nội',
      type: 'Toàn thời gian (Full-time)',
      excerpt: 'Thiết kế banner website, hình ảnh sản phẩm Shopee/TikTok Shop, bộ nhận diện thương hiệu & bao bì mỹ phẩm.',
      pdfKey: 'TUYỂN DỤNG_ NHÂN VIÊN THIẾT KẾ ĐỒ HỌA.pdf',
      asciiUrl: '/uploads/jd/jd-designer-staff.pdf'
    },
    {
      id: 'job-8',
      title: 'Nhân viên Vận hành TikTok Shop (TikTok Operator)',
      department: 'tiktok',
      departmentName: 'TikTok',
      location: 'S1.06 Vinsmart City & 111 Phố Trung Phụng, Hà Nội',
      type: 'Toàn thời gian (Full-time)',
      excerpt: 'Tối ưu gian hàng TikTok Shop, cài đặt Affiliate MCN cho KOC/KOL, booking sáng tạo nội dung & tăng trưởng GMV.',
      pdfKey: 'TUYỂN DỤNG_ NHÂN VIÊN VẬN HÀNH TIKTOK SHOP.pdf',
      asciiUrl: '/uploads/jd/jd-tiktok-operator.pdf'
    },
    {
      id: 'job-9',
      title: 'Nhân viên Chăm sóc Khách hàng & Sales Online',
      department: 'sales',
      departmentName: 'Tư vấn / CSKH',
      location: 'S1.06 Vinsmart City & 111 Phố Trung Phụng, Hà Nội',
      type: 'Toàn thời gian / Theo ca',
      excerpt: 'Tư vấn chu trình Skincare phù hợp cho khách hàng qua Fanpage/Zalo/Website, chốt đơn và xử lý khiếu nại cẩn thận.',
      pdfKey: 'TUYỂN DỤNG_ NHÂN VIÊN CHĂM SÓC KHÁCH HÀNG.pdf',
      asciiUrl: '/uploads/jd/jd-cskh-staff.pdf'
    }
  ];

  const jobsWithHtml = jobMappings.map(m => ({
    id: m.id,
    title: m.title,
    department: m.department,
    departmentName: m.departmentName,
    location: m.location,
    type: m.type,
    excerpt: m.excerpt,
    jdFileUrl: m.asciiUrl,
    jdFileName: m.pdfKey,
    contentHtml: textToHtml(rawMap[m.pdfKey]),
    isActive: true
  }));

  // Update DB page_recruitment setting
  const recSetting = await prisma.settings.findUnique({ where: { key: 'page_recruitment' } });
  let settingValue: any = {};
  try {
    settingValue = JSON.parse(recSetting?.value || '{}');
  } catch (e) {}

  settingValue.tabsConfig = jobsWithHtml;

  await prisma.settings.upsert({
    where: { key: 'page_recruitment' },
    update: { value: JSON.stringify(settingValue) },
    create: { key: 'page_recruitment', value: JSON.stringify(settingValue) }
  });

  console.log('Successfully updated DB page_recruitment setting!');
  
  // Write formatted TS data file for static fallback
  const tsCode = `export const initialRecruitmentJobs = ${JSON.stringify(jobsWithHtml, null, 2)};\n`;
  fs.writeFileSync('c:/Users/WEB GCNATURE/Web - GCnature/src/data/recruitmentJobs.ts', tsCode, 'utf8');
  console.log('Successfully written src/data/recruitmentJobs.ts!');
}

run().finally(() => prisma.$disconnect());
