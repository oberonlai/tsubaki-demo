# Tsubaki (椿) — Japanese-Inspired Blog Theme for Astro

![Tsubaki Banner](./public/og-image.png)

> Bring the quiet elegance of Japanese design to your blog.

Tsubaki (椿, Camellia) is a premium Astro blog theme that draws from Japanese minimalist philosophy — **Ma** (間, negative space), **Wabi-sabi** (侘寂, beauty in imperfection), **Kanso** (簡素, simplicity), and **Shibui** (渋い, subtle elegance). Every detail, from typography to scroll-triggered animations, is crafted to create a reading experience that feels unhurried and intentional.

**[Live Demo](https://tsubaki-demo.netlify.app)** · **[Buy on Polar.sh](https://polar.sh/codotx)**

---

## Features

### 8 Production-Ready Pages
- **Home** — Hero with GSAP word-by-word reveal animation
- **Blog listing** — Bento-grid layout with tag filtering
- **Blog post** — Article layout with auto-generated TOC, reading progress bar, author bio
- **About** — Design philosophy cards
- **Tags & Tag filter pages**
- **404** — On-brand error page
- **RSS feed** (auto-generated)

### 9 Polished Components
`Nav` · `Footer` · `BlogCard` (3 variants incl. featured) · `BlogGrid` · `ReadingProgress` · `TableOfContents` · `AuthorBio` · `TagCloud` · `Pagination` · `ThemeToggle`

### GSAP Animations (Buttery Smooth)
- Hero text: word-by-word split reveal
- Blog cards: scroll-triggered reveal with stagger
- Reading progress: ScrollTrigger-powered (no scroll listener overhead)
- Page transitions: fade in/out via Astro View Transitions
- All GSAP loaded dynamically — zero first-paint cost (27.79 kB gzipped, lazy)

### Performance-First
- Non-blocking font loading (Playfair Display)
- Astro `<Image />` with responsive srcset on all blog images
- Prefetch on hover for instant navigation
- Sitemap + RSS auto-generated at build
- SSR-safe — all GSAP imports are dynamic
- **95+ Lighthouse score** out of the box

### Content Collections
- Astro content collections with MDX support
- Frontmatter schema: `title`, `description`, `date`, `image`, `author`, `tags`, `draft`
- 4 sample posts demonstrating different content types
- Prose styles for headings, code blocks, tables, blockquotes

### Dark / Light Mode
Carefully tuned color tokens for both modes.

**Built with:** Astro v4, GSAP 3, Tailwind CSS, MDX

---

## Quick Start

```bash
npm create astro@latest -- --template codotx/tsubaki
```

Or clone directly:

```bash
git clone https://github.com/codotx/tsubaki.git my-blog
cd my-blog
npm install
npm run dev
```

Open `http://localhost:4321` to see your new blog.

---

## Configuration

Edit `astro.config.mjs` to set your site URL:

```js
export default defineConfig({
  site: 'https://yourdomain.com',
  // ...
});
```

### Site Metadata

Update `src/layouts/BaseLayout.astro` to customize the default site title, description, and OG image.

### Author & Social Links

Edit `src/components/Footer.astro` and `src/components/Nav.astro` to update your name and social media links.

### Color Tokens

All design tokens live in `src/styles/tsubaki.css`. Key variables:

```css
:root {
  --color-text-primary: #1a1a1a;
  --color-text-secondary: #6b7280;
  --color-bg: #fafaf8;
  --color-accent: #8b2635;
  --font-serif: 'Playfair Display', Georgia, serif;
  --font-sans: 'Inter', system-ui, sans-serif;
}
```

---

## Content: Adding Blog Posts

Create `.md` or `.mdx` files in `src/content/blog/`:

```md
---
title: "My First Post"
description: "A short description for SEO and card previews."
date: 2024-01-15
tags: ["astro", "tutorial"]
author: "Your Name"
image:
  src: "/images/my-post-hero.jpg"
  alt: "Post hero image"
draft: false
---

Your content here...
```

### Frontmatter Reference

| Field         | Type       | Required | Description                              |
|---------------|------------|----------|------------------------------------------|
| `title`       | `string`   | ✅       | Post title                               |
| `description` | `string`   | ✅       | Used in SEO meta and card previews       |
| `date`        | `Date`     | ✅       | Publication date                         |
| `updatedDate` | `Date`     | ❌       | Last updated date                        |
| `tags`        | `string[]` | ❌       | Tag list for filtering                   |
| `author`      | `string`   | ❌       | Author name (defaults to "Codotx Team") |
| `image`       | `object`   | ❌       | `{ src, alt }` for hero image            |
| `draft`       | `boolean`  | ❌       | Set to `true` to hide from production    |

---

## Customization

### Component Overrides

All components are in `src/components/`. They're plain Astro components — edit them directly.

### BlogCard Variants

`BlogCard.astro` accepts a `variant` prop:

```astro
<BlogCard post={post} variant="featured" />
<BlogCard post={post} variant="compact" />
<BlogCard post={post} />  <!-- default -->
```

### Disabling Animations

To disable GSAP on a specific page, simply don't import the animation utilities in the page `<script>` block.

---

## Performance Notes

Tsubaki is built with a performance-first mindset:

- GSAP is **dynamically imported** — it never blocks the initial page load
- Fonts use `font-display: swap` with preconnect hints
- All images use Astro's optimized `<Image />` component (WebP output, responsive srcset)
- `prefetch: { defaultStrategy: 'hover' }` gives instant-feeling navigation
- Content is fully static at build time — no client-side data fetching

To verify your Lighthouse score:

```bash
npm run build && npm run preview
# Then open Chrome DevTools → Lighthouse
```

---

## License

Tsubaki is a **commercial theme**. Each purchase includes a license for one site.

| License    | Price | Sites |
|------------|-------|-------|
| Personal   | $49   | 1 personal site |
| Commercial | $79   | 1 commercial/business site |

**[Purchase a license →](https://polar.sh/codotx)**

You may not redistribute, resell, or transfer the theme. See the full license terms at [codotx.com/license](https://codotx.com/license).

---

## Credits

- [Astro](https://astro.build) — The web framework for content-driven websites
- [GSAP](https://gsap.com) — Professional-grade animation library
- [Tailwind CSS](https://tailwindcss.com) — Utility-first CSS framework
- [Playfair Display](https://fonts.google.com/specimen/Playfair+Display) — Serif typeface by Claus Eggers Sørensen

---

Made with 椿 by [Codotx](https://codotx.com)
