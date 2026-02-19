// ── Category ──────────────────────────────────────────────
export interface Category {
  id: string;
  name: string;
  description: string | null;
  color: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface CategoryFormValues {
  name: string;
  description?: string;
  color?: string;
}

// ── Prompt ────────────────────────────────────────────────
export interface Prompt {
  id: string;
  title: string;
  content: string;
  description: string | null;
  category_id: string | null;
  is_favorite: boolean;
  usage_count: number;
  tags: string[] | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface PromptFormValues {
  title: string;
  content: string;
  description?: string;
  category_id?: string | null;
  tags?: string[];
}

// ── Filter & UI ───────────────────────────────────────────
export type SortField = "created_at" | "updated_at" | "title" | "usage_count";
export type SortDirection = "asc" | "desc";
export type ViewMode = "grid" | "list";

export interface PromptFilter {
  search: string;
  categoryId: string | null;
  favoritesOnly: boolean;
  tags: string[];
  sortField: SortField;
  sortDirection: SortDirection;
}

// ── Analytics ─────────────────────────────────────────────
export interface AnalyticsData {
  totalPrompts: number;
  totalCategories: number;
  totalFavorites: number;
  totalUsage: number;
  promptsByCategory: { name: string; count: number; color: string | null }[];
  topUsed: { title: string; usage_count: number }[];
  recentlyCreated: Prompt[];
  tagDistribution: { tag: string; count: number }[];
}
