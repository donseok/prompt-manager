"use client";

import { useEffect } from "react";
import {
  Plus,
  Star,
  FolderPlus,
  Search,
  BarChart3,
  Moon,
  Sun,
  LayoutDashboard,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { usePrompts } from "@/hooks/use-prompts";
import { useCategories } from "@/hooks/use-categories";
import { useUIStore } from "@/store/ui-store";
import { toast } from "sonner";

export function CommandPalette() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { data: prompts = [] } = usePrompts();
  const { data: categories = [] } = useCategories();
  const {
    commandPaletteOpen,
    setCommandPaletteOpen,
    openPromptDialog,
    openCategoryDialog,
    openPromptDetail,
    setCategoryId,
    setFavoritesOnly,
    resetFilter,
  } = useUIStore();

  // Ctrl+K shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  const runCommand = (fn: () => void) => {
    setCommandPaletteOpen(false);
    fn();
  };

  return (
    <CommandDialog
      open={commandPaletteOpen}
      onOpenChange={setCommandPaletteOpen}
    >
      <CommandInput placeholder="명령어 또는 프롬프트 검색..." />
      <CommandList>
        <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>

        {/* Actions */}
        <CommandGroup heading="작업">
          <CommandItem onSelect={() => runCommand(() => openPromptDialog())}>
            <Plus className="size-4" />
            새 프롬프트 만들기
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => openCategoryDialog())}>
            <FolderPlus className="size-4" />
            새 카테고리 만들기
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => { resetFilter(); router.push("/"); })}>
            <LayoutDashboard className="size-4" />
            전체 프롬프트 보기
          </CommandItem>
          <CommandItem
            onSelect={() =>
              runCommand(() => {
                setFavoritesOnly(true);
                router.push("/");
              })
            }
          >
            <Star className="size-4" />
            즐겨찾기 보기
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/analytics"))}>
            <BarChart3 className="size-4" />
            분석 페이지
          </CommandItem>
          <CommandItem
            onSelect={() =>
              runCommand(() =>
                setTheme(theme === "dark" ? "light" : "dark")
              )
            }
          >
            {theme === "dark" ? (
              <Sun className="size-4" />
            ) : (
              <Moon className="size-4" />
            )}
            테마 전환
          </CommandItem>
        </CommandGroup>

        {/* Categories */}
        {categories.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="카테고리">
              {categories.map((cat) => (
                <CommandItem
                  key={cat.id}
                  onSelect={() =>
                    runCommand(() => {
                      setCategoryId(cat.id);
                      router.push("/");
                    })
                  }
                >
                  <span
                    className="size-3 rounded-full"
                    style={{ backgroundColor: cat.color || "#6b7280" }}
                  />
                  {cat.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {/* Recent prompts */}
        {prompts.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="프롬프트">
              {prompts.slice(0, 10).map((p) => (
                <CommandItem
                  key={p.id}
                  onSelect={() => runCommand(() => openPromptDetail(p.id))}
                >
                  <Search className="size-4" />
                  <span className="truncate">{p.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
