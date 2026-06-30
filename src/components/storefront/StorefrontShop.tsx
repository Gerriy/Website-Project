import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { buildProductTagBadges } from '../../data/shopTags';
import {
  addCartLine,
  createCart,
  fetchCart,
  fetchCollectionProducts,
  fetchGlobalProducts,
  filterProductsLocally,
  isStorefrontConfigured,
  removeCartLine,
  updateCartLine,
  type Cart,
  type Product,
  type ProductVariant,
  type StorefrontConfig,
} from '../../lib/shopifyStorefront';

interface FilterItem {
  slug: string;
  label: string;
  collectionId?: string;
  isDefault?: boolean;
}

interface StorefrontShopProps {
  themeCollections: FilterItem[];
  creatorFilters: FilterItem[];
  config: StorefrontConfig;
  downIconSrc: string;
}

type FilterMode = 'theme' | 'creator';

const CART_STORAGE_KEY = 'masta-dan-storefront-cart-id';
const PAGE_SIZE = 24;
const FILTERED_SEARCH_SIZE = 100;

function formatMoney(money?: { amount: string; currencyCode: string }) {
  if (!money) return '';
  const amount = Number(money.amount);
  if (Number.isNaN(amount)) return `$${money.amount}`;

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: money.currencyCode,
    currencyDisplay: 'narrowSymbol',
  }).format(amount);
}

function formatProductPrice(product: Product) {
  const min = product.priceRange.minVariantPrice;
  const max = product.priceRange.maxVariantPrice;

  if (min.amount === max.amount && min.currencyCode === max.currencyCode) {
    return formatMoney(min);
  }

  return `${formatMoney(min)} – ${formatMoney(max)}`;
}

function firstAvailableVariant(product: Product) {
  return product.variants.find((variant) => variant.availableForSale) || product.variants[0] || null;
}

function ProductTagList({ tags }: { tags?: string[] }) {
  const badges = buildProductTagBadges(tags || []);
  if (!badges.length) return null;

  return (
    <div className="storefront-tags" aria-label="Product tags">
      {badges.map((tag) => (
        <span
          key={`${tag.category}-${tag.sourceTag}`}
          className={`storefront-tag storefront-tag-${tag.category.toLowerCase()}`}
          style={{ '--tag-color': tag.color } as React.CSSProperties}
          title={`${tag.displayEn} / ${tag.displayCn}`}
        >
          {tag.category === 'Creator' && <i aria-hidden="true" />}
          <span>{tag.displayCn}</span>
        </span>
      ))}
    </div>
  );
}

