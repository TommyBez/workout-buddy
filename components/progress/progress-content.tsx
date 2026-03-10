"use client"

import { useState } from "react"
import type { BodyMetric, WorkoutLog } from "@/lib/types"
import { WeightChart } from "@/components/progress/weight-chart"
import { StatsSummary } from "@/components/progress/stats-summary"
import { WorkoutHistory } from "@/components/progress/workout-history"
import { MetricsForm } from "@/components/progress/metrics-form"
import { cn } from "@/lib/utils"

interface ProgressContentProps {
  metrics: BodyMetric[]
  logs: WorkoutLog[]
}

const TABS = ["Body", "Workouts"] as const

function getMeasurementBadges(metric: BodyMetric) {
  return [
    metric.weight_kg !== null ? `${Number(metric.weight_kg)} kg` : null,
    metric.body_fat_pct !== null ? `${Number(metric.body_fat_pct)}% bf` : null,
    metric.chest_cm !== null ? `Chest ${Number(metric.chest_cm)} cm` : null,
    metric.shoulders_cm !== null ? `Shoulders ${Number(metric.shoulders_cm)} cm` : null,
    metric.waist_cm !== null ? `Waist ${Number(metric.waist_cm)} cm` : null,
    metric.hips_cm !== null ? `Hips ${Number(metric.hips_cm)} cm` : null,
    metric.bicep_cm !== null ? `Bicep ${Number(metric.bicep_cm)} cm` : null,
    metric.thigh_cm !== null ? `Thigh ${Number(metric.thigh_cm)} cm` : null,
  ].filter((value): value is string => value !== null)
}

export function ProgressContent({ metrics, logs }: ProgressContentProps) {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("Body")

  return (
    <div className="flex flex-col gap-4 px-4 pb-4">
      {/* Tab selector */}
      <div className="animate-fade-in delay-50 flex gap-1 rounded-xl bg-secondary/60 p-1">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={cn(
              "flex-1 rounded-lg py-2.5 text-sm font-medium transition-all duration-300",
              activeTab === tab
                ? "bg-card text-foreground shadow-sm shadow-black/20"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Body" && (
        <div className="flex flex-col gap-4">
          <div className="animate-fade-up delay-100 flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Measurements
            </h2>
            <MetricsForm />
          </div>
          <div className="animate-fade-up delay-150">
            <WeightChart metrics={metrics} />
          </div>
          <div className="animate-fade-up delay-200">
            <StatsSummary logs={logs} metrics={metrics} />
          </div>

          {/* Recent measurements */}
          {metrics.length > 0 && (
            <div className="animate-fade-up delay-250 space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Recent Entries
              </h3>
              {metrics.slice(0, 5).map((m, i) => (
                <div
                  key={m.id}
                  className="forge-card flex items-center justify-between rounded-xl border border-border bg-card px-3.5 py-3"
                  style={{ animationDelay: `${300 + i * 50}ms` }}
                >
                  <span className="text-sm text-muted-foreground">
                    {new Date(m.recorded_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <div className="flex flex-wrap justify-end gap-2 text-sm">
                    {getMeasurementBadges(m).map((label) => (
                      <span
                        key={`${m.id}-${label}`}
                        className="rounded-full border border-border/80 bg-secondary/60 px-2 py-1 font-mono text-xs text-foreground"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "Workouts" && (
        <div className="flex flex-col gap-4">
          <div className="animate-fade-up delay-100">
            <StatsSummary logs={logs} metrics={metrics} />
          </div>
          <div className="animate-fade-up delay-200 space-y-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Workout History
            </h2>
            <WorkoutHistory logs={logs} />
          </div>
        </div>
      )}
    </div>
  )
}
