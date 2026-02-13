"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerFooter,
} from "@/components/ui/drawer"
import { Plus, Loader2 } from "lucide-react"
import { saveBodyMetric } from "@/app/actions/metrics"
import { toast } from "sonner"

export function MetricsForm() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [weight, setWeight] = useState("")
  const [bodyFat, setBodyFat] = useState("")
  const [chest, setChest] = useState("")
  const [waist, setWaist] = useState("")
  const [hips, setHips] = useState("")
  const [bicep, setBicep] = useState("")
  const [thigh, setThigh] = useState("")

  async function handleSave() {
    setIsSaving(true)
    try {
      await saveBodyMetric({
        weight_kg: weight ? parseFloat(weight) : undefined,
        body_fat_pct: bodyFat ? parseFloat(bodyFat) : undefined,
        chest_cm: chest ? parseFloat(chest) : undefined,
        waist_cm: waist ? parseFloat(waist) : undefined,
        hips_cm: hips ? parseFloat(hips) : undefined,
        bicep_cm: bicep ? parseFloat(bicep) : undefined,
        thigh_cm: thigh ? parseFloat(thigh) : undefined,
      })
      toast.success("Measurements saved!")
      setIsOpen(false)
      resetForm()
      router.refresh()
    } catch {
      toast.error("Failed to save measurements")
    } finally {
      setIsSaving(false)
    }
  }

  function resetForm() {
    setWeight("")
    setBodyFat("")
    setChest("")
    setWaist("")
    setHips("")
    setBicep("")
    setThigh("")
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button size="sm" className="gap-1">
          <Plus className="h-4 w-4" />
          Log
        </Button>
      </DrawerTrigger>
      <DrawerContent className="bg-card">
        <DrawerHeader>
          <DrawerTitle>{"Log Today's Measurements"}</DrawerTitle>
        </DrawerHeader>
        <div className="flex flex-col gap-4 px-4">
          <div className="flex gap-3">
            <div className="flex-1 space-y-1.5">
              <Label htmlFor="m-weight" className="text-xs">Weight (kg)</Label>
              <Input
                id="m-weight"
                type="number"
                inputMode="decimal"
                placeholder="75"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="h-11 bg-background"
              />
            </div>
            <div className="flex-1 space-y-1.5">
              <Label htmlFor="m-bf" className="text-xs">Body Fat %</Label>
              <Input
                id="m-bf"
                type="number"
                inputMode="decimal"
                placeholder="15"
                value={bodyFat}
                onChange={(e) => setBodyFat(e.target.value)}
                className="h-11 bg-background"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Chest", value: chest, setter: setChest, id: "m-chest" },
              { label: "Waist", value: waist, setter: setWaist, id: "m-waist" },
              { label: "Hips", value: hips, setter: setHips, id: "m-hips" },
              { label: "Bicep", value: bicep, setter: setBicep, id: "m-bicep" },
              { label: "Thigh", value: thigh, setter: setThigh, id: "m-thigh" },
            ].map((field) => (
              <div key={field.id} className="space-y-1.5">
                <Label htmlFor={field.id} className="text-xs">{field.label} (cm)</Label>
                <Input
                  id={field.id}
                  type="number"
                  inputMode="decimal"
                  value={field.value}
                  onChange={(e) => field.setter(e.target.value)}
                  className="h-11 bg-background"
                />
              </div>
            ))}
          </div>
        </div>
        <DrawerFooter>
          <Button onClick={handleSave} disabled={isSaving} className="h-12">
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSaving ? "Saving..." : "Save Measurements"}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
