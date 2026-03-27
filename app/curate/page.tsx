import { createClient } from "@/lib/supabase/server";
import { CurateClient } from "./curate-client";
import { syncFeeds } from "@/lib/actions/rss";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export default async function CuratePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return <div>Unauthorized</div>;

  // Get items that haven't been selected yet
  const { data: selections } = await supabase
    .from("user_selections")
    .select("feed_item_id")
    .eq("user_id", user.id);
    
  const selectedIds = selections?.map(s => s.feed_item_id) || [];

  let query = supabase
    .from("feed_items")
    .select("*, sources(name)");
    
  if (selectedIds.length > 0) {
    query = query.not("id", "in", `(${selectedIds.join(',')})`);
  }

  const { data: items, error } = await query
    .order("published_at", { ascending: false })
    .limit(20);

  if (error) {
    console.error("Error fetching items to curate:", error);
  }

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] overflow-hidden bg-zinc-100 dark:bg-black">
      <header className="p-4 flex items-center justify-between border-b bg-white dark:bg-zinc-900 z-10">
        <h1 className="text-xl font-bold">Curate</h1>
        <form action={syncFeeds}>
          <Button variant="outline" size="sm" type="submit" className="gap-2">
            <RefreshCw className="h-4 w-4" /> Sync
          </Button>
        </form>
      </header>
      
      <main className="flex-1 relative flex items-center justify-center p-4">
        {items && items.length > 0 ? (
          <CurateClient initialItems={items} />
        ) : (
          <div className="text-center space-y-4">
            <p className="text-zinc-500">No new items to curate.</p>
            <p className="text-xs text-zinc-400">Try syncing or adding new sources in Settings.</p>
          </div>
        )}
      </main>
    </div>
  );
}
