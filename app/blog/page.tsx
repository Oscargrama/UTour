import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Calendar, User } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blog de Viajes - UTour | Guías y Tips para Colombia",
  description:
    "Descubre guías locales, tips de viaje y las mejores recomendaciones para explorar Medellín, Guatapé y Colombia.",
  keywords: "blog viajes colombia, guia medellin, tips guatape, turismo colombia",
  openGraph: {
    title: "Blog de Viajes - UTour",
    description: "Guías locales y tips para explorar Colombia",
    type: "website",
  },
}

export default async function BlogPage() {
  const supabase = await createClient()

  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="bg-[#fefce8] py-16">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h1
                className="text-5xl font-bold text-[#1f2937] mb-4 text-balance"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Blog de Viajes
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Guías locales, tips de viaje y las mejores recomendaciones para explorar Colombia como un local.
              </p>
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            {posts && posts.length > 0 ? (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    {post.image_url && (
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={post.image_url || "/placeholder.svg"}
                          alt={post.title}
                          className="h-full w-full object-cover transition-transform hover:scale-105"
                        />
                      </div>
                    )}

                    <CardHeader>
                      <CardTitle className="text-xl" style={{ fontFamily: "var(--font-heading)" }}>
                        {post.title}
                      </CardTitle>
                      <CardDescription className="leading-relaxed">{post.excerpt}</CardDescription>
                    </CardHeader>

                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(post.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter>
                      <Button asChild variant="outline" className="w-full bg-transparent">
                        <Link href={`/blog/${post.slug}`}>Leer Más →</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No hay posts publicados aún. Vuelve pronto!</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
