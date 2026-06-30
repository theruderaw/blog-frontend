import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

import { API_URL } from "../../config/api";
import { useAuth } from "../Auth/AuthContext";

function EditArticle() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const slug = searchParams.get("slug");

    const [article, setArticle] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [blocksLoaded, setBlocksLoaded] = useState(false);
    
    const editor = useCreateBlockNote();

    // 1. GET: Fetch current content by slug to load into editor
    useEffect(() => {
        if (!slug) return;

        const fetchArticle = async () => {
            try {
                const res = await fetch(`${API_URL}articles/read?slug=${slug}`, {
                    method: "GET",
                    headers: { "accept": "application/json" }
                });
                const data = await res.json();
                const articleData = Array.isArray(data) ? data[0] : data;
                setArticle(articleData);
                console.log(article)

                if (articleData?.body && !blocksLoaded) {
                    editor.replaceBlocks(editor.document, articleData.body);
                    setBlocksLoaded(true);
                }
            } catch (err) {
                console.error("Error loading editor data:", err);
            }
        };

        fetchArticle();
    }, [slug, blocksLoaded, editor]);

    // 2. PATCH: Push current document schema alterations back to backend API
    const handleSync = async (targetStatus) => {
        if (!user?.id || !article) return;
        setIsSaving(true);

        try {
            const payload = {
                user_uuid: user.id,
                title: article.title,
                slug: article.slug,
                status: targetStatus,
                article_id: article.id,
                body: editor.document // Grabs array structural JSON schema directly
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
                setArticle(prev => ({ ...prev, status: targetStatus }));
                
                if (targetStatus === "published") {
                    navigate("/dashboard"); // Take them back to dashboard after publishing
                }
            } else {
                console.error("Server rejected patch request.");
            }
        } catch (error) {
            console.error("Network fault processing PATCH:", error);
        } finally {
            setIsSaving(false);
        }
    };

    if (!article) {
        return <div className="p-6 text-zinc-500 font-mono text-xs">Loading Editor Context...</div>;
    }

    return (
        <div className="w-full max-w-full px-4 box-border">
    <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
            <h1 className="font-bold text-white m-0 text-3xl">{article.title}</h1>
            <span className="uppercase bg-zinc-800 text-zinc-300 border border-zinc-700">
                {article.status || "draft"}
            </span>
        </div>

        <div className="flex items-center gap-4">
            <button 
                onClick={() => handleSync("draft")} 
                disabled={isSaving}
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded transition-colors px-3 py-1.5"
            >
                Save Draft
            </button>
            <button 
                onClick={() => handleSync("published")} 
                disabled={isSaving}
                className="bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors px-3 py-1.5"
            >
                Publish
            </button>
        </div>
    </div>

    <BlockNoteView 
        editor={editor} 
        editable={true} 
        theme="dark" 
    />
</div>
    );
}

export default EditArticle;