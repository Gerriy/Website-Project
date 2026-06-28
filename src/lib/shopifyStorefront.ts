export interface StorefrontConfig {
  domain: string;
  token: string;
  apiVersion: string;
}

export interface Money {
  amount: string;
  currencyCode: string;
}

export interface ProductImage {
  id?: string;
  url: string;
  altText?: string | null;
}

export interface ProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  price: Money;
  image?: ProductImage | null;
  selectedOptions: Array<{ name: string; value: string }>;
}

export interface Product {
  id: string;
  title: string;
  handle: string;
  description: string;
  productType?: string;
  vendor?: string;
  tags?: string[];
  availableForSale: boolean;
  featuredImage?: ProductImage | null;
  images: ProductImage[];
  variants: ProductVariant[];
  priceRange: {
    minVariantPrice: Money;
    maxVariantPrice: Money;
  };
}

export interface ProductConnectionResult {
  products: Product[];
  pageInfo: {
    hasNextPage: boolean;
    endCursor?: string | null;
  };
}

export interface CartLine {
  id: string;
  quantity: number;
  title: string;
  variantTitle: string;
  image?: ProductImage | null;
  price: Money;
  lineTotal: Money;
}

export interface Cart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  subtotal: Money;
  lines: CartLine[];
}

interface GraphQLErrorPayload {
  message: string;
}

interface UserError {
  field?: string[];
  message: string;
}

const PRODUCT_FIELDS = `
  id
  title
  handle
  description
  productType
  vendor
  tags
  availableForSale
  featuredImage {
    id
    altText
    url(transform: { maxWidth: 1200, maxHeight: 1200, crop: CENTER, preferredContentType: WEBP })
  }
  images(first: 8) {
    nodes {
      id
      altText
      url(transform: { maxWidth: 2000, maxHeight: 2000, preferredContentType: WEBP })
    }
  }
  priceRange {
    minVariantPrice { amount currencyCode }
    maxVariantPrice { amount currencyCode }
  }
  variants(first: 50) {
    nodes {
      id
      title
      availableForSale
      price { amount currencyCode }
      selectedOptions { name value }
      image {
        id
        altText
        url(transform: { maxWidth: 2000, maxHeight: 2000, preferredContentType: WEBP })
      }
    }
  }
`;

const CART_FIELDS = `
  id
  checkoutUrl
  totalQuantity
  cost {
    subtotalAmount { amount currencyCode }
  }
  lines(first: 50) {
    nodes {
      id
      quantity
      cost {
        totalAmount { amount currencyCode }
      }
      merchandise {
        ... on ProductVariant {
          id
          title
          price { amount currencyCode }
          image {
            id
            altText
            url(transform: { maxWidth: 600, maxHeight: 600, crop: CENTER, preferredContentType: WEBP })
          }
          product {
            title
            featuredImage {
              id
              altText
              url(transform: { maxWidth: 600, maxHeight: 600, crop: CENTER, preferredContentType: WEBP })
            }
          }
        }
      }
    }
  }
`;

export const collectionIdToGid = (collectionId?: string) =>
  collectionId ? `gid://shopify/Collection/${collectionId}` : '';

export const isStorefrontConfigured = (config: StorefrontConfig) =>
  Boolean(config.domain && config.token && config.apiVersion);

async function storefrontRequest<T>(
  config: StorefrontConfig,
  query: string,
  variables: Record<string, unknown> = {},
): Promise<T> {
  if (!isStorefrontConfigured(config)) {
    throw new Error('Storefront API is not configured.');
  }

  const endpoint = `https://${config.domain}/api/${config.apiVersion}/graphql.json`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': config.token,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`Shopify request failed (${response.status}).`);
  }

  const payload = (await response.json()) as {
    data?: T;
    errors?: GraphQLErrorPayload[];
  };

  if (payload.errors?.length) {
    throw new Error(payload.errors.map((error) => error.message).join(' / '));
  }

  if (!payload.data) throw new Error('Shopify response was empty.');
  return payload.data;
}

function assertNoUserErrors(errors?: UserError[]) {
  if (!errors?.length) return;
  throw new Error(errors.map((error) => error.message).join(' / '));
}

function normalizeImage(image?: ProductImage | null): ProductImage | null {
  if (!image?.url) return null;
  return image;
}

function connectionNodes<T>(value?: T[] | { nodes?: T[] } | null): T[] {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.nodes)) return value.nodes;
  return [];
}

function normalizeProduct(product: any): Product {
  const images = connectionNodes<ProductImage>(product.images).filter((image) => image?.url);
  const variants = connectionNodes<ProductVariant>(product.variants).filter((variant) => variant?.id);
  const featuredImage = normalizeImage(product.featuredImage) || images[0] || null;

  return {
    ...product,
    description: product.description || '',
    featuredImage,
    images: images.length ? images : featuredImage ? [featuredImage] : [],
    variants,
  };
}

function normalizeProductConnection(connection: {
  nodes?: Product[];
  pageInfo?: { hasNextPage: boolean; endCursor?: string | null };
}): ProductConnectionResult {
  return {
    products: (connection.nodes || []).map(normalizeProduct),
    pageInfo: {
      hasNextPage: Boolean(connection.pageInfo?.hasNextPage),
      endCursor: connection.pageInfo?.endCursor || null,
    },
  };
}

