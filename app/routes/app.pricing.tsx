import { useState } from "react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Page, Layout } from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import pricingStyles from "../styles/pricing.css?url";

export const links = () => [{ rel: "stylesheet", href: pricingStyles }];

const PLANS = [
  {
    name: "Free",
    price: 0,
    annual: 0,
    desc: "Testing & small stores",
    popular: false,
    features: [
      { text: "10 indexed pages", included: true },
      { text: "Manual sync", included: true },
      { text: "2 AI crawlers monitored", included: true },
      { text: "1 llms.txt version", included: true },
      { text: "7 days analytics", included: true },
      { text: "Priority support", included: false },
    ],
  },
  {
    name: "Starter",
    price: 4.99,
    annual: 3.99,
    desc: "Growing e-commerce",
    popular: false,
    features: [
      { text: "50 indexed pages", included: true },
      { text: "Auto sync every 24h", included: true },
      { text: "3 AI crawlers monitored", included: true },
      { text: "5 llms.txt versions", included: true },
      { text: "30 days analytics", included: true },
      { text: "Priority support", included: false },
    ],
  },
  {
    name: "Business",
    price: 7.99,
    annual: 6.39,
    desc: "Established stores",
    popular: true,
    features: [
      { text: "200 indexed pages", included: true },
      { text: "Auto sync every 12h", included: true },
      { text: "5 AI crawlers monitored", included: true },
      { text: "20 llms.txt versions", included: true },
      { text: "90 days analytics", included: true },
      { text: "Priority support", included: true },
    ],
  },
  {
    name: "Professional",
    price: 9.99,
    annual: 7.99,
    desc: "High-volume stores",
    popular: false,
    features: [
      { text: "500 indexed pages", included: true },
      { text: "Auto sync every 6h", included: true },
      { text: "5 AI crawlers monitored", included: true },
      { text: "50 llms.txt versions", included: true },
      { text: "1 year analytics", included: true },
      { text: "Priority support", included: true },
    ],
  },
  {
    name: "Enterprise",
    price: 19.99,
    annual: 15.99,
    desc: "Enterprise scale",
    popular: false,
    features: [
      { text: "Unlimited pages", included: true },
      { text: "Auto sync every 1h", included: true },
      { text: "5 AI crawlers monitored", included: true },
      { text: "Unlimited llms.txt versions", included: true },
      { text: "1 year analytics", included: true },
      { text: "Priority support", included: true },
    ],
  },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  return json({ currentPlan: "free" });
};

export default function PricingPage() {
  const { currentPlan } = useLoaderData<typeof loader>();
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <Page title="">
      <div className="pricing-container">
        <div className="pricing-header">
          <h1 className="pricing-header__title">Choose Your Plan</h1>
          <p className="pricing-header__subtitle">
            Boost your store's AI visibility with Indexora
          </p>
        </div>

        <div className="pricing-toggle">
          <span className={`pricing-toggle__label ${!isAnnual ? "pricing-toggle__label--active" : ""}`}>
            Monthly
          </span>
          <div
            className={`pricing-toggle__switch ${isAnnual ? "pricing-toggle__switch--active" : ""}`}
            onClick={() => setIsAnnual(!isAnnual)}
          />
          <span className={`pricing-toggle__label ${isAnnual ? "pricing-toggle__label--active" : ""}`}>
            Annual
          </span>
          {isAnnual && <span className="pricing-toggle__save">Save 20%</span>}
        </div>

        <div className="pricing-grid">
          {PLANS.map((plan) => {
            const price = isAnnual ? plan.annual : plan.price;
            const isCurrent = plan.name.toLowerCase() === currentPlan;

            return (
              <div className={`pricing-card ${plan.popular ? "pricing-card--popular" : ""}`} key={plan.name}>
                {plan.popular && <div className="pricing-card__badge">Most Popular</div>}
                <div className="pricing-card__name">{plan.name}</div>
                <div className="pricing-card__price">
                  {price === 0 ? "Free" : `$${price}`}
                  {price > 0 && <span>/mo</span>}
                </div>
                <div className="pricing-card__desc">{plan.desc}</div>

                <ul className="pricing-card__features">
                  {plan.features.map((f, i) => (
                    <li className="pricing-card__feature" key={i}>
                      <span className={`pricing-card__feature-icon ${!f.included ? "pricing-card__feature-icon--no" : ""}`}>
                        {f.included ? "✓" : "—"}
                      </span>
                      {f.text}
                    </li>
                  ))}
                </ul>

                <button className={`pricing-card__cta ${isCurrent ? "pricing-card__cta--current" : plan.popular ? "pricing-card__cta--primary" : ""}`}>
                  {isCurrent ? "Current Plan" : price === 0 ? "Get Started" : "Upgrade"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </Page>
  );
}
