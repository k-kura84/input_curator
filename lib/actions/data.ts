"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { Database } from "@/lib/database.types";

export async function getCategories() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
  return data;
}

export async function addCategory(name: string, color?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from("categories").insert({
    name,
    color,
    user_id: user.id,
  });

  if (error) throw error;
  revalidatePath("/");
}

export async function getSources() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sources")
    .select("*, categories(name)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching sources:", error);
    return [];
  }
  return data;
}

export async function addSource(name: string, url: string, categoryId?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from("sources").insert({
    name,
    url,
    category_id: categoryId,
    user_id: user.id,
  });

  if (error) throw error;
  revalidatePath("/");
}

export async function deleteSource(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("sources").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/settings");
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/settings");
}
export async function getFeedItems(sourceId?: string) {
  const supabase = await createClient();
  let query = supabase.from("feed_items").select("*, sources(name)");

  if (sourceId) {
    query = query.eq("source_id", sourceId);
  }

  const { data, error } = await query.order("published_at", { ascending: false });

  if (error) {
    console.error("Error fetching feed items:", error);
    return [];
  }
  return data;
}

export async function upsertSelection(feedItemId: string, status: 'keep' | 'discard' | 'pending', comment?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from("user_selections").upsert({
    user_id: user.id,
    feed_item_id: feedItemId,
    status,
    comment,
    updated_at: new Date().toISOString(),
  });

  if (error) throw error;
  revalidatePath("/");
}

export async function markAsExported(selectionIds: string[]) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("user_selections")
    .update({ is_exported: true })
    .in("id", selectionIds);

  if (error) throw error;
  revalidatePath("/");
}
