import { getCategories, getSources, addCategory, addSource, deleteCategory, deleteSource } from "@/lib/actions/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Plus, Rss, Folder } from "lucide-react";
import { logout } from "../login/actions";

export default async function SettingsPage() {
  const [categories, sources] = await Promise.all([getCategories(), getSources()]);

  async function handleAddCategory(formData: FormData) {
    "use server";
    const name = formData.get("name") as string;
    if (name) await addCategory(name);
  }

  async function handleAddSource(formData: FormData) {
    "use server";
    const name = formData.get("name") as string;
    const url = formData.get("url") as string;
    const categoryId = formData.get("categoryId") as string;
    if (name && url) await addSource(name, url, categoryId || undefined);
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <form action={logout}>
          <Button variant="ghost" size="sm">Log out</Button>
        </form>
      </div>

      <Tabs defaultValue="sources" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sources" className="flex items-center gap-2">
            <Rss className="h-4 w-4" /> Sources
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <Folder className="h-4 w-4" /> Categories
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>RSS Sources</CardTitle>
              <CardDescription>Add the RSS/Atom feeds you want to monitor.</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={handleAddSource} className="grid gap-4 mb-6">
                <div className="grid gap-2">
                  <Input name="name" placeholder="Source Name (e.g. Wired Tech)" required />
                  <Input name="url" placeholder="RSS URL" type="url" required />
                  <select 
                    name="categoryId" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select Category (Optional)</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <Button type="submit" className="w-full">
                  <Plus className="mr-2 h-4 w-4" /> Add Source
                </Button>
              </form>

              <div className="space-y-4">
                {sources.map((source) => (
                  <div key={source.id} className="flex items-center justify-between p-3 border rounded-lg bg-zinc-50 dark:bg-zinc-900/50">
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{source.name}</span>
                      <span className="text-[10px] text-zinc-500 truncate max-w-[200px]">{source.url}</span>
                      {source.categories && (
                        <span className="text-[10px] mt-1 px-1.5 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-full w-fit">
                          {source.categories.name}
                        </span>
                      )}
                    </div>
                    <form action={async () => { "use server"; await deleteSource(source.id); }}>
                      <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
              <CardDescription>Group your sources by topic.</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={handleAddCategory} className="flex gap-2 mb-6">
                <Input name="name" placeholder="Category Name" required />
                <Button type="submit">
                  <Plus className="mr-2 h-4 w-4" /> Add
                </Button>
              </form>

              <div className="grid grid-cols-2 gap-3">
                {categories.map((cat) => (
                  <div key={cat.id} className="flex items-center justify-between p-3 border rounded-lg bg-zinc-50 dark:bg-zinc-900/50">
                    <span className="text-sm font-medium">{cat.name}</span>
                    <form action={async () => { "use server"; await deleteCategory(cat.id); }}>
                      <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
