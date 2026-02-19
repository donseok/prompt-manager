"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUIStore } from "@/store/ui-store";
import {
  useCategory,
  useCreateCategory,
  useUpdateCategory,
} from "@/hooks/use-categories";

const COLORS = [
  "#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4",
  "#3b82f6", "#8b5cf6", "#ec4899", "#6b7280",
];

export function CategoryDialog() {
  const { categoryDialogOpen, editingCategoryId, closeCategoryDialog } =
    useUIStore();
  const { data: existing } = useCategory(editingCategoryId);
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(COLORS[0]);

  const isEditing = !!editingCategoryId;

  useEffect(() => {
    if (existing && isEditing) {
      setName(existing.name);
      setDescription(existing.description || "");
      setColor(existing.color || COLORS[0]);
    } else if (!isEditing) {
      setName("");
      setDescription("");
      setColor(COLORS[0]);
    }
  }, [existing, isEditing, categoryDialogOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const values = { name: name.trim(), description: description.trim() || undefined, color };

    if (isEditing && editingCategoryId) {
      await updateMutation.mutateAsync({ id: editingCategoryId, values });
    } else {
      await createMutation.mutateAsync(values);
    }
    closeCategoryDialog();
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={categoryDialogOpen} onOpenChange={(open) => !open && closeCategoryDialog()}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "카테고리 수정" : "새 카테고리"}
            </DialogTitle>
            <DialogDescription>
              {isEditing ? "카테고리 정보를 수정합니다." : "새 카테고리를 만듭니다."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="cat-name">이름</Label>
              <Input
                id="cat-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="카테고리 이름"
                autoFocus
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="cat-desc">설명</Label>
              <Textarea
                id="cat-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="카테고리 설명 (선택)"
                rows={2}
              />
            </div>

            <div className="grid gap-2">
              <Label>색상</Label>
              <div className="flex flex-wrap gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className="size-7 rounded-full border-2 transition-transform hover:scale-110"
                    style={{
                      backgroundColor: c,
                      borderColor: color === c ? "white" : "transparent",
                      outline: color === c ? `2px solid ${c}` : "none",
                    }}
                    onClick={() => setColor(c)}
                  />
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={closeCategoryDialog}
            >
              취소
            </Button>
            <Button type="submit" disabled={isPending || !name.trim()}>
              {isPending ? "저장 중..." : isEditing ? "수정" : "생성"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
