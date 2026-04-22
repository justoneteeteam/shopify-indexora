import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Page, Layout, Card, Text, BlockStack, InlineStack, IndexTable, Badge, Tabs, TextField, Box } from "@shopify/polaris";
import { useState, useCallback } from "react";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { MOCK_PRODUCTS, MOCK_COLLECTIONS, MOCK_PAGES, MOCK_AI_SESSIONS, getMockTotalSessions, getMockTotalRevenue } from "../lib/mock-data";
import dashboardStyles from "../styles/dashboard.css?url";

export const links = () => [{ rel: "stylesheet", href: dashboardStyles }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;

  let store = await prisma.store.findUnique({ where: { shopifyDomain: shop } });
  if (!store) {
    store = await prisma.store.create({ data: { shopifyDomain: shop } });
  }

  // Redirect to onboarding if not completed
  if (!store.onboardingDone) {
    return redirect("/app/onboarding");
  }

  // Try real data first, fall back to mock
  const aiSessionCount = await prisma.aiSession.count({ where: { storeId: store.id } });
  const useMock = aiSessionCount === 0;

  const allItems = [...MOCK_PRODUCTS, ...MOCK_COLLECTIONS, ...MOCK_PAGES];

  return json({
    storeName: store.storeName || shop,
    totalSessions: useMock ? getMockTotalSessions() : aiSessionCount,
    sessionsTrend: useMock ? 18 : 0,
    totalRevenue: useMock ? getMockTotalRevenue() : 0,
    revenueTrend: useMock ? 24 : 0,
    visibilityScore: 78,
    optimizedCount: allItems.filter((i: any) => i.readinessScore >= 70).length,
    totalItems: allItems.length,
    items: allItems,
    platforms: useMock ? MOCK_AI_SESSIONS : [],
    useMock,
  });
};

