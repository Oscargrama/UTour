"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

export function BlogPostForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    image_url: "",
    author: "Oscar",
    published: false,
  })

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
  }

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()

      const { error } = await supabase.from("blog_posts").insert([formData])

      if (error) throw error

      toast({
        title: "Post creado!",
        description: formData.published
          ? "El post ha sido publicado exitosamente."
          : "El post ha sido guardado como borrador.",
      })

      router.push("/admin/blog")
      router.refresh()
    } catch (error: any) {
      console.error("[v0] Blog post creation error:", error)
      toast({
        title: "Error",
        description: error.message || "No se pudo crear el post.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-4xl">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              required
              placeholder="Ej: 10 Consejos para Visitar Guatapé"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug (URL) *</Label>
            <Input
              id="slug"
              required
              placeholder="10-consejos-visitar-guatape"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            />
            <p className="text-sm text-muted-foreground">URL: /blog/{formData.slug || "slug-del-post"}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Extracto</Label>
            <Textarea
              id="excerpt"
              placeholder="Breve descripción del post (opcional)"
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              className="resize-none"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Contenido *</Label>
            <Textarea
              id="content"
              required
              placeholder="Escribe el contenido del post en HTML..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="min-h-[300px] font-mono text-sm resize-none"
            />
            <p className="text-sm text-muted-foreground">
              Puedes usar HTML básico: &lt;p&gt;, &lt;h2&gt;, &lt;ul&gt;, &lt;li&gt;, etc.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_url">URL de la Imagen</Label>
            <Input
              id="image_url"
              type="url"
              placeholder="https://ejemplo.com/imagen.jpg"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="author">Autor</Label>
            <Input
              id="author"
              placeholder="Oscar"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="published"
              checked={formData.published}
              onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
            />
            <Label htmlFor="published" className="cursor-pointer">
              Publicar inmediatamente
            </Label>
          </div>

          <div className="flex gap-4">
            <Button type="submit" className="bg-[#f59e0b] hover:bg-[#fbbf24]" disabled={loading}>
              {loading ? "Guardando..." : formData.published ? "Publicar Post" : "Guardar Borrador"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.push("/admin/blog")}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
