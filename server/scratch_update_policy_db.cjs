const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const newPolicyConfig = {
  title: "CHÍNH SÁCH ĐẠI LÝ TOÀN QUỐC",
  desc: "CÔNG TY TNHH SẢN XUẤT VÀ THƯƠNG MẠI GC NATURE",
  sections: [
    {
      title: "Giới thiệu thương hiệu",
      content: "GC Nature - Sự chăm sóc toàn diện (GC 네이처 - 온전한 케어) là thương hiệu nhập khẩu và thương mại các dòng mỹ phẩm Hàn Quốc số 1 Việt Nam với sứ mệnh đem những sản phẩm mỹ phẩm chính hãng tốt nhất tới tay người tiêu dùng Việt Nam. Được thành lập bởi các Chuyên gia kinh doanh Mỹ Phẩm Hàn Quốc với hơn 10 năm kinh nghiệm, chúng tôi có sứ mệnh đưa những dòng sản phẩm tốt nhất, hiệu quả và an toàn nhất từ các nước với công nghệ sản xuất hóa mỹ phẩm hàng đầu tại Hàn Quốc và các nước phát triển.\n\nCác dòng sản phẩm của GC Nature là những sản phẩm liên tục lọt TOP bán chạy và tìm kiếm trên Coupang, Olive Young, TOP tìm kiếm trên Naver, được cộng đồng nghệ sỹ Hàn Quốc dùng và feedback uy tín."
    }
  ],
  tabsConfig: {
    npp: {
      name: "Nhà phân phối (NPP)",
      partnerStandard: "Có mặt bằng kinh doanh\nCó văn phòng kinh doanh",
      requiredDocs: "Giấy phép kinh doanh, Thông tin liên hệ, Địa điểm kinh doanh",
      requiredImport: "Đơn hàng tối thiểu 50.000.000 VNĐ",
      discount: "55%",
      bonus: "Doanh số từ 50-100 triệu/quý: Thưởng 5%.\nDoanh số từ 100tr - 200 triệu/quý: Thưởng 6%\nDoanh số > 200 triệu/quý: Thưởng 8% + Tour du lịch Hàn Quốc",
      revenueGuarantee: "Được quyền tham gia",
      onlineSale: "Website và Google map",
      exclusive: "Được mở showroom, cửa hàng, thương mại điện tử",
      csmSupport: "Có chuyên gia y dược & Hỗ trợ tổ chức sự kiện hàng tháng",
      mediaSupport: "Cung cấp tư liệu Marketing, hình ảnh sản phẩm, nội dung quảng cáo, và video đào tạo sản phẩm.",
      training: "Tổ chức các buổi huấn luyện về kiến thức sản phẩm, kỹ năng tư vấn khách hàng, và cập nhật xu hướng làm đẹp mới nhất.",
      branding: "Cấp thư ủy quyền phân phối chính thức từ GC Nature.",
      debt: "Thỏa thuận công nợ linh hoạt"
    },
    bs: {
      name: "Bác sĩ chuyên môn (BS)",
      partnerStandard: "Có phòng khám/cơ sở trị liệu chuyên môn hoặc mặt bằng kinh doanh",
      requiredDocs: "Giấy phép kinh doanh, Chứng chỉ hành nghề y/dược, Thông tin liên hệ",
      requiredImport: "Đơn hàng tối thiểu 10.000.000 VNĐ",
      discount: "50%",
      bonus: "Doanh số từ 50-100 triệu/quý: Thưởng 5%.\nDoanh số từ 100tr - 200 triệu/quý: Thưởng 6%\nDoanh số > 200 triệu/quý: Thưởng 8% + Tour du lịch Hàn Quốc",
      revenueGuarantee: "Được quyền tham gia",
      onlineSale: "Website và Google map chính hãng",
      exclusive: "Được mở showroom, cửa hàng, thương mại điện tử phân phối",
      csmSupport: "Có chuyên gia y dược & Hỗ trợ tổ chức sự kiện hàng tháng",
      mediaSupport: "Cung cấp tư liệu Marketing chuyên sâu, hình ảnh lâm sàng, nội dung khoa học, và video đào tạo sản phẩm.",
      training: "Tổ chức huấn luyện lâm sàng về hoạt chất, cơ chế sản phẩm và cập nhật kiến thức y khoa thẩm mỹ.",
      branding: "Cấp chứng nhận ủy quyền chuyên gia đối tác da liễu & Standee chính hãng.",
      debt: "Thỏa thuận công nợ linh hoạt"
    },
    c1: {
      name: "Đại lý cấp 1",
      partnerStandard: "Có mặt bằng hoặc kênh kinh doanh mỹ phẩm hoạt động ổn định",
      requiredDocs: "Giấy phép kinh doanh/Thông tin cá nhân, Địa điểm kinh doanh",
      requiredImport: "Đơn hàng tối thiểu 10.000.000 VNĐ",
      discount: "45%",
      bonus: "Doanh số từ 50-100 triệu/quý: Thưởng 5%.\nDoanh số từ 100tr - 200 triệu/quý: Thưởng 6%\nDoanh số > 200 triệu/quý: Thưởng 8% + Tour du lịch Hàn Quốc",
      revenueGuarantee: "Không hỗ trợ",
      onlineSale: "Website và Google map hệ thống",
      exclusive: "Được mở showroom, cửa hàng, bán hàng online thương mại điện tử",
      csmSupport: "Có chuyên gia y dược hỗ trợ tư vấn trực tuyến và sự kiện",
      mediaSupport: "Cung cấp tư liệu hình ảnh sản phẩm và nội dung bài viết mẫu.",
      training: "Hỗ trợ tài liệu đào tạo cơ bản về sản phẩm và phương pháp tư vấn.",
      branding: "Cấp giấy chứng nhận đại lý chính hãng cấp 1 & Standee thương hiệu.",
      debt: "Thỏa thuận thanh toán trước"
    },
    c2: {
      name: "Đại lý cấp 2",
      partnerStandard: "Có shop mỹ phẩm, spa nhỏ hoặc kênh bán hàng online cá nhân",
      requiredDocs: "Thông tin liên hệ, Kênh bán hàng chi tiết",
      requiredImport: "Đơn hàng tối thiểu 5.000.000 VNĐ",
      discount: "40%",
      bonus: "Doanh số từ 50-100 triệu/quý: Thưởng 5%.\nDoanh số từ 100tr - 200 triệu/quý: Thưởng 6%\nDoanh số > 200 triệu/quý: Thưởng 8% + Tour du lịch Hàn Quốc",
      revenueGuarantee: "Không hỗ trợ",
      onlineSale: "Website và định vị Google map",
      exclusive: "Được mở showroom, cửa hàng, bán lẻ tại khu vực",
      csmSupport: "Không áp dụng hỗ trợ sự kiện riêng biệt",
      mediaSupport: "Cung cấp tư liệu hình ảnh sản phẩm cơ bản.",
      training: "Hỗ trợ tài liệu hướng dẫn sử dụng sản phẩm cơ bản.",
      branding: "Cấp giấy chứng nhận đại lý chính hãng cấp 2.",
      debt: "Thanh toán 100% trước khi giao hàng"
    }
  },
  updatedAt: new Date().toISOString(),
  seoTitle: "Chính Sách Đại Lý GC Nature Toàn Quốc | Mỹ Phẩm Hàn Quốc",
  seoDesc: "Chính sách hợp tác đại lý phân phối mỹ phẩm Hàn Quốc nhập khẩu chính hãng của GC Nature. Chiết khấu cao lên đến 55%, hỗ trợ Marketing toàn diện, đào tạo chuyên sâu.",
  seoKeywords: "GC Nature, đại lý mỹ phẩm, chính sách đại lý, nhập khẩu mỹ phẩm hàn quốc, phân phối mỹ phẩm"
};

async function updatePolicy() {
  try {
    const updated = await prisma.settings.upsert({
      where: { key: 'page_agent_policy' },
      update: {
        value: JSON.stringify(newPolicyConfig),
        updated_at: new Date()
      },
      create: {
        key: 'page_agent_policy',
        value: JSON.stringify(newPolicyConfig),
        updated_at: new Date()
      }
    });
    console.log("Successfully updated page_agent_policy database record with the new bonus program for all levels!");
  } catch (error) {
    console.error("Error updating database record:", error);
  } finally {
    await prisma.$disconnect();
  }
}

updatePolicy();
