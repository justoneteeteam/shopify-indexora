-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "scope" TEXT,
    "expires" TIMESTAMP(3),
    "accessToken" TEXT NOT NULL,
    "userId" BIGINT,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT,
    "accountOwner" BOOLEAN NOT NULL DEFAULT false,
    "locale" TEXT,
    "collaborator" BOOLEAN DEFAULT false,
    "emailVerified" BOOLEAN DEFAULT false,
    "refreshToken" TEXT,
    "refreshTokenExpires" TIMESTAMP(3),

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Store" (
    "id" TEXT NOT NULL,
    "shopifyDomain" TEXT NOT NULL,
    "storeName" TEXT,
    "planTier" TEXT NOT NULL DEFAULT 'free',
    "billingId" TEXT,
    "trialUsed" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "onboardingDone" BOOLEAN NOT NULL DEFAULT false,
    "embedEnabled" BOOLEAN NOT NULL DEFAULT false,
    "lastSync" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Store_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiSession" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "referrer" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "landingPage" TEXT NOT NULL,
    "sessionId" TEXT,
    "ipHash" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiConversion" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "shopifyOrderId" TEXT NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "referrer" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiConversion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LlmItem" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "shopifyId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "shortDescription" TEXT,
    "bodyHtml" TEXT,
    "featuredImageUrl" TEXT,
    "handle" TEXT,
    "price" TEXT,
    "stockStatus" TEXT,
    "category" TEXT,
    "tags" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "trafficVolume" INTEGER NOT NULL DEFAULT 0,
    "revenueVolume" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "readinessScore" INTEGER NOT NULL DEFAULT 0,
    "isOptimized" BOOLEAN NOT NULL DEFAULT false,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LlmItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LlmMetadata" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "titleLength" INTEGER NOT NULL DEFAULT 0,
    "descLength" INTEGER NOT NULL DEFAULT 0,
    "wordCount" INTEGER NOT NULL DEFAULT 0,
    "hasImage" BOOLEAN NOT NULL DEFAULT false,
    "hasSeoTitle" BOOLEAN NOT NULL DEFAULT false,
    "hasSeoDesc" BOOLEAN NOT NULL DEFAULT false,
    "hasCategory" BOOLEAN NOT NULL DEFAULT false,
    "hasTags" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "LlmMetadata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LlmVersion" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "format" TEXT NOT NULL DEFAULT 'markdown',
    "content" TEXT NOT NULL,
    "itemCount" INTEGER NOT NULL DEFAULT 0,
    "fileSize" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LlmVersion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Store_shopifyDomain_key" ON "Store"("shopifyDomain");

-- CreateIndex
CREATE INDEX "AiSession_storeId_idx" ON "AiSession"("storeId");

-- CreateIndex
CREATE INDEX "AiSession_createdAt_idx" ON "AiSession"("createdAt");

-- CreateIndex
CREATE INDEX "AiSession_platform_idx" ON "AiSession"("platform");

-- CreateIndex
CREATE INDEX "AiConversion_storeId_idx" ON "AiConversion"("storeId");

-- CreateIndex
CREATE INDEX "AiConversion_createdAt_idx" ON "AiConversion"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "AiConversion_storeId_shopifyOrderId_key" ON "AiConversion"("storeId", "shopifyOrderId");

-- CreateIndex
CREATE INDEX "LlmItem_storeId_idx" ON "LlmItem"("storeId");

-- CreateIndex
CREATE INDEX "LlmItem_type_idx" ON "LlmItem"("type");

-- CreateIndex
CREATE INDEX "LlmItem_isOptimized_idx" ON "LlmItem"("isOptimized");

-- CreateIndex
CREATE UNIQUE INDEX "LlmItem_storeId_shopifyId_key" ON "LlmItem"("storeId", "shopifyId");

-- CreateIndex
CREATE UNIQUE INDEX "LlmMetadata_itemId_key" ON "LlmMetadata"("itemId");

-- CreateIndex
CREATE INDEX "LlmVersion_storeId_idx" ON "LlmVersion"("storeId");

-- AddForeignKey
ALTER TABLE "AiSession" ADD CONSTRAINT "AiSession_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiConversion" ADD CONSTRAINT "AiConversion_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LlmItem" ADD CONSTRAINT "LlmItem_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LlmMetadata" ADD CONSTRAINT "LlmMetadata_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "LlmItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LlmVersion" ADD CONSTRAINT "LlmVersion_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;
