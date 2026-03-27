import { createClient } from "@/lib/supabase/server";
import { syncFeeds } from "@/lib/actions/rss";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Inbox, Settings, RefreshCw, LogOut } from "lucide-react";
import { logout } from "./login/actions";
import Link from "next/link";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return <div>Unauthorized</div>;

  // Get some quick stats
  const { data: selections } = await supabase.from("user_selections").select("feed_item_id").eq("user_id", user.id);
  const selectedIds = selections?.map(s => s.feed_item_id) || [];

  let pendingQuery = supabase.from("feed_items").select("*", { count: "exact", head: true });
  if (selectedIds.length > 0) {
    pendingQuery = pendingQuery.not("id", "in", `(${selectedIds.join(',')})`);
  }

  const [
    { count: sourceCount },
    { count: pendingCount },
    { count: keepCount }
  ] = await Promise.all([
    supabase.from("sources").select("*", { count: "exact", head: true }).eq("user_id", user.id),
    pendingQuery,
    supabase.from("user_selections").select("*", { count: "exact", head: true }).eq("user_id", user.id).eq("status", "keep").eq("is_exported", false)
  ]);

  return (
    <div className="flex-1 p-4 md:p-8 pt-6 max-w-2xl mx-auto space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-zinc-500">Welcome back, {user.email}</p>
        </div>
        <form action={logout}>
          <Button variant="ghost" size="icon" title="Logout">
            <LogOut className="h-5 w-5 text-zinc-400" />
          </Button>
        </form>
      </header>

      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30">
          <CardHeader className="p-4 pb-0">
            <CardDescription className="text-blue-600 dark:text-blue-400 font-medium">To Curate</CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <span className="text-3xl font-bold">{pendingCount || 0}</span>
          </CardContent>
        </Card>
        <Card className="bg-orange-50 dark:bg-orange-900/10 border-orange-100 dark:border-orange-900/30">
          <CardHeader className="p-4 pb-0">
            <CardDescription className="text-orange-600 dark:text-orange-400 font-medium">In Inbox</CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <span className="text-3xl font-bold">{keepCount || 0}</span>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4">
        <Link href="/curate">
          <Button className="w-full h-16 text-lg gap-2 shadow-lg shadow-blue-500/20" size="lg">
            <Sparkles className="h-5 w-5" /> Start Curating
          </Button>
        </Link>
        <div className="flex gap-2">
          <Link href="/inbox" className="flex-1">
            <Button variant="outline" className="w-full h-12 gap-2">
              <Inbox className="h-4 w-4" /> View Inbox
            </Button>
          </Link>
          <Link href="/settings" className="flex-1">
            <Button variant="outline" className="w-full h-12 gap-2">
              <Settings className="h-4 w-4" /> Settings
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <form action={syncFeeds}>
            <Button variant="ghost" className="w-full justify-start gap-2 h-10 px-2" type="submit">
              <RefreshCw className="h-4 w-4" /> Sync All RSS Feeds
            </Button>
          </form>
          <div className="text-[10px] text-zinc-400 text-center">
            Currently monitoring {sourceCount || 0} sources
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
