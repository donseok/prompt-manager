"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Search,
  Plus,
  Moon,
  Sun,
  PanelLeftClose,
  PanelLeft,
  Command,
  LayoutGrid,
  List,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useUIStore } from "@/store/ui-store";

export function AppHeader() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const {
    sidebarOpen,
    toggleSidebar,
    filter,
    setSearch,
    viewMode,
    setViewMode,
    openPromptDialog,
    setCommandPaletteOpen,
  } = useUIStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Debounced search
  const [localSearch, setLocalSearch] = useState(filter.search);
  const handleSearchChange = useCallback(
    (value: string) => {
      setLocalSearch(value);
      const timer = setTimeout(() => setSearch(value), 300);
      return () => clearTimeout(timer);
    },
    [setSearch]
  );

  // Sync external filter changes
  useEffect(() => {
    setLocalSearch(filter.search);
  }, [filter.search]);

  return (
    <header className="flex h-14 items-center gap-2 border-b bg-background px-4">
      <TooltipProvider delayDuration={300}>
        {/* Sidebar toggle */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              {sidebarOpen ? (
                <PanelLeftClose className="size-4" />
              ) : (
                <PanelLeft className="size-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>사이드바 토글</TooltipContent>
        </Tooltip>

        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="프롬프트 검색..."
            value={localSearch}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9 h-9"
          />
        </div>

        <div className="flex items-center gap-1 ml-auto">
          {/* View mode toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  setViewMode(viewMode === "grid" ? "list" : "grid")
                }
              >
                {viewMode === "grid" ? (
                  <List className="size-4" />
                ) : (
                  <LayoutGrid className="size-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {viewMode === "grid" ? "리스트 뷰" : "그리드 뷰"}
            </TooltipContent>
          </Tooltip>

          {/* Command palette */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCommandPaletteOpen(true)}
              >
                <Command className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              커맨드 팔레트 <kbd className="ml-1 text-xs">Ctrl+K</kbd>
            </TooltipContent>
          </Tooltip>

          {/* Theme toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {mounted && theme === "dark" ? (
                  <Sun className="size-4" />
                ) : (
                  <Moon className="size-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>테마 전환</TooltipContent>
          </Tooltip>

          {/* Add prompt */}
          <Button size="sm" onClick={() => openPromptDialog()} className="gap-1.5 ml-1">
            <Plus className="size-4" />
            새 프롬프트
          </Button>
        </div>
      </TooltipProvider>
    </header>
  );
}
