"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Copy, Check, FileDown, Trash2 } from "lucide-react";
import { markAsExported, upsertSelection } from "@/lib/actions/data";
import { useToast } from "@/hooks/use-toast";

export function InboxClient({ initialSelections }: { initialSelections: any[] }) {
  const [selections, setSelections] = useState(initialSelections);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const generateMarkdown = () => {
    let md = "# Curated Inbox - " + new Date().toLocaleDateString() + "\n\n";
    selections.forEach((sel) => {
      const item = sel.feed_items;
      md += `## [${item.title}](${item.link})\n`;
      md += `Source: ${item.sources?.name || "RSS"}\n`;
      md += `Date: ${new Date(item.published_at).toLocaleDateString()}\n`;
      if (sel.comment) md += `Memo: ${sel.comment}\n`;
      md += `\n---\n\n`;
    });
    return md;
  };

  const handleCopy = async () => {
    const md = generateMarkdown();
    await navigator.clipboard.writeText(md);
    setCopied(true);
    toast({
      title: "Copied to clipboard",
      description: "Markdown has been copied. You can now paste it into Obsidian.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExported = async () => {
    const ids = selections.map((s) => s.id);
    try {
      await markAsExported(ids);
      setSelections([]);
      toast({
        title: "Marked as Exported",
        description: "These items will no longer appear in your active inbox.",
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 sticky top-2 z-20 bg-zinc-50 dark:bg-black/80 backdrop-blur pb-2">
        <Button onClick={handleCopy} disabled={selections.length === 0} className="flex-1 gap-2">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          Copy Markdown
        </Button>
        <Button onClick={handleExported} variant="outline" disabled={selections.length === 0} className="gap-2">
          <FileDown className="h-4 w-4" /> Done
        </Button>
      </div>

      <div className="space-y-4">
        {selections.map((sel) => {
          const item = sel.feed_items;
          return (
            <Card key={sel.id} className="overflow-hidden">
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start gap-2">
                  <span className="text-[10px] text-zinc-500">{item.sources?.name}</span>
                  <span className="text-[10px] text-zinc-500">{new Date(item.published_at).toLocaleDateString()}</span>
                </div>
                <CardTitle className="text-sm font-bold leading-tight">
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {item.title}
                  </a>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-2">
                {sel.comment && (
                  <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 border-l-2 border-yellow-500 text-xs italic">
                    {sel.comment}
                  </div>
                )}
              </CardContent>
              <CardFooter className="p-4 pt-2 flex justify-end">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 text-[10px] text-zinc-400 hover:text-red-500"
                  onClick={async () => {
                    await upsertSelection(item.id, 'discard'); // Hide it
                    setSelections(prev => prev.filter(s => s.id !== sel.id));
                  }}
                >
                  <Trash2 className="h-3 w-3 mr-1" /> Remove
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
