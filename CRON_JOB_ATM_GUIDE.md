# 🔄 HƯỚNG DẪN CẤU HÌNH CRON JOB ATM AUTO CHECK

## 📋 Tổng quan

Hệ thống tự động kiểm tra giao dịch ATM/Banking để xác nhận thanh toán đơn hàng.

**Cách hoạt động:**
1. Khách hàng chuyển khoản với nội dung: `MERCY DH001` (mã đơn hàng)
2. Cron job chạy mỗi 2 phút, gọi API ngân hàng
3. Tìm giao dịch khớp với mã đơn hàng
4. Tự động cập nhật trạng thái đơn hàng

---

## ⚙️ CẤU HÌNH HIỆN TẠI

### File: `server/.env`

```env
# Bank payment provider
ACB_HISTORY_API_URL="https://api.sieuthicode.net/historyapiacb/ec4f8aeb9d87bc0ffa48f709365313d1"
ACB_CRON_SCHEDULE="*/2 * * * *"
ENABLE_ACB_CRON="true"
```

### Giải thích:

- **ACB_HISTORY_API_URL**: API endpoint để lấy lịch sử giao dịch ACB
- **ACB_CRON_SCHEDULE**: Lịch chạy cron (mỗi 2 phút)
- **ENABLE_ACB_CRON**: Bật/tắt cron job

---

## 🔧 CÁCH THAY ĐỔI CẤU HÌNH

### 1. Thay đổi tần suất chạy

Sửa `ACB_CRON_SCHEDULE` theo cú pháp cron:

```env
# Mỗi 1 phút
ACB_CRON_SCHEDULE="*/1 * * * *"

# Mỗi 5 phút
ACB_CRON_SCHEDULE="*/5 * * * *"

# Mỗi 10 phút
ACB_CRON_SCHEDULE="*/10 * * * *"

# Mỗi 30 giây (không khuyến nghị - quá nhanh)
ACB_CRON_SCHEDULE="*/30 * * * * *"
```

**Cú pháp Cron:**
```
* * * * *
│ │ │ │ │
│ │ │ │ └─── Ngày trong tuần (0-7, 0 và 7 là Chủ nhật)
│ │ │ └───── Tháng (1-12)
│ │ └─────── Ngày trong tháng (1-31)
│ └───────── Giờ (0-23)
└─────────── Phút (0-59)
```

### 2. Tắt/Bật Cron Job

```env
# Tắt cron job
ENABLE_ACB_CRON="false"

# Bật cron job
ENABLE_ACB_CRON="true"
```

### 3. Thay đổi API Provider

Nếu dùng API khác hoặc ngân hàng khác:

```env
# Ví dụ: API Vietcombank
VCB_HISTORY_API_URL="https://api.example.com/vcb/history/your_token"
```

---

## 🚀 CÁCH HOẠT ĐỘNG CHI TIẾT

### File: `server/src/cron/acbJob.ts`

```typescript
import cron from 'node-cron';

export function startAcbCronJob() {
  const enabled = process.env.ENABLE_ACB_CRON === 'true';
  
  if (!enabled) {
    console.log('ACB cron job is disabled');
    return;
  }

  const schedule = process.env.ACB_CRON_SCHEDULE || '*/2 * * * *';
  
  cron.schedule(schedule, async () => {
    console.log('🔄 Checking ACB transactions...');
    
    try {
      // 1. Gọi API lấy lịch sử giao dịch
      const response = await fetch(process.env.ACB_HISTORY_API_URL);
      const transactions = await response.json();
      
      // 2. Lọc giao dịch mới (trong 10 phút gần nhất)
      const recentTransactions = transactions.filter(t => {
        const transTime = new Date(t.transactionDate);
        const now = new Date();
        return (now - transTime) < 10 * 60 * 1000; // 10 phút
      });
      
      // 3. Tìm đơn hàng khớp
      for (const trans of recentTransactions) {
        const orderCode = extractOrderCode(trans.description);
        if (orderCode) {
          await updateOrderStatus(orderCode, trans.amount);
        }
      }
      
      console.log('✅ ACB check completed');
    } catch (error) {
      console.error('❌ ACB check failed:', error);
    }
  });
  
  console.log(`✅ ACB cron job started: ${schedule}`);
}

function extractOrderCode(description: string): string | null {
  // Tìm mã đơn hàng trong nội dung chuyển khoản
  // VD: "MERCY DH001" -> "DH001"
  const match = description.match(/MERCY\s+([A-Z0-9]+)/i);
  return match ? match[1] : null;
}
```

---

## 📊 LUỒNG XỬ LÝ

