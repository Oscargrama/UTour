import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"
import type { Metadata } from "next"
import { BlogFeed } from "@/components/blog-feed"
import { BlogNewsletter } from "@/components/blog-newsletter"

export const revalidate = 86400

export const metadata: Metadata = {
  title: "Blog de Viajes - UTour | Guías y Tips para Colombia",
  description:
    "Descubre guías locales, tips de viaje y las mejores recomendaciones para explorar Medellín, Guatapé y Colombia.",
  keywords: "blog viajes colombia, guia medellin, tips guatape, turismo colombia",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Blog de Viajes - UTour",
    description: "Guías locales y tips para explorar Colombia",
    type: "website",
    url: "/blog",
  },
}

const IMAGE_QUALITY = 70

function getOptimizedImageUrl(url: string, width: number) {
  if (!url) return url
  try {
    const parsed = new URL(url)
    if (parsed.hostname.includes("supabase.co")) {
      parsed.searchParams.set("width", String(width))
      parsed.searchParams.set("quality", String(IMAGE_QUALITY))
      return parsed.toString()
    }
  } catch {
    return url
  }
  return url
}

type Category = "destinations" | "guides" | "tips"

type BlogPostRow = {
  id: string
  slug: string
  title: string
  excerpt: string | null
  content: string | null
  image_url: string | null
  author: string | null
  created_at: string | null
}

const CATEGORY_KEYWORDS: Record<Category, string[]> = {
  tips: ["precio", "vale la pena", "tips", "consejos", "presupuesto", "costos"],
  guides: ["guía", "itinerario", "qué hacer", "como", "cómo", "ruta", "plan", "3 días", "tres días"],
  destinations: ["guatape", "guatapé", "medellin", "medellín", "comuna", "antioquia", "colombia"],
}

function estimateReadTime(content?: string | null) {
  if (!content) return "5 min"
  const text = content.replace(/<[^>]+>/g, " ")
  const words = text.trim().split(/\s+/).filter(Boolean).length
  const minutes = Math.max(3, Math.round(words / 200))
  return `${minutes} min`
}

function formatDateLabel(date?: string | null) {
  if (!date) return "2026"
  try {
    return new Date(date).toLocaleDateString("es-CO", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  } catch {
    return "2026"
  }
}

function getCategoryForPost(post: BlogPostRow): Category {
  const haystack = `${post.title ?? ""} ${post.excerpt ?? ""} ${post.slug ?? ""} ${post.content ?? ""}`.toLowerCase()
  if (CATEGORY_KEYWORDS.tips.some((keyword) => haystack.includes(keyword))) return "tips"
  if (CATEGORY_KEYWORDS.guides.some((keyword) => haystack.includes(keyword))) return "guides"
  if (CATEGORY_KEYWORDS.destinations.some((keyword) => haystack.includes(keyword))) return "destinations"
  return "guides"
}

export default async function BlogPage() {
  const supabase = await createClient()

  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false })

  const mappedPosts = (posts as BlogPostRow[] | null)?.map((post) => ({
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    image_url: post.image_url,
    author: post.author,
    created_at: formatDateLabel(post.created_at),
    readTime: estimateReadTime(post.content),
    category: getCategoryForPost(post),
  }))

  const featuredPost = mappedPosts?.[0]
  const feedPosts = mappedPosts ? (mappedPosts.length > 1 ? mappedPosts.slice(1) : mappedPosts) : []
  const featuredImage =
    featuredPost?.image_url
      ? getOptimizedImageUrl(featuredPost.image_url, 1200)
      : "/og/utour-default-1200x630.svg"

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="bg-[#f8faff]">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-[#f4f7ff] pb-20 pt-28">
          <div className="absolute inset-x-0 top-0 h-52 brand-gradient-bg opacity-10" />
          <div className="container mx-auto grid items-center gap-12 px-4 md:grid-cols-12">
            <div className="md:col-span-7">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7a2ce8]">Historia destacada</p>
              <h1
                className="mt-4 text-4xl font-black leading-tight text-[#101b4c] md:text-6xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {featuredPost?.title ?? "Historias reales para viajar sin prisas"}
              </h1>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-[#5b6a97]">
                {featuredPost?.excerpt ??
                  "Guías locales, rutas lentas y experiencias diseñadas para que vivas Colombia con más libertad."}
              </p>
              <div className="mt-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#7b88b2]">
                <span>{featuredPost?.readTime ?? "5 min"}</span>
                <span className="text-[#c1c9e6]">•</span>
                <span>{featuredPost?.created_at ?? "2026"}</span>
              </div>
              <Button asChild className="brand-cta-btn mt-8 rounded-full px-7">
                <Link href={featuredPost ? `/blog/${featuredPost.slug}` : "/blog"}>
                  Leer historia <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="md:col-span-5">
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-[#d9e2ff] bg-white shadow-[0_20px_50px_rgba(16,27,76,0.16)]">
                <Image
                  src={featuredImage}
                  alt={featuredPost?.title ?? "Historias UTour"}
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                  priority
                  unoptimized
                />
              </div>
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <BlogFeed posts={feedPosts} />
          </div>
        </section>

        <BlogNewsletter />
      </main>

      <Footer />
    </div>
  )
}
