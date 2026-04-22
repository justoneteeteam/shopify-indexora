import { register } from "@shopify/web-pixels-extension";

register(({ analytics, browser, init }) => {
  const AI_DOMAINS = [
    "chatgpt.com",
    "chat.openai.com",
    "gemini.google.com",
    "perplexity.ai",
    "copilot.microsoft.com",
    "claude.ai",
    "you.com",
  ];

  // On every page view, capture referrer into sessionStorage (first visit only)
  analytics.subscribe("page_viewed", () => {
    try {
      const existing = browser.sessionStorage.getItem("indexora_ai_ref");
      if (existing) return;

      const referrer = document.referrer || "";
      const matched = AI_DOMAINS.find((d) => referrer.includes(d));
      if (matched) {
        browser.sessionStorage.setItem("indexora_ai_ref", matched);
      }
    } catch (e) {
      // sessionStorage may be unavailable
    }
  });

  // On checkout completion, attribute revenue if AI session
  analytics.subscribe("checkout_completed", (event) => {
    try {
      const aiRef = browser.sessionStorage.getItem("indexora_ai_ref");
      if (!aiRef) return;

      const checkout = event.data.checkout;
      const shopDomain = init.data.shop?.domain || "";

      fetch(`https://${shopDomain}/apps/indexora/track-conversion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          referrer: aiRef,
          orderId: checkout.order?.id || "",
          totalPrice: checkout.totalPrice?.amount || "0",
          currency: checkout.totalPrice?.currencyCode || "USD",
          timestamp: Date.now(),
        }),
        keepalive: true,
      });
    } catch (e) {
      // Silently fail
    }
  });
});
