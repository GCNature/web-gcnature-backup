import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiGet, apiPut } from '@/lib/api';
import { toast } from 'sonner';

export interface FloatingButton {
  id: string;
  title: string;
  type: 'call' | 'zalo' | 'messenger' | 'custom';
  url: string;
  icon?: string; // Lucide icon name or image URL
  bgColor?: string;
  enabled: boolean;
}

export interface HeaderConfig {
  announcementText: string;
  announcementLink: string;
  hotline: string;
  logoUrl: string;
  showFlashSaleBadge: boolean;
  showHotProgramBadge: boolean;
}

export interface FooterConfig {
  companyName: string;
  addressHCM: string;
  addressHN: string;
  email: string;
  taxCode: string;
  copyrightText: string;
}

export interface SocialLinks {
  facebook: string;
  facebookGroup: string;
  instagram: string;
  threads: string;
  youtube: string;
  pinterest: string;
  tiktok: string;
}

export interface SiteConfig {
  header: HeaderConfig;
  footer: FooterConfig;
  social: SocialLinks;
  floatingButtons: FloatingButton[];
}

const defaultSiteConfig: SiteConfig = {
  header: {
    announcementText: "⚡ MỸ PHẨM HÀN QUỐC CHÍNH HÃNG - GIAO HÀNG TOÀN QUỐC",
    announcementLink: "/flash-sale",
    hotline: "0559869392",
    logoUrl: "/logo.png",
    showFlashSaleBadge: true,
    showHotProgramBadge: true
  },
  footer: {
    companyName: "CÔNG TY TNHH MỸ PHẨM GCNATURE KOREA",
    addressHCM: "36 đường số 5 KĐT Vạn Phúc, Thủ Đức, HCM",
    addressHN: "S1.06 Vinsmart City, Nam Từ Liêm, Hà Nội",
    email: "gcnatureofficial@gmail.com",
    taxCode: "0316889988",
    copyrightText: "© 2026 GCnature Korea. Tất cả quyền được bảo lưu."
  },
  social: {
    facebook: "https://www.facebook.com/GCnature",
    facebookGroup: "https://facebook.com/groups/koreacosmetics/",
    instagram: "https://www.instagram.com/gcnatureofficial/",
    threads: "https://www.threads.com/@gcnatureofficial",
    youtube: "https://www.youtube.com/@GCnatureOfficial",
    pinterest: "https://www.pinterest.com/gcnaturekorea/",
    tiktok: "https://www.tiktok.com/@gcnature.com.vn"
  },
  floatingButtons: [
    {
      id: "messenger",
      title: "Chat Messenger",
      type: "messenger",
      url: "https://m.me/1060662693798459",
      icon: "https://upload.wikimedia.org/wikipedia/commons/b/be/Facebook_Messenger_logo_2020.svg",
      bgColor: "#0084FF",
      enabled: true
    },
    {
      id: "zalo",
      title: "Chat Zalo",
      type: "zalo",
      url: "https://zalo.me/0559869392",
      icon: "https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg",
      bgColor: "#0068FF",
      enabled: true
    },
    {
      id: "hotline",
      title: "Hotline: 0559.869.392",
      type: "call",
      url: "tel:0559869392",
      icon: "Phone",
      bgColor: "#5dc1d1",
      enabled: true
    }
  ]
};

interface SiteConfigContextType {
  config: SiteConfig;
  loading: boolean;
  updateConfig: (newConfig: SiteConfig) => Promise<boolean>;
  reloadConfig: () => Promise<void>;
}

const SiteConfigContext = createContext<SiteConfigContextType | undefined>(undefined);

export const SiteConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<SiteConfig>(defaultSiteConfig);
  const [loading, setLoading] = useState(true);

  const fetchConfig = async () => {
    try {
      const res = await apiGet('/settings/site-config');
      if (res.success && res.data) {
        setConfig((prev) => ({
          header: { ...prev.header, ...(res.data.header || {}) },
          footer: { ...prev.footer, ...(res.data.footer || {}) },
          social: { ...prev.social, ...(res.data.social || {}) },
          floatingButtons: Array.isArray(res.data.floatingButtons) && res.data.floatingButtons.length > 0 
            ? res.data.floatingButtons 
            : prev.floatingButtons
        }));
      }
    } catch (err) {
      console.log('Using default site config');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
    const handleSync = () => fetchConfig();
    window.addEventListener("site-config-updated", handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener("site-config-updated", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  const updateConfig = async (newConfig: SiteConfig): Promise<boolean> => {
    try {
      const res = await apiPut('/admin/settings/site-config', newConfig);
      if (res.success) {
        setConfig(newConfig);
        window.dispatchEvent(new Event("site-config-updated"));
        toast.success("Đã lưu và cập nhật giao diện ngay lập tức!");
        return true;
      } else {
        toast.error("Lưu cấu hình thất bại: " + (res.message || 'Lỗi không xác định'));
        return false;
      }
    } catch (err: any) {
      toast.error("Lỗi khi lưu cấu hình: " + (err.message || 'Lỗi kết nối'));
      return false;
    }
  };

  return (
    <SiteConfigContext.Provider value={{ config, loading, updateConfig, reloadConfig: fetchConfig }}>
      {children}
    </SiteConfigContext.Provider>
  );
};

export const useSiteConfig = () => {
  const context = useContext(SiteConfigContext);
  if (!context) {
    throw new Error('useSiteConfig must be used within a SiteConfigProvider');
  }
  return context;
};
