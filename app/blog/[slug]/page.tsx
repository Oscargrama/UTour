import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { notFound } from "next/navigation"
import { Calendar, ArrowUpRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"
import { BackButton } from "@/components/back-button"

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
  const readingMinutes = Math.max(
    3,
    Math.round((post.content ? post.content.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length : 0) / 200),
  )
  const articleDate = new Date(post.created_at)
  const dateLabel = Number.isNaN(articleDate.getTime())
    ? "2026"
    : articleDate.toLocaleDateString("es-CO", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
  const summary = post.excerpt || post.title
  const fallbackHero = "/og/utour-default-1200x630.svg"
  const heroImage = post.image_url ? getOptimizedImageUrl(post.image_url, 1400) : fallbackHero
  const contentText = `${post.title} ${post.excerpt ?? ""} ${post.content ?? ""}`.toLowerCase()
  const tourLinks = [
    { keyword: ["guatape", "guatapé", "peñol", "penol"], href: "/tours/guatape-private" },
    { keyword: ["comuna 13", "comuna13"], href: "/tours/comuna-13" },
    { keyword: ["cafe", "cafeter", "coffee"], href: "/tours/tour-cafetero" },
    { keyword: ["salto del buey", "buey"], href: "/tours/salto-del-buey" },
    { keyword: ["nocturno", "miradores", "noche"], href: "/tours/tour-nocturno" },
    { keyword: ["walking", "caminar", "centro"], href: "/tours/medellin-walking" },
  ]
  const relatedTour =
    tourLinks.find((tour) => tour.keyword.some((word) => contentText.includes(word)))?.href || "/tours"
  const relatedLabel = relatedTour === "/tours" ? "Ver experiencia UTour" : "Ver tour relacionado"

  const headingIds = new Map<string, number>()
  const tocItems: Array<{ id: string; label: string; level: number }> = []

  const slugifyHeading = (value: string) =>
    value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")

  const addHeadingAnchors = (html: string) =>
    html.replace(/<h([23])>([\s\S]*?)<\/h\1>/gi, (_match, level, inner) => {
      const text = inner.replace(/<[^>]+>/g, "").trim()
      const baseId = slugifyHeading(text || "seccion")
      const currentCount = headingIds.get(baseId) || 0
      const nextCount = currentCount + 1
      headingIds.set(baseId, nextCount)
      const id = currentCount === 0 ? baseId : `${baseId}-${nextCount}`
      tocItems.push({ id, label: text, level: Number(level) })
      return `<h${level} id="${id}">${inner}</h${level}>`
    })

  const highlightCallouts = (html: string) =>
    html.replace(/<p>([\s\S]*?)<\/p>/gi, (match, inner) => {
      const text = inner.replace(/<[^>]+>/g, "").trim().toLowerCase()
      const keywords = ["tip", "consejo", "insight", "dato", "nota", "clave"]
      if (keywords.some((keyword) => text.startsWith(`${keyword}:`) || text.startsWith(`${keyword} `))) {
        return `<div class="utour-callout"><p>${inner}</p></div>`
      }
      return match
    })

  const processedContent = post.content ? highlightCallouts(addHeadingAnchors(post.content)) : ""
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

      <main className="bg-[#f8faff]">
        <section className="relative overflow-hidden bg-[#f4f7ff] pb-20 pt-28">
          <div className="absolute inset-x-0 top-0 h-52 brand-gradient-bg opacity-10" />
          <div className="container mx-auto grid items-center gap-12 px-4 md:grid-cols-12">
            <div className="md:col-span-7">
              <BackButton className="mb-6" label="Volver al Blog" fallbackHref="/blog" useHistory={false} />
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7a2ce8]">Featured story</p>
              <h1
                className="mt-4 text-4xl font-black leading-tight text-[#101b4c] md:text-6xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {post.title}
              </h1>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-[#5b6a97]">{summary}</p>
              <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#7b88b2]">
                <span>{readingMinutes} min</span>
                <span className="text-[#c1c9e6]">•</span>
                <span>{dateLabel}</span>
              </div>
            </div>
            <div className="md:col-span-5">
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-[#d9e2ff] bg-white shadow-[0_20px_50px_rgba(16,27,76,0.16)]">
                <Image
                  src={heroImage}
                  alt={post.title}
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

        <section className="py-16 bg-white">
          <div className="container mx-auto grid gap-10 px-4 lg:grid-cols-[minmax(0,1fr)_320px]">
            <article>
              <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }} />
              <header className="mb-8">
                <div className="flex flex-wrap items-center gap-4 text-sm text-[#7b88b2]">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-[#7a2ce8]" />
                    <span>{dateLabel}</span>
                  </div>
                  <span className="text-[#c1c9e6]">•</span>
                  <span>{readingMinutes} min de lectura</span>
                </div>
              </header>

              <div
                className="prose prose-lg max-w-none leading-relaxed prose-headings:font-black prose-headings:tracking-tight prose-headings:text-[#101b4c] prose-h2:relative prose-h2:mt-12 prose-h2:mb-4 prose-h2:px-5 prose-h2:py-3 prose-h2:text-3xl prose-h2:rounded-2xl prose-h2:border prose-h2:border-[#e1e8ff] prose-h2:bg-[#f5f7ff] prose-h2:shadow-[0_12px_24px_rgba(16,27,76,0.08)] prose-h2:after:content-[''] prose-h2:after:block prose-h2:after:h-[3px] prose-h2:after:w-16 prose-h2:after:rounded-full prose-h2:after:bg-[linear-gradient(90deg,#7a2ce8,#38cbe1)] prose-h2:after:mt-3 prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-2xl prose-h3:text-[#1f3684] prose-p:text-[#384979] prose-p:text-[18px] prose-p:leading-8 prose-p:mt-5 prose-strong:text-[#1f3684] prose-strong:font-semibold prose-strong:bg-[#eef2ff] prose-strong:px-1.5 prose-strong:py-0.5 prose-strong:rounded-md prose-a:text-[#1f85d4] prose-a:no-underline hover:prose-a:underline prose-li:marker:text-[#7a2ce8] prose-ul:rounded-2xl prose-ul:border prose-ul:border-[#e6ecff] prose-ul:bg-[#f8faff] prose-ul:px-6 prose-ul:py-4 prose-ul:shadow-[0_10px_20px_rgba(16,27,76,0.06)] prose-li:my-2 [&_.utour-callout]:rounded-2xl [&_.utour-callout]:border [&_.utour-callout]:border-[#d8e6ff] [&_.utour-callout]:bg-[#eef6ff] [&_.utour-callout]:px-5 [&_.utour-callout]:py-4 [&_.utour-callout]:shadow-[0_12px_20px_rgba(31,54,132,0.08)] [&_.utour-callout_p]:m-0 [&_.utour-callout_p]:text-[#1f3684] [&_.utour-callout_p]:font-semibold [&_.utour-callout]:before:content-['Insight'] [&_.utour-callout]:before:block [&_.utour-callout]:before:text-[10px] [&_.utour-callout]:before:uppercase [&_.utour-callout]:before:tracking-[0.3em] [&_.utour-callout]:before:text-[#7a2ce8] [&_.utour-callout]:before:mb-2 [&>p:first-of-type:first-letter]:float-left [&>p:first-of-type:first-letter]:text-6xl [&>p:first-of-type:first-letter]:font-black [&>p:first-of-type:first-letter]:text-[#7a2ce8] [&>p:first-of-type:first-letter]:mr-4 [&>p:first-of-type:first-letter]:leading-none [&>p:first-of-type:first-letter]:mt-2 [&>p:first-of-type]:text-[20px] [&>p:first-of-type]:text-[#2b3a6a]"
                dangerouslySetInnerHTML={{ __html: processedContent }}
              />
            </article>

            <aside className="lg:sticky lg:top-28">
              {tocItems.length > 0 && (
                <div className="mb-6 rounded-3xl border border-[#e1e8ff] bg-white p-6 shadow-[0_16px_30px_rgba(16,27,76,0.1)]">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#1f3684]">En este artículo</p>
                  <ul className="mt-4 space-y-2 text-sm text-[#4a5a8a]">
                    {tocItems.map((item) => (
                      <li key={item.id} className={item.level === 3 ? "ml-3 text-[#6b79a8]" : ""}>
                        <a href={`#${item.id}`} className="hover:text-[#7a2ce8]">
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="rounded-3xl border border-[#d9e2ff] bg-[#f7f8ff] p-6 shadow-[0_18px_36px_rgba(16,27,76,0.12)]">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#7a2ce8]">Experiencia UTour</p>
                <h3 className="mt-3 text-2xl font-black text-[#101b4c]">{relatedLabel}</h3>
                <p className="mt-3 text-sm text-[#5b6a97]">
                  Viaja sin prisas con un tour privado o semiprivado diseñado a tu ritmo.
                </p>
                <ul className="mt-4 space-y-3 text-sm text-[#4a5a8a]">
                  <li className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#7a2ce8]" />
                    Itinerario flexible
                  </li>
                  <li className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#1f85d4]" />
                    Grupos pequeños
                  </li>
                  <li className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#38cbe1]" />
                    Guías locales
                  </li>
                </ul>
                <Button asChild className="brand-cta-btn mt-6 w-full rounded-full">
                  <Link href={relatedTour}>
                    Ver tour
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="mt-6 rounded-3xl border border-[#e1e8ff] bg-white p-6 shadow-[0_16px_30px_rgba(16,27,76,0.1)]">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#38cbe1]">Explorar</p>
                <h3 className="mt-3 text-2xl font-black text-[#101b4c]">Todas las experiencias</h3>
                <p className="mt-3 text-sm text-[#5b6a97]">Descubre tours privados y semiprivados en Medellín y Antioquia.</p>
                <Button
                  asChild
                  variant="outline"
                  className="mt-6 w-full rounded-full border-[#c9d4ff] bg-white text-[#1f3684] hover:bg-[#edf2ff]"
                >
                  <Link href="/tours">Ver experiencias</Link>
                </Button>
              </div>
            </aside>
          </div>
        </section>

        <section className="py-20 bg-[#0f1530]">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-5xl">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#38cbe1] text-center">
                Siguiente paso
              </p>
              <h2
                className="mt-4 text-center text-4xl font-black tracking-tight text-white"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Reserva la experiencia a tu ritmo
              </h2>
              <p className="mt-4 text-center text-base text-[#c9d3f8]">
                Si este contenido te inspiró, da el siguiente paso con una experiencia privada o semiprivada diseñada a tu
                estilo.
              </p>

              <div className="mt-10 grid gap-6 md:grid-cols-2">
                <Link
                  href={relatedTour}
                  className="group relative overflow-hidden rounded-3xl border border-[#2b3a6a] bg-[#141c3b] p-6 text-white shadow-[0_18px_36px_rgba(6,10,26,0.4)] transition-transform hover:-translate-y-1"
                >
                  <div className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100">
                    <div className="h-full w-full bg-gradient-to-br from-[#7a2ce8] via-[#1f85d4] to-[#38cbe1] opacity-20" />
                  </div>
                  <div className="relative">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#38cbe1]">Recomendado</p>
                    <h3 className="mt-3 text-2xl font-bold">{relatedLabel}</h3>
                    <p className="mt-3 text-sm text-[#c9d3f8]">
                      Ir directo al tour que encaja con este artículo.
                    </p>
                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white">
                      Ver tour <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>

                <Link
                  href="/tours"
                  className="group relative overflow-hidden rounded-3xl border border-[#2b3a6a] bg-[#0f1530] p-6 text-white shadow-[0_18px_36px_rgba(6,10,26,0.4)] transition-transform hover:-translate-y-1"
                >
                  <div className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100">
                    <div className="h-full w-full bg-gradient-to-br from-[#38cbe1] via-[#1f85d4] to-[#7a2ce8] opacity-15" />
                  </div>
                  <div className="relative">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#7a2ce8]">Explorar</p>
                    <h3 className="mt-3 text-2xl font-bold">Ver todas las experiencias</h3>
                    <p className="mt-3 text-sm text-[#c9d3f8]">
                      Descubre tours privados y semiprivados en Medellín y Antioquia.
                    </p>
                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white">
                      Explorar ahora <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
