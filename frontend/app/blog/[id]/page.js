"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

const page = () => {
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams(); // Get blog ID from URL

    useEffect(() => {
        if (!id) return;

        const fetchBlog = async () => {
            try {
                const response = await fetch(
                    `https://fullstackblog-r4gh.onrender.com/api/posts/${id}`
                );
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
        <div className="max-w-4xl mx-auto px-6 py-10 bg-white shadow-md rounded-lg">
            <h1 className="text-5xl font-extrabold mb-8 text-gray-800 leading-tight">
                {blog.title}
            </h1>
            <div className="flex flex-wrap items-center text-sm text-gray-600 mb-8">
                <span className="mr-4">
                    <span className="font-semibold">By:</span>{" "}
                    {blog.author || "Unknown Author"}
                </span>
                {blog.date && (
                    <span className="mr-4 flex items-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-5 h-5 mr-1 text-purple-600"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M8.25 4.5v1.125M15.75 4.5v1.125M3 9.75h18M4.5 9.75v9.375a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V9.75M3 9.75a2.25 2.25 0 012.25-2.25h13.5a2.25 2.25 0 012.25 2.25M3 9.75h18"
                            />
                        </svg>
                        {new Date(blog.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </span>
                )}
                <Link
                    href="/"
                    className="ml-auto px-5 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-800 transition-all duration-300"
                >
                    All Blogs
                </Link>
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
