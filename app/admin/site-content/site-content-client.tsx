"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Plus } from "lucide-react";
import type { SiteContent } from "@/lib/types";
import { toast } from "@/lib/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { upsertSiteContent } from "@/app/admin/actions/site-content";

const PREDEFINED_KEYS: { key: string; label: string; description: string }[] = [
  { key: "hero_title", label: "Hero Title", description: "Main headline on the homepage hero section" },
  { key: "hero_subtitle", label: "Hero Subtitle", description: "Subtitle text below the hero title" },
  { key: "about_mission", label: "About — Mission", description: "Mission statement on the about page" },
  { key: "about_how", label: "About — How We Work", description: "Description of how the organization works" },
  { key: "about_approach", label: "About — Approach", description: "The approach section on the about page" },
  { key: "about_insights", label: "About — Insights", description: "Insights section on the about page" },
];

interface SiteContentClientProps {
  entries: SiteContent[];
}

export default function SiteContentClient({ entries }: SiteContentClientProps) {
  const router = useRouter();
  const entryMap = Object.fromEntries(entries.map((e) => [e.key, e.value ?? ""]));

  const [values, setValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const { key } of PREDEFINED_KEYS) {
      initial[key] = entryMap[key] ?? "";
    }
    for (const entry of entries) {
      if (!initial[entry.key]) {
        initial[entry.key] = entry.value ?? "";
      }
    }
    return initial;
  });

  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [addingNew, setAddingNew] = useState(false);

  const predefinedKeySet = new Set(PREDEFINED_KEYS.map((k) => k.key));
  const additionalKeys = Object.keys(values).filter((k) => !predefinedKeySet.has(k));

  async function handleSave(key: string) {
    setSavingKey(key);
    try {
      await upsertSiteContent(key, values[key]);
      toast({ title: "Saved", description: `"${key}" updated successfully.` });
      router.refresh();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSavingKey(null);
    }
  }

  async function handleAddNew() {
    const trimmedKey = newKey.trim().toLowerCase().replace(/\s+/g, "_");
    if (!trimmedKey) {
      toast({ title: "Key is required", variant: "destructive" });
      return;
    }
    if (values[trimmedKey] !== undefined) {
      toast({ title: "Key already exists", variant: "destructive" });
      return;
    }

    setAddingNew(true);
    try {
      await upsertSiteContent(trimmedKey, newValue);
      setValues((prev) => ({ ...prev, [trimmedKey]: newValue }));
      setNewKey("");
      setNewValue("");
      toast({ title: "Created", description: `"${trimmedKey}" added successfully.` });
      router.refresh();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setAddingNew(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Site Content</h1>
        <p className="text-muted-foreground mt-1">
          Edit text content displayed across the public website.
        </p>
      </div>

      <div className="grid gap-4">
        {PREDEFINED_KEYS.map(({ key, label, description }) => (
          <Card key={key}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{label}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                rows={4}
                value={values[key]}
                onChange={(e) =>
                  setValues((prev) => ({ ...prev, [key]: e.target.value }))
                }
                placeholder={`Enter ${label.toLowerCase()}...`}
              />
              <div className="flex justify-end">
                <Button
                  size="sm"
                  onClick={() => handleSave(key)}
                  disabled={savingKey === key}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {savingKey === key ? "Saving..." : "Save"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {additionalKeys.length > 0 && (
        <>
          <Separator />
          <div>
            <h2 className="text-lg font-semibold mb-3">Custom Content</h2>
            <div className="grid gap-4">
              {additionalKeys.map((key) => (
                <Card key={key}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-mono text-sm">
                      {key}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Textarea
                      rows={3}
                      value={values[key]}
                      onChange={(e) =>
                        setValues((prev) => ({ ...prev, [key]: e.target.value }))
                      }
                    />
                    <div className="flex justify-end">
                      <Button
                        size="sm"
                        onClick={() => handleSave(key)}
                        disabled={savingKey === key}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {savingKey === key ? "Saving..." : "Save"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </>
      )}

      <Separator />

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Add Custom Content</CardTitle>
          <CardDescription>
            Create a new content entry with a custom key.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="new-key">Key</Label>
              <Input
                id="new-key"
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                placeholder="e.g. footer_tagline"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-value">Value</Label>
            <Textarea
              id="new-value"
              rows={3}
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder="Content value..."
            />
          </div>
          <div className="flex justify-end">
            <Button onClick={handleAddNew} disabled={addingNew}>
              <Plus className="h-4 w-4 mr-2" />
              {addingNew ? "Adding..." : "Add Entry"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
