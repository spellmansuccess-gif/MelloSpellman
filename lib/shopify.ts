/**
 * Shopify Storefront API client.
 *
 * Posts to https://${domain}/api/${version}/graphql.json with the public
 * Storefront access token in the `X-Shopify-Storefront-Access-Token` header.
 * Never include the admin (shpat_) token here — this module runs on the
 * client whenever a server component imports it indirectly.
 */

const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN
const SHOPIFY_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN
const API_VERSION = '2024-07'

export const SHOPIFY_CONFIGURED = Boolean(SHOPIFY_DOMAIN && SHOPIFY_TOKEN)

// ---------- Storefront types (minimal — enough for our queries) ----------

export interface Money {
  amount: string
  currencyCode: string
}

export interface ShopifyImage {
  id?: string | null
  url: string
  altText: string | null
  width?: number | null
  height?: number | null
}

export interface SelectedOption {
  name: string
  value: string
}

export interface ProductVariant {
  id: string
  title: string
  availableForSale: boolean
  price: Money
  image: ShopifyImage | null
  selectedOptions: SelectedOption[]
}

export interface Product {
  id: string
  handle: string
  title: string
  description: string
  descriptionHtml: string
  productType: string
  tags: string[]
  featuredImage: ShopifyImage | null
  images: { edges: Array<{ node: ShopifyImage }> }
  priceRange: {
    minVariantPrice: Money
    maxVariantPrice: Money
  }
  variants: { edges: Array<{ node: ProductVariant }> }
}

export interface CartLineMerchandise {
  id: string
  title: string
  price: Money
  selectedOptions: SelectedOption[]
  image: ShopifyImage | null
  product: {
    id: string
    handle: string
    title: string
    featuredImage: ShopifyImage | null
  }
}

export interface CartLine {
  id: string
  quantity: number
  cost: { totalAmount: Money }
  merchandise: CartLineMerchandise
}

export interface Cart {
  id: string
  checkoutUrl: string
  totalQuantity: number
  cost: {
    subtotalAmount: Money
    totalAmount: Money
  }
  lines: { edges: Array<{ node: CartLine }> }
}

export interface UserError {
  field: string[] | null
  message: string
}

// ---------- Fetch helper ----------

interface ShopifyGraphQLError {
  message: string
  extensions?: Record<string, unknown>
}

interface ShopifyResponse<T> {
  data?: T
  errors?: ShopifyGraphQLError[]
}

export interface FetchOptions {
  cache?: RequestCache
  next?: { revalidate?: number; tags?: string[] }
}

export async function shopifyFetch<T>(
  query: string,
  variables: Record<string, unknown> = {},
  opts: FetchOptions = {},
): Promise<T> {
  if (!SHOPIFY_CONFIGURED) {
    throw new Error(
      'Shopify Storefront client is not configured. Set NEXT_PUBLIC_SHOPIFY_DOMAIN and NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN in your environment.',
    )
  }

  const res = await fetch(`https://${SHOPIFY_DOMAIN}/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_TOKEN as string,
    },
    body: JSON.stringify({ query, variables }),
    cache: opts.cache,
    next: opts.next,
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Shopify HTTP ${res.status}: ${text || res.statusText}`)
  }

  const json = (await res.json()) as ShopifyResponse<T>
  if (json.errors && json.errors.length > 0) {
    throw new Error(
      `Shopify GraphQL: ${json.errors.map((e) => e.message).join('; ')}`,
    )
  }
  if (!json.data) throw new Error('Shopify returned no data')
  return json.data
}

// ---------- Formatting helpers ----------

export function formatMoney(money: Money | null | undefined): string {
  if (!money) return ''
  const n = Number(money.amount)
  if (Number.isNaN(n)) return `${money.amount} ${money.currencyCode}`
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: money.currencyCode || 'USD',
      maximumFractionDigits: 2,
    }).format(n)
  } catch {
    return `$${n.toFixed(2)}`
  }
}
