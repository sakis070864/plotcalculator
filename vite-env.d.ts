/// <reference types="vite/client" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly API_KEY: string;
    readonly ADMIN_EMAIL: string;
    readonly ADMIN_PASSWORD: string;
  }
}
