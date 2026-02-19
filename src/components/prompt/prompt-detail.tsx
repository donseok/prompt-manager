"use client";

import { Copy, Star, Pencil, Trash2, X } from "lucide-react";
import Markdown from "react-markdown";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  usePrompt,
  useToggleFavorite,
  useDeletePrompt,
  useIncrementUsage,
} from "@/hooks/use-prompts";
import { useCategories } from "@/hooks/use-categories";
import { useUIStore } from "@/store/ui-store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { formatDistanceToNow, format } from "date-fns";
import { ko } from "date-fns/locale";

export function PromptDetail() {
  const { detailPromptId, closePromptDetail, openPromptDialog } = useUIStore();
  const { data: prompt } = usePrompt(detailPromptId);
  const { data: categories = [] } = useCategories();
  const toggleFavorite = useToggleFavorite();
  const deletePrompt = useDeletePrompt();
  const incrementUsage = useIncrementUsage();

  const category = categories.find((c) => c.id === prompt?.category_id);

  const handleCopy = async () => {
    if (!prompt) return;
    await navigator.clipboard.writeText(prompt.content);
    incrementUsage.mutate(prompt.id);
    toast.success("클립보드에 복사되었습니다");
  };

  const handleDelete = () => {
    if (!prompt) return;
    deletePrompt.mutate(prompt.id);
    closePromptDetail();
  };

  return (
    <Sheet open={!!detailPromptId} onOpenChange={(open) => !open && closePromptDetail()}>
      <SheetContent className="w-full sm:max-w-xl p-0 flex flex-col">
        <SheetHeader className="px-6 pt-6 pb-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <SheetTitle className="text-xl">
                {prompt?.title ?? ""}
              </SheetTitle>
              {prompt?.description && (
                <SheetDescription className="mt-1">
                  {prompt.description}
                </SheetDescription>
              )}
            </div>
          </div>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            {category && (
              <Badge variant="outline" className="gap-1.5">
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: category.color || "#6b7280" }}
                />
                {category.name}
              </Badge>
            )}
            {prompt?.tags?.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <Button variant="default" size="sm" className="gap-1.5" onClick={handleCopy}>
              <Copy className="size-3.5" />
              복사
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => {
                if (!prompt) return;
                toggleFavorite.mutate({
                  id: prompt.id,
                  is_favorite: !prompt.is_favorite,
                });
              }}
            >
              <Star
                className={cn(
                  "size-3.5",
                  prompt?.is_favorite
                    ? "fill-yellow-400 text-yellow-400"
                    : ""
                )}
              />
              즐겨찾기
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => {
                if (!prompt) return;
                closePromptDetail();
                openPromptDialog(prompt.id);
              }}
            >
              <Pencil className="size-3.5" />
              수정
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-destructive"
              onClick={handleDelete}
            >
              <Trash2 className="size-3.5" />
              삭제
            </Button>
          </div>
        </SheetHeader>

        <Separator className="mt-4" />

        {/* Content */}
        <ScrollArea className="flex-1 px-6 py-4">
          {prompt && (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <Markdown>{prompt.content}</Markdown>
            </div>
          )}
        </ScrollArea>

        {/* Footer info */}
        {prompt && (
          <>
            <Separator />
            <div className="px-6 py-3 text-xs text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1">
              <span>
                생성: {format(new Date(prompt.created_at), "yyyy.MM.dd HH:mm", { locale: ko })}
              </span>
              <span>
                수정: {formatDistanceToNow(new Date(prompt.updated_at), { addSuffix: true, locale: ko })}
              </span>
              <span className="ml-auto">사용: {prompt.usage_count}회</span>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
