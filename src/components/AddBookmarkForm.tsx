"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
    onAdd: (url: string, title: string) => Promise<void>;
}

const AddBookmarkForm = ({ onAdd }: Props) => {
    const [url, setUrl] = useState("");
    const [title, setTitle] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url.trim() || !title.trim()) return;
        setSubmitting(true);
        await onAdd(url.trim(), title.trim());
        setUrl("");
        setTitle("");
        setSubmitting(false);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
            <Input
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="flex-1 bg-card border-border font-body"
                required
            />
            <Input
                placeholder="https://example.com"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1 bg-card border-border font-body"
                required
            />
            <Button type="submit" disabled={submitting} className="gap-2 font-body">
                <Plus className="h-4 w-4" />
                Add
            </Button>
        </form>
    );
};

export default AddBookmarkForm;
