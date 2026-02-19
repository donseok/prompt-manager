"use client";

import { AppShell } from "@/components/layout/app-shell";
import { PromptList } from "@/components/prompt/prompt-list";
import { PromptDialog } from "@/components/prompt/prompt-dialog";
import { PromptDetail } from "@/components/prompt/prompt-detail";
import { CategoryDialog } from "@/components/category/category-dialog";
import { CommandPalette } from "@/components/command-palette";

export default function HomePage() {
  return (
    <AppShell>
      <PromptList />

      {/* Dialogs & overlays */}
      <PromptDialog />
      <PromptDetail />
      <CategoryDialog />
      <CommandPalette />
    </AppShell>
  );
}
