export { cn } from "cn"

// Environments named prod* are read-only in this app; the server check in
// [envName]/index.astro is the real protection, the UI just mirrors it.
export const isReadOnlyEnv = (envName: string) =>
  envName.toLowerCase().startsWith("prod")
