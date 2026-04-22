/**
 * Indexora — Readiness Calculator
 * Scores LLM items 0-100 for AI crawler readiness.
 */

export interface ReadinessResult {
  score: number;
  level: "High" | "Medium" | "Low";
  breakdown: Record<string, number>;
}

interface ItemFields {
  title?: string | null;
  description?: string | null;
  bodyHtml?: string | null;
  featuredImageUrl?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  tags?: string | null;
  price?: string | null;
  category?: string | null;
  trafficVolume?: number;
}

export function calculateReadiness(item: ItemFields): ReadinessResult {
  const breakdown: Record<string, number> = {};
  let score = 0;

  // Title quality (15 pts)
  const titleLen = item.title?.length ?? 0;
  if (titleLen > 50) breakdown.title = 15;
  else if (titleLen > 30) breakdown.title = 10;
  else if (titleLen > 10) breakdown.title = 5;
  else breakdown.title = 0;
  score += breakdown.title;

  // Description quality (25 pts)
  const descText = item.description || item.bodyHtml?.replace(/<[^>]*>/g, "") || "";
  const descLen = descText.length;
  if (descLen > 200) breakdown.description = 25;
  else if (descLen > 100) breakdown.description = 18;
  else if (descLen > 50) breakdown.description = 10;
  else breakdown.description = 0;
  score += breakdown.description;

  // Featured image (15 pts)
  breakdown.image = item.featuredImageUrl ? 15 : 0;
  score += breakdown.image;

  // SEO title (10 pts)
  const seoTitleLen = item.seoTitle?.length ?? 0;
  breakdown.seoTitle = seoTitleLen > 20 ? 10 : seoTitleLen > 0 ? 5 : 0;
  score += breakdown.seoTitle;

  // SEO description (10 pts)
  const seoDescLen = item.seoDescription?.length ?? 0;
  breakdown.seoDescription = seoDescLen > 50 ? 10 : seoDescLen > 0 ? 5 : 0;
  score += breakdown.seoDescription;

  // Tags (5 pts)
  const hasTags = item.tags && item.tags.trim().length > 0;
  breakdown.tags = hasTags ? 5 : 0;
  score += breakdown.tags;

  // Word count (10 pts)
  const wordCount = descText.split(/\s+/).filter(Boolean).length;
  if (wordCount > 150) breakdown.wordCount = 10;
  else if (wordCount > 75) breakdown.wordCount = 6;
  else breakdown.wordCount = 0;
  score += breakdown.wordCount;

  // Traffic (10 pts)
  const traffic = item.trafficVolume ?? 0;
  if (traffic > 1000) breakdown.traffic = 10;
  else if (traffic > 500) breakdown.traffic = 6;
  else breakdown.traffic = 0;
  score += breakdown.traffic;

  // Completeness bonus (capped to 100 total)
  const coreFields = [
    item.title, item.description || item.bodyHtml, item.featuredImageUrl,
    item.seoTitle, item.seoDescription, item.tags,
  ];
  const filledCount = coreFields.filter(Boolean).length;
  if (filledCount === coreFields.length) {
    breakdown.completeness = Math.min(15, 100 - score);
    score += breakdown.completeness;
  } else {
    breakdown.completeness = 0;
  }

  score = Math.min(100, score);

  const level: ReadinessResult["level"] =
    score >= 85 ? "High" : score >= 70 ? "Medium" : "Low";

  return { score, level, breakdown };
}

export function getReadinessColor(level: string): string {
  switch (level) {
    case "High": return "#4CAF50";
    case "Medium": return "#f5c542";
    case "Low": return "#ef4444";
    default: return "#6b7280";
  }
}
