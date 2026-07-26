import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import ScrollToTop from "@/components/ScrollToTop";
import SEOHead from "@/components/SEOHead";
import { makeSiteUrl } from "@/lib/config";

const defaultFaqs = [
  {
    question: "Mỹ phẩm GCnature có phải chính hãng không?",
    answer: "GCnature cam kết 100% sản phẩm phân phối đều được nhập khẩu chính ngạch trực tiếp từ Hàn Quốc, đầy đủ hóa đơn chứng từ, tem chống giả và giấy công bố chất lượng từ Bộ Y tế Việt Nam."
  },
  {
    question: "GCnature có tư vấn da trước khi mua không?",
    answer: "Có, đội ngũ chuyên gia da liễu với hơn 10 năm kinh nghiệm của GCnature luôn sẵn sàng tư vấn miễn phí 24/7 để giúp bạn lựa chọn sản phẩm phù hợp nhất với loại da của mình qua Hotline/Zalo: 0898.273.899."
  },
  {
    question: "Chính sách đổi trả sản phẩm khi kích ứng như thế nào?",
    answer: "GCnature cam kết đồng hành cùng bạn. Nếu gặp tình trạng kích ứng da (trong vòng 7 ngày kể từ khi mua), vui lòng liên hệ ngay qua Hotline 0898.273.899 để chúng tôi hỗ trợ đổi trả sản phẩm hoặc hướng dẫn xử lý phục hồi da kịp thời."
  },
  {
    question: "GCnature miễn phí giao hàng toàn quốc khi nào?",
    answer: "GCnature miễn phí vận chuyển tiêu chuẩn toàn quốc cho mọi đơn hàng từ 500.000đ trở lên. Với đơn hàng dưới 500.000đ, phí ship đồng giá là 30.000đ."
  },
  {
    question: "Tôi có thể mua sản phẩm trực tiếp ở đâu?",
    answer: "Quý khách có thể mua trực tiếp tại các Showroom của GCnature: Showroom tại S1.06 Vinsmart City, Nam Từ Liêm, Hà Nội hoặc Showroom tại 36 đường số 5, Khu đô thị Vạn Phúc, Thủ Đức, TP.Hồ Chí Minh."
  }
];

const FAQ = () => {
  const [content, setContent] = useState<{
    title: string;
    desc: string;
    sections: { title: string; content: string }[];
    updatedAt?: string;
    seoTitle?: string;
    seoDesc?: string;
    seoKeywords?: string;
  } | null>(null);

  useEffect(() => {
    fetch('/api/settings/page/page_faq')
      .then(res => res.json())
      .then(data => {
        if (data && data.sections && data.sections.length > 0) {
          setContent(data);
        }
      })
      .catch(err => console.error("Load FAQ page error:", err));
  }, []);

  // Map database sections to FAQ structure: title -> question, content -> answer
  const faqList = content?.sections
    ? content.sections.map(sec => ({
        question: sec.title,
        answer: sec.content
      }))
    : defaultFaqs;

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <SEOHead
        title={content?.seoTitle || content?.title || "Câu hỏi thường gặp"}
        description={content?.seoDesc || content?.desc || "Giải đáp các thắc mắc về mỹ phẩm Hàn Quốc nhập khẩu chính hãng tại GCnature."}
        keywords={content?.seoKeywords || ""}
        canonical={makeSiteUrl("/faq")}
      />
      <Header />

      <main>
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-black text-center mb-8 text-gray-900">
              {content?.title || "Câu hỏi thường gặp"}
            </h1>
            {content?.desc && (
              <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto text-base md:text-lg font-medium">
                {content.desc}
              </p>
            )}
            
            <div className="space-y-4">
              {faqList.map((faq, index) => (
                <details key={index} className="group border border-border rounded-lg bg-card overflow-hidden">
                  <summary className="font-semibold text-foreground px-6 py-4 cursor-pointer list-none flex justify-between items-center hover:bg-muted/50 transition-colors">
                    {faq.question}
                    <span className="transition group-open:rotate-180">
                      <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24">
                        <path d="M6 9l6 6 6-6"></path>
                      </svg>
                    </span>
                  </summary>
                  <div className="px-6 pb-4 text-muted-foreground border-t border-border mt-2 pt-4 whitespace-pre-line">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
            {content?.updatedAt && (
              <div className="text-right text-xs text-gray-400 italic mt-8 border-t pt-4">
                Cập nhật ngày: {new Date(content.updatedAt).toLocaleDateString('vi-VN')}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
      <BottomNav />
      <ScrollToTop />
    </div>
  );
};

export default FAQ;
