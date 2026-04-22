import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Page, Layout, Card, Text, BlockStack, Banner } from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { AI_PLATFORMS, AI_CRAWLER_BOTS } from "../lib/ai-platforms";
import crawlerStyles from "../styles/crawlers.css?url";

export const links = () => [{ rel: "stylesheet", href: crawlerStyles }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);

  // Mock crawler status data
  const crawlers = AI_PLATFORMS.map((p) => {
    const bot = AI_CRAWLER_BOTS.find((b) => b.platform === p.platform);
    // Simulate: most are allowed, some unknown
    const statuses = ["allowed", "allowed", "allowed", "unknown", "allowed", "allowed"];
    const idx = AI_PLATFORMS.indexOf(p);
    return {
      ...p,
      botName: bot?.userAgent || p.botName || "Unknown",
      status: statuses[idx] || "unknown",
      lastVisit: idx < 3 ? "2 hours ago" : idx < 5 ? "Yesterday" : "3 days ago",
      visits: [1240, 680, 410, 130, 70, 25][idx] || 0,
    };
  });

  return json({ crawlers });
};

export default function CrawlersPage() {
  const { crawlers } = useLoaderData<typeof loader>();

  return (
    <Page title="AI Crawlers" subtitle="Monitor which AI bots are crawling your store">
      <Layout>
        <Layout.Section>
          <Banner tone="info">
            <p>Indexora monitors AI crawler activity on your store. Ensure your robots.txt allows these bots for maximum AI visibility.</p>
          </Banner>

          <div className="crawlers-grid" style={{ marginTop: 16 }}>
            {crawlers.map((crawler: any) => (
              <div className="crawler-card" key={crawler.platform}>
                <div className="crawler-card__header">
                  <div className="crawler-card__info">
                    <div className="crawler-card__icon" style={{ background: `${crawler.color}15` }}>
                      {crawler.icon}
                    </div>
                    <div>
                      <div className="crawler-card__name">{crawler.platform}</div>
                      <div className="crawler-card__bot">{crawler.botName}</div>
                    </div>
                  </div>
                  <div className={`crawler-status crawler-status--${crawler.status}`}>
                    <span className={`crawler-status__dot crawler-status__dot--${crawler.status}`} />
                    {crawler.status === "allowed" ? "ALLOWED" : crawler.status === "blocked" ? "BLOCKED" : "UNKNOWN"}
                  </div>
                </div>

                <div className="crawler-card__stats">
                  <div>
                    <div className="crawler-card__stat-label">Visits</div>
                    <div className="crawler-card__stat-value">{crawler.visits.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="crawler-card__stat-label">Last Seen</div>
                    <div className="crawler-card__stat-value" style={{ fontSize: 14 }}>{crawler.lastVisit}</div>
                  </div>
                </div>

                <button className={`crawler-card__action ${crawler.status !== "allowed" ? "crawler-card__action--fix" : ""}`}>
                  {crawler.status === "allowed" ? "View Details" : "Fix Now"}
                </button>
              </div>
            ))}
          </div>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
