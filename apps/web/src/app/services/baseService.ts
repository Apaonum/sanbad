import axios, { AxiosInstance, AxiosProgressEvent } from 'axios';
import { createBrowserClient } from '@supabase/ssr';

// Factory function แบบที่คุณคุ้นเคย
export const createService = (
  contentType?: string,
  uploadProgress?: (progressEvent: AxiosProgressEvent) => void,
  downloadProgress?: (progressEvent: AxiosProgressEvent) => void
): AxiosInstance => {
  const service = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  });

  // Request Interceptor
  service.interceptors.request.use(async (config) => {
    try {
      // 1. ใช้ Supabase SSR ดึง Token แทน MSAL
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
      }

      config.headers['Content-Type'] = contentType ?? 'application/json';
      if (uploadProgress) config.onUploadProgress = uploadProgress;
      if (downloadProgress) config.onDownloadProgress = downloadProgress;

      // ปล่อยเรื่อง Pagination และ Lang ให้เป็นหน้าที่ของ API แต่ละเส้นหรือ TanStack Query
    } catch (error) {
      console.error('Interceptor Request Error:', error);
    }
    return config;
  });

  // Response Interceptor
  service.interceptors.response.use(
    (response) => response,
    async (error) => {
      // ตรวจสอบว่ากำลังรันบน Browser (Client-side) ป้องกัน SSR Crash
      const isClient = typeof window !== 'undefined';

      if (error.response?.status === 500) {
        return Promise.reject(error.response.data?.message || 'Internal Server Error');
      } else if (error.response?.status === 401 && isClient) {
        // จัดการเมื่อ Token หมดอายุ หรือไม่ได้รับอนุญาต
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        await supabase.auth.signOut();
        window.location.href = '/login'; // หรือ '/th/login' ตาม i18n
      }
      
      return Promise.reject(error);
    }
  );

  return service;
};

// ส่งออก default instance
const baseService = createService();
export default baseService;