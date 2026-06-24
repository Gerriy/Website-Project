# Masta Dan website

Dependency-free static website prepared for GitHub Pages. The first release contains the homepage and About page, subtle reveal animations, responsive navigation and reserved UI for a later Shopify Buy Button integration.

## Preview locally

Any small static server will work. For example, if Python is installed:

```powershell
python -m http.server 8080
```

Then open `http://localhost:8080`.

## Replace placeholder assets

Place optimized WebP images at the paths below. Placeholders disappear automatically when a valid image exists.

| Slot | File path | Suggested shape |
| --- | --- | --- |
| Homepage character group | `assets/images/home/hero-characters.webp` | Wide transparent image, about 18:7 |
| Homepage team photo | `assets/images/home/team-photo.webp` | 4:3 |
| Homepage contact art | `assets/images/home/contact-art.webp` | 16:10 |
| About group photo | `assets/images/about/group-photo.webp` | 3:2 |
| Member portraits | `assets/images/members/{name}.webp` | 1:1, ideally 800 × 800 |

Member filenames are `chowee.webp`, `yy.webp`, `p-chan.webp`, `gerri.webp`, `ahua.webp`, `popo.webp` and `ethan-yes.webp`.

Update temporary copy, email and social links directly in `index.html` and `about/index.html` once final content is ready.

## GitHub Pages and custom domain

1. Push the repository to GitHub.
2. In **Settings → Pages**, deploy from the root of the main branch.
3. Add the custom domain in the Pages settings.
4. GitHub will create or request a `CNAME` file; keep that file in the repository root.

Because the site has no build step, deployment is immediate and there are no package dependencies to maintain.

## Shopify integration seam

The navigation and cart position are reserved. When Shopify materials are ready, add the Buy Button sales channel script and mount its product/cart components into new `shopping/` pages. Shopify should remain responsible for secure checkout and payment.
