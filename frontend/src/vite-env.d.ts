/// <reference types="vite/client" />
export { };

declare global {
    interface Window {
        RUNTIME_ENV: {
            VITE_API_URL?: string;
            DATABASE_URL?: string;
            GOOGLE_PLACES_API_KEY?: string;
            GOOGLE_PLACES_RADIUS?: string | number;
            VITE_OTP_CODE?: string | number;
            VITE_OTP_FORMAT?: string;
        };
    }
}