# Masta Dan website

Astro-based static website for Masta Dan, prepared for GitHub Pages and Shopify commerce. The live shop currently uses Shopify Buy Button, while a hidden Storefront API lab route is being built with a small React island for product search, modal, cart and checkout state.

## Requirements

- Node.js 24 LTS
- npm 11+

## Commands

```powershell
npm install
npm run dev
npm run build
npm run preview
```

- `npm run dev` starts the editable local development server.
- `npm run build` generates the production site in `dist/`.
- `npm run preview` previews the completed production build.

## Project structure

```text
src/
  components/       Reusable header, footer, hero, members, CTA and shop components
  data/             Copy and member sources of truth
  lib/              Storefront API client and shared commerce helpers
  layouts/          Shared document layout
  pages/            Homepage and About routes
  scripts/          Navigation, image fallback and reveal behaviour
  styles/           Shared responsive styling
public/assets/      Images and other files copied directly to the built site
reference/          Original design, sitemap and copy notes
```

## Hero/banner image

The current hero artwork is stored at:

```text
public/assets/images/hero/home-hero.png
```

Replace that file with another PNG using the same filename, or change `hero.image` in `src/data/siteCopy.ts` if the extension or filename changes. The Hero component checks for the file during the build. If it is missing, the page retains the text heading and displays a clearly labelled asset placeholder.

## Other images

Missing images do not remove content. Every image slot retains its size and displays a label until a valid file is available.

| Content | Location |
| --- | --- |
| Brand logo | `public/assets/images/brand/logo.png` |
| Homepage team photo | `public/assets/images/home/team-photo.png` |
| Homepage contact art | `public/assets/images/home/contact-art.webp` |
| About group photo | `public/assets/images/about/group-photo.webp` |
| Product previews | `public/assets/images/products/product-1.webp` through `product-3.webp` |
| Member portraits | `public/assets/images/members/{member-id}.png` |

The seven current member filenames are `chowee.png`, `yy.png`, `p-chan.png`, `gerri.png`, `ahua.png`, `popo.png` and `ethan-yes.png`.

## Edit copy and members

- Update all shared English and Traditional Chinese copy in `src/data/siteCopy.ts`.
- Update names, roles, image paths and Instagram URLs in `src/data/members.ts`.
- The member grid is rendered from that data file on both pages, so all seven members remain synchronized.

Approved Traditional Chinese member titles live in `src/data/members.ts`. Other unverified Chinese strings remain marked `[TC copy pending]`; replace those markers only with approved Traditional Chinese copy. The header reserves an EN / 繁中 control for dedicated language routes in a later phase. See `reference/content/README.md`.

## Shopify / Storefront API

The public `/shop/` route uses the custom Storefront API implementation. The previous Shopify Buy Button version is archived at:

```text
/shop-buy-button-archive/
```

The archive route is not linked from navigation and includes `noindex,nofollow`, but it is not private. Anyone with the URL can visit it.

### Required local environment

Copy `.env.example` to `.env` and replace the token:

```text
PUBLIC_SHOPIFY_DOMAIN=q1h1fd-1k.myshopify.com
PUBLIC_SHOPIFY_STOREFRONT_TOKEN=replace-with-public-storefront-token
PUBLIC_SHOPIFY_API_VERSION=2026-04
```

Only use a public Shopify Storefront API token here. Never place a Shopify Admin API token or private token in these `PUBLIC_` variables.

Recommended Shopify custom app setup:

- App name: `Masta Dan Website Storefront`
- Grant only the minimum unauthenticated Storefront API scopes needed for product listings, inventory availability if used, cart and checkout.
- Rotate the token if it is accidentally over-scoped or exposed in the wrong place.

For GitHub Pages deployment, add `PUBLIC_SHOPIFY_STOREFRONT_TOKEN` as a GitHub Actions repository Secret. The workflow already supplies the shop domain and API version.

## GitHub Pages deployment

The included `.github/workflows/deploy.yml` builds and deploys the site whenever `master` or `main` is pushed. In the GitHub repository, open **Settings → Pages** and set the source to **GitHub Actions**.

### GitHub project page

For a URL such as `https://owner.github.io/repository-name/`, the workflow already supplies:

```text
SITE_URL=https://owner.github.io
BASE_PATH=/repository-name
```

Locally, `BASE_PATH` defaults to `/`.

### Custom domain

The production domain is configured as `https://mastadan.com` with a root base path. The deployment artifact includes `public/CNAME` for portability, although GitHub Pages custom Actions deployments also store the domain through the repository's Pages settings.

To connect or update the custom domain:

1. Add the domain in **Settings → Pages** and follow GitHub's DNS instructions.
2. Keep `public/CNAME` containing only the domain name.
3. Keep the workflow environment set to the custom origin and root base:

```yaml
env:
  SITE_URL: https://mastadan.com
  BASE_PATH: /
```

`astro.config.mjs` reads both environment values, so no source component changes are needed.
