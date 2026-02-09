import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminHeader } from "@/components/admin-header"
import { BlogPostForm } from "@/components/blog-post-form"

export default async function NewBlogPostPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-[#fefce8]">
      <AdminHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#1f2937] mb-2" style={{ fontFamily: "var(--font-heading)" }}>
            Crear Nuevo Post
          </h1>
          <p className="text-muted-foreground">Comparte tips, guías y experiencias con tus lectores</p>
        </div>

        <BlogPostForm />
      </main>
    </div>
  )
}