export default function Dashboard() {
  const data = useLoaderData<typeof loader>();
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchValue, setSearchValue] = useState("");

  const tabs = [
    { id: "all", content: `All (${data.items.length})` },
    { id: "products", content: `Products (${data.items.filter((i: any) => i.type === "product").length})` },
    { id: "collections", content: `Collections (${data.items.filter((i: any) => i.type === "collection").length})` },
    { id: "pages", content: `Pages (${data.items.filter((i: any) => i.type === "page").length})` },
  ];

  const typeFilter = ["all", "product", "collection", "page"][selectedTab];
  const filteredItems = data.items
    .filter((i: any) => typeFilter === "all" || i.type === typeFilter)
    .filter((i: any) => i.title.toLowerCase().includes(searchValue.toLowerCase()));

  const circumference = 2 * Math.PI * 34;
  const offset = circumference - (data.visibilityScore / 100) * circumference;

  return (
    <Page title="">
      {/* Hero Header */}
      <div className="indexora-hero">
        <img src="/indexora-icon.png" alt="Indexora" className="indexora-hero__logo" />
        <div>
          <div className="indexora-hero__title">Indexora</div>
          <div className="indexora-hero__tagline">ChatGPT and Gemini SEO Rank Booster</div>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="analytics-grid">
        <div className="analytics-card analytics-card--sessions">
          <div className="analytics-card__label">AI Sessions</div>
          <div className="analytics-card__value">{data.totalSessions.toLocaleString()}</div>
          <span className={`analytics-card__trend analytics-card__trend--${data.sessionsTrend >= 0 ? "up" : "down"}`}>
            {data.sessionsTrend >= 0 ? "↑" : "↓"} {Math.abs(data.sessionsTrend)}%
          </span>
        </div>

        <div className="analytics-card analytics-card--revenue">
          <div className="analytics-card__label">AI Revenue</div>
          <div className="analytics-card__value">${data.totalRevenue.toLocaleString()}</div>
          <span className={`analytics-card__trend analytics-card__trend--${data.revenueTrend >= 0 ? "up" : "down"}`}>
            {data.revenueTrend >= 0 ? "↑" : "↓"} {Math.abs(data.revenueTrend)}%
          </span>
        </div>

        <div className="analytics-card analytics-card--visibility">
          <div className="analytics-card__label">AI Visibility Score</div>
          <InlineStack align="space-between" blockAlign="center">
            <div className="analytics-card__value">{data.visibilityScore}</div>
            <div className="circular-gauge">
              <svg className="circular-gauge__svg" width="80" height="80" viewBox="0 0 80 80">
                <circle className="circular-gauge__bg" cx="40" cy="40" r="34" />
                <circle
                  className="circular-gauge__fill"
                  cx="40" cy="40" r="34"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                />
              </svg>
              <span className="circular-gauge__text">/100</span>
            </div>
          </InlineStack>
        </div>

        <div className="analytics-card analytics-card--optimized">
          <div className="analytics-card__label">Items Optimized</div>
          <div className="analytics-card__value">{data.optimizedCount}/{data.totalItems}</div>
          <span className="analytics-card__trend analytics-card__trend--up">
            {Math.round((data.optimizedCount / data.totalItems) * 100)}%
          </span>
        </div>
      </div>

      <Layout>
        <Layout.Section>
          {/* Platform Breakdown */}
          {data.platforms.length > 0 && (
            <Card>
              <BlockStack gap="300">
                <Text variant="headingMd" as="h2">Traffic by AI Platform</Text>
                <div className="platform-breakdown">
                  {data.platforms.map((p: any) => (
                    <div className="platform-row" key={p.platform}>
                      <div className="platform-icon" style={{ background: `${getPlatformColor(p.platform)}20` }}>
                        {getPlatformEmoji(p.platform)}
                      </div>
                      <div className="platform-name">{p.platform}</div>
                      <div className="platform-stat">{p.sessions.toLocaleString()} sessions</div>
                      <div className="platform-stat">${p.revenue.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </BlockStack>
            </Card>
          )}

          {/* Items Table */}
          <div style={{ marginTop: 16 }}>
            <Card padding="0">
              <Box padding="400">
                <Tabs tabs={tabs} selected={selectedTab} onSelect={setSelectedTab} />
                <div style={{ marginTop: 12 }}>
                  <TextField
                    label=""
                    labelHidden
                    placeholder="Search items..."
                    value={searchValue}
                    onChange={setSearchValue}
                    autoComplete="off"
                    clearButton
                    onClearButtonClick={() => setSearchValue("")}
                  />
                </div>
              </Box>

              <IndexTable
                itemCount={filteredItems.length}
                headings={[
                  { title: "Item" },
                  { title: "Type" },
                  { title: "Traffic" },
                  { title: "Readiness" },
                ]}
                selectable={false}
              >
                {filteredItems.map((item: any, index: number) => (
                  <IndexTable.Row id={item.shopifyId} key={item.shopifyId} position={index}>
                    <IndexTable.Cell>
                      <Text variant="bodyMd" fontWeight="semibold" as="span">{item.title}</Text>
                    </IndexTable.Cell>
                    <IndexTable.Cell>
                      <Badge tone={item.type === "product" ? "info" : item.type === "collection" ? "success" : "attention"}>
                        {item.type}
                      </Badge>
                    </IndexTable.Cell>
                    <IndexTable.Cell>
                      <div className="traffic-heat">
                        <span className={`traffic-heat__dot traffic-heat__dot--${(item.trafficVolume || 0) >= 2000 ? "hot" : (item.trafficVolume || 0) >= 1000 ? "warm" : "cold"}`} />
                        <Text as="span" variant="bodyMd">{(item.trafficVolume || 0).toLocaleString()}</Text>
                      </div>
                    </IndexTable.Cell>
                    <IndexTable.Cell>
                      <span className={`readiness-badge readiness-badge--${item.readinessScore >= 85 ? "high" : item.readinessScore >= 70 ? "medium" : "low"}`}>
                        {item.readinessScore >= 85 ? "High" : item.readinessScore >= 70 ? "Medium" : "Low"} ({item.readinessScore})
                      </span>
                    </IndexTable.Cell>
                  </IndexTable.Row>
                ))}
              </IndexTable>
            </Card>
          </div>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

function getPlatformColor(platform: string): string {
  const colors: Record<string, string> = {
    ChatGPT: "#10a37f", Gemini: "#4285f4", Perplexity: "#20b2aa",
    Copilot: "#0078d4", Claude: "#cc785c",
  };
  return colors[platform] || "#6b7280";
}

function getPlatformEmoji(platform: string): string {
  const emojis: Record<string, string> = {
    ChatGPT: "🤖", Gemini: "✨", Perplexity: "🔍",
    Copilot: "🪟", Claude: "🧠",
  };
  return emojis[platform] || "🔎";
}
