import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXTAUTH_URL || "https://portfoliopro.in";

  const routes = [
    "",
    "/features",
    "/solutions/investor-app",
    "/solutions/advisor-app",
    "/solutions/robo-advisory",
    "/solutions/financial-websites",
    "/solutions/crm",
    "/pricing",
    "/calculators",
    "/fund-explorer",
    "/testimonials",
    "/blog",
    "/contact",
    "/book-demo",
    "/pay-online",
    "/about",
    "/careers",
    "/privacy-policy",
    "/terms",
    "/refund-policy",
    "/disclaimer",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : route.startsWith("/solutions") ? 0.9 : 0.8,
  }));
}

