"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUIStore } from "@/store/ui-store";
import { usePrompt, useCreatePrompt, useUpdatePrompt } from "@/hooks/use-prompts";
import { useCategories } from "@/hooks/use-categories";

export function PromptDialog() {
  const { promptDialogOpen, editingPromptId, closePromptDialog } = useUIStore();
  const { data: existing } = usePrompt(editingPromptId);
  const { data: categories = [] } = useCategories();
  const createMutation = useCreatePrompt();
  const updateMutation = useUpdatePrompt();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const isEditing = !!editingPromptId;

  useEffect(() => {
    if (existing && isEditing) {
      setTitle(existing.title);
      setContent(existing.content);
      setDescription(existing.description || "");
      setCategoryId(existing.category_id || null);
      setTags(existing.tags || []);
    } else if (!isEditing && promptDialogOpen) {
      setTitle("");
      setContent("");
      setDescription("");
      setCategoryId(null);
      setTags([]);
    }
    setTagInput("");
  }, [existing, isEditing, promptDialogOpen]);

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const values = {
      title: title.trim(),
      content: content.trim(),
      description: description.trim() || undefined,
      category_id: categoryId || null,
      tags: tags.length > 0 ? tags : undefined,
    };

    if (isEditing && editingPromptId) {
      await updateMutation.mutateAsync({ id: editingPromptId, values });
    } else {
      await createMutation.mutateAsync(values);
    }
    closePromptDialog();
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={promptDialogOpen} onOpenChange={(open) => !open && closePromptDialog()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "프롬프트 수정" : "새 프롬프트"}
            </DialogTitle>
            <DialogDescription>
              {isEditing ? "프롬프트를 수정합니다." : "새 프롬프트를 작성합니다."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Title */}
            <div className="grid gap-2">
              <Label htmlFor="prompt-title">제목 *</Label>
              <Input
                id="prompt-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="프롬프트 제목"
                autoFocus
              />
            </div>

            {/* Description */}
            <div className="grid gap-2">
              <Label htmlFor="prompt-desc">설명</Label>
              <Input
                id="prompt-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="간단한 설명 (선택)"
              />
            </div>

            {/* Content */}
            <div className="grid gap-2">
              <Label htmlFor="prompt-content">프롬프트 내용 *</Label>
              <Textarea
                id="prompt-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="프롬프트 내용을 입력하세요..."
                rows={8}
                className="font-mono text-sm"
              />
            </div>

            {/* Category */}
            <div className="grid gap-2">
              <Label>카테고리</Label>
              <Select
                value={categoryId || "none"}
                onValueChange={(v) => setCategoryId(v === "none" ? null : v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="카테고리 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">미분류</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      <span className="flex items-center gap-2">
                        <span
                          className="size-2 rounded-full"
                          style={{ backgroundColor: cat.color || "#6b7280" }}
                        />
                        {cat.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tags */}
            <div className="grid gap-2">
              <Label>태그</Label>
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder="태그 입력 후 Enter"
                  className="flex-1"
                />
                <Button type="button" variant="outline" onClick={addTag} disabled={!tagInput.trim()}>
                  추가
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1 pr-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-0.5 rounded-full hover:bg-muted-foreground/20 p-0.5"
                      >
                        <X className="size-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={closePromptDialog}>
              취소
            </Button>
            <Button
              type="submit"
              disabled={isPending || !title.trim() || !content.trim()}
            >
              {isPending ? "저장 중..." : isEditing ? "수정" : "생성"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
