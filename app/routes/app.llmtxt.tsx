import { useState } from "react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Page, Layout, Card, Text, BlockStack, InlineStack, Button, Badge, Select, Box } from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { MOCK_PRODUCTS, MOCK_COLLECTIONS, MOCK_PAGES } from "../lib/mock-data";
import { generateLlmsTxt } from "../lib/llmtxt-generator";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;

  const allItems = [...MOCK_PRODUCTS, ...MOCK_COLLECTIONS, ...MOCK_PAGES];
  const markdownContent = generateLlmsTxt({
    storeName: shop.replace(".myshopify.com", ""),
    storeDomain: shop,
    items: allItems,
    format: "markdown",
  });
  const yamlContent = generateLlmsTxt({
    storeName: shop.replace(".myshopify.com", ""),
    storeDomain: shop,
    items: allItems,
    format: "yaml",
  });

  return json({
    markdownContent,
    yamlContent,
    itemCount: allItems.length,
    mdSize: new Blob([markdownContent]).size,
    yamlSize: new Blob([yamlContent]).size,
  });
};

export default function LlmTxtPage() {
  const data = useLoaderData<typeof loader>();
  const [format, setFormat] = useState("markdown");
  const content = format === "markdown" ? data.markdownContent : data.yamlContent;
  const fileSize = format === "markdown" ? data.mdSize : data.yamlSize;

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
  };

  const handleDownload = () => {
    const ext = format === "markdown" ? "txt" : "yaml";
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `llms.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Page title="LLM.txt Generator" subtitle="Generate AI-friendly content files for crawler indexing">
      <Layout>
        <Layout.Section variant="oneThird">
          <Card>
            <BlockStack gap="400">
              <Text variant="headingMd" as="h2">Settings</Text>
              <Select
                label="Format"
                options={[
                  { label: "Markdown (recommended)", value: "markdown" },
                  { label: "YAML", value: "yaml" },
                ]}
                value={format}
                onChange={setFormat}
              />
              <BlockStack gap="200">
                <InlineStack align="space-between">
                  <Text as="span" variant="bodySm" tone="subdued">Items</Text>
                  <Text as="span" variant="bodySm" fontWeight="semibold">{data.itemCount}</Text>
                </InlineStack>
                <InlineStack align="space-between">
                  <Text as="span" variant="bodySm" tone="subdued">File size</Text>
                  <Text as="span" variant="bodySm" fontWeight="semibold">{(fileSize / 1024).toFixed(1)} KB</Text>
                </InlineStack>
                <InlineStack align="space-between">
                  <Text as="span" variant="bodySm" tone="subdued">Lines</Text>
                  <Text as="span" variant="bodySm" fontWeight="semibold">{content.split("\n").length}</Text>
                </InlineStack>
              </BlockStack>
              <InlineStack gap="200">
                <Button onClick={handleCopy}>Copy</Button>
                <Button variant="primary" onClick={handleDownload}>Download</Button>
              </InlineStack>
            </BlockStack>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Card>
            <BlockStack gap="200">
              <InlineStack align="space-between">
                <Text variant="headingMd" as="h2">Preview</Text>
                <Badge tone="info">{format.toUpperCase()}</Badge>
              </InlineStack>
              <Box padding="300" background="bg-surface-secondary" borderRadius="200">
                <pre style={{ fontSize: 12, lineHeight: 1.6, whiteSpace: "pre-wrap", wordBreak: "break-word", margin: 0, fontFamily: "'SF Mono', 'Cascadia Code', monospace" }}>
                  {content}
                </pre>
              </Box>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
