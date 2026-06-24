# Masta Dan website

Astro-based static website for Masta Dan, prepared for GitHub Pages and a future Shopify Buy Button integration. The current release includes the homepage and About page. It uses Astro components and small browser-native scripts; React is intentionally not installed.

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
  components/       Reusable header, footer, hero, members, CTA and shop previews
  data/             Copy and member sources of truth
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
| Homepage team photo | `public/assets/images/home/team-photo.webp` |
| Homepage contact art | `public/assets/images/home/contact-art.webp` |
| About group photo | `public/assets/images/about/group-photo.webp` |
| Product previews | `public/assets/images/products/product-1.webp` through `product-3.webp` |
| Member portraits | `public/assets/images/members/{member-id}.png` |

The seven current member filenames are `chowee.png`, `yy.png`, `p-chan.png`, `gerri.png`, `ahua.png`, `popo.png` and `ethan-yes.png`.

## Edit copy and members

- Update all shared English and Traditional Chinese copy in `src/data/siteCopy.ts`.
- Update names, roles, image paths and Instagram URLs in `src/data/members.ts`.
- The member grid is rendered from that data file on both pages, so all seven members remain synchronized.

No corrected Traditional Chinese source document has been supplied yet. Unverified Chinese strings have been replaced with `[TC copy pending]`. Replace those markers only with approved Traditional Chinese copy; do not auto-translate or convert it to Simplified Chinese. See `reference/content/README.md`.

## Shopify phase

`ShopifyPlaceholder.astro` reserves the future integration boundary. Shopify product/card mounting can be added without replacing the existing Header, catalogue layout or pages. Shopify should continue to handle secure checkout and payment.

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
