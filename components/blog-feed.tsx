"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"

type Category = "destinations" | "guides" | "tips"

type BlogPostCard = {
  id: string
  slug: string
  title: string
  excerpt?: string | null
  image_url?: string | null
  author?: string | null
  created_at?: string | null
  readTime?: string
  category: Category
}

type BlogFeedProps = {
  posts: BlogPostCard[]
}

const FILTERS: Array<{ id: "all" | Category; label: string }> = [
  { id: "all", label: "Todos" },
  { id: "destinations", label: "Destinos" },
  { id: "guides", label: "Guías" },
  { id: "tips", label: "Tips" },
]

const CATEGORY_META: Record<Category, { label: string; className: string }> = {
  destinations: {
    label: "Destinos",
    className: "bg-[#e7efff] text-[#1f3684] border-[#cddcff]",
  },
  guides: {
    label: "Guías",
    className: "bg-[#f3ecff] text-[#5a2cc7] border-[#e1d4ff]",
  },
  tips: {
    label: "Tips",
    className: "bg-[#dff8fb] text-[#0c6b86] border-[#c3eef4]",
  },
}

function getOptimizedImageUrl(url?: string | null) {
  if (!url) return url ?? ""
  try {
    const parsed = new URL(url)
    if (parsed.hostname.includes("supabase.co")) {
      parsed.searchParams.set("width", "900")
      parsed.searchParams.set("quality", "70")
      return parsed.toString()
    }
  } catch {
    return url
  }
  return url
}

export function BlogFeed({ posts }: BlogFeedProps) {
  const [activeFilter, setActiveFilter] = useState<"all" | Category>("all")

  const visiblePosts = useMemo(() => {
    if (activeFilter === "all") return posts
    return posts.filter((post) => post.category === activeFilter)
  }, [activeFilter, posts])

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7a2ce8]">Insights</p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-[#101b4c]" style={{ fontFamily: "var(--font-heading)" }}>
            Últimas historias
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-2 rounded-full border border-[#e1e8ff] bg-white p-1 shadow-sm">
          {FILTERS.map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => setActiveFilter(filter.id)}
              className={cn(
                "rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition-colors",
                activeFilter === filter.id
                  ? "bg-[#1f3684] text-white shadow-[0_10px_20px_rgba(31,54,132,0.2)]"
                  : "text-[#5b6a97] hover:text-[#1f3684]",
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {visiblePosts.length === 0 ? (
        <div className="mt-12 rounded-3xl border border-dashed border-[#dce3ff] bg-white px-6 py-12 text-center text-[#5b6a97]">
          Aún no hay historias en esta categoría. Pronto más contenido.
        </div>
      ) : (
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {visiblePosts.map((post) => {
            const category = CATEGORY_META[post.category]
            return (
              <article
                key={post.id}
                className="flex h-full flex-col overflow-hidden rounded-3xl border border-[#e1e8ff] bg-white shadow-[0_18px_30px_rgba(16,27,76,0.08)] transition-transform duration-300 hover:-translate-y-1"
              >
                <Link href={`/blog/${post.slug}`} className="relative aspect-[16/10] w-full overflow-hidden">
                  {post.image_url ? (
                    <Image
                      src={getOptimizedImageUrl(post.image_url)}
                      alt={post.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      unoptimized
                    />
                  ) : (
                    <div className="h-full w-full bg-[#edf2ff]" />
                  )}
                </Link>

                <div className="flex flex-1 flex-col px-6 pb-6 pt-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        "rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]",
                        category.className,
                      )}
                    >
                      {category.label}
                    </span>
                    <span className="rounded-full border border-[#e1e8ff] bg-[#f8f9ff] px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#4b5b8f]">
                      UTour
                    </span>
                  </div>

                  <Link href={`/blog/${post.slug}`} className="mt-4 text-xl font-bold text-[#101b4c]">
                    {post.title}
                  </Link>

                  <p className="mt-3 text-sm leading-relaxed text-[#5b6a97]">{post.excerpt}</p>

                  <div className="mt-auto flex items-center justify-between pt-6 text-xs font-semibold uppercase tracking-[0.15em] text-[#7b88b2]">
                    <span>{post.readTime || "5 min"}</span>
                    <span className="text-[#c1c9e6]">•</span>
                    <span>{post.created_at || "2026"}</span>
                  </div>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#1f3684]"
                  >
                    Leer historia <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
