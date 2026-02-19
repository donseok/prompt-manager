"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { AnalyticsData, Prompt, Category } from "@/types";

export function useAnalytics() {
  return useQuery<AnalyticsData>({
    queryKey: ["analytics"],
    queryFn: async () => {
      const [promptsRes, categoriesRes] = await Promise.all([
        supabase.from("prompts").select("*").order("updated_at", { ascending: false }),
        supabase.from("categories").select("*").order("sort_order", { ascending: true }),
      ]);

      const prompts: Prompt[] = promptsRes.data ?? [];
      const categories: Category[] = categoriesRes.data ?? [];

      // Prompts by category
      const promptsByCategory = categories.map((cat) => ({
        name: cat.name,
        count: prompts.filter((p) => p.category_id === cat.id).length,
        color: cat.color,
      }));
      const uncategorized = prompts.filter((p) => !p.category_id).length;
      if (uncategorized > 0) {
        promptsByCategory.push({ name: "미분류", count: uncategorized, color: "#6b7280" });
      }

      // Top used
      const topUsed = [...prompts]
        .sort((a, b) => b.usage_count - a.usage_count)
        .slice(0, 5)
        .map((p) => ({ title: p.title, usage_count: p.usage_count }));

      // Tag distribution
      const tagMap = new Map<string, number>();
      for (const p of prompts) {
        for (const t of p.tags ?? []) {
          tagMap.set(t, (tagMap.get(t) ?? 0) + 1);
        }
      }
      const tagDistribution = Array.from(tagMap.entries())
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      return {
        totalPrompts: prompts.length,
        totalCategories: categories.length,
        totalFavorites: prompts.filter((p) => p.is_favorite).length,
        totalUsage: prompts.reduce((sum, p) => sum + p.usage_count, 0),
        promptsByCategory,
        topUsed,
        recentlyCreated: prompts.slice(0, 5),
        tagDistribution,
      };
    },
  });
}
