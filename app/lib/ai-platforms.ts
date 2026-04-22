/**
 * Indexora — AI Platform Referrer Mapping
 * Single source of truth for AI referrer domain detection.
 */

export interface AiPlatformInfo {
  domain: string;
  platform: string;
  icon: string;
  color: string;
  botName?: string;
}

export const AI_REFERRERS: Record<string, string> = {
  "chatgpt.com": "ChatGPT",
  "chat.openai.com": "ChatGPT",
  "gemini.google.com": "Gemini",
  "perplexity.ai": "Perplexity",
  "copilot.microsoft.com": "Copilot",
  "claude.ai": "Claude",
  "you.com": "You.com",
};

export const AI_PLATFORMS: AiPlatformInfo[] = [
  {
    domain: "chatgpt.com",
    platform: "ChatGPT",
    icon: "🤖",
    color: "#10a37f",
    botName: "GPTBot / ChatGPT-User",
  },
  {
    domain: "gemini.google.com",
    platform: "Gemini",
    icon: "✨",
    color: "#4285f4",
    botName: "Google-Extended",
  },
  {
    domain: "perplexity.ai",
    platform: "Perplexity",
    icon: "🔍",
    color: "#20b2aa",
    botName: "PerplexityBot",
  },
  {
    domain: "copilot.microsoft.com",
    platform: "Copilot",
    icon: "🪟",
    color: "#0078d4",
    botName: "bingbot",
  },
  {
    domain: "claude.ai",
    platform: "Claude",
    icon: "🧠",
    color: "#cc785c",
    botName: "ClaudeBot",
  },
  {
    domain: "you.com",
    platform: "You.com",
    icon: "🔎",
    color: "#6366f1",
    botName: "YouBot",
  },
];

export const AI_CRAWLER_BOTS = [
  { name: "GPTBot", platform: "ChatGPT", userAgent: "GPTBot" },
  { name: "ChatGPT-User", platform: "ChatGPT", userAgent: "ChatGPT-User" },
  { name: "Google-Extended", platform: "Gemini", userAgent: "Google-Extended" },
  { name: "CCBot", platform: "Claude", userAgent: "CCBot" },
  { name: "PerplexityBot", platform: "Perplexity", userAgent: "PerplexityBot" },
  { name: "bingbot", platform: "Copilot", userAgent: "bingbot" },
];

export function getPlatformFromReferrer(referrer: string): string | null {
  for (const [domain, platform] of Object.entries(AI_REFERRERS)) {
    if (referrer.includes(domain)) {
      return platform;
    }
  }
  return null;
}

export function getPlatformColor(platform: string): string {
  const info = AI_PLATFORMS.find((p) => p.platform === platform);
  return info?.color ?? "#6b7280";
}