export default function StorefrontShop({
  themeCollections,
  creatorFilters,
  config,
  downIconSrc,
}: StorefrontShopProps) {
  const [filterMode, setFilterModeState] = useState<FilterMode>('theme');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState('all');
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [pageInfo, setPageInfo] = useState<{ hasNextPage: boolean; endCursor?: string | null }>({
    hasNextPage: false,
    endCursor: null,
  });
  const [status, setStatus] = useState('商品載入中…');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [activeImageUrl, setActiveImageUrl] = useState('');
  const [selectedVariantId, setSelectedVariantId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState<Cart | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartBusy, setCartBusy] = useState(false);
  const [cartMessage, setCartMessage] = useState('');

  const filterSets = useMemo(
    () => ({
      theme: themeCollections,
      creator: creatorFilters,
    }),
    [themeCollections, creatorFilters],
  );

  const activeFilters = filterSets[filterMode];
  const activeFilter = activeFilters.find((filter) => filter.slug === selectedSlug) || activeFilters[0];
  const isAllFilter = !activeFilter || activeFilter.slug === 'all';
  const selectedVariant = activeProduct?.variants.find((variant) => variant.id === selectedVariantId) || null;
  const configured = isStorefrontConfigured(config);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setSearchTerm(searchInput.trim()), 250);
    return () => window.clearTimeout(timeoutId);
  }, [searchInput]);

  const loadProducts = useCallback(
    async (after?: string | null, append = false) => {
      if (!configured) {
        setProducts([]);
        setPageInfo({ hasNextPage: false, endCursor: null });
        setStatus('');
        setError('Storefront API 尚未設定。請先加入 PUBLIC_SHOPIFY_STOREFRONT_TOKEN。');
        return;
      }

      const currentFilter = activeFilter;
      if (!currentFilter) return;

      if (!isAllFilter && !currentFilter.collectionId) {
        setProducts([]);
        setPageInfo({ hasNextPage: false, endCursor: null });
        setStatus('準備中...');
        setError('');
        return;
      }

      append ? setLoadingMore(true) : setLoading(true);
      setError('');
      setStatus(searchTerm ? '搜尋中…' : '商品載入中…');

      try {
        const result =
          isAllFilter
            ? await fetchGlobalProducts(config, {
                first: PAGE_SIZE,
                after,
                search: searchTerm,
              })
            : searchTerm
              ? (() => null)()
              : await fetchCollectionProducts(config, {
                  collectionId: currentFilter.collectionId || '',
                  first: PAGE_SIZE,
                  after,
                });

        if (result) {
          setProducts((current) => (append ? [...current, ...result.products] : result.products));
          setPageInfo(result.pageInfo);
          setStatus(result.products.length ? '' : '沒有找到商品');
          return;
        }

        const collectionResult = await fetchCollectionProducts(config, {
          collectionId: currentFilter.collectionId || '',
          first: FILTERED_SEARCH_SIZE,
        });
        const filteredProducts = filterProductsLocally(collectionResult.products, searchTerm);
        setProducts(filteredProducts);
        setPageInfo({ hasNextPage: false, endCursor: null });
        setStatus(filteredProducts.length ? '' : '沒有找到商品');
      } catch (shopifyError) {
        setProducts([]);
        setPageInfo({ hasNextPage: false, endCursor: null });
        setStatus('');
        setError(shopifyError instanceof Error ? shopifyError.message : '商品未能載入，請稍後再試。');
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [activeFilter, config, configured, isAllFilter, searchTerm],
  );

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (cancelled) return;
      await loadProducts(null, false);
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [loadProducts]);

  useEffect(() => {
    if (!configured) return;
    const storedCartId = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!storedCartId) return;

    fetchCart(config, storedCartId)
      .then((loadedCart) => {
        if (!loadedCart) {
          window.localStorage.removeItem(CART_STORAGE_KEY);
          return;
        }
        setCart(loadedCart);
      })
      .catch(() => window.localStorage.removeItem(CART_STORAGE_KEY));
  }, [config, configured]);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent('masta-dan:cart-updated', {
        detail: {
          quantity: cart?.totalQuantity || 0,
          hasItems: Boolean(cart?.lines.length),
        },
      }),
    );
  }, [cart?.totalQuantity, cart?.lines.length]);

  useEffect(() => {
    const handleCartRequest = () => {
      if (cart?.lines.length) {
        setCartOpen(true);
        return;
      }

      document.querySelector('.storefront-shop')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    window.addEventListener('masta-dan:cart-requested', handleCartRequest);
    return () => window.removeEventListener('masta-dan:cart-requested', handleCartRequest);
  }, [cart?.lines.length]);

  const setFilterMode = (nextMode: FilterMode) => {
    setFilterModeState(nextMode);
    setSelectedSlug('all');
    setSearchInput('');
    setSearchTerm('');
    setDropdownOpen(false);
  };

  const openProduct = (product: Product) => {
    const variant = firstAvailableVariant(product);
    const image = variant?.image?.url || product.images[0]?.url || product.featuredImage?.url || '';
    setActiveProduct(product);
    setSelectedVariantId(variant?.id || '');
    setActiveImageUrl(image);
    setQuantity(1);
  };

  const closeProduct = () => {
    setActiveProduct(null);
    setSelectedVariantId('');
    setActiveImageUrl('');
    setQuantity(1);
  };

  const persistCart = (nextCart: Cart) => {
    window.localStorage.setItem(CART_STORAGE_KEY, nextCart.id);
    setCart(nextCart);
  };

  const addSelectedToCart = async () => {
    if (!selectedVariant || !selectedVariant.availableForSale) return;
    setCartBusy(true);
    setCartMessage('');

    const line = {
      merchandiseId: selectedVariant.id,
      quantity: Math.max(1, quantity),
    };

    try {
      const nextCart = cart
        ? await addCartLine(config, cart.id, line)
        : await createCart(config, line);
      persistCart(nextCart);
      setCartOpen(true);
      closeProduct();
    } catch {
      try {
        window.localStorage.removeItem(CART_STORAGE_KEY);
        const nextCart = await createCart(config, line);
        persistCart(nextCart);
        setCartOpen(true);
        closeProduct();
      } catch (cartError) {
        setCartMessage(cartError instanceof Error ? cartError.message : '未能加入購物車，請稍後再試。');
      }
    } finally {
      setCartBusy(false);
    }
  };

  const changeCartQuantity = async (lineId: string, nextQuantity: number) => {
    if (!cart) return;
    setCartBusy(true);
    setCartMessage('');

    try {
      const nextCart =
        nextQuantity <= 0
          ? await removeCartLine(config, cart.id, lineId)
          : await updateCartLine(config, cart.id, lineId, nextQuantity);
      persistCart(nextCart);
    } catch (cartError) {
      setCartMessage(cartError instanceof Error ? cartError.message : '購物車未能更新，請稍後再試。');
    } finally {
      setCartBusy(false);
    }
  };

  return (
    <section className="section shell shopify-buy-section storefront-shop" aria-label="Storefront API shopping products">
      <div className="shop-filter-panel reveal is-visible" aria-label="Shop filters">
        <div className={`shop-filter-dropdown${dropdownOpen ? ' is-open' : ''}`} data-shop-filter-dropdown>
          <button
            className="shop-filter-trigger"
            type="button"
            aria-expanded={dropdownOpen}
            aria-controls="storefront-filter-menu"
            onClick={() => setDropdownOpen((open) => !open)}
          >
            <span>{filterMode === 'theme' ? '作品分類' : '創作者分類'}</span>
            <img src={downIconSrc} alt="" aria-hidden="true" />
          </button>

          <div className="shop-filter-menu" id="storefront-filter-menu" role="listbox" hidden={!dropdownOpen}>
            <button
              className={`shop-filter-option${filterMode === 'theme' ? ' is-active' : ''}`}
              type="button"
              role="option"
              aria-selected={filterMode === 'theme'}
              onClick={() => setFilterMode('theme')}
            >
              作品分類
            </button>
            <button
              className={`shop-filter-option${filterMode === 'creator' ? ' is-active' : ''}`}
              type="button"
              role="option"
              aria-selected={filterMode === 'creator'}
              onClick={() => setFilterMode('creator')}
            >
              創作者分類
            </button>
          </div>
        </div>

        <div className="shop-filter-buttons" role="group" aria-label={filterMode === 'theme' ? '作品分類' : '創作者分類'}>
          {activeFilters.map((filter) => (
            <button
              key={filter.slug}
              className="shop-filter-button"
              type="button"
              aria-pressed={selectedSlug === filter.slug}
              onClick={() => setSelectedSlug(filter.slug)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <label className="storefront-search">
          <span>搜尋商品</span>
          <input
            value={searchInput}
            onChange={(event) => setSearchInput(event.currentTarget.value)}
            type="search"
            placeholder={isAllFilter ? '搜尋全部商品' : `搜尋 ${activeFilter?.label || ''}`}
          />
        </label>
      </div>

      <div className="shopify-buy-panel reveal is-visible storefront-panel" style={{ '--delay': '90ms' } as React.CSSProperties}>
        {!configured && (
          <div className="storefront-config-warning">
            <strong>Storefront API 尚未設定</strong>
            <p>請在本機 `.env` 或 GitHub Variables 加入 PUBLIC_SHOPIFY_STOREFRONT_TOKEN。</p>
          </div>
        )}

        {error && <p className="shopify-status is-error">{error}</p>}
        {status && !error && <p className="shopify-status">{status}</p>}

        <div className="storefront-grid" aria-busy={loading}>
          {products.map((product) => {
            const image = product.featuredImage || product.images[0];
            return (
              <article className="storefront-card" key={product.id}>
                <button className="storefront-card-image" type="button" onClick={() => openProduct(product)}>
                  {image ? <img src={image.url} alt={image.altText || product.title} loading="lazy" /> : <span>Image pending</span>}
                  {!product.availableForSale && <em>暫時售罄</em>}
                </button>
                <h2>{product.title}</h2>
                <p>{formatProductPrice(product)}</p>
                <button className="primary-button storefront-card-button" type="button" onClick={() => openProduct(product)}>
                  查看詳情
                </button>
              </article>
            );
          })}
        </div>

        {pageInfo.hasNextPage && !searchTerm && (
          <div className="storefront-load-more">
            <button
              className="primary-button"
              type="button"
              disabled={loadingMore}
              onClick={() => loadProducts(pageInfo.endCursor, true)}
            >
              {loadingMore ? '載入中…' : '載入更多'}
            </button>
          </div>
        )}
      </div>

      {activeProduct && (
        <div className="storefront-overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && closeProduct()}>
          <section className="storefront-modal" role="dialog" aria-modal="true" aria-labelledby="storefront-product-title">
            <button className="storefront-close" type="button" onClick={closeProduct} aria-label="Close product detail">
              ×
            </button>
            <div className="storefront-modal-body">
            <div className="storefront-modal-gallery">
              {activeImageUrl ? <img src={activeImageUrl} alt={activeProduct.title} /> : <div className="storefront-image-placeholder">Image pending</div>}
              {activeProduct.images.length > 1 && (
                <div className="storefront-thumbs">
                  {activeProduct.images.map((image) => (
                    <button
                      key={image.url}
                      type="button"
                      className={activeImageUrl === image.url ? 'is-active' : ''}
                      onClick={() => setActiveImageUrl(image.url)}
                    >
                      <img src={image.url} alt={image.altText || activeProduct.title} />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="storefront-modal-copy">
              <h2 id="storefront-product-title">{activeProduct.title}</h2>
              <ProductTagList tags={activeProduct.tags} />
              <p className="storefront-price">{selectedVariant ? formatMoney(selectedVariant.price) : formatProductPrice(activeProduct)}</p>
              {activeProduct.descriptionHtml ? (
                <div className="storefront-description" dangerouslySetInnerHTML={{ __html: activeProduct.descriptionHtml }} />
              ) : (
                activeProduct.description && <p className="storefront-description">{activeProduct.description}</p>
              )}

              {activeProduct.variants.length > 1 && (
                <label className="storefront-select">
                  <span>款式</span>
                  <select
                    value={selectedVariantId}
                    onChange={(event) => {
                      const nextVariant = activeProduct.variants.find((variant) => variant.id === event.currentTarget.value);
                      setSelectedVariantId(event.currentTarget.value);
                      if (nextVariant?.image?.url) setActiveImageUrl(nextVariant.image.url);
                    }}
                  >
                    {activeProduct.variants.map((variant) => (
                      <option key={variant.id} value={variant.id} disabled={!variant.availableForSale}>
                        {variant.title}
                        {!variant.availableForSale ? ' — 暫時售罄' : ''}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              <label className="storefront-quantity">
                <span>數量</span>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(event) => setQuantity(Math.max(1, Number(event.currentTarget.value) || 1))}
                />
              </label>

              <button
                className="primary-button storefront-add"
                type="button"
                disabled={!selectedVariant?.availableForSale || cartBusy}
                onClick={addSelectedToCart}
              >
                {!selectedVariant?.availableForSale ? '暫時售罄' : cartBusy ? '加入中…' : '加入購物車'}
              </button>
              {cartMessage && <p className="shopify-status is-error">{cartMessage}</p>}
            </div>
            </div>
          </section>
        </div>
      )}

      <div className={`storefront-cart-shell${cartOpen ? ' is-open' : ''}`} aria-hidden={!cartOpen}>
        <button className="storefront-cart-backdrop" type="button" onClick={() => setCartOpen(false)} aria-label="Close cart" />
        <aside className="storefront-cart-drawer" aria-label="購物車">
          <div className="storefront-cart-header">
            <h2>購物車</h2>
            <button type="button" onClick={() => setCartOpen(false)} aria-label="Close cart">
              ×
            </button>
          </div>

          {!cart?.lines.length ? (
            <p className="storefront-empty-cart">購物車暫時是空的。</p>
          ) : (
            <div className="storefront-cart-lines">
              {cart.lines.map((line) => (
                <article className="storefront-cart-line" key={line.id}>
                  {line.image && <img src={line.image.url} alt={line.image.altText || line.title} />}
                  <div>
                    <h3>{line.title}</h3>
                    {line.variantTitle && <p>{line.variantTitle}</p>}
                    <strong>{formatMoney(line.lineTotal)}</strong>
                    <div className="storefront-cart-qty">
                      <button type="button" disabled={cartBusy} onClick={() => changeCartQuantity(line.id, line.quantity - 1)}>
                        −
                      </button>
                      <span>{line.quantity}</span>
                      <button type="button" disabled={cartBusy} onClick={() => changeCartQuantity(line.id, line.quantity + 1)}>
                        +
                      </button>
                      <button type="button" disabled={cartBusy} onClick={() => changeCartQuantity(line.id, 0)}>
                        移除
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {cartMessage && <p className="shopify-status is-error">{cartMessage}</p>}

          <div className="storefront-cart-footer">
            <div>
              <span>小計</span>
              <strong>{formatMoney(cart?.subtotal)}</strong>
            </div>
            <a className={`primary-button${!cart?.checkoutUrl ? ' is-disabled' : ''}`} href={cart?.checkoutUrl || '#'} rel="noopener noreferrer">
              結帳
            </a>
          </div>
        </aside>
      </div>
    </section>
  );
}
