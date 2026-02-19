"use client";

import {
  BarChart3,
  FileText,
  FolderOpen,
  Star,
  Hash,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useAnalytics } from "@/hooks/use-analytics";
import { AppShell } from "@/components/layout/app-shell";
import { CategoryDialog } from "@/components/category/category-dialog";
import { PromptDialog } from "@/components/prompt/prompt-dialog";
import { PromptDetail } from "@/components/prompt/prompt-detail";
import { CommandPalette } from "@/components/command-palette";

const PIE_COLORS = [
  "#3b82f6", "#ef4444", "#22c55e", "#eab308", "#8b5cf6",
  "#ec4899", "#06b6d4", "#f97316", "#6b7280",
];

export default function AnalyticsPage() {
  const { data, isLoading } = useAnalytics();

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="size-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">분석</h1>
            <p className="text-sm text-muted-foreground">프롬프트 사용 통계</p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))}
          </div>
        ) : data ? (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                icon={<FileText className="size-5" />}
                label="전체 프롬프트"
                value={data.totalPrompts}
              />
              <StatCard
                icon={<FolderOpen className="size-5" />}
                label="카테고리"
                value={data.totalCategories}
              />
              <StatCard
                icon={<Star className="size-5" />}
                label="즐겨찾기"
                value={data.totalFavorites}
              />
              <StatCard
                icon={<Hash className="size-5" />}
                label="총 사용 횟수"
                value={data.totalUsage}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Category distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">카테고리별 프롬프트</CardTitle>
                  <CardDescription>카테고리별 프롬프트 수</CardDescription>
                </CardHeader>
                <CardContent>
                  {data.promptsByCategory.length > 0 ? (
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={data.promptsByCategory}
                          dataKey="count"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={90}
                          label={({ name, value }) => `${name} (${value})`}
                        >
                          {data.promptsByCategory.map((entry, index) => (
                            <Cell
                              key={entry.name}
                              fill={entry.color || PIE_COLORS[index % PIE_COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      데이터가 없습니다
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Top used */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">많이 사용된 프롬프트</CardTitle>
                  <CardDescription>사용 횟수 기준 상위 5개</CardDescription>
                </CardHeader>
                <CardContent>
                  {data.topUsed.length > 0 ? (
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={data.topUsed} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" allowDecimals={false} />
                        <YAxis
                          dataKey="title"
                          type="category"
                          width={120}
                          tick={{ fontSize: 12 }}
                        />
                        <Tooltip />
                        <Bar dataKey="usage_count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      데이터가 없습니다
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Tag distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">태그 분포</CardTitle>
                  <CardDescription>가장 많이 사용된 태그</CardDescription>
                </CardHeader>
                <CardContent>
                  {data.tagDistribution.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {data.tagDistribution.map((t) => (
                        <Badge
                          key={t.tag}
                          variant="secondary"
                          className="text-sm px-3 py-1"
                        >
                          {t.tag}
                          <span className="ml-1.5 text-muted-foreground">
                            {t.count}
                          </span>
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      태그가 없습니다
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Recently created */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">최근 생성</CardTitle>
                  <CardDescription>최근 생성된 프롬프트</CardDescription>
                </CardHeader>
                <CardContent>
                  {data.recentlyCreated.length > 0 ? (
                    <div className="space-y-3">
                      {data.recentlyCreated.map((p) => (
                        <div
                          key={p.id}
                          className="flex items-center justify-between gap-2"
                        >
                          <span className="text-sm truncate font-medium">
                            {p.title}
                          </span>
                          <span className="text-xs text-muted-foreground shrink-0">
                            {new Date(p.created_at).toLocaleDateString("ko-KR")}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      데이터가 없습니다
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        ) : null}
      </div>

      <CategoryDialog />
      <PromptDialog />
      <PromptDetail />
      <CommandPalette />
    </AppShell>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 pt-6">
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