```
┌─────────────────────────────────────────────────────────────┐
│  1. Khách hàng chuyển khoản                                 │
│     - Số tiền: 500,000đ                                     │
│     - Nội dung: "MERCY DH001"                               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  2. Cron Job chạy (mỗi 2 phút)                              │
│     - Gọi API ACB History                                   │
│     - Lấy danh sách giao dịch mới                           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  3. Tìm giao dịch khớp                                      │
│     - Tìm "MERCY DH001" trong description                   │
│     - Kiểm tra số tiền khớp với đơn hàng                    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  4. Cập nhật đơn hàng                                       │
│     - Đổi status: pending → confirmed                       │
│     - Lưu thông tin giao dịch vào notes                     │
│     - Gửi email thông báo cho khách                         │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔐 BẢO MẬT API

### Lấy API Token từ SieuThiCode.net

1. Truy cập: https://api.sieuthicode.net
2. Đăng ký tài khoản
3. Tạo API key cho ACB History
4. Copy token vào `.env`:

```env
ACB_HISTORY_API_URL="https://api.sieuthicode.net/historyapiacb/YOUR_TOKEN_HERE"
```

### Bảo vệ API Token

- ✅ **KHÔNG** commit file `.env` lên Git
- ✅ Thêm `.env` vào `.gitignore`
- ✅ Sử dụng biến môi trường trên server production
- ✅ Rotate token định kỳ (3-6 tháng)

---

## 🧪 TEST CRON JOB

### 1. Test thủ công

```bash
cd server
npm run dev
```

Xem log console:
```
✅ ACB cron job started: */2 * * * *
🔄 Checking ACB transactions...
✅ ACB check completed
```

### 2. Test với đơn hàng thật

1. Tạo đơn hàng test: `DH999`
2. Chuyển khoản với nội dung: `MERCY DH999`
3. Đợi 2 phút (hoặc thời gian cron schedule)
4. Kiểm tra đơn hàng đã chuyển sang "Đã xác nhận" chưa

### 3. Xem log chi tiết

Thêm log vào `server/src/cron/acbJob.ts`:

```typescript
console.log('📝 Transactions found:', transactions.length);
console.log('🔍 Recent transactions:', recentTransactions.length);
console.log('✅ Orders updated:', updatedOrders.length);
```

---

## ⚠️ LƯU Ý QUAN TRỌNG

### 1. Tần suất gọi API

- **Khuyến nghị**: 2-5 phút/lần
- **Không nên**: < 1 phút (có thể bị rate limit)
- **Tối đa**: 10 phút (khách chờ lâu)

### 2. Chi phí API

- Mỗi lần gọi API = 1 request
- Tính phí theo số request/tháng
- **Ước tính**: 
  - Mỗi 2 phút = 720 requests/ngày
  - 720 × 30 = 21,600 requests/tháng

### 3. Xử lý lỗi

Cron job tự động retry nếu lỗi:
- Lỗi network: Bỏ qua, chờ lần sau
- Lỗi API: Log error, không crash server
- Lỗi database: Rollback transaction

### 4. Duplicate Detection

Hệ thống tự động phát hiện giao dịch trùng:
- Lưu transaction ID vào database
- Kiểm tra trước khi cập nhật đơn hàng
- Tránh cập nhật 2 lần cho cùng 1 giao dịch

---

## 🛠️ TROUBLESHOOTING

### Vấn đề 1: Cron không chạy

**Nguyên nhân:**
- `ENABLE_ACB_CRON="false"`
- Lỗi cú pháp cron schedule
- Server không khởi động đúng

**Giải pháp:**
```bash
# Kiểm tra log
cd server
npm run dev

# Xem có dòng này không:
# ✅ ACB cron job started: */2 * * * *
```

### Vấn đề 2: API trả về lỗi 401/403

**Nguyên nhân:**
- Token hết hạn
- Token sai
- IP bị block

**Giải pháp:**
- Tạo token mới
- Kiểm tra whitelist IP
- Liên hệ support API provider

### Vấn đề 3: Đơn hàng không tự động cập nhật

**Nguyên nhân:**
- Nội dung chuyển khoản sai format
- Số tiền không khớp
- Đơn hàng đã bị hủy

**Giải pháp:**
- Kiểm tra format: `MERCY DH001` (có dấu cách)
- Kiểm tra số tiền chính xác
- Xem log để debug

---

## 📈 MONITORING

### Metrics cần theo dõi

1. **Success Rate**: % giao dịch được xử lý thành công
2. **Response Time**: Thời gian API response
3. **Error Rate**: % lỗi khi gọi API
4. **Orders Auto-Confirmed**: Số đơn tự động xác nhận/ngày

### Dashboard Admin

Thêm vào AdminPayments:
- Số giao dịch hôm nay
- Số đơn tự động xác nhận
- Lịch sử cron job runs
- Error logs

---

## 🔄 NÂNG CẤP

### Tính năng có thể thêm:

1. **Multi-Bank Support**
   - Hỗ trợ nhiều ngân hàng (VCB, TCB, MB...)
   - Cấu hình riêng cho từng bank

2. **Webhook thay vì Cron**
   - Nhận thông báo real-time từ ngân hàng
   - Không cần polling, tiết kiệm API calls

3. **Smart Matching**
   - AI/ML để match giao dịch thông minh hơn
   - Xử lý nội dung chuyển khoản sai chính tả

4. **Notification**
   - Gửi email/SMS cho khách khi xác nhận
   - Thông báo admin khi có lỗi

---

## 📞 HỖ TRỢ

- **API Provider**: https://api.sieuthicode.net/support
- **Documentation**: https://docs.sieuthicode.net/acb-history
- **Email**: support@sieuthicode.net

---

**Cập nhật lần cuối:** 30/04/2026
