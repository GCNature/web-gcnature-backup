import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Radio, Save, ExternalLink, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function AdminLivestream() {
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [shopeeUrl, setShopeeUrl] = useState("");
  const [tiktokUrl, setTiktokUrl] = useState("");

  // Load current livestream settings
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/settings", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        if (data.livestream) {
          try {
            const ls = JSON.parse(data.livestream);
            setShopeeUrl(ls.shopeeUrl || "");
            setTiktokUrl(ls.tiktokUrl || "");
          } catch {}
        }
      } catch (err) {
        console.error("Load livestream settings failed:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          livestream: JSON.stringify({
            shopeeUrl: shopeeUrl.trim(),
            tiktokUrl: tiktokUrl.trim(),
          }),
        }),
      });
      if (res.ok) {
        toast.success(
          shopeeUrl.trim() || tiktokUrl.trim()
            ? "🟢 Đã bật nút Live trên trang chủ!"
            : "⚪ Đã tắt nút Live trên trang chủ."
        );
      } else {
        toast.error("Có lỗi xảy ra");
      }
    } catch {
      toast.error("Không thể kết nối server");
    } finally {
      setSaving(false);
    }
  };

  const handleClearAll = async () => {
    setShopeeUrl("");
    setTiktokUrl("");
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          livestream: JSON.stringify({ shopeeUrl: "", tiktokUrl: "" }),
        }),
      });
      if (res.ok) {
        toast.success("⚪ Đã xóa tất cả link — nút Live ẩn trên trang chủ");
      }
    } catch {
      toast.error("Lỗi khi xóa");
    } finally {
      setSaving(false);
    }
  };

  const isLive = !!(shopeeUrl.trim() || tiktokUrl.trim());

  return (
    <AdminLayout title="Quản lý Livestream">
      <div className="max-w-3xl space-y-6">
        {/* Status banner */}
        <div
          className={`rounded-xl p-4 flex items-center gap-3 border ${
            isLive
              ? "bg-green-50 border-green-200"
              : "bg-gray-50 border-gray-200"
          }`}
        >
          {isLive ? (
            <>
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
              </span>
              <div>
                <p className="text-sm font-bold text-green-800">
                  🔴 Đang LIVE — Nút "Săn Deal trên Live" đang hiện trên trang chủ
                </p>
                <p className="text-xs text-green-600 mt-0.5">
                  Khách hàng có thể nhìn thấy và click vào link phòng live
                </p>
              </div>
            </>
          ) : (
            <>
              <span className="relative flex h-3 w-3">
                <span className="relative inline-flex rounded-full h-3 w-3 bg-gray-400" />
              </span>
              <div>
                <p className="text-sm font-bold text-gray-600">
                  ⚪ Chưa live — Nút ẩn trên trang chủ
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Paste link phòng live vào bên dưới rồi bấm "Lên Live"
                </p>
              </div>
            </>
          )}
        </div>

        {/* Hướng dẫn */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Radio className="w-5 h-5 text-red-500" />
              Hướng dẫn nhanh
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-2 text-sm text-red-800">
              <p>
                <strong>📱 Bước 1:</strong> Mở app Shopee/TikTok → Bắt đầu phiên Live
              </p>
              <p>
                <strong>🔗 Bước 2:</strong> Copy link phòng live → Paste vào ô bên dưới
              </p>
              <p>
                <strong>💾 Bước 3:</strong> Bấm <strong>"Lên Live"</strong> → Nút sẽ tự hiện trên trang chủ
              </p>
              <p>
                <strong>🛑 Khi xuống live:</strong> Bấm <strong>"Xuống Live"</strong> → Nút sẽ tự ẩn đi
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Link inputs */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Link phòng Live</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Shopee Live */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-semibold">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#ee4d2d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7l.867 12.143a2 2 0 0 0 2 1.857h10.276a2 2 0 0 0 2 -1.857l.867 -12.143h-16z" /><path d="M8.5 7c0 -1.653 1.5 -4 3.5 -4s3.5 2.347 3.5 4" /><path d="M9.5 17c.413 .462 1 1 2.5 1s2.5 -.897 2.5 -2s-1 -1.5 -2.5 -2s-2 -1.47 -2 -2c0 -1.104 1 -2 2 -2s1.5 0 2.5 1" /></svg>
                Shopee Live
              </Label>
              <div className="flex gap-2">
                <Input
                  value={shopeeUrl}
                  onChange={(e) => setShopeeUrl(e.target.value)}
                  placeholder="https://shopee.vn/... (để trống nếu không live Shopee)"
                  className="flex-1"
                />
                {shopeeUrl && (
                  <a
                    href={shopeeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-2 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 text-xs font-medium transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Mở
                  </a>
                )}
              </div>
              {shopeeUrl && (
                <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                  Sẽ hiện nút "Xem Live trên Shopee" trên trang chủ
                </p>
              )}
            </div>

            {/* TikTok Live */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-semibold">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#000">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.86a8.28 8.28 0 0 0 4.76 1.5V6.83a4.83 4.83 0 0 1-1-.14z" />
                </svg>
                TikTok Live
              </Label>
              <div className="flex gap-2">
                <Input
                  value={tiktokUrl}
                  onChange={(e) => setTiktokUrl(e.target.value)}
                  placeholder="https://www.tiktok.com/@.../live (để trống nếu không live TikTok)"
                  className="flex-1"
                />
                {tiktokUrl && (
                  <a
                    href={tiktokUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs font-medium transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Mở
                  </a>
                )}
              </div>
              {tiktokUrl && (
                <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                  Sẽ hiện nút "Xem Live trên TikTok" trên trang chủ
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action buttons */}
        <div className="flex items-center gap-3">
          <Button
            onClick={handleSave}
            disabled={saving}
            className={`gap-2 flex-1 py-6 text-base font-bold ${
              isLive
                ? "bg-red-600 hover:bg-red-700"
                : "bg-gray-400 hover:bg-gray-500"
            }`}
          >
            {isLive ? (
              <>
                <Radio className="w-5 h-5" />
                {saving ? "Đang lưu..." : "🔴 Lên Live"}
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                {saving ? "Đang lưu..." : "Lưu (chưa có link)"}
              </>
            )}
          </Button>

          {isLive && (
            <Button
              variant="outline"
              onClick={handleClearAll}
              disabled={saving}
              className="gap-2 py-6 text-base border-red-200 text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-5 h-5" />
              Xuống Live
            </Button>
          )}
        </div>

        {/* Schedule info */}
        <div className="text-center text-sm text-gray-500 pb-4">
          📅 Lịch live đều đặn: <strong>20h - 00h mỗi ngày</strong>
        </div>
      </div>
    </AdminLayout>
  );
}
