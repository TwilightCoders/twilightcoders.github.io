# Design

## Concept

**The workshop at dusk.** The page opens on a twilight sky: a gradient from
night into a warm horizon, with a faint CSS starfield. Below it the page turns
flat and dark. The name gets one visual idea, and the work gets the rest of the
page.

twilightcoders.net is the open-source side of the studio, so it does not sell.
Commercial products are one quiet link away at twilightcoders.com.

## Structure

1. **Hero:** who we are in one sentence, plus three live figures (gem downloads,
   open-source projects, publishing since).
2. **Selected work:** six featured projects in alternating rows. Each row
   shows a real screenshot or a real usage snippet from the project's README,
   and links to a detail page at `/work/<slug>/`.
3. **Catalog:** every project we maintain, grouped by purpose, with status,
   language, stars and downloads. Older projects fold into "From the archive".
4. **Upstream:** contributions merged into, or published from, other people's
   projects.
5. **About:** the studio, verifiable facts only.
6. **Sneak peek:** work in progress, one short paragraph each and no links,
   until a project is ready for a page of its own.
7. **Handoff and footer:** products and contact at twilightcoders.com.

Detail pages carry the full write-up, highlights, code, a facts sidebar (install
line, language, version, downloads, stars, license) and previous/next links.

## Content rules

- Copy comes from each project's README and source. A project the page cannot
  describe accurately is left off, not given a placeholder.
- Status labels say what is true: Active, Stable, Dormant, Archive.
- Credit is explicit where the work is shared, as with Ruby Sudo.
- Private and unannounced work stays off the catalog. It appears, if at all,
  only as a sneak peek.
- `test/projects.test.ts` enforces the rules it can: no boilerplate taglines, no
  repositories that aren't ours, nothing unannounced in the catalog, unlinked
  sneak peeks, https links, and real images with alt text.

## Type

- **Display:** Fraunces, self-hosted (OFL). 600 roman and 500 italic, both
  preloaded, about 40 KB.
- **Body:** the system sans stack.
- **Data** (names, versions, counts, labels): the system mono stack.

## Color

One theme, dark. Body text is 11–17:1 against the canvas, and code comments are
lifted from Tokyo Night's default to reach AA.

| Token | Value | Use |
|---|---|---|
| `--bg-0` / `--bg-1` / `--bg-2` | `#090b13` / `#12162a` / `#1b2140` | Canvas, cards, raised surfaces |
| `--ink-0` / `--ink-1` / `--ink-2` | `#f4f1e8` / `#c3c6dd` / `#9296b8` | Headings, body, metadata |
| `--amber` | `#f2b84c` | Primary accent: calls to action, figures, focus ring |
| `--mint` | `#7fe7c4` | Secondary accent: emphasis, active status, inline links |
| `--violet` | `#a78bfa` | Sky glow only |

## Performance

- Static HTML with no client JavaScript.
- Images go through `astro:assets`: responsive AVIF and WebP with intrinsic
  sizes, so nothing shifts.
- Syntax highlighting happens at build time (Shiki).
- `prefers-reduced-motion` stops the star twinkle.
- Lighthouse, mobile profile: 100 in every category, LCP 1.3 s, CLS 0, TBT 0 ms,
  69 KB total.
