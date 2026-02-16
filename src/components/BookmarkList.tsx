"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Bookmark as BookmarkIcon } from "lucide-react";
import AddBookmarkForm from "./AddBookmarkForm";
import BookmarkCard, { Bookmark } from "./BookmarkCard";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
    initialBookmarks: Bookmark[];
}

export default function BookmarkList({ initialBookmarks }: Props) {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const supabase = createClient();

    const fetchBookmarks = useCallback(async () => {
        const { data, error } = await supabase
            .from("bookmarks")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            toast({ title: "Error loading bookmarks", description: error.message, variant: "destructive" });
        } else {
            setBookmarks(data as Bookmark[]);
        }
    }, [supabase, toast]);

    useEffect(() => {
        const channel = supabase
            .channel("bookmarks-realtime")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "bookmarks" },
                (payload) => {
                    if (payload.eventType === "INSERT") {
                        const newBookmark = payload.new as Bookmark;
                        setBookmarks((prev) => {
                            if (prev.some((b) => b.id === newBookmark.id)) return prev;
                            return [newBookmark, ...prev];
                        });
                    } else if (payload.eventType === "DELETE") {
                        const oldId = (payload.old as any).id;
                        setBookmarks((prev) => prev.filter((b) => b.id !== oldId));
                    } else if (payload.eventType === "UPDATE") {
                        const updated = payload.new as Bookmark;
                        setBookmarks((prev) =>
                            prev.map((b) => (b.id === updated.id ? updated : b))
                        );
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase]);

    const addBookmark = async (url: string, title: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase
            .from("bookmarks")
            .insert({ url, title, user_id: user.id });

        if (error) {
            toast({ title: "Failed to add bookmark", description: error.message, variant: "destructive" });
        } else {
            // Fallback refresh in case realtime is slow or disabled
            fetchBookmarks();
        }
    };

    const deleteBookmark = async (id: string) => {
        const { error } = await supabase.from("bookmarks").delete().eq("id", id);
        if (error) {
            toast({ title: "Failed to delete bookmark", description: error.message, variant: "destructive" });
        } else {
            // Fallback refresh
            fetchBookmarks();
        }
    };

    return (
        <div className="space-y-8">
            <AddBookmarkForm onAdd={addBookmark} />

            {loading ? (
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-16 rounded-xl" />
                    ))}
                </div>
            ) : bookmarks.length === 0 ? (
                <div className="py-20 text-center">
                    <BookmarkIcon className="mx-auto h-10 w-10 text-muted-foreground/40" />
                    <p className="mt-4 text-muted-foreground font-body">No bookmarks yet. Add your first one above!</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {bookmarks.map((b) => (
                        <BookmarkCard key={b.id} bookmark={b} onDelete={deleteBookmark} />
                    ))}
                </div>
            )}
        </div>
    );
}
