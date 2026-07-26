/**
 * Branding helpers
 * Stores admin-customizable logo settings (desktop / mobile, light / dark variants)
 * in localStorage AND syncs to the server so ALL devices see the same branding.
 *
 * Empty string for any logo field means "use the bundled default" — the Header is
 * responsible for falling back to its own imported defaults.
 */
import logoWhiteDefault from "@/assets/logo/logowhite.png";
import logoBlackDefault from "@/assets/logo/logoBlack.png";
import { API_BASE_URL } from "@/lib/config";

export const BRANDING_STORAGE_KEY = "gcnature_branding";
export const BRANDING_UPDATED_EVENT = "gcnature:branding-updated";

/** Resolved fallback URLs for components that want a non-empty value */
export const builtInLogos = {
  light: logoWhiteDefault,
  dark: logoBlackDefault,
};

export interface BrandingSettings {
  /** Logo on dark/red header (desktop). Empty = use bundled default */
  logoLight: string;
  /** Logo on light/dark theme (desktop). Empty = use bundled default */
  logoDark: string;
  /** Optional override for mobile header — empty falls back to logoLight (or bundled default) */
  logoLightMobile: string;
  /** Optional override for mobile header — empty falls back to logoDark (or bundled default) */
  logoDarkMobile: string;
  /** Optional tagline shown under the logo in header (empty = hide) */
  tagline: string;
  /** Logo height in px on desktop header */
  logoHeightDesktop: number;
  /** Logo height in px on mobile header (top red bar) */
  logoHeightMobile: number;
  /** Logo height in px in mobile sidebar header */
  logoHeightSidebar: number;
  /** Background style of mobile sidebar header: "red" (brand) or "white" (clean) */
  sidebarHeaderStyle: "red" | "white";
  /** Height of the top mobile header bar (red bar) in px */
  headerHeightMobile: number;
  /** Height of the top desktop header bar in px */
  headerHeightDesktop: number;
}

export const defaultBranding: BrandingSettings = {
  logoLight: "",
  logoDark: "",
  logoLightMobile: "",
  logoDarkMobile: "",
  tagline: "Sự chăm sóc toàn diện",
  logoHeightDesktop: 80,
  logoHeightMobile: 64,
  logoHeightSidebar: 64,
  sidebarHeaderStyle: "white",
  headerHeightMobile: 68,
  headerHeightDesktop: 88,
};

function sanitize(parsed: Partial<BrandingSettings>): BrandingSettings {
  // Migrate ugly default Vite import paths from older versions to empty
  const isViteAssetPath = (s?: string) =>
    !!s && (s.startsWith("/src/assets/") || s.includes("/assets/logo/logowhite") || s.includes("/assets/logo/logoBlack"));
  if (isViteAssetPath(parsed.logoLight)) parsed.logoLight = "";
  if (isViteAssetPath(parsed.logoDark)) parsed.logoDark = "";
  if (isViteAssetPath(parsed.logoLightMobile)) parsed.logoLightMobile = "";
  if (isViteAssetPath(parsed.logoDarkMobile)) parsed.logoDarkMobile = "";
  // Migrate old defaults so existing users get the bigger / synced sizes
  if (parsed.logoHeightMobile === 56) parsed.logoHeightMobile = defaultBranding.logoHeightMobile;
  if (parsed.logoHeightSidebar === 56 || parsed.logoHeightSidebar === 80) parsed.logoHeightSidebar = defaultBranding.logoHeightSidebar;
  return { ...defaultBranding, ...parsed };
}

export function getBranding(): BrandingSettings {
  try {
    const saved = localStorage.getItem(BRANDING_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as Partial<BrandingSettings>;
      return sanitize(parsed);
    }
  } catch {}
  return defaultBranding;
}

export function saveBranding(b: BrandingSettings) {
  localStorage.setItem(BRANDING_STORAGE_KEY, JSON.stringify(b));
  window.dispatchEvent(new Event(BRANDING_UPDATED_EVENT));
}

/**
 * Save branding to the server so ALL devices see the same branding.
 * Also saves to localStorage for immediate local effect.
 */
export async function saveBrandingToServer(b: BrandingSettings): Promise<boolean> {
  saveBranding(b); // immediate local effect
  try {
    const token = localStorage.getItem("token");
    if (!token) return false;
    const res = await fetch(`${API_BASE_URL}/settings`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ branding: JSON.stringify(b) }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Fetch branding from the server and update localStorage.
 * Called on page load so all devices get the latest branding.
 */
export async function fetchBrandingFromServer(): Promise<BrandingSettings> {
  try {
    const res = await fetch(`${API_BASE_URL}/settings/branding`);
    if (res.ok) {
      const data = await res.json();
      if (data && typeof data === "object" && data.logoLight !== undefined) {
        const b = sanitize(data);
        localStorage.setItem(BRANDING_STORAGE_KEY, JSON.stringify(b));
        window.dispatchEvent(new Event(BRANDING_UPDATED_EVENT));
        return b;
      }
    }
  } catch {}
  // Fall back to localStorage if server is unavailable
  return getBranding();
}

/**
 * Resolve a branding settings record into a guaranteed-non-empty set of URLs
 * to render. Components should prefer this helper over reading the raw fields.
 */
export function resolveBranding(b: BrandingSettings) {
  const logoLight = b.logoLight || builtInLogos.light;
  const logoDark = b.logoDark || builtInLogos.dark;
  return {
    ...b,
    logoLight,
    logoDark,
    logoLightMobile: b.logoLightMobile || logoLight,
    logoDarkMobile: b.logoDarkMobile || logoDark,
  };
}
