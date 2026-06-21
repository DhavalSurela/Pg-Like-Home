import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = "https://pg-like-home.vercel.app";

    return [
        {
            url: baseUrl,
            lastModified: new Date('2026-02-18T16:15:01.685Z'),
            changeFrequency: "weekly",
            priority: 1.0,
        },
        {
            url: `${baseUrl}/rooms`,
            lastModified: new Date('2026-02-18T16:15:01.685Z'),
            changeFrequency: "monthly",
            priority: 0.9,
        },
        {
            url: `${baseUrl}/food`,
            lastModified: new Date('2026-02-18T16:15:01.685Z'),
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/facilities`,
            lastModified: new Date('2026-02-18T16:15:01.685Z'),
            changeFrequency: "monthly",
            priority: 0.7,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date('2026-02-18T16:15:01.685Z'),
            changeFrequency: "monthly",
            priority: 0.7,
        },
        {
            url: `${baseUrl}/rules`,
            lastModified: new Date('2026-02-18T16:15:01.685Z'),
            changeFrequency: "yearly",
            priority: 0.5,
        },
    ];
}
