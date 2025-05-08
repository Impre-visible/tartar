/// <reference types="vite/client" />
export { };

declare global {
    interface Window {
        RUNTIME_ENV: {
            VITE_API_URL?: string;
            VITE_OTP_FORMAT?: string;
        };
    }
}