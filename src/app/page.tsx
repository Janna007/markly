import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Bookmark as BookmarkIcon, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import BookmarkList from "@/components/BookmarkList";
import { Toaster } from "@/components/ui/toaster";

export default async function IndexPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/auth");
  }

  const { data: bookmarks } = await supabase
    .from("bookmarks")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <BookmarkIcon className="h-4 w-4 text-primary" />
            </div>
            <h1 className="text-xl text-foreground font-display">Markly</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:block font-body">
              {user.email}
            </span>
            <form action="/auth/signout" method="post">
              <Button variant="ghost" size="icon" type="submit">
                <LogOut className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-2xl px-4 py-8">
        <BookmarkList initialBookmarks={bookmarks || []} />
      </main>
      <Toaster />
    </div>
  );
}
