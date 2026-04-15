import type { MetadataRoute } from "next";

const BASE_URL = "https://tulipes-et-cetera.fr";
const locales = ["fr", "de", "en"] as const;

const pages = [
  { path: "", priority: 1.0, changeFrequency: "monthly" as const },
  { path: "/maison", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/chambres", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/services", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/decouvrir", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/reservation", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/avis", priority: 0.7, changeFrequency: "weekly" as const },
  { path: "/contact", priority: 0.7, changeFrequency: "yearly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const page of pages) {
    for (const locale of locales) {
      const url = `${BASE_URL}/${locale}${page.path}`;
      const alternates: Record<string, string> = {};
      for (const lang of locales) {
        alternates[lang] = `${BASE_URL}/${lang}${page.path}`;
      }

      entries.push({
        url,
        lastModified: now,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: {
          languages: alternates,
        },
      });
    }
  }

  return entries;
}
