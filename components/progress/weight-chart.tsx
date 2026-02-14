"use client"

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"
import type { BodyMetric } from "@/lib/types"

interface WeightChartProps {
  metrics: BodyMetric[]
}

export function WeightChart({ metrics }: WeightChartProps) {
  const data = metrics
    .filter((m) => m.weight_kg !== null)
    .map((m) => ({
      date: new Date(m.recorded_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      weight: Number(m.weight_kg),
    }))
    .reverse()

  if (data.length === 0) {
    return (
      <div className="forge-card flex h-48 items-center justify-center rounded-xl border border-border bg-card">
        <p className="text-sm text-muted-foreground">No weight data yet</p>
      </div>
    )
  }

  const minWeight = Math.floor(Math.min(...data.map((d) => d.weight)) - 2)
  const maxWeight = Math.ceil(Math.max(...data.map((d) => d.weight)) + 2)

  return (
    <div className="forge-card rounded-xl border border-border bg-card p-4">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Weight Trend
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(38 92% 50%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(38 92% 50%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "hsl(0 0% 45%)", fontSize: 11 }}
          />
          <YAxis
            domain={[minWeight, maxWeight]}
            axisLine={false}
            tickLine={false}
            tick={{ fill: "hsl(0 0% 45%)", fontSize: 11 }}
            width={35}
          />
          <Tooltip
            contentStyle={{
              background: "hsl(0 0% 7%)",
              border: "1px solid hsl(0 0% 14%)",
              borderRadius: "10px",
              color: "hsl(0 0% 95%)",
              fontSize: 12,
              boxShadow: "0 8px 32px -8px hsl(0 0% 0% / 0.5)",
            }}
            formatter={(value: number) => [`${value} kg`, "Weight"]}
          />
          <Area
            type="monotone"
            dataKey="weight"
            stroke="hsl(38 92% 50%)"
            strokeWidth={2}
            fill="url(#weightGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
