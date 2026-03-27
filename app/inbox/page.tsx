import { createClient } from "@/lib/supabase/server";
import { InboxClient } from "./inbox-client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default async function InboxPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return <div>Unauthorized</div>;

  // Get items marked as 'keep' that are NOT YET exported
  const { data: selections, error } = await supabase
    .from("user_selections")
    .select(`
      id,
      comment,
      is_exported,
      feed_items (
        id,
        title,
        link,
        published_at,
        sources (name)
      )
    `)
    .eq("user_id", user.id)
    .eq("status", "keep")
    .eq("is_exported", false)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching inbox items:", error);
  }

  return (
    <div className="flex-1 p-4 md:p-8 pt-6 max-w-2xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Inbox</h2>
      </div>
      
      {selections && selections.length > 0 ? (
        <InboxClient initialSelections={selections} />
      ) : (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-zinc-400">Your inbox is empty</CardTitle>
            <CardDescription>
              Start curating in the <strong>Curate</strong> tab to find interesting items!
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}
