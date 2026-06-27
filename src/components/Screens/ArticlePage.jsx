import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { API_URL } from "../../config/api";

function ArticlePage() {
    const [searchParams] = useSearchParams();
    const slug = searchParams.get("slug");

    const [article, setArticle] = useState(null);

    const editor = useCreateBlockNote();

    useEffect(() => {
        if (!slug) return;

        const fetchArticle = async () => {
            try {
                console.log("Fetching");

                const res = await fetch(
                    `${API_URL}articles/read?slug=${slug}`
                );

                const data = await res.json();

                // IMPORTANT: handle array vs object
                const articleData = Array.isArray(data) ? data[0] : data;

                setArticle(articleData);

                if (articleData?.body) {
                    setTimeout(() => {
                        editor.replaceBlocks(
                            editor.document,
                            articleData.body
                        );
                    }, 0);
                }
            } catch (err) {
                console.log(err);
            }
        };

        fetchArticle();
    }, [slug]);

    if (!article) return <div>Loading...</div>;

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-2">
                {article.title}
            </h1>

            <BlockNoteView editor={editor} editable={false} />
        </div>
    );
}

export default ArticlePage;