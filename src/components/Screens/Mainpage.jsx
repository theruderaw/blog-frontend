import { useEffect, useState } from "react";
import { API_URL } from "../../config/api";
import { useNavigate } from "react-router-dom";

function Mainpage() {
    const navigate = useNavigate();
    const [articles, setArticles] = useState([]);

    const getText = (body) => {
        if (!body || !Array.isArray(body)) return "";

        const text = body
            .flatMap((block) => block.content || [])
            .map((item) => item.text || "")
            .join(" ");

        return text.slice(0, 250);
    };

    console.log("Here")
    useEffect(() => {
        console.log("in useEffect")
        const fetchArticles = async () => {
            try {
                const response = await fetch(
                    `${API_URL}articles?&page_no=1&page_size=6`
                );

                const {data:data,meta} = await response.json();
                setArticles(data);
                console.log(meta)
            } catch (error) {
                console.log(error);
            }
        };
        fetchArticles();
    },[]);

    return (
        <div className="grid grid-cols-3 gap-4 text-white border-white">
            {articles.map((article) => (
                <div key={article.id} className="border p-4 rounded">
                    <h2
                        className="p-2 cursor-pointer hover:underline"
                        onClick={() => navigate(`/article?slug=${article.slug}`)}
                    >
                        {article.title}
                    </h2>
                    <p>
                        {article.body
                            ? getText(article.body)
                            : "No preview"}
                    </p>
                </div>
            ))}
        </div>
    );
}

export default Mainpage;