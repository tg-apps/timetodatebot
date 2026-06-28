declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly TOKEN?: string;
      readonly DB_FILE_NAME?: string;
    }
  }
}

export {};
