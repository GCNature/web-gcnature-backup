import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import News from "./News";
import NewsDetail from "./NewsDetail";

interface PostCategoryItem {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
}

export default function NewsDispatcher() {
  const { slug } = useParams();
  const [categoryTree, setCategoryTree] = useState<PostCategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<{ value: string | null }>("/settings/post-categories-tree")
      .then((res) => {
        if (res?.value) {
          setCategoryTree(JSON.parse(res.value));
        }
      })
      .catch((err) => console.error("Error loading category tree in dispatcher", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-sm text-gray-500 font-medium">
        <div className="flex flex-col items-center gap-2">
          <div className="w-5 h-5 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
          <span>Đang tải nội dung...</span>
        </div>
      </div>
    );
  }

  // Check if current slug matches any parent category slug
  const isParentCategory = categoryTree.some((c) => c.slug === slug && !c.parentId);

  if (isParentCategory) {
    return <News />;
  }

  return <NewsDetail />;
}
