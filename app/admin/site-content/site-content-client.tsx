"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, ChevronDown, ChevronRight, Globe, FileText, Users, Archive, Beaker, BookOpen, Layers, Image as ImageIcon, Mail, UserCircle, Share2 } from "lucide-react";
import type { SiteContent, ContentSection, SITE_CONTENT_SECTIONS } from "@/lib/types";
import { toast } from "@/lib/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { upsertSiteContent } from "@/app/admin/actions/site-content";

const PAGE_ICONS: Record<string, React.ReactNode> = {
  'Homepage': <Globe className="h-5 w-5" />,
  'Team': <Users className="h-5 w-5" />,
  'Archives': <Archive className="h-5 w-5" />,
  'Chambers': <Beaker className="h-5 w-5" />,
  'Blog': <BookOpen className="h-5 w-5" />,
  'Programs': <Layers className="h-5 w-5" />,
  'Gallery': <ImageIcon className="h-5 w-5" />,
  'Contact': <Mail className="h-5 w-5" />,
  'Contributors': <UserCircle className="h-5 w-5" />,
  'Social Links': <Share2 className="h-5 w-5" />,
};

interface SiteContentClientProps {
  entries: SiteContent[];
  sections: ContentSection[];
}

export default function SiteContentClient({ entries, sections }: SiteContentClientProps) {
  const router = useRouter();
  const entryMap = Object.fromEntries(entries.map((e) => [e.key, e.value ?? ""]));

  const [values, setValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const section of sections) {
      for (const { key } of section.keys) {
        initial[key] = entryMap[key] ?? "";
      }
    }
    return initial;
  });

  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());

  const pages = Array.from(new Set(sections.map(s => s.page)));

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  async function handleSave(key: string) {
    setSavingKey(key);
    try {
      await upsertSiteContent(key, values[key]);
      toast({ title: "Saved", description: "Content updated successfully." });
      router.refresh();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSavingKey(null);
    }
  }

  async function handleSaveSection(sectionKeys: string[]) {
    setSavingKey("section");
    try {
      for (const key of sectionKeys) {
        await upsertSiteContent(key, values[key]);
      }
      toast({ title: "Saved", description: "All content in this section updated." });
      router.refresh();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSavingKey(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Edit Website Content</h1>
        <p className="text-muted-foreground mt-1">
          Modify all text and information displayed on the public website. Changes are saved immediately.
        </p>
      </div>

      <div className="space-y-4">
        {pages.map(page => {
          const pageSections = sections.filter(s => s.page === page);
          
          return (
            <Card key={page} className="overflow-hidden">
              <CardHeader className="bg-muted/50 py-4">
                <div className="flex items-center gap-3">
                  {PAGE_ICONS[page] || <FileText className="h-5 w-5" />}
                  <CardTitle className="text-lg">{page}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {pageSections.map((section, idx) => {
                  const sectionId = `${page}-${idx}`;
                  const isOpen = openSections.has(sectionId);
                  
                  return (
                    <Collapsible key={sectionId} open={isOpen} onOpenChange={() => toggleSection(sectionId)}>
                      <CollapsibleTrigger className="flex w-full items-center justify-between p-4 hover:bg-muted/30 transition-colors border-t first:border-t-0">
                        <div className="text-left">
                          <h3 className="font-medium">{section.label}</h3>
                          <p className="text-sm text-muted-foreground">{section.description}</p>
                        </div>
                        {isOpen ? (
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        )}
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="px-4 pb-4 space-y-4 bg-muted/10">
                          {section.keys.map(({ key, label, type }) => (
                            <div key={key} className="space-y-2">
                              <label className="text-sm font-medium text-foreground">
                                {label}
                              </label>
                              {type === 'textarea' ? (
                                <Textarea
                                  rows={4}
                                  value={values[key]}
                                  onChange={(e) =>
                                    setValues((prev) => ({ ...prev, [key]: e.target.value }))
                                  }
                                  placeholder={`Enter ${label.toLowerCase()}...`}
                                  className="bg-background"
                                />
                              ) : (
                                <Input
                                  type={type}
                                  value={values[key]}
                                  onChange={(e) =>
                                    setValues((prev) => ({ ...prev, [key]: e.target.value }))
                                  }
                                  placeholder={`Enter ${label.toLowerCase()}...`}
                                  className="bg-background"
                                />
                              )}
                            </div>
                          ))}
                          <div className="flex justify-end pt-2">
                            <Button
                              onClick={() => handleSaveSection(section.keys.map(k => k.key))}
                              disabled={savingKey === "section"}
                            >
                              <Save className="h-4 w-4 mr-2" />
                              {savingKey === "section" ? "Saving..." : "Save Section"}
                            </Button>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  );
                })}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
