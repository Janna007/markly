"use client";

import { ExternalLink, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Bookmark {
    id: string;
    url: string;
    title: string;
    created_at: string;
    user_id: string;
}

interface Props {
    bookmark: Bookmark;
    onDelete: (id: string) => Promise<void>;
}

const BookmarkCard = ({ bookmark, onDelete }: Props) => {
    const hostname = (() => {
        try {
            return new URL(bookmark.url).hostname;
        } catch {
            return bookmark.url;
        }
    })();

    return (
        <div className="group flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-all hover:shadow-md hover:border-primary/20">
            <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center gap-3 min-w-0"
            >
                <img
                    src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=32`}
                    alt=""
                    className="h-6 w-6 rounded-sm shrink-0"
                />
                <div className="min-w-0">
                    <p className="font-medium text-foreground truncate font-body">{bookmark.title}</p>
                    <p className="text-xs text-muted-foreground truncate font-body">{hostname}</p>
                </div>
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </a>
            <Button
                variant="ghost"
                size="icon"
                className="ml-2 shrink-0 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => onDelete(bookmark.id)}
            >
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    );
};

export default BookmarkCard;
