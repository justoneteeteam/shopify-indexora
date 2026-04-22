/**
 * Indexora — Analytics Queries
 * Reusable Prisma queries for AI traffic metrics.
 */
import prisma from "../db.server";

export interface DateRange {
  start: Date;
  end: Date;
}

function getDateRange(days: number): DateRange {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - days);
  return { start, end };
}

function getPreviousDateRange(days: number): DateRange {
  const end = new Date();
  end.setDate(end.getDate() - days);
  const start = new Date();
  start.setDate(start.getDate() - days * 2);
  return { start, end };
}

export async function getAiSessionStats(storeId: string, days: number = 30) {
  const current = getDateRange(days);
  const previous = getPreviousDateRange(days);

  const [currentCount, previousCount, platformBreakdown] = await Promise.all([
    prisma.aiSession.count({
      where: {
        storeId,
        createdAt: { gte: current.start, lte: current.end },
      },
    }),
    prisma.aiSession.count({
      where: {
        storeId,
        createdAt: { gte: previous.start, lte: previous.end },
      },
    }),
    prisma.aiSession.groupBy({
      by: ["platform"],
      where: {
        storeId,
        createdAt: { gte: current.start, lte: current.end },
      },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    }),
  ]);

  const trend =
    previousCount > 0
      ? Math.round(((currentCount - previousCount) / previousCount) * 100)
      : currentCount > 0
        ? 100
        : 0;

  return {
    count: currentCount,
    previousCount,
    trend,
    platforms: platformBreakdown.map((p) => ({
      platform: p.platform,
      sessions: p._count.id,
    })),
  };
}

export async function getAiRevenueStats(storeId: string, days: number = 30) {
  const current = getDateRange(days);
  const previous = getPreviousDateRange(days);

  const [currentRevenue, previousRevenue, platformBreakdown] =
    await Promise.all([
      prisma.aiConversion.aggregate({
        where: {
          storeId,
          createdAt: { gte: current.start, lte: current.end },
        },
        _sum: { totalPrice: true },
        _count: { id: true },
      }),
      prisma.aiConversion.aggregate({
        where: {
          storeId,
          createdAt: { gte: previous.start, lte: previous.end },
        },
        _sum: { totalPrice: true },
      }),
      prisma.aiConversion.groupBy({
        by: ["platform"],
        where: {
          storeId,
          createdAt: { gte: current.start, lte: current.end },
        },
        _sum: { totalPrice: true },
        _count: { id: true },
        orderBy: { _sum: { totalPrice: "desc" } },
      }),
    ]);

  const currentTotal = currentRevenue._sum.totalPrice ?? 0;
  const previousTotal = previousRevenue._sum.totalPrice ?? 0;

  const trend =
    previousTotal > 0
      ? Math.round(((currentTotal - previousTotal) / previousTotal) * 100)
      : currentTotal > 0
        ? 100
        : 0;

  return {
    total: currentTotal,
    orderCount: currentRevenue._count.id,
    previousTotal,
    trend,
    platforms: platformBreakdown.map((p) => ({
      platform: p.platform,
      revenue: p._sum.totalPrice ?? 0,
      orders: p._count.id,
    })),
  };
}

export async function getTopAiLandingPages(
  storeId: string,
  limit: number = 10,
) {
  const { start, end } = getDateRange(30);

  const pages = await prisma.aiSession.groupBy({
    by: ["landingPage"],
    where: {
      storeId,
      createdAt: { gte: start, lte: end },
    },
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
    take: limit,
  });

  return pages.map((p) => ({
    page: p.landingPage,
    sessions: p._count.id,
  }));
}
