import React, { useEffect, useState } from "react";
import { API_URL } from "../../config/api";
import { useNavigate } from "react-router-dom";

function Library() {
    const navigate = useNavigate();
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await fetch(
                    `${API_URL}articles?page_no=1&page_size=15`
                );
                
                const {data:data,meta} = await response.json();
                console.log(meta)
                setArticles(data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchArticles();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-xl text-white font-bold mb-4">Library</h1>

            <table className="w-full text-white border border-gray-600">
                <thead>
                    <tr className="border-b border-gray-600">
                        <th className="text-left p-2">Title</th>
                        <th className="text-left p-2">Author</th>
                        <th className="text-left p-2">Created</th>
                    </tr>
                </thead>

                <tbody>
                    {articles.map((article) => (
                        <tr key={article.id} className="border-b border-gray-700">
                            <td
                                className="p-2 cursor-pointer hover:underline"
                                onClick={() => navigate(`/article?slug=${article.slug}`)}
                            >
                                {article.title}
                            </td>

                            <td className="p-2">
                                {article.posted_by}
                            </td>

                            <td className="p-2">
                                {new Date(article.created_at).toLocaleDateString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Library;