// src/environment.ts

interface Env {
    VITE_API_URL?: string;
    VITE_OTP_FORMAT?: string;
}

const runtimeEnv = typeof window !== 'undefined' ? window.RUNTIME_ENV ?? {} : {};

export const env: Env = {
    VITE_API_URL: runtimeEnv.VITE_API_URL ?? import.meta.env.VITE_API_URL,
    VITE_OTP_FORMAT: runtimeEnv.VITE_OTP_FORMAT ?? import.meta.env.VITE_OTP_FORMAT,
};
