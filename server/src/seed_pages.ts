import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const defaultPagesData: Record<string, any> = {
  "page_about": {
    title: "Giới thiệu",
    desc: "GC Nature - Sự chăm sóc toàn diện (GC 네이처 - 온전한 케어) là thương hiệu nhập khẩu và thương mại các dòng mỹ phẩm Hàn Quốc số 1 Việt Nam.",
    sections: [
      {
        title: "Về thương hiệu GCnature",
        content: "GC Nature - Sự chăm sóc toàn diện (GC 네이처 - 온전한 케어) là thương hiệu nhập khẩu và thương mại các dòng mỹ phẩm Hàn Quốc số 1 Việt Nam với sứ mệnh đem những sản phẩm mỹ phẩm chính hãng tốt nhất tới tay người tiêu dùng Việt Nam."
      },
      {
        title: "Đội ngũ chuyên môn",
        content: "Được thành lập bởi các Chuyên gia kinh doanh Mỹ Phẩm Hàn Quốc với hơn 10 năm kinh nghiệm, chúng tôi có sứ mệnh đưa những dòng sản phẩm tốt nhất, hiệu quả và an toàn nhất từ các nước với công nghệ sản xuất hóa mỹ phẩm hàng đầu tại Hàn Quốc và các nước phát triển."
      },
      {
        title: "Độ uy tín & Khuyên dùng",
        content: "Các dòng sản phẩm của GC Nature là những sản phẩm liên tục lọt TOP bán chạy và tìm kiếm trên Coupang, Olive Young, TOP tìm kiếm trên Naver, được cộng đồng nghệ sỹ Hàn Quốc dùng và feedback uy tín."
      }
    ]
  },
  "page_faq": {
    title: "Câu hỏi thường gặp",
    desc: "Giải đáp các thắc mắc về mỹ phẩm Hàn Quốc nhập khẩu chính hãng tại GCnature.",
    sections: [
      {
        title: "Mỹ phẩm GCnature có phải chính hãng không?",
        content: "GCnature cam kết 100% sản phẩm phân phối đều được nhập khẩu chính ngạch trực tiếp từ Hàn Quốc, đầy đủ hóa đơn chứng từ, tem chống giả và giấy công bố chất lượng từ Bộ Y tế Việt Nam."
      },
      {
        title: "GCnature có tư vấn da trước khi mua không?",
        content: "Có, đội ngũ chuyên gia da liễu với hơn 10 năm kinh nghiệm của GCnature luôn sẵn sàng tư vấn miễn phí 24/7 để giúp bạn lựa chọn sản phẩm phù hợp nhất với loại da của mình qua Hotline/Zalo: 0559869392."
      },
      {
        title: "Chính sách đổi trả sản phẩm khi kích ứng như thế nào?",
        content: "GCnature cam kết đồng hành cùng bạn. Nếu gặp tình trạng kích ứng da (trong vòng 7 ngày kể từ khi mua), vui lòng liên hệ ngay qua Hotline 0559869392 để chúng tôi hỗ trợ đổi trả sản phẩm hoặc hướng dẫn xử lý phục hồi da kịp thời."
      },
      {
        title: "GCnature miễn phí giao hàng toàn quốc khi nào?",
        content: "GCnature miễn phí vận chuyển tiêu chuẩn toàn quốc cho mọi đơn hàng từ 500.000đ trở lên. Với đơn hàng dưới 500.000đ, phí ship đồng giá là 30.000đ."
      },
      {
        title: "Tôi có thể mua sản phẩm trực tiếp ở đâu?",
        content: "Quý khách có thể mua trực tiếp tại Showroom Hà Nội: S1.06 Vinsmart City, Tây Mỗ, Hà Nội; hoặc Showroom Hồ Chí Minh: 104 Nguyễn Thị Nhung, Vạn Phúc, Thủ Đức, TP.Hồ Chí Minh."
      }
    ]
  },
  "page_recruitment": {
    title: "Tuyển Dụng",
    desc: "Gia nhập đội ngũ GCnature - Cùng chúng tôi mang đến những dòng mỹ phẩm Hàn Quốc tốt nhất cho người tiêu dùng.",
    sections: [
      {
        title: "Vị trí đang mở tuyển",
        content: "Hiện tại chúng tôi chưa có vị trí tuyển dụng nào đang mở.\n\nHãy theo dõi trang này hoặc Fanpage của chúng tôi để cập nhật những thông tin tuyển dụng mới nhất trong tương lai."
      }
    ]
  },
  "page_agent_policy": {
    title: "CHÍNH SÁCH ĐẠI LÝ TOÀN QUỐC",
    desc: "CÔNG TY TNHH SẢN XUẤT VÀ THƯƠNG MẠI GC NATURE",
    sections: [
      {
        title: "Giới thiệu thương hiệu",
        content: "GC Nature - Sự chăm sóc toàn diện (GC 네이처 - 온전한 케어) là thương hiệu nhập khẩu và thương mại các dòng mỹ phẩm Hàn Quốc số 1 Việt Nam với sứ mệnh đem những sản phẩm mỹ phẩm chính hãng tốt nhất tới tay người tiêu dùng Việt Nam. Được thành lập bởi các Chuyên gia kinh doanh Mỹ Phẩm Hàn Quốc với hơn 10 năm kinh nghiệm, chúng tôi có sứ mệnh đưa những dòng sản phẩm tốt nhất, hiệu quả và an toàn nhất từ các nước với công nghệ sản xuất hóa mỹ phẩm hàng đầu tại Hàn Quốc và các nước phát triển.\n\nCác dòng sản phẩm của GC Nature là những sản phẩm liên tục lọt TOP bán chạy và tìm kiếm trên Coupang, Olive Young, TOP tìm kiếm trên Naver, được cộng đồng nghệ sỹ Hàn Quốc dùng và feedback uy tín."
      }
    ]
  },
  "page_policy_mua-hang": {
    title: "Chính sách mua hàng",
    desc: "GCnature hướng dẫn quy trình đặt mua mỹ phẩm Hàn Quốc chính hãng trực tuyến an toàn, thuận tiện.",
    sections: [
      {
        title: "Điều 1: Quy trình đặt mua sản phẩm",
        content: "1. Lựa chọn sản phẩm: Khách hàng truy cập website gcnature.com.vn để tìm kiếm và chọn lựa các sản phẩm theo nhu cầu (Kem chống nắng, dưỡng da, trang điểm, ampoule/siêu tinh chất...).\n2. Kiểm tra thông tin: Xem kỹ thông tin mô tả sản phẩm, giá bán niêm yết, chương trình khuyến mãi (Flash Sale nếu có) và thành phần của mỹ phẩm.\n3. Giỏ hàng và Thanh toán: Thêm sản phẩm vào giỏ hàng, điền đầy đủ thông tin giao hàng (Họ tên, Số điện thoại chính xác, Địa chỉ nhận hàng cụ thể) và tiến hành lựa chọn phương thức thanh toán."
      },
      {
        title: "Điều 2: Xác nhận đơn hàng & Xử lý vận chuyển",
        content: "1. Xác nhận tự động: Sau khi đặt hàng thành công, hệ thống sẽ gửi email hoặc liên hệ qua số điện thoại để xác nhận chi tiết đơn hàng.\n2. Đóng gói chuẩn y khoa: Sản phẩm mỹ phẩm của GCnature sẽ được bọc chống sốc cẩn thận, đóng gói kín nguyên seal và có kèm theo hóa đơn mua hàng cụ thể.\n3. Thời gian giao hàng: Giao hàng hỏa tốc trong 2h-4h tại khu vực nội thành TP.HCM và Hà Nội. Giao tiêu chuẩn toàn quốc trong vòng 2-4 ngày làm việc."
      },
      {
        title: "Điều 3: Quy định nhận hàng (Không đồng kiểm)",
        content: "1. Quy định không đồng kiểm: Nhằm đảm bảo tính bảo mật, nguyên vẹn và niêm phong của các dòng mỹ phẩm cao cấp trong quá trình vận chuyển, GCnature áp dụng chính sách KHÔNG ĐỒNG KIỂM khi nhận hàng.\n2. Quy trình nhận hàng: Khách hàng vui lòng thanh toán đơn hàng (đối với hình thức COD) hoặc ký xác nhận nhận kiện hàng nguyên vẹn niêm phong từ shipper trước khi khui mở.\n3. Quay video mở hộp: Sau khi nhận hàng thành công, khách hàng vui lòng quay video liên tục không cắt ghép trong suốt quá trình khui mở hộp giấy bên ngoài để kiểm tra số lượng và tình trạng sản phẩm dưỡng da bên trong. Đây là căn cứ duy nhất để GCnature hỗ trợ đổi trả/hoàn tiền nhanh chóng nếu có sự cố xảy ra."
      }
    ]
  },
  "page_policy_bao-mat": {
    title: "Chính sách bảo mật thông tin",
    desc: "GCnature cam kết bảo vệ tối đa quyền riêng tư và thông tin cá nhân của khách hàng khi mua sắm tại hệ thống.",
    sections: [
      {
        title: "Điều 1: Mục đích thu thập thông tin",
        content: "GCnature thu thập thông tin cá nhân (họ tên, số điện thoại, địa chỉ nhận hàng, email) nhằm:\n1. Xử lý đơn hàng, giao hàng tận nơi cho khách hàng.\n2. Tư vấn giải pháp chăm sóc da và giải đáp mọi thắc mắc của khách hàng.\n3. Cập nhật các ưu đãi, chương trình Flash Sale và tích lũy điểm thưởng thành viên."
      },
      {
        title: "Điều 2: Cam kết bảo mật quyền riêng tư",
        content: "1. Lưu trữ an toàn: Thông tin khách hàng được mã hóa và lưu trữ an toàn trên máy chủ bảo mật của GCnature, hạn chế tối đa các truy cập trái phép.\n2. Không chia sẻ bên thứ ba: Cam kết hoàn toàn không bán, trao đổi hay cung cấp thông tin của khách hàng cho bất kỳ bên thứ ba nào, ngoại trừ đối tác vận chuyển phục vụ cho việc chuyển phát đơn hàng.\n3. Giao dịch an toàn: Toàn bộ quá trình thanh toán trực tuyến đều được mã hóa qua cổng bảo mật SSL/TLS tiêu chuẩn quốc tế."
      }
    ]
  },
  "page_policy_thanh-toan": {
    title: "Chính sách thanh toán",
    desc: "GCnature cung cấp đa dạng phương thức thanh toán an toàn, linh hoạt cho mọi khách hàng.",
    sections: [
      {
        title: "Điều 1: Phương thức thanh toán được chấp nhận",
        content: "1. Thanh toán khi nhận hàng (COD): Khách hàng thanh toán tiền mặt trực tiếp cho shipper sau khi nhận kiện hàng nguyên vẹn niêm phong.\n2. Chuyển khoản ngân hàng qua VietQR: Chuyển khoản trực tiếp tới tài khoản ngân hàng của GCnature thông qua quét mã VietQR tự động điền sẵn số tiền và nội dung chuyển khoản trên hệ thống.\n3. Thanh toán qua ví điện tử MoMo hoặc thẻ Visa/Mastercard trực tuyến."
      },
      {
        title: "Điều 2: Quy định bảo mật thanh toán",
        content: "1. Hệ thống thanh toán trực tuyến tích hợp trên website đáp ứng tiêu chuẩn an toàn dữ liệu, mọi thông tin số thẻ tín dụng đều được xử lý mã hóa bảo mật và không được lưu trữ lại trên hệ thống của cửa hàng.\n2. Đối với các đơn hàng có giá trị lớn hoặc mua sỉ đại lý, khách hàng vui lòng thực hiện thanh toán chuyển khoản trước 100% để nhận được các mức chiết khấu ưu đãi tối đa theo quy định chính sách đại lý."
      }
    ]
  },
  "page_policy_khach-hang-than-thiet": {
    title: "Chính sách khách hàng thân thiết (GCnature Member)",
    desc: "Chương trình tích điểm và ưu đãi đặc quyền dành riêng cho khách hàng đồng hành lâu dài cùng mỹ phẩm GCnature.",
    sections: [
      {
        title: "Điều 1: Cơ chế tích lũy điểm thưởng (GC Point)",
        content: "1. Tỷ lệ quy đổi: Mỗi đơn hàng phát sinh, cứ mỗi 10.000đ thanh toán mua hàng thực tế sẽ được tích lũy 1 điểm GC Point.\n2. Giá trị quy đổi: 1 điểm GC Point tương đương với 100đ khi quy đổi sang mã giảm giá trực tiếp áp dụng cho các đơn hàng mua sắm kế tiếp."
      },
      {
        title: "Điều 2: Phân hạng thành viên và đặc quyền",
        content: "1. Hạng Bạc (Tích lũy dưới 500 điểm): Tích lũy điểm thưởng mặc định, nhận thông báo sớm nhất các chương trình Flash Sale hàng tháng.\n2. Hạng Vàng (Tích lũy từ 500 - 1500 điểm): Chiết khấu giảm trực tiếp 1% trên tổng hóa đơn mỗi khi mua hàng; nhận quà sinh nhật trị giá 200.000đ.\n3. Hạng Kim Cương (Tích lũy trên 1500 điểm): Chiết khấu giảm trực tiếp 3% trên tổng hóa đơn mua hàng; nhận quà sinh nhật trị giá 500.000đ; miễn phí giao hàng cho mọi đơn hàng không giới hạn giá trị tối thiểu; ưu tiên nhận hàng dùng thử (sample) của các dòng sản phẩm mới nhất từ Hàn Quốc."
      }
    ]
  },
  "page_policy_khieu-nai": {
    title: "Chính sách xử lý khiếu nại & Đổi trả",
    desc: "GCnature cam kết lắng nghe và xử lý mọi khiếu nại, sự cố đơn hàng một cách nhanh chóng, công bằng, bảo vệ quyền lợi tối đa của khách hàng.",
    sections: [
      {
        title: "Điều 1: Tiếp nhận khiếu nại",
        content: "GCnature sẵn sàng tiếp nhận khiếu nại của khách hàng qua các kênh chính thức sau:\n1. Hotline / Zalo tiếp nhận: 0559 869 392 (Hỗ trợ từ 9:00 - 21:30 hàng ngày).\n2. Email tiếp nhận: gcnatureofficial@gmail.com\n3. Thời hạn khiếu nại: Trong vòng 7 ngày làm việc kể từ thời điểm nhận hàng thành công ghi nhận trên hệ thống vận chuyển."
      },
      {
        title: "Điều 2: Các trường hợp được giải quyết đổi trả 100% miễn phí",
        content: "1. Lỗi sản phẩm từ nhà sản xuất: Hộp bị vỡ màng co, dung dịch bị rò rỉ do nắp vặn lỏng, đầu xịt bị hỏng, sản phẩm hết hạn sử dụng hoặc có dị vật bên trong.\n2. Lỗi giao nhầm hàng: Giao sai sản phẩm mỹ phẩm so với đơn đặt hàng (nhầm dòng sản phẩm, nhầm dung tích, nhầm thương hiệu).\n3. Hỏng hóc do vận chuyển: Sản phẩm bị bẹp rúm, vỡ nứt chai lọ thủy tinh do lỗi vận chuyển của shipper.\n4. Trường hợp kích ứng da: Nếu khách hàng sử dụng sản phẩm và gặp hiện tượng nổi mẩn đỏ, dị ứng, ngứa rát (yêu cầu cung cấp hình ảnh thực tế biểu hiện da và chẩn đoán kích ứng da từ cơ sở da liễu uy tín). GCnature sẽ thu hồi sản phẩm đã khui nắp (hao hụt không quá 10%) và hỗ trợ đổi sản phẩm khác phù hợp hơn hoặc hoàn tiền 100% cho quý khách."
      },
      {
        title: "Điều 3: Quy trình giải quyết khiếu nại",
        content: "1. Tiếp nhận & Xác minh: Khách hàng cung cấp mã đơn hàng, hình ảnh hoặc video mở hộp sản phẩm lỗi. Bộ phận CSKH sẽ phản hồi xác minh thông tin trong vòng 24h làm việc.\n2. Xử lý đổi trả/hoàn tiền: GCnature hỗ trợ thu hồi sản phẩm lỗi miễn phí tận nhà. Sản phẩm mới đổi trả sẽ được gửi đi ngay sau khi nhận được hàng lỗi hoàn trả.\n3. Thời gian hoàn tiền: Trong trường hợp hoàn tiền, tiền sẽ được chuyển khoản trả lại vào tài khoản ngân hàng của quý khách trong vòng 24h - 48h làm việc."
      }
    ]
  },
  "page_policy_oem": {
    title: "Chính sách hợp tác OEM nhà máy",
    desc: "GCnature cung cấp dịch vụ sản xuất, thiết kế, đóng gói và gia công mỹ phẩm Hàn Quốc chính hãng trọn gói theo yêu cầu (OEM/ODM).",
    sections: [
      {
        title: "Điều 1: Quy trình hợp tác gia công mỹ phẩm OEM",
        content: "1. Tiếp nhận và Phân tích yêu cầu: Khách hàng cung cấp thông tin chi tiết về sản phẩm cần gia công (Kem chống nắng, serum dưỡng da, son môi, mặt nạ, ampoule...), số lượng dự kiến và định hướng thương hiệu sản phẩm.\n2. Nghiên cứu và Phát triển (R&D): Đội ngũ chuyên gia R&D của GCnature phối hợp cùng các phòng Lab của nhà máy sản xuất hàng đầu Hàn Quốc phát triển công thức độc quyền, sản xuất mẫu thử (sample) và kiểm nghiệm tính an toàn.\n3. Thiết kế & Lựa chọn bao bì: Hỗ trợ trọn gói thiết kế bộ nhận diện thương hiệu sản phẩm, lựa chọn kiểu dáng chai lọ, bao bì hộp giấy cao cấp bắt kịp xu hướng thị trường làm đẹp tại Hàn Quốc và Việt Nam.\n4. Thủ tục pháp lý & Nhập khẩu: Hỗ trợ toàn bộ thủ tục pháp lý công bố mỹ phẩm, kiểm định chất lượng sản phẩm và thông quan nhập khẩu chính ngạch từ Hàn Quốc về Việt Nam bàn giao cho khách hàng."
      },
      {
        title: "Điều 2: Tiêu chuẩn chất lượng sản xuất nhà máy",
        content: "1. Đạt chuẩn CGMP quốc tế: Toàn bộ quá trình sản xuất và gia công mỹ phẩm được thực hiện trực tiếp tại các nhà máy đạt tiêu chuẩn thực hành tốt sản xuất mỹ phẩm (CGMP) hàng đầu tại Hàn Quốc.\n2. Nguồn nguyên liệu an toàn, lành tính: Cam kết 100% nguyên liệu sử dụng đều đạt chỉ số an toàn cao, có chứng nhận xuất xứ rõ ràng và được kiểm duyệt khắt khe bởi cơ quan y tế Hàn Quốc (KFDA).\n3. Công nghệ hiện đại bảo mật: Toàn bộ quy trình đóng gói, chiết rót tự động khép kín đảm bảo vô trùng hoàn toàn. Cam kết bảo mật tuyệt đối công thức và thông tin thương hiệu độc quyền của khách hàng."
      }
    ]
  },
  "page_policy_affiliate": {
    title: "Chính sách Affiliate (Tiếp thị liên kết)",
    desc: "Tham gia chương trình tiếp thị liên kết cùng GCnature để giới thiệu các sản phẩm mỹ phẩm Hàn Quốc chất lượng cao và nhận mức hoa hồng hấp dẫn.",
    sections: [
      {
        title: "Điều 1: Quy định tham gia tiếp thị liên kết",
        content: "1. Đối tượng tham gia: Mọi cá nhân, đối tác truyền thông, KOL/KOC, Beauty Blogger hoặc chính khách hàng của GCnature đều có thể đăng ký tài khoản tham gia tiếp thị liên kết miễn phí.\n2. Tạo link tiếp thị liên kết (Affiliate Link): Sau khi tài khoản được kích hoạt trên hệ thống, đối tác có thể tự tạo mã giới thiệu hoặc link liên kết độc quyền cho từng sản phẩm của GCnature.\n3. Cách thức vận hành: Chia sẻ link tiếp thị của bạn lên các mạng xã hội (Facebook, TikTok, Zalo, Instagram, Youtube...) hoặc website cá nhân. Khi khách hàng nhấn vào link và phát sinh đơn hàng thành công, hệ thống sẽ tự động ghi nhận doanh thu cho bạn."
      },
      {
        title: "Điều 2: Mức hoa hồng và Cơ chế thanh toán",
        content: "1. Tỷ lệ hoa hồng vượt trội: Nhận mức chiết khấu hoa hồng hấp dẫn từ 10% đến 20% trên giá trị thanh toán thực tế của mỗi đơn hàng thành công thông qua link giới thiệu của bạn.\n2. Cơ chế lưu giữ Cookie (30 ngày): Hệ thống áp dụng cơ chế ghi nhận cookie trong vòng 30 ngày theo quy tắc Last Click (đơn hàng được tính cho link click cuối cùng trước khi mua hàng).\n3. Đối soát & Đối chiếu doanh số: Doanh thu và hoa hồng được thống kê tự động theo thời gian thực (Realtime) trên trang quản lý tài khoản của bạn để đảm bảo tính minh bạch tối đa.\n4. Lịch thanh toán định kỳ: Hoa hồng tích lũy sẽ được đối soát và chuyển khoản trực tiếp vào tài khoản ngân hàng của đối tác vào ngày 15 hàng tháng (khi số dư đạt mức tối thiểu 200.000đ)."
      }
    ]
  },
  "page_reviews": {
    title: "Góc review",
    desc: "Đánh giá chân thực về mỹ phẩm GCnature từ các nhà sáng tạo nội dung và KOLs uy tín.",
    kols: [
      {
        id: "1",
        tiktokUrl: "https://www.tiktok.com/@mr.manhdora.macginhi",
        channelName: "mr.manhdora.macginhi",
        followers: "1.2M",
        specialty: "Mỹ phẩm & Chăm sóc da chuyên sâu",
        avatarUrl: "https://p16-sign-useast2a.tiktokcdn.com/tos-useast2a-avt-0068-giso/a699c2794eb84c9823e5950d60c49bcf~c5_100x100.jpeg?lk3s=30310797&nonce=31206&refresh_token=431e78a6ff607d79b97771ba82c94ca1&x-expires=1747310400&x-signature=8qH9Rn%2BvYnVrMeA%2FC8VJMGEQbhg%3D",
        videos: [
          {
            id: "1",
            videoId: "7616957685631683861",
            title: "Bí quyết dưỡng ẩm căng bóng Hàn Quốc"
          },
          {
            id: "2",
            videoId: "7616707469141740821",
            title: "Review kem chống nắng lọt top Olive Young"
          },
          {
            id: "3",
            videoId: "7616353847182675220",
            title: "Check var son kem lì GCnature"
          },
          {
            id: "4",
            videoId: "7578746935889104148",
            title: "Chu trình phục hồi da kích ứng mẩn đỏ"
          },
          {
            id: "5",
            videoId: "7578457567358192917",
            title: "Sữa rửa mặt dịu nhẹ thích hợp cho mọi loại da"
          }
        ]
      }
    ]
  }
};

