import { createClient } from "@/lib/supabase/server"
import type { MetadataRoute } from "next"
import { getSiteUrl } from "@/lib/site-url"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()
  const siteUrl = getSiteUrl()

  const { data: posts } = await supabase.from("blog_posts").select("slug, updated_at").eq("published", true)

  const blogUrls =
    posts?.map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updated_at),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })) || []

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/faqs`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...blogUrls,
  ]
}
