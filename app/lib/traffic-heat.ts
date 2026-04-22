/**
 * Indexora — Traffic Heat Classification
 */

export type HeatLevel = "hot" | "warm" | "cold";

export interface HeatInfo {
  level: HeatLevel;
  label: string;
  color: string;
  emoji: string;
}

export function getTrafficHeat(sessions: number): HeatInfo {
  if (sessions >= 2000) {
    return { level: "hot", label: "Hot", color: "#ef4444", emoji: "🔴" };
  }
  if (sessions >= 1000) {
    return { level: "warm", label: "Warm", color: "#f5c542", emoji: "🟡" };
  }
  return { level: "cold", label: "Cold", color: "#60a5fa", emoji: "🔵" };
}