export async function fetchGlobalProducts(
  config: StorefrontConfig,
  options: { first?: number; after?: string | null; search?: string } = {},
): Promise<ProductConnectionResult> {
  const query = `
    query Products($first: Int!, $after: String, $query: String) {
      products(first: $first, after: $after, query: $query) {
        nodes { ${PRODUCT_FIELDS} }
        pageInfo { hasNextPage endCursor }
      }
    }
  `;

  const data = await storefrontRequest<{ products: { nodes: Product[]; pageInfo: ProductConnectionResult['pageInfo'] } }>(
    config,
    query,
    {
      first: options.first || 24,
      after: options.after || null,
      query: options.search?.trim() || null,
    },
  );

  return normalizeProductConnection(data.products);
}

export async function fetchCollectionProducts(
  config: StorefrontConfig,
  options: { collectionId: string; first?: number; after?: string | null },
): Promise<ProductConnectionResult> {
  const query = `
    query CollectionProducts($id: ID!, $first: Int!, $after: String) {
      node(id: $id) {
        ... on Collection {
          products(first: $first, after: $after) {
            nodes { ${PRODUCT_FIELDS} }
            pageInfo { hasNextPage endCursor }
          }
        }
      }
    }
  `;

  const data = await storefrontRequest<{
    node?: { products?: { nodes: Product[]; pageInfo: ProductConnectionResult['pageInfo'] } } | null;
  }>(config, query, {
    id: collectionIdToGid(options.collectionId),
    first: options.first || 24,
    after: options.after || null,
  });

  if (!data.node?.products) {
    throw new Error('Collection is not available.');
  }

  return normalizeProductConnection(data.node.products);
}

export function filterProductsLocally(products: Product[], search: string) {
  const needle = search.trim().toLowerCase();
  if (!needle) return products;

  return products.filter((product) => {
    const haystack = [
      product.title,
      product.description,
      product.handle,
      product.productType || '',
      product.vendor || '',
      ...(product.tags || []),
      ...product.variants.map((variant) => variant.title),
    ]
      .join(' ')
      .toLowerCase();

    return haystack.includes(needle);
  });
}

function normalizeCart(cart?: any): Cart | null {
  if (!cart?.id) return null;
  return {
    id: cart.id,
    checkoutUrl: cart.checkoutUrl,
    totalQuantity: cart.totalQuantity || 0,
    subtotal: cart.subtotal || cart.cost?.subtotalAmount,
    lines:
      cart.lines?.nodes?.map((line: any) => {
        const variant = line.merchandise;
        return {
          id: line.id,
          quantity: line.quantity,
          title: variant?.product?.title || 'Product',
          variantTitle: variant?.title === 'Default Title' ? '' : variant?.title || '',
          image: normalizeImage(variant?.image) || normalizeImage(variant?.product?.featuredImage),
          price: variant?.price,
          lineTotal: line.cost?.totalAmount,
        };
      }) || [],
  } as Cart;
}

export async function fetchCart(config: StorefrontConfig, cartId: string): Promise<Cart | null> {
  const query = `
    query Cart($id: ID!) {
      cart(id: $id) { ${CART_FIELDS} }
    }
  `;
  const data = await storefrontRequest<{ cart?: any }>(config, query, { id: cartId });
  return normalizeCart(data.cart);
}

export async function createCart(
  config: StorefrontConfig,
  line?: { merchandiseId: string; quantity: number },
): Promise<Cart> {
  const query = `
    mutation CartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart { ${CART_FIELDS} }
        userErrors { field message }
      }
    }
  `;
  const data = await storefrontRequest<{
    cartCreate: { cart?: any; userErrors: UserError[] };
  }>(config, query, {
    input: line ? { lines: [line] } : {},
  });

  assertNoUserErrors(data.cartCreate.userErrors);
  const cart = normalizeCart(data.cartCreate.cart);
  if (!cart) throw new Error('Cart could not be created.');
  return cart;
}

export async function addCartLine(
  config: StorefrontConfig,
  cartId: string,
  line: { merchandiseId: string; quantity: number },
): Promise<Cart> {
  const query = `
    mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart { ${CART_FIELDS} }
        userErrors { field message }
      }
    }
  `;
  const data = await storefrontRequest<{
    cartLinesAdd: { cart?: any; userErrors: UserError[] };
  }>(config, query, { cartId, lines: [line] });

  assertNoUserErrors(data.cartLinesAdd.userErrors);
  const cart = normalizeCart(data.cartLinesAdd.cart);
  if (!cart) throw new Error('Cart could not be updated.');
  return cart;
}

export async function updateCartLine(
  config: StorefrontConfig,
  cartId: string,
  lineId: string,
  quantity: number,
): Promise<Cart> {
  const query = `
    mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart { ${CART_FIELDS} }
        userErrors { field message }
      }
    }
  `;
  const data = await storefrontRequest<{
    cartLinesUpdate: { cart?: any; userErrors: UserError[] };
  }>(config, query, { cartId, lines: [{ id: lineId, quantity }] });

  assertNoUserErrors(data.cartLinesUpdate.userErrors);
  const cart = normalizeCart(data.cartLinesUpdate.cart);
  if (!cart) throw new Error('Cart could not be updated.');
  return cart;
}

export async function removeCartLine(config: StorefrontConfig, cartId: string, lineId: string): Promise<Cart> {
  const query = `
    mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart { ${CART_FIELDS} }
        userErrors { field message }
      }
    }
  `;
  const data = await storefrontRequest<{
    cartLinesRemove: { cart?: any; userErrors: UserError[] };
  }>(config, query, { cartId, lineIds: [lineId] });

  assertNoUserErrors(data.cartLinesRemove.userErrors);
  const cart = normalizeCart(data.cartLinesRemove.cart);
  if (!cart) throw new Error('Cart could not be updated.');
  return cart;
}
