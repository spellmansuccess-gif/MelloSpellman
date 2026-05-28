/**
 * Storefront GraphQL queries + thin wrappers around shopifyFetch.
 *
 * Reads (products, productByHandle) are revalidated at 60s. Cart mutations
 * are explicitly cache:'no-store' so cart state always round-trips fresh.
 */

import {
  shopifyFetch,
  type Cart,
  type Product,
  type UserError,
} from './shopify'

const PRODUCT_FRAGMENT = `
  fragment ProductFields on Product {
    id
    handle
    title
    description
    descriptionHtml
    productType
    tags
    featuredImage { id url altText width height }
    images(first: 8) {
      edges { node { id url altText width height } }
    }
    priceRange {
      minVariantPrice { amount currencyCode }
      maxVariantPrice { amount currencyCode }
    }
    variants(first: 50) {
      edges {
        node {
          id
          title
          availableForSale
          price { amount currencyCode }
          image { id url altText width height }
          selectedOptions { name value }
        }
      }
    }
  }
`

const CART_FRAGMENT = `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount { amount currencyCode }
      totalAmount { amount currencyCode }
    }
    lines(first: 50) {
      edges {
        node {
          id
          quantity
          cost { totalAmount { amount currencyCode } }
          merchandise {
            ... on ProductVariant {
              id
              title
              price { amount currencyCode }
              selectedOptions { name value }
              image { id url altText width height }
              product {
                id
                handle
                title
                featuredImage { id url altText width height }
              }
            }
          }
        }
      }
    }
  }
`

// ---------- Reads ----------

export async function fetchProducts(first = 24): Promise<Product[]> {
  const query = `
    ${PRODUCT_FRAGMENT}
    query Products($first: Int!) {
      products(first: $first, sortKey: UPDATED_AT, reverse: true) {
        edges { node { ...ProductFields } }
      }
    }
  `
  try {
    const data = await shopifyFetch<{ products: { edges: Array<{ node: Product }> } }>(
      query,
      { first },
      { next: { revalidate: 60 } },
    )
    return data.products.edges.map((e) => e.node)
  } catch (err) {
    // Don't crash the page render if Shopify is unreachable or unconfigured —
    // log and return an empty list. The shop page handles empty gracefully.
    console.error('fetchProducts failed:', (err as Error).message)
    return []
  }
}

export async function fetchProductByHandle(handle: string): Promise<Product | null> {
  const query = `
    ${PRODUCT_FRAGMENT}
    query ProductByHandle($handle: String!) {
      productByHandle(handle: $handle) { ...ProductFields }
    }
  `
  try {
    const data = await shopifyFetch<{ productByHandle: Product | null }>(
      query,
      { handle },
      { next: { revalidate: 60 } },
    )
    return data.productByHandle ?? null
  } catch (err) {
    console.error('fetchProductByHandle failed:', (err as Error).message)
    return null
  }
}

// ---------- Cart mutations ----------

interface CartMutationPayload {
  cart: Cart | null
  userErrors: UserError[]
}

function assertNoErrors(payload: CartMutationPayload, action: string): Cart {
  if (payload.userErrors && payload.userErrors.length > 0) {
    throw new Error(`${action}: ${payload.userErrors.map((e) => e.message).join('; ')}`)
  }
  if (!payload.cart) throw new Error(`${action}: no cart in response`)
  return payload.cart
}

export async function cartCreate(merchandiseId: string, quantity = 1): Promise<Cart> {
  const query = `
    ${CART_FRAGMENT}
    mutation CartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart { ...CartFields }
        userErrors { field message }
      }
    }
  `
  const data = await shopifyFetch<{ cartCreate: CartMutationPayload }>(
    query,
    { input: { lines: [{ merchandiseId, quantity }] } },
    { cache: 'no-store' },
  )
  return assertNoErrors(data.cartCreate, 'cartCreate')
}

export async function cartLinesAdd(
  cartId: string,
  merchandiseId: string,
  quantity = 1,
): Promise<Cart> {
  const query = `
    ${CART_FRAGMENT}
    mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart { ...CartFields }
        userErrors { field message }
      }
    }
  `
  const data = await shopifyFetch<{ cartLinesAdd: CartMutationPayload }>(
    query,
    { cartId, lines: [{ merchandiseId, quantity }] },
    { cache: 'no-store' },
  )
  return assertNoErrors(data.cartLinesAdd, 'cartLinesAdd')
}

export async function cartLinesUpdate(
  cartId: string,
  lineId: string,
  quantity: number,
): Promise<Cart> {
  const query = `
    ${CART_FRAGMENT}
    mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart { ...CartFields }
        userErrors { field message }
      }
    }
  `
  const data = await shopifyFetch<{ cartLinesUpdate: CartMutationPayload }>(
    query,
    { cartId, lines: [{ id: lineId, quantity }] },
    { cache: 'no-store' },
  )
  return assertNoErrors(data.cartLinesUpdate, 'cartLinesUpdate')
}

export async function cartLinesRemove(cartId: string, lineIds: string[]): Promise<Cart> {
  const query = `
    ${CART_FRAGMENT}
    mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart { ...CartFields }
        userErrors { field message }
      }
    }
  `
  const data = await shopifyFetch<{ cartLinesRemove: CartMutationPayload }>(
    query,
    { cartId, lineIds },
    { cache: 'no-store' },
  )
  return assertNoErrors(data.cartLinesRemove, 'cartLinesRemove')
}

export async function cartFetch(cartId: string): Promise<Cart | null> {
  const query = `
    ${CART_FRAGMENT}
    query CartFetch($cartId: ID!) {
      cart(id: $cartId) { ...CartFields }
    }
  `
  try {
    const data = await shopifyFetch<{ cart: Cart | null }>(
      query,
      { cartId },
      { cache: 'no-store' },
    )
    return data.cart
  } catch (err) {
    console.error('cartFetch failed:', (err as Error).message)
    return null
  }
}
