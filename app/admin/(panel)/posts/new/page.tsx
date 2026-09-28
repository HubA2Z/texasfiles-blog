import PostEditor from "@/components/admin/PostEditor";
import { getCategories } from "@/lib/posts";

export default async function NewPost() {
  const categories = (await getCategories()).map((c) => c.name);
  return <PostEditor categories={categories} />;
}
