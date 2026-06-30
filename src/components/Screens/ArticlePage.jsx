import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

import { API_URL } from "../../config/api";
import { useAuth } from "../Auth/AuthContext";

function ArticlePage() {
    const { user } = useAuth();
    const [searchParams] = useSearchParams();
    const slug = searchParams.get("slug");

    const [article, setArticle] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    
    const editor = useCreateBlockNote();

    // 1. GET Request: Fetch article structure by slug
    useEffect(() => {
        if (!slug) return;

        const fetchArticle = async () => {
            try {
                const res = await fetch(`${API_URL}articles/read?slug=${slug}`, {
                    method: "GET",
                    headers: {
                        "accept": "application/json",
                    },
                });
                const data = await res.json();
                
                // Handle array formats if returned from database search
                const articleData = Array.isArray(data) ? data[0] : data;
                setArticle(articleData);

                if (articleData?.body) {
                    // Inject database JSON array block structure directly into BlockNote
                    editor.replaceBlocks(editor.document, articleData.body);
                }
            } catch (err) {
                console.error("Error fetching article details:", err);
            }
        };

        fetchArticle();
    }, [slug, editor]);

    // 2. PATCH Request: Save structural modifications back to server
    const handleSaveChanges = async () => {
        if (!user?.id || !article) return;
        setIsSaving(true);

        try {
            const payload = {
                user_uuid: user.id, // Populated securely via useAuth payload context
                title: article.title,
                slug: article.slug,
                status: article.status || "draft",
                body: editor.document // Grabs structural rich-text JSON schema directly
            };

            const response = await fetch(`${API_URL}articles/`, {
                method: "PATCH",
                headers: {
                    "accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const updatedData = await response.json();
                console.log("Changes successfully saved:", updatedData);
                alert("Article saved successfully!");
            } else {
                console.error("Server rejected patch structural updates.");
            }
        } catch (error) {
            console.error("Network fault processing PATCH sync:", error);
        } finally {
            setIsSaving(false);
        }
    };

    if (!article) {
        return <div className="p-6 text-zinc-400 font-mono text-xs">Loading context...</div>;
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            {/* Header Toolbar */}
            <div className="flex justify-between items-center mb-6 border-b border-zinc-800 pb-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1">{article.title}</h1>
                    <p className="text-xs text-zinc-500 font-mono">Slug: {article.slug}</p>
                </div>

                {/* Save button visible strictly when accessed via protected route properties */}
                
            </div>

            {/* Rich Text Editor Container */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 max-h-[60vh] overflow-y-auto">
                <BlockNoteView 
                    editor={editor} 
                    editable={false} 
                    theme="dark" 
                />
            </div>
        </div>
    );
}

export default ArticlePage;