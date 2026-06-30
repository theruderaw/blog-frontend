import React, { useEffect, useState } from "react";
import { API_URL } from "../../config/api";
import { useAuth } from "../Auth/AuthContext";
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const { user } = useAuth();
    const [articles, setArticles] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user?.id) return;

        const fetchArticle = async () => {
            try {
                const res = await fetch(
                    `${API_URL}articles/user?page_no=1&page_size=10&author_id=${user.id}`
                );
                const data = await res.json();
                setArticles(Array.isArray(data) ? data : []);
            } catch (error) {
                console.log(error);
            }
        };
        fetchArticle();
    }, [user?.id]);

    const handleDelete = async (articleId) => {
        try {
            const response = await fetch(
                `${API_URL}articles/?article_id=${articleId}`, {
                    method: "DELETE"
                }
            );

            if (response.ok) {
                const data = await response.json();
                console.log("Deleted successfully:", data);
                setArticles(prev => prev.filter(art => art.id !== articleId));
            } else {
                console.error("Failed to delete article");
            }
        } catch (err) {
            console.error("Network error during delete:", err);
        }
    };

    const handleEdit = async (slug) => {
        navigate(`/edit?slug=${slug}`)
    }
    
    const formatDate = (isoString) => {
        if (!isoString) return "N/A";
        return isoString.split("T")[0]; 
    };

    return (
        <div className="p-6 w-full max-w-full box-border">
            <h2 className="text-2xl font-bold mb-6 text-white">Articles Dashboard</h2>
            
            {/* 1. Added explicit width and scroll containers to absolute trap viewport bleeding */}
            <div className="w-full max-w-full overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-950">
                <table className="w-full min-w-[600px] text-left border-collapse text-sm text-zinc-300 table-fixed">
                    <thead>
                        <tr className="border-b border-zinc-800 bg-zinc-900 text-zinc-400 font-medium">
                            <th className="px-6 py-4 w-2/5">Title</th>
                            <th className="px-6 py-4 w-1/5">Posted By</th>
                            <th className="px-6 py-4 w-1/5">Created At</th>
                            <th className="px-6 py-4 w-1/6 text-right">Views</th>
                            <th className="px-6 py-4 w-1/6 text-center">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-zinc-800/60">
                        {articles.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-8 text-center text-zinc-500">
                                    No articles found.
                                </td>
                            </tr>
                        ) : (
                            /* 2. Slicing directly here forces the loop to hard limit at 8 results maximum */
                            articles.slice(0, 6).map((article) => (
                                <tr key={article.id} className="hover:bg-zinc-900/40 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white truncate max-w-0">
                                        {article.title || "Untitled"}
                                    </td>
                                    <td className="px-6 py-4 text-zinc-400 truncate max-w-0">
                                        @{article.posted_by || "anonymous"}
                                    </td>
                                    <td className="px-6 py-4 font-mono text-xs whitespace-nowrap">
                                        {formatDate(article.created_at)}
                                    </td>
                                    <td className="px-6 py-4 text-right font-semibold text-zinc-200 whitespace-nowrap">
                                        {article.views !== undefined ? article.views.toLocaleString() : 0}
                                    </td>
                                    <td className="px-6 py-4 text-center whitespace-nowrap">
                                        <button 
                                            onClick={() => handleDelete(article.id)}
                                            className="text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-3 py-1 rounded transition-colors text-xs font-medium"
                                        >
                                            Delete
                                        </button>
                                        <button 
                                            onClick={() => handleEdit(article.slug)}
                                            className="text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1 rounded transition-colors text-xs font-medium mr-2"
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Dashboard;