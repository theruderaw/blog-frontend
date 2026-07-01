import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";

import { API_URL } from "../../config/api";
import { useAuth } from "../Auth/AuthContext";

function EditArticle() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const slug = searchParams.get("slug");

    const [article, setArticle] = useState(null);
    const [title, setTitle] = useState("");
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
                const { data, meta } = await res.json();
                console.log(meta);
                setArticle(data);
                setTitle(data?.title || "");

                if (data?.body && !blocksLoaded) {
                    editor.replaceBlocks(editor.document, data.body);
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
                title: title,
                slug: article.slug,
                status: targetStatus,
                article_id: article.id,
                body: editor.document 
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
                const responseEnvelope = await response.json();
                const { data: updatedArticle } = responseEnvelope;

                setArticle(prev => ({ 
                    ...prev, 
                    ...updatedArticle, 
                    status: targetStatus 
                }));
                
                if (targetStatus === "published") {
                    navigate("/dashboard"); 
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
        <MantineProvider defaultColorScheme="dark">
            {/* Matches Home exact outer wrapper system: full height, hidden scroll, precise padding */}
            <div className="text-white px-8 py-6 h-full w-full flex flex-col overflow-hidden">
                
                {/* Top Row: Layout matches Home view precisely */}
                <div className="flex items-center justify-between mb-8 flex-shrink-0">
                    <div className="w-3/4">
                        <input
                            type="text"
                            placeholder="Enter title..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-transparent border-b border-zinc-800 text-4xl font-bold outline-none placeholder:text-zinc-500 pb-2 focus:border-white transition-all"
                        />
                    </div>

                    <div className="text-right">
                        <p className="text-zinc-400 text-sm">Status</p>
                        <p className="font-medium text-lg uppercase tracking-wider text-zinc-300">
                            {article.status || "draft"}
                        </p>
                    </div>
                </div>

                {/* Editor Container: Identical height distribution and rounded styles */}
                <div className="flex-1 min-h-0 border border-zinc-800 rounded-2xl p-6 shadow-lg mb-8 overflow-y-auto transparent-editor">
                    <BlockNoteView
                        editor={editor}
                        theme="dark"
                    />
                </div>

                {/* Bottom Row: Controls match Home's footer placement exactly */}
                <div className="flex items-center justify-between flex-shrink-0">
                    <p className="text-zinc-500 text-sm font-mono">
                        SLUG : {article.slug}
                    </p>

                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => handleSync("draft")} 
                            disabled={isSaving}
                            className="px-6 py-3 rounded-xl border border-zinc-700 bg-zinc-900 text-zinc-200 font-semibold hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
                        >
                            Save Draft
                        </button>
                        
                        <button 
                            onClick={() => handleSync("published")} 
                            disabled={isSaving}
                            className="px-6 py-3 rounded-xl bg-white text-black font-semibold hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
                        >
                            Publish
                        </button>
                    </div>
                </div>
                
            </div>
        </MantineProvider>
    );
}

export default EditArticle;