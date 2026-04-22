import { useState, useCallback } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useSubmit } from "@remix-run/react";
import { Page, Button, Text, BlockStack, InlineStack, Box, Banner } from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import onboardingStyles from "../styles/onboarding.css?url";

export const links = () => [{ rel: "stylesheet", href: onboardingStyles }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session, admin } = await authenticate.admin(request);
  const shop = session.shop;

  let store = await prisma.store.findUnique({ where: { shopifyDomain: shop } });
  if (!store) {
    store = await prisma.store.create({ data: { shopifyDomain: shop } });
  }

  if (store.onboardingDone) {
    return redirect("/app");
  }

  // Get current theme ID for deep link
  const themeResponse = await admin.rest.get({ path: "themes", query: { role: "main" } });
  const themeData = await themeResponse.json();
  const mainTheme = themeData?.themes?.[0];
  const themeId = mainTheme?.id || "";

  return json({
    shop: shop.replace(".myshopify.com", ""),
    themeId: String(themeId),
    embedEnabled: store.embedEnabled,
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "complete-onboarding") {
    await prisma.store.update({
      where: { shopifyDomain: session.shop },
      data: { onboardingDone: true, embedEnabled: true },
    });
    return redirect("/app");
  }

  return json({ ok: true });
};

export default function Onboarding() {
  const { shop, themeId } = useLoaderData<typeof loader>();
  const submit = useSubmit();
  const [step, setStep] = useState(1);

  const handleEnableTracking = useCallback(() => {
    // Open deep link to theme editor to enable the app embed
    const deepLink = `https://admin.shopify.com/store/${shop}/themes/${themeId}/editor?context=apps`;
    window.open(deepLink, "_blank");
    setStep(3);
  }, [shop, themeId]);

  const handleComplete = useCallback(() => {
    submit({ intent: "complete-onboarding" }, { method: "post" });
  }, [submit]);

  return (
    <Page>
      <div className="onboarding-container">
        {/* Step Indicators */}
        <div className="onboarding-step-indicator">
          <div className={`onboarding-step-dot ${step >= 1 ? "onboarding-step-dot--active" : ""}`} />
          <div className={`onboarding-step-line ${step >= 2 ? "onboarding-step-line--done" : ""}`} />
          <div className={`onboarding-step-dot ${step >= 2 ? "onboarding-step-dot--active" : ""}`} />
          <div className={`onboarding-step-line ${step >= 3 ? "onboarding-step-line--done" : ""}`} />
          <div className={`onboarding-step-dot ${step >= 3 ? "onboarding-step-dot--active" : ""}`} />
        </div>

        {/* Step 1: Welcome */}
        {step === 1 && (
          <BlockStack gap="400">
            <div className="onboarding-hero">
              <img src="/indexora-icon.png" alt="Indexora" className="onboarding-hero__logo" />
              <h1 className="onboarding-hero__title">Welcome to Indexora 🐍</h1>
              <p className="onboarding-hero__subtitle">
                See exactly how AI chatbots like ChatGPT, Gemini, and Perplexity
                drive traffic and revenue to your store.
              </p>
            </div>
            <Button variant="primary" size="large" fullWidth onClick={() => setStep(2)}>
              Get Started →
            </Button>
          </BlockStack>
        )}

        {/* Step 2: Enable Tracking */}
        {step === 2 && (
          <BlockStack gap="400">
            <div className="onboarding-hero">
              <h1 className="onboarding-hero__title">Enable AI Traffic Tracking</h1>
              <p className="onboarding-hero__subtitle">
                Indexora adds invisible tracking to your storefront to detect visitors
                from AI platforms. No code editing required.
              </p>
            </div>

            <ul className="onboarding-checklist">
              <li className="onboarding-checklist__item">
                <span className="onboarding-checklist__icon">✅</span>
                <div>
                  <div className="onboarding-checklist__text">AI Session Detection</div>
                  <div className="onboarding-checklist__desc">Track visitors from ChatGPT, Gemini, Perplexity & more</div>
                </div>
              </li>
              <li className="onboarding-checklist__item">
                <span className="onboarding-checklist__icon">✅</span>
                <div>
                  <div className="onboarding-checklist__text">AI Revenue Attribution</div>
                  <div className="onboarding-checklist__desc">See exactly how much revenue AI traffic generates</div>
                </div>
              </li>
              <li className="onboarding-checklist__item">
                <span className="onboarding-checklist__icon">✅</span>
                <div>
                  <div className="onboarding-checklist__text">AI Crawler Monitoring</div>
                  <div className="onboarding-checklist__desc">Know which AI bots are crawling your store</div>
                </div>
              </li>
            </ul>

            <Banner tone="info">
              <p>Clicking below will open your theme editor. Toggle ON the &quot;Indexora AI Tracker&quot; embed, then return here.</p>
            </Banner>

            <button className="onboarding-enable-btn" onClick={handleEnableTracking}>
              Enable Tracking
            </button>
          </BlockStack>
        )}

        {/* Step 3: Done */}
        {step === 3 && (
          <BlockStack gap="400">
            <div className="onboarding-done">
              <div className="onboarding-done__emoji">🎉</div>
              <h1 className="onboarding-hero__title">You're all set!</h1>
              <p className="onboarding-hero__subtitle">
                AI traffic data will start appearing as visitors arrive from AI platforms.
              </p>
            </div>

            <div className="onboarding-status onboarding-status--success">
              ✅ Tracking is ready to go
            </div>

            <Button variant="primary" size="large" fullWidth onClick={handleComplete}>
              Go to Dashboard →
            </Button>
          </BlockStack>
        )}
      </div>
    </Page>
  );
}
