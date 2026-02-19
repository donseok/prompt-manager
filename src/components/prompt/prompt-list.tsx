"use client";

import { useMemo } from "react";
import { FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PromptCard } from "./prompt-card";
import { usePrompts } from "@/hooks/use-prompts";
import { useUIStore } from "@/store/ui-store";
import type { Prompt, SortField, SortDirection } from "@/types";
import { cn } from "@/lib/utils";

function sortPrompts(
  prompts: Prompt[],
  field: SortField,
  direction: SortDirection
): Prompt[] {
  return [...prompts].sort((a, b) => {
    let cmp = 0;
    switch (field) {
      case "title":
        cmp = a.title.localeCompare(b.title);
        break;
      case "usage_count":
        cmp = a.usage_count - b.usage_count;
        break;
      case "created_at":
        cmp =
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        break;
      case "updated_at":
      default:
        cmp =
          new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
        break;
    }
    return direction === "asc" ? cmp : -cmp;
  });
}

export function PromptList() {
  const { data: prompts, isLoading } = usePrompts();
  const { filter, viewMode, openPromptDialog } = useUIStore();

  const filtered = useMemo(() => {
    if (!prompts) return [];

    let result = prompts;

    // Category filter
    if (filter.categoryId) {
      result = result.filter((p) => p.category_id === filter.categoryId);
    }

    // Favorites filter
    if (filter.favoritesOnly) {
      result = result.filter((p) => p.is_favorite);
    }

    // Tag filter
    if (filter.tags.length > 0) {
      result = result.filter((p) =>
        filter.tags.some((t) => p.tags?.includes(t))
      );
    }

    // Search filter
    if (filter.search.trim()) {
      const q = filter.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.content.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Sort
    result = sortPrompts(result, filter.sortField, filter.sortDirection);

    return result;
  }, [prompts, filter]);

  if (isLoading) {
    return (
      <div
        className={cn(
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
            : "flex flex-col gap-2"
        )}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-[220px] rounded-xl" />
        ))}
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-muted-foreground">
        <div className="flex items-center justify-center size-20 rounded-2xl bg-muted/60">
          <FileText className="size-10 opacity-40" />
        </div>
        <div className="text-center max-w-xs">
          <p className="text-lg font-semibold text-foreground">프롬프트가 없습니다</p>
          <p className="text-sm mt-1">
            {filter.search
              ? "검색 결과가 없습니다. 다른 키워드로 검색해 보세요."
              : "새 프롬프트를 추가하여 시작하세요."}
          </p>
        </div>
        {!filter.search && (
          <Button onClick={() => openPromptDialog()} className="gap-1.5">
            <Plus className="size-4" />
            새 프롬프트
          </Button>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        viewMode === "grid"
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
          : "flex flex-col gap-2"
      )}
    >
      {filtered.map((prompt) => (
        <PromptCard key={prompt.id} prompt={prompt} />
      ))}
    </div>
  );
}
