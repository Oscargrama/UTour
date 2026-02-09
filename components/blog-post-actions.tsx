"use client"

import { Button } from "@/components/ui/button"
import { Edit, Eye } from "lucide-react"
import Link from "next/link"

interface BlogPostActionsProps {
  postId: string
  slug: string
  isPublished: boolean
}

export function BlogPostActions({ postId, slug, isPublished }: BlogPostActionsProps) {
  return (
    <div className="flex gap-2">
      <Button asChild variant="outline" size="sm">
        <Link href={`/admin/blog/edit/${postId}`}>
          <Edit className="mr-2 h-4 w-4" />
          Editar
        </Link>
      </Button>
      {isPublished && (
        <Button asChild variant="outline" size="sm">
          <Link href={`/blog/${slug}`} target="_blank">
            <Eye className="mr-2 h-4 w-4" />
            Ver
          </Link>
        </Button>
      )}
    </div>
  )
}
