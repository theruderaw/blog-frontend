import { useEffect, useState, useRef } from "react";
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { API_URL } from "../../config/api";

import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { useAuth } from "../Auth/AuthContext";

function Home() {
    const editor = useCreateBlockNote();
    const { user } = useAuth();

    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [content, setContent] = useState([]);
    const [username, setUsername] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [uploadedArticle, setUploadedArticle] = useState(null);
    const [isSlugAvailable, setIsSlugAvailable] = useState(true);
    const [isCheckingSlug, setIsCheckingSlug] = useState(false);

    const debounceTimeoutRef = useRef(null);

    // Fetch author username
    useEffect(() => {
        const fetchUsername = async () => {
            try {
                const response = await fetch(`${API_URL}gen/username?user_id=${user.id}`);
                const { data, meta } = await response.json();
                setUsername(data.username);
            } catch (error) {
                console.log(error);
            }
        };

        if (user?.id) fetchUsername();
    }, [user?.id]);

    // Continuous Slug availability check (Debounced)
    useEffect(() => {
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        if (!slug.trim()) return;

        debounceTimeoutRef.current = setTimeout(async () => {
            try {
                const response = await fetch(`${API_URL}gen/slug?slug=${slug}`);
                const data = await response.json();
                
                if (data.exists || data.present) {
                    setIsSlugAvailable(false);
                } else {
                    setIsSlugAvailable(true);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setIsCheckingSlug(false);
            }
        }, 400);

        return () => clearTimeout(debounceTimeoutRef.current);
    }, [slug]);

    // Slug Generator
    const generateSlug = (value) => {
        setTitle(value);
        
        const computedSlug = value
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-") 
            .replace(/[^\w-]/g, "");

        setSlug(computedSlug);

        if (computedSlug.trim().length > 0) {
            setIsCheckingSlug(true);
        } else {
            setIsCheckingSlug(false);
            setIsSlugAvailable(true);
        }
    };

    // Form Submission & Reset
    const handleSubmit = async () => {
        if (!title.trim() || content.length === 0 || !user?.id || (slug.trim() && !isSlugAvailable)) {
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch(`${API_URL}articles/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_uuid: user.id,
                    title,
                    slug,
                    status: "draft",
                    body: content,
                }),
            });

            const data = await response.json();
            setUploadedArticle(data);

            setTitle("");
            setSlug("");
            setContent([]);
            setIsCheckingSlug(false);
            setIsSlugAvailable(true);
            editor.removeBlocks(editor.document); 

        } catch (error) {
            console.log(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const hasSlug = slug.trim().length > 0;
    const displaySlugUnavailable = hasSlug && !isSlugAvailable;

    return (
        <MantineProvider>
            {/* 1. Added h-full, w-full, flex flex-col, and overflow-hidden to fit the parent layout block exactly */}
            <div className="text-white px-8 py-6 h-full w-full flex flex-col overflow-hidden">
                
                {/* Top row */}
                <div className="flex items-center justify-between mb-6 flex-shrink-0">
                    <div className="w-3/4">
                        <input
                            type="text"
                            placeholder="Enter title..."
                            value={title}
                            onChange={(e) => generateSlug(e.target.value)}
                            className="w-full bg-transparent border-b border-zinc-800 text-4xl font-bold outline-none placeholder:text-zinc-500 pb-2 focus:border-white transition-all"
                        />
                    </div>

                    <div className="text-right">
                        <p className="text-zinc-400 text-sm">Author</p>
                        <p className="font-medium text-lg">@{username}</p>
                    </div>
                </div>

                {/* 2. Scrollable Editor Frame container */}
                {/* flex-1 causes this container to stretch exactly across the available height, and overflow-y-auto forces internal scrolling */}
                <div className="flex-1 min-h-0 border border-zinc-800 rounded-2xl p-6 shadow-lg mb-6 overflow-y-auto transparent-editor">
                    <BlockNoteView
                        editor={editor}
                        theme="dark"
                        onChange={() => setContent(editor.document)}
                    />
                </div>

                {/* Bottom controls */}
                <div className="flex items-center justify-between flex-shrink-0">
                    <p className="text-zinc-500 text-sm">
                        SLUG : {slug}
                        {displaySlugUnavailable && " (slug unavailable)"}
                        {hasSlug && isCheckingSlug && " (checking...)"}
                    </p>

                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || displaySlugUnavailable}
                        className="px-6 py-3 rounded-xl bg-white text-black font-semibold hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
                    >
                        Submit
                    </button>
                </div>

                {uploadedArticle && (
                    <div className="mt-4 text-xs text-zinc-400 flex-shrink-0">
                        <p>Uploaded: {uploadedArticle.title} ({uploadedArticle.slug})</p>
                    </div>
                )}

            </div>
        </MantineProvider>
    );
}

export default Home;