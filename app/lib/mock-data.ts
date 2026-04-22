/**
 * Indexora — Mock Data
 * Realistic store data for development/demo.
 */

export const MOCK_PRODUCTS = [
  { shopifyId: "gid://shopify/Product/1", type: "product", title: "Premium Wireless Headphones", handle: "premium-wireless-headphones", description: "High-quality noise-cancelling wireless headphones with 40-hour battery life, premium drivers, and ultra-comfortable ear cushions.", featuredImageUrl: "https://placehold.co/400x400/1a1f4e/f5c542?text=Headphones", price: "299.99", stockStatus: "In stock", category: "Electronics", tags: "audio,wireless,premium", seoTitle: "Premium Wireless Headphones - Best Noise Cancelling", seoDescription: "Shop our premium wireless headphones with 40-hour battery and active noise cancellation.", trafficVolume: 2840, readinessScore: 92 },
  { shopifyId: "gid://shopify/Product/2", type: "product", title: "Ergonomic Desk Chair", handle: "ergonomic-desk-chair", description: "Premium ergonomic office chair with lumbar support, adjustable armrests, and breathable mesh back for all-day comfort.", featuredImageUrl: "https://placehold.co/400x400/4CAF50/fff?text=Chair", price: "449.99", stockStatus: "In stock", category: "Furniture", tags: "office,ergonomic,furniture", seoTitle: "Ergonomic Desk Chair - Premium Office Seating", seoDescription: "Discover our ergonomic desk chair with full lumbar support and adjustable features.", trafficVolume: 1920, readinessScore: 88 },
  { shopifyId: "gid://shopify/Product/3", type: "product", title: "Smart Fitness Watch", handle: "smart-fitness-watch", description: "Advanced fitness tracker with heart rate monitor, GPS, sleep tracking, and 7-day battery life.", featuredImageUrl: "https://placehold.co/400x400/f5c542/1a1f4e?text=Watch", price: "199.99", stockStatus: "In stock", category: "Electronics", tags: "fitness,wearable,smart", seoTitle: "Smart Fitness Watch - GPS & Heart Rate", seoDescription: "Track your fitness goals with our smart watch featuring GPS and heart rate monitoring.", trafficVolume: 3200, readinessScore: 95 },
  { shopifyId: "gid://shopify/Product/4", type: "product", title: "Organic Cotton T-Shirt", handle: "organic-cotton-tshirt", description: "Soft organic cotton t-shirt available in multiple colors. Sustainably sourced and ethically manufactured.", featuredImageUrl: "https://placehold.co/400x400/4a9eed/fff?text=T-Shirt", price: "34.99", stockStatus: "In stock", category: "Apparel", tags: "clothing,organic,sustainable", seoTitle: "", seoDescription: "", trafficVolume: 650, readinessScore: 58 },
  { shopifyId: "gid://shopify/Product/5", type: "product", title: "Bamboo Standing Desk", handle: "bamboo-standing-desk", description: "Height-adjustable standing desk made from sustainable bamboo with electric motor lift system.", featuredImageUrl: "https://placehold.co/400x400/1a1f4e/4CAF50?text=Desk", price: "599.99", stockStatus: "In stock", category: "Furniture", tags: "office,standing-desk,bamboo", seoTitle: "Bamboo Standing Desk - Adjustable Height", seoDescription: "Electric height-adjustable standing desk crafted from sustainable bamboo.", trafficVolume: 1450, readinessScore: 82 },
  { shopifyId: "gid://shopify/Product/6", type: "product", title: "Portable Bluetooth Speaker", handle: "portable-bluetooth-speaker", description: "Waterproof portable speaker with 360-degree sound and 12-hour playback.", featuredImageUrl: "https://placehold.co/400x400/f5c542/1a1f4e?text=Speaker", price: "79.99", stockStatus: "In stock", category: "Electronics", tags: "audio,bluetooth,portable", seoTitle: "Portable Bluetooth Speaker - Waterproof", seoDescription: "Take your music anywhere with our waterproof portable bluetooth speaker.", trafficVolume: 1100, readinessScore: 85 },
  { shopifyId: "gid://shopify/Product/7", type: "product", title: "Leather Messenger Bag", handle: "leather-messenger-bag", description: "Handcrafted genuine leather messenger bag with padded laptop compartment.", featuredImageUrl: null, price: "189.99", stockStatus: "In stock", category: "Accessories", tags: "bag,leather", seoTitle: "", seoDescription: "", trafficVolume: 320, readinessScore: 42 },
  { shopifyId: "gid://shopify/Product/8", type: "product", title: "Ceramic Pour Over Coffee Set", handle: "ceramic-pour-over-coffee-set", description: "Artisan ceramic pour-over coffee dripper with matching mug and bamboo stand.", featuredImageUrl: "https://placehold.co/400x400/4CAF50/fff?text=Coffee", price: "64.99", stockStatus: "In stock", category: "Kitchen", tags: "coffee,ceramic,artisan", seoTitle: "Ceramic Pour Over Coffee Set", seoDescription: "Brew the perfect cup with our artisan ceramic pour-over coffee set.", trafficVolume: 890, readinessScore: 78 },
];

export const MOCK_COLLECTIONS = [
  { shopifyId: "gid://shopify/Collection/1", type: "collection", title: "Office Essentials", handle: "office-essentials", description: "Complete workspace setup with furniture, lighting, and accessories for the modern professional.", readinessScore: 75 },
  { shopifyId: "gid://shopify/Collection/2", type: "collection", title: "Gaming Gear", handle: "gaming-gear", description: "High-performance gaming peripherals and accessories for competitive gamers.", readinessScore: 80 },
  { shopifyId: "gid://shopify/Collection/3", type: "collection", title: "Sustainable Living", handle: "sustainable-living", description: "Eco-friendly products made from sustainable materials for conscious consumers.", readinessScore: 72 },
  { shopifyId: "gid://shopify/Collection/4", type: "collection", title: "Tech Accessories", handle: "tech-accessories", description: "Premium accessories for your devices including cases, chargers, and cables.", readinessScore: 68 },
];

export const MOCK_PAGES = [
  { shopifyId: "gid://shopify/Page/1", type: "page", title: "About Us", handle: "about", description: "Learn about our company mission, values, and the team behind our brand.", readinessScore: 85 },
  { shopifyId: "gid://shopify/Page/2", type: "page", title: "Contact Support", handle: "contact", description: "Get in touch with our customer support team for any questions.", readinessScore: 70 },
  { shopifyId: "gid://shopify/Page/3", type: "page", title: "Shipping Policy", handle: "shipping", description: "Shipping rates, delivery estimates, and international shipping information.", readinessScore: 65 },
];

export const MOCK_AI_SESSIONS = [
  { platform: "ChatGPT", sessions: 1240, revenue: 3800 },
  { platform: "Gemini", sessions: 680, revenue: 2100 },
  { platform: "Perplexity", sessions: 410, revenue: 1050 },
  { platform: "Copilot", sessions: 130, revenue: 350 },
  { platform: "Claude", sessions: 70, revenue: 150 },
];

export function getMockTotalSessions(): number {
  return MOCK_AI_SESSIONS.reduce((sum, p) => sum + p.sessions, 0);
}

export function getMockTotalRevenue(): number {
  return MOCK_AI_SESSIONS.reduce((sum, p) => sum + p.revenue, 0);
}
