/// <reference types="vite/client" />

// Allow importing .md files as raw strings via ?raw suffix
declare module '*.md?raw' {
  const content: string;
  export default content;
}
