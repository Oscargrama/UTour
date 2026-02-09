import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminHeader } from "@/components/admin-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Plus } from "lucide-react"
import { BlogPostActions } from "@/components/blog-post-actions"

export default async function BlogAdminPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: posts } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-[#fefce8]">
      <AdminHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-[#1f2937] mb-2" style={{ fontFamily: "var(--font-heading)" }}>
              Posts de Blog
            </h1>
            <p className="text-muted-foreground">Crea y gestiona el contenido de tu blog</p>
          </div>
          <Button asChild className="bg-[#f59e0b] hover:bg-[#fbbf24]">
            <Link href="/admin/blog/new">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Post
            </Link>
          </Button>
        </div>

        <div className="space-y-4">
          {posts && posts.length > 0 ? (
            posts.map((post) => (
              <Card key={post.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle>{post.title}</CardTitle>
                        <Badge variant={post.published ? "default" : "secondary"}>
                          {post.published ? "Publicado" : "Borrador"}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground mb-2">{post.excerpt}</p>

                      <p className="text-xs text-muted-foreground">
                        Por {post.author} • {new Date(post.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    <BlogPostActions postId={post.id} slug={post.slug} isPublished={post.published} />
                  </div>
                </CardHeader>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No hay posts aún. Crea tu primer post!
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
