"use client";

import { Star, Copy, MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToggleFavorite, useDeletePrompt, useIncrementUsage } from "@/hooks/use-prompts";
import { useCategories } from "@/hooks/use-categories";
import { useUIStore } from "@/store/ui-store";
import type { Prompt } from "@/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

export function PromptCard({ prompt }: { prompt: Prompt }) {
  const { data: categories = [] } = useCategories();
  const toggleFavorite = useToggleFavorite();
  const deletePrompt = useDeletePrompt();
  const incrementUsage = useIncrementUsage();
  const { openPromptDialog, openPromptDetail } = useUIStore();

  const category = categories.find((c) => c.id === prompt.category_id);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt.content);
    incrementUsage.mutate(prompt.id);
    toast.success("클립보드에 복사되었습니다");
  };

  const handleDelete = () => {
    deletePrompt.mutate(prompt.id);
  };

  return (
    <Card className="group relative flex flex-col transition-shadow hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base truncate">{prompt.title}</CardTitle>
            {prompt.description && (
              <CardDescription className="mt-1 line-clamp-1">
                {prompt.description}
              </CardDescription>
            )}
          </div>
          <div className="flex items-center gap-0.5 shrink-0">
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7"
                    onClick={() =>
                      toggleFavorite.mutate({
                        id: prompt.id,
                        is_favorite: !prompt.is_favorite,
                      })
                    }
                  >
                    <Star
                      className={cn(
                        "size-4",
                        prompt.is_favorite
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground"
                      )}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>즐겨찾기</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-7">
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => openPromptDetail(prompt.id)}>
                  <Eye className="size-4" />
                  상세 보기
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => openPromptDialog(prompt.id)}>
                  <Pencil className="size-4" />
                  수정
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleCopy}>
                  <Copy className="size-4" />
                  복사
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={handleDelete}>
                  <Trash2 className="size-4" />
                  삭제
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent
        className="flex-1 cursor-pointer"
        onClick={() => openPromptDetail(prompt.id)}
      >
        <p className="text-sm text-muted-foreground line-clamp-3 whitespace-pre-wrap">
          {prompt.content}
        </p>
      </CardContent>

      <CardFooter className="flex flex-wrap items-center gap-1.5 pt-0 text-xs text-muted-foreground">
        {category && (
          <Badge variant="outline" className="gap-1 text-xs font-normal">
            <span
              className="size-1.5 rounded-full"
              style={{ backgroundColor: category.color || "#6b7280" }}
            />
            {category.name}
          </Badge>
        )}
        {prompt.tags?.map((tag) => (
          <Badge key={tag} variant="secondary" className="text-xs font-normal">
            {tag}
          </Badge>
        ))}
        <span className="ml-auto">
          {formatDistanceToNow(new Date(prompt.updated_at), {
            addSuffix: true,
            locale: ko,
          })}
        </span>
        {prompt.usage_count > 0 && (
          <span>· {prompt.usage_count}회 사용</span>
        )}
      </CardFooter>
    </Card>
  );
}
