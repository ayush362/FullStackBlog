"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";

const page = () => {
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams(); // Get blog ID from URL

    useEffect(() => {
        if (!id) return;

        const fetchBlog = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/posts/${id}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch blog");
                }
                const data = await response.json();
                setBlog(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchBlog();
    }, [id]);

    if (loading) {
        return <div className="text-center text-xl">Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center">Error: {error}</div>;
    }

    if (!blog) {
        return <div className="text-gray-500 text-center">Blog not found.</div>;
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-6">{blog.title}</h1>
            <div className="text-gray-600 mb-6">
                <span>By {blog.author || "Unknown Author"}</span>
                {blog.date && (
                    <span className="ml-4">
                        {new Date(blog.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </span>
                )}
            </div>
            <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
                {blog.content.split("\n").map((paragraph, index) => (
                    <p key={index}>{paragraph.trim()}</p>
                ))}
            </div>
        </div>
    );
};

export default page;
