"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Prompt, PromptFormValues } from "@/types";
import { toast } from "sonner";

const PROMPTS_KEY = ["prompts"];

export function usePrompts() {
  return useQuery<Prompt[]>({
    queryKey: PROMPTS_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("prompts")
        .select("*")
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function usePrompt(id: string | null) {
  return useQuery<Prompt | null>({
    queryKey: ["prompts", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("prompts")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

export function useCreatePrompt() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (values: PromptFormValues) => {
      const { data, error } = await supabase
        .from("prompts")
        .insert(values)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PROMPTS_KEY });
      toast.success("프롬프트가 생성되었습니다");
    },
    onError: () => {
      toast.error("프롬프트 생성에 실패했습니다");
    },
  });
}

export function useUpdatePrompt() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      values,
    }: {
      id: string;
      values: Partial<PromptFormValues>;
    }) => {
      const { data, error } = await supabase
        .from("prompts")
        .update(values)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PROMPTS_KEY });
      toast.success("프롬프트가 수정되었습니다");
    },
    onError: () => {
      toast.error("프롬프트 수정에 실패했습니다");
    },
  });
}

export function useDeletePrompt() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("prompts")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PROMPTS_KEY });
      toast.success("프롬프트가 삭제되었습니다");
    },
    onError: () => {
      toast.error("프롬프트 삭제에 실패했습니다");
    },
  });
}

export function useToggleFavorite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      is_favorite,
    }: {
      id: string;
      is_favorite: boolean;
    }) => {
      const { error } = await supabase
        .from("prompts")
        .update({ is_favorite })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PROMPTS_KEY });
    },
  });
}

export function useIncrementUsage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      // Fetch current usage_count, then increment
      const { data: prompt, error: fetchError } = await supabase
        .from("prompts")
        .select("usage_count")
        .eq("id", id)
        .single();
      if (fetchError) throw fetchError;

      const { error } = await supabase
        .from("prompts")
        .update({ usage_count: (prompt?.usage_count ?? 0) + 1 })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PROMPTS_KEY });
    },
  });
}
