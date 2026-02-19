"use client";

import { create } from "zustand";
import type { PromptFilter, SortField, SortDirection, ViewMode } from "@/types";

interface UIState {
  // Sidebar
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Filter
  filter: PromptFilter;
  setSearch: (search: string) => void;
  setCategoryId: (categoryId: string | null) => void;
  setFavoritesOnly: (favoritesOnly: boolean) => void;
  toggleTag: (tag: string) => void;
  setSort: (field: SortField, direction: SortDirection) => void;
  resetFilter: () => void;

  // View mode
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;

  // Dialogs
  promptDialogOpen: boolean;
  editingPromptId: string | null;
  openPromptDialog: (promptId?: string) => void;
  closePromptDialog: () => void;

  categoryDialogOpen: boolean;
  editingCategoryId: string | null;
  openCategoryDialog: (categoryId?: string) => void;
  closeCategoryDialog: () => void;

  // Prompt detail
  detailPromptId: string | null;
  openPromptDetail: (promptId: string) => void;
  closePromptDetail: () => void;

  // Command palette
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
}

const defaultFilter: PromptFilter = {
  search: "",
  categoryId: null,
  favoritesOnly: false,
  tags: [],
  sortField: "updated_at",
  sortDirection: "desc",
};

export const useUIStore = create<UIState>((set) => ({
  // Sidebar
  sidebarOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  // Filter
  filter: { ...defaultFilter },
  setSearch: (search) =>
    set((s) => ({ filter: { ...s.filter, search } })),
  setCategoryId: (categoryId) =>
    set((s) => ({ filter: { ...s.filter, categoryId } })),
  setFavoritesOnly: (favoritesOnly) =>
    set((s) => ({ filter: { ...s.filter, favoritesOnly } })),
  toggleTag: (tag) =>
    set((s) => {
      const tags = s.filter.tags.includes(tag)
        ? s.filter.tags.filter((t) => t !== tag)
        : [...s.filter.tags, tag];
      return { filter: { ...s.filter, tags } };
    }),
  setSort: (sortField, sortDirection) =>
    set((s) => ({ filter: { ...s.filter, sortField, sortDirection } })),
  resetFilter: () => set({ filter: { ...defaultFilter } }),

  // View mode
  viewMode: "grid",
  setViewMode: (viewMode) => set({ viewMode }),

  // Dialogs
  promptDialogOpen: false,
  editingPromptId: null,
  openPromptDialog: (promptId) =>
    set({ promptDialogOpen: true, editingPromptId: promptId ?? null }),
  closePromptDialog: () =>
    set({ promptDialogOpen: false, editingPromptId: null }),

  categoryDialogOpen: false,
  editingCategoryId: null,
  openCategoryDialog: (categoryId) =>
    set({ categoryDialogOpen: true, editingCategoryId: categoryId ?? null }),
  closeCategoryDialog: () =>
    set({ categoryDialogOpen: false, editingCategoryId: null }),

  // Prompt detail
  detailPromptId: null,
  openPromptDetail: (promptId) => set({ detailPromptId: promptId }),
  closePromptDetail: () => set({ detailPromptId: null }),

  // Command palette
  commandPaletteOpen: false,
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
}));
