import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";

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

                // Parse the standard response envelope
                const responseEnvelope = await res.json();

                // Destructure the data and meta fields for clean usage
                const { data, meta } = responseEnvelope;
                console.log(meta);
                
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

    if (!article) {
        return <div className="p-6 text-zinc-500 font-mono text-xs">Loading context...</div>;
    }

    return (
        <MantineProvider defaultColorScheme="dark">
            {/* Matches Home exact outer wrapper layout structure */}
            <div className="text-white px-8 py-6 h-full w-full flex flex-col overflow-hidden">
                
                {/* Top Row: Exactly matches Home header columns layout */}
                <div className="flex items-center justify-between mb-8 flex-shrink-0">
                    <div className="w-3/4">
                        <h1 className="w-full text-4xl font-bold pb-2 border-b border-zinc-800 tracking-tight">
                            {article.title}
                        </h1>
                    </div>

                    <div className="text-right">
                        <p className="text-zinc-400 text-sm">Author</p>
                        <p className="font-medium text-lg">@{user?.username || "anonymous"}</p>
                    </div>
                </div>

                {/* Editor Container: Fixed to match exact transparent-editor classes */}
                <div className="flex-1 min-h-0 border border-zinc-800 rounded-2xl p-6 shadow-lg mb-8 overflow-y-auto transparent-editor">
                    <BlockNoteView 
                        editor={editor} 
                        editable={false} 
                        theme="dark" 
                    />
                </div>

                {/* Bottom Footer Status Area */}
                <div className="flex items-center justify-between flex-shrink-0">
                    <p className="text-zinc-500 text-sm font-mono">
                        SLUG : {article.slug}
                    </p>
                    
                    <div className="flex items-center gap-4">
                        {/* Space placeholder to maintain structural scaling alignments */}
                    </div>
                </div>

            </div>
        </MantineProvider>
    );
}

export default ArticlePage;