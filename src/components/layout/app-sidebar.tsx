"use client";

import {
  FolderOpen,
  Plus,
  Star,
  LayoutDashboard,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategories } from "@/hooks/use-categories";
import { useUIStore } from "@/store/ui-store";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AppSidebar() {
  const pathname = usePathname();
  const { data: categories, isLoading } = useCategories();
  const {
    filter,
    setCategoryId,
    setFavoritesOnly,
    openCategoryDialog,
    resetFilter,
  } = useUIStore();

  const isAnalytics = pathname === "/analytics";

  return (
    <div className="flex h-full w-64 flex-col border-r bg-sidebar text-sidebar-foreground">
      {/* Logo / Title */}
      <div className="flex h-14 items-center gap-2 px-4 font-semibold">
        <FolderOpen className="size-5 text-sidebar-primary" />
        <span>Prompt Manager</span>
      </div>

      <Separator />

      {/* Navigation */}
      <div className="px-3 pt-3 pb-1">
        <Link href="/">
          <Button
            variant={!isAnalytics && !filter.categoryId && !filter.favoritesOnly ? "secondary" : "ghost"}
            className="w-full justify-start gap-2"
            onClick={() => {
              resetFilter();
            }}
          >
            <LayoutDashboard className="size-4" />
            전체 프롬프트
          </Button>
        </Link>
        <Link href="/">
          <Button
            variant={filter.favoritesOnly ? "secondary" : "ghost"}
            className="w-full justify-start gap-2"
            onClick={() => {
              setFavoritesOnly(!filter.favoritesOnly);
              setCategoryId(null);
            }}
          >
            <Star className={cn("size-4", filter.favoritesOnly && "fill-current")} />
            즐겨찾기
          </Button>
        </Link>
        <Link href="/analytics">
          <Button
            variant={isAnalytics ? "secondary" : "ghost"}
            className="w-full justify-start gap-2"
          >
            <BarChart3 className="size-4" />
            분석
          </Button>
        </Link>
      </div>

      <Separator className="mx-3" />

      {/* Categories */}
      <div className="flex items-center justify-between px-4 pt-3 pb-1">
        <span className="text-xs font-medium text-muted-foreground uppercase">
          카테고리
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="size-6"
          onClick={() => openCategoryDialog()}
        >
          <Plus className="size-3.5" />
        </Button>
      </div>

      <ScrollArea className="flex-1 px-3">
        {isLoading ? (
          <div className="space-y-1">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full rounded-md" />
            ))}
          </div>
        ) : categories && categories.length > 0 ? (
          <div className="space-y-0.5">
            {categories.map((category) => (
              <Link key={category.id} href="/">
                <Button
                  variant={
                    filter.categoryId === category.id ? "secondary" : "ghost"
                  }
                  className="w-full justify-start gap-2"
                  onClick={() => {
                    setCategoryId(
                      filter.categoryId === category.id ? null : category.id
                    );
                    setFavoritesOnly(false);
                  }}
                >
                  <span
                    className="size-2.5 rounded-full shrink-0"
                    style={{
                      backgroundColor: category.color || "hsl(var(--muted-foreground))",
                    }}
                  />
                  <span className="truncate">{category.name}</span>
                </Button>
              </Link>
            ))}
          </div>
        ) : (
          <p className="py-4 text-center text-xs text-muted-foreground">
            카테고리가 없습니다
          </p>
        )}
      </ScrollArea>
    </div>
  );
}
