import type { ImageMetadata } from 'astro';

const files = import.meta.glob<{ default: ImageMetadata }>('../assets/work/*.{png,jpg,webp}', { eager: true });

/** Resolve a file name under src/assets/work/ to its optimized image. */
export function workImage(name: string): ImageMetadata {
  const entry = Object.entries(files).find(([path]) => path.endsWith(`/${name}`));
  if (!entry) throw new Error(`Missing image src/assets/work/${name}`);
  return entry[1].default;
}
