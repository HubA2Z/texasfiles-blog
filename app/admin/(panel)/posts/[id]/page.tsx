import { notFound } from "next/navigation";
import PostEditor from "@/components/admin/PostEditor";
import { adminGetPost, getCategories } from "@/lib/posts";

export default async function EditPost({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const n = Number(id);
  if (!Number.isInteger(n) || n <= 0) notFound();
  const [post, cats] = await Promise.all([adminGetPost(n), getCategories()]);
  if (!post) notFound();
  return <PostEditor post={post} categories={cats.map((c) => c.name)} />;
}
