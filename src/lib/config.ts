const env = import.meta.env;

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");

export const SITE_URL = trimTrailingSlash(env.VITE_SITE_URL || "https://gcnature.com.vn");
export const API_BASE_URL = env.VITE_API_BASE_URL || "/api";

export const GOOGLE_CLIENT_ID =
  env.VITE_GOOGLE_CLIENT_ID ||
  "671275324232-jedlb9gmfkj2n44dbcc5rgvcvlb1s936.apps.googleusercontent.com";

export const BANK_CODE = env.VITE_BANK_CODE || "ACB";
export const BANK_ACCOUNT = env.VITE_BANK_ACCOUNT || "24488671";
export const BANK_ACCOUNT_NAME = env.VITE_BANK_ACCOUNT_NAME || "MAI XUAN ANH";
export const VIETQR_TEMPLATE = env.VITE_VIETQR_TEMPLATE || "compact2";
export const VIETQR_BASE_URL = trimTrailingSlash(env.VITE_VIETQR_BASE_URL || "https://img.vietqr.io/image");

export const ZALO_URL = env.VITE_ZALO_URL || "https://zalo.me/0559869392";
export const HOTLINE = env.VITE_HOTLINE || "0559869392";
export const CONTACT_EMAIL = env.VITE_CONTACT_EMAIL || "gcnatureofficial@gmail.com";

export const BANK_HISTORY_API_PATH = "/bank/history";

export function makeSiteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalizedPath}`;
}

export function makeVietQrUrl(amount: number, addInfo: string) {
  const params = new URLSearchParams({
    amount: String(amount),
    addInfo,
    accountName: BANK_ACCOUNT_NAME,
  });

  return `${VIETQR_BASE_URL}/${BANK_CODE}-${BANK_ACCOUNT}-${VIETQR_TEMPLATE}.png?${params.toString()}`;
}