async function main() {
  console.log('Seeding default static pages data...');
  for (const [key, value] of Object.entries(defaultPagesData)) {
    const existing = await prisma.settings.findUnique({
      where: { key }
    });

    if (!existing) {
      await prisma.settings.create({
        data: {
          key,
          value: JSON.stringify(value)
        }
      });
      console.log(`- Created setting for: ${key}`);
    } else {
      // Overwrite if it is currently empty, null, or not valid JSON
      let shouldOverwrite = false;
      if (!existing.value) {
        shouldOverwrite = true;
      } else {
        try {
          const parsed = JSON.parse(existing.value);
          // For page_reviews, overwrite if no kols
          if (key === "page_reviews") {
            if (!parsed.kols || parsed.kols.length === 0) shouldOverwrite = true;
          } else if (!parsed.sections || parsed.sections.length === 0) {
            shouldOverwrite = true;
          }
        } catch {
          shouldOverwrite = true;
        }
      }

      if (shouldOverwrite) {
        await prisma.settings.update({
          where: { key },
          data: {
            value: JSON.stringify(value)
          }
        });
        console.log(`- Updated (overwrote empty/invalid) setting for: ${key}`);
      } else {
        console.log(`- Skipped (already has content) setting for: ${key}`);
      }
    }
  }
  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
