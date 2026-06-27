import React, { useEffect, useState } from "react";
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
    const {user} = useAuth();

    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [content, setContent] = useState([]);
    const [username,setUsername] = useState('');

    useEffect( () => {
        const fetchUsername = async () => {
            try{
                const response = await fetch(
                    `${API_URL}gen/username?user_id=${user.id}`
                )

                const data = await response.json()
                setUsername(data.username)
            } catch (error) {
                console.log(error)
            }
        }

        if (user?.id) {
            fetchUsername()
        }
    }, [user?.id])

    const generateSlug = (value) => {
        setTitle(value);
        setSlug(
            value
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]/g, "")
        );
    };

    const handleSubmit = async () => {
        // backend logic here
        console.log("Upload",user.id)
        try {
            const response = await fetch(`${API_URL}articles/`,{
                method: 'POST',
                headers: {
                    'Content-type':'application/json'
                },
                body : JSON.stringify({
                    user_uuid : user.id,
                    title,
                    slug,
                    status : "draft",
                    body : content
                })
            });

            const data = await response.json()
            console.log(data)
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <MantineProvider>
            <div className="text-white px-8 py-6">

            {/* Top row */}
                <div className="flex items-center justify-between mb-8">

                {/* Title */}
                    <div className="w-3/4">
                        <input
                        type="text"
                        placeholder="Enter title..."
                        value={title}
                        onChange={(e) => generateSlug(e.target.value)}
                        className="
                        w-full
                        bg-transparent
                        border-b
                        text-4xl font-bold
                        outline-none
                        placeholder:text-zinc-500
                        pb-2
                        focus:border-white
                        transition-all
                        "
                        />
                    </div>

                {/* Username */}
                    <div className="text-right">
                        <p className="text-zinc-400 text-sm">Author</p>
                        <p className="font-medium text-lg">@{username}</p>
                    </div>
                </div>

                {/* Editor */}
                <div
                className="
                rounded-2xl
                border 
                p-6
                shadow-lg
                mb-8
                "
                >
                    <BlockNoteView
                    editor={editor}
                    onChange={() => setContent(editor.document)}
                    />
                </div>

                {/* Bottom controls */}
                <div className="flex items-center justify-between">

                {/* Slug preview */}
                    <p className="text-zinc-500 text-sm">
                    SLUG : {slug}
                    </p>

                {/* Submit */}
                    <button
                    onClick={handleSubmit}
                    className="
                    px-6 py-3
                    rounded-xl
                    bg-white
                    text-black
                    font-semibold
                    hover:scale-105
                    transition-transform
                    "
                    >
                    Submit
                    </button>
                </div>

            </div>
        </MantineProvider>
    );
}

export default Home;