import { json, type ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { AI_REFERRERS } from "../lib/ai-platforms";

/**
 * App Proxy endpoint: /apps/indexora/track-session
 * Receives AI session beacons from the App Embed Block.
 */
export async function action({ request }: ActionFunctionArgs) {
  const { session } = await authenticate.public.appProxy(request);

  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const body = await request.json();
    const shopDomain = session?.shop || "";

    if (!body.referrer || !body.page) {
      return json({ error: "Missing fields" }, { status: 400 });
    }

    // Find or create store
    let store = await prisma.store.findUnique({
      where: { shopifyDomain: shopDomain },
    });

    if (!store) {
      store = await prisma.store.create({
        data: { shopifyDomain: shopDomain },
      });
    }

    const platform = AI_REFERRERS[body.referrer] || "Unknown";

    await prisma.aiSession.create({
      data: {
        storeId: store.id,
        referrer: body.referrer,
        platform,
        landingPage: body.page,
        userAgent: request.headers.get("user-agent") || undefined,
      },
    });

    return json({ ok: true });
  } catch (error) {
    console.error("Track session error:", error);
    return json({ error: "Internal error" }, { status: 500 });
  }
}

export async function loader() {
  return json({ status: "Indexora tracking active" });
}
