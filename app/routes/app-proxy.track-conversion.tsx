import { json, type ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { AI_REFERRERS } from "../lib/ai-platforms";

/**
 * App Proxy endpoint: /apps/indexora/track-conversion
 * Receives revenue attribution beacons from the Web Pixel.
 */
export async function action({ request }: ActionFunctionArgs) {
  const { session } = await authenticate.public.appProxy(request);

  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const body = await request.json();
    const shopDomain = session?.shop || "";

    if (!body.orderId || !body.referrer) {
      return json({ error: "Missing fields" }, { status: 400 });
    }

    let store = await prisma.store.findUnique({
      where: { shopifyDomain: shopDomain },
    });

    if (!store) {
      store = await prisma.store.create({
        data: { shopifyDomain: shopDomain },
      });
    }

    const platform = AI_REFERRERS[body.referrer] || "Unknown";

    // Upsert to prevent duplicate order attribution
    await prisma.aiConversion.upsert({
      where: {
        storeId_shopifyOrderId: {
          storeId: store.id,
          shopifyOrderId: String(body.orderId),
        },
      },
      create: {
        storeId: store.id,
        shopifyOrderId: String(body.orderId),
        totalPrice: parseFloat(body.totalPrice) || 0,
        currency: body.currency || "USD",
        referrer: body.referrer,
        platform,
      },
      update: {}, // Don't overwrite existing — dedup
    });

    return json({ ok: true });
  } catch (error) {
    console.error("Track conversion error:", error);
    return json({ error: "Internal error" }, { status: 500 });
  }
}

export async function loader() {
  return json({ status: "Indexora conversion tracking active" });
}
