"use server";

import Parser from "rss-parser";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const parser = new Parser({
  customFields: {
    item: [["content:encoded", "contentEncoded"]],
  },
});

export async function syncFeeds() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // 1. Get all sources for this user
  const { data: sources, error: sourcesError } = await supabase
    .from("sources")
    .select("*")
    .eq("user_id", user.id);

  if (sourcesError) throw sourcesError;
  if (!sources || sources.length === 0) return { count: 0 };

  let totalNewItems = 0;

  // 2. Fetch and parse each source
  for (const source of sources) {
    try {
      const feed = await parser.parseURL(source.url);
      
      // Map to correct DB schema: source_id, title, link, content, published_at
      const parsedItems = feed.items.map((item) => ({
        source_id: source.id,
        title: item.title || "No Title",
        link: item.link || "",
        content: item.contentSnippet || item.content || "",
        published_at: item.isoDate || item.pubDate || new Date().toISOString(),
      })).filter(item => item.link); // Must have a link

      if (parsedItems.length === 0) continue;

      // Extract links to check for duplicates
      const itemLinks = parsedItems.map(i => i.link);

      // Fetch existing links from DB for this source
      const { data: existingItems, error: existingError } = await supabase
        .from("feed_items")
        .select("link")
        .eq("source_id", source.id)
        .in("link", itemLinks);

      if (existingError) {
        console.error(`Error checking existing items for ${source.name}:`, existingError);
        continue;
      }

      const existingLinks = new Set(existingItems?.map(e => e.link) || []);

      // Filter out items that are already in the DB
      const itemsToInsert = parsedItems.filter(item => !existingLinks.has(item.link));

      if (itemsToInsert.length > 0) {
        // Insert new items
        const { error: insertError } = await supabase
          .from("feed_items")
          .insert(itemsToInsert);

        if (insertError) {
          console.error(`Error inserting items for ${source.name}:`, insertError);
        } else {
          totalNewItems += itemsToInsert.length;
        }
      }
    } catch (e) {
      console.error(`Failed to fetch feed for ${source.name}:`, e);
    }
  }

  revalidatePath("/");
  revalidatePath("/curate");
}
