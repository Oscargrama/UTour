import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { notFound } from "next/navigation"
import { Calendar, User, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"

export const revalidate = 86400

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
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

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data: post } = await supabase.from("blog_posts").select("*").eq("slug", slug).eq("published", true).single()

  if (!post) {
    return {
      title: "Post no encontrado - UTour",
    }
  }

  return {
    title: `${post.title} - UTour Blog`,
    description: post.excerpt || post.title,
    keywords: `${post.title}, viajes colombia, guia medellin, tours`,
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt || "",
      type: "article",
      url: `/blog/${slug}`,
      images: post.image_url ? [post.image_url] : [],
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: post } = await supabase.from("blog_posts").select("*").eq("slug", slug).eq("published", true).single()

  if (!post) {
    notFound()
  }

  const siteUrl = "https://utour.lat"
  const postUrl = `${siteUrl}/blog/${post.slug}`
  const published = post.created_at ? new Date(post.created_at).toISOString() : new Date().toISOString()
  const modified = post.updated_at ? new Date(post.updated_at).toISOString() : published
  const images = post.image_url ? [post.image_url] : []
  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || post.title,
    image: images,
    author: {
      "@type": "Person",
      name: post.author || "UTour",
    },
    datePublished: published,
    dateModified: modified,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postUrl,
    },
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main>
        {/* Hero Section with Image */}
        {post.image_url && (
          <section className="relative h-[400px] bg-[#1f2937]">
            <Image
              src={getOptimizedImageUrl(post.image_url, 1600)}
              alt={post.title}
              fill
              sizes="100vw"
              className="object-cover opacity-60"
              priority
              unoptimized
            />
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-4">
                <Button asChild variant="ghost" className="mb-4 text-white hover:text-white/80">
                  <Link href="/blog">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver al Blog
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* Article Content */}
        <article className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }} />
            <header className="mb-8">
              <h1
                className="text-4xl md:text-5xl font-bold text-[#1f2937] mb-4 text-balance"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-[#f59e0b]" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-[#f59e0b]" />
                  <span>
                    {new Date(post.created_at).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </header>

            <div
              className="prose prose-lg max-w-none leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </article>

        {/* CTA Section */}
        <section className="py-16 bg-[#fefce8]">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-[#1f2937] mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              Listo para tu aventura?
            </h2>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              Reserva tu tour privado y experimenta Colombia con un guía local apasionado.
            </p>
            <Button asChild size="lg" className="bg-[#f59e0b] hover:bg-[#fbbf24]">
              <Link href="/#booking">Reservar Ahora</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
