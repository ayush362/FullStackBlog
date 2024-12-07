"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import React from "react";
import Link from "next/link";

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

const FetchBlog = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await axios.get(
                    "https://fullstackblog-r4gh.onrender.com/api/posts"
                );
                const sortedBlogs = response.data.sort(
                    (a, b) => new Date(b.date) - new Date(a.date)
                );
                setBlogs(sortedBlogs);
                setLoading(false);
            } catch (error) {
                console.error("Fetch error:", error);
                setError(error.message);
                setLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    const featuredBlog = blogs[0];
    const otherBlogs = blogs.slice(1);

    if (loading) return <div className="text-center text-xl">Loading...</div>;
    if (error) return <div className="text-red-500">Error: {error}</div>;

    return (
        <>
            <div className="max-w-4xl mx-auto px-4 py-8 space-y-12">
                {/* Page Header */}
                <div className="text-center border-b-2 border-gray-200 pb-6">
                    <h1 className="text-5xl font-serif font-bold text-gray-900 tracking-tight">
                        Our Blog
                    </h1>
                    <p className="mt-4 text-gray-600 text-lg">
                        Insights, stories, and perspectives
                    </p>
                </div>

                {/* Featured Blog */}
                {featuredBlog && (
                    <article className="group space-y-4">
                        <div className="mb-4 text-sm text-gray-500 flex items-center space-x-4">
                            <span>{featuredBlog.author || "Anonymous"}</span>
                            <span>•</span>
                            <time>{formatDate(featuredBlog.date)}</time>
                        </div>
                        <h2 className="text-3xl font-serif font-bold mb-4 text-gray-900 hover:text-blue-600 transition-colors">
                            {featuredBlog.title}
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-6">
                            {featuredBlog.content
                                ? `${featuredBlog.content.slice(0, 250)}...`
                                : "No content available"}
                        </p>
                        <Link
                            href={`/blog/${featuredBlog.id}`}
                            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors"
                        >
                            Read Full Article
                        </Link>
                    </article>
                )}

                {/* Recent Blogs */}
                <div className="space-y-8 border-t pt-8 border-gray-200">
                    <h3 className="text-2xl font-serif font-semibold text-gray-900 mb-6">
                        Recent Posts
                    </h3>
                    {otherBlogs.map((blog) => (
                        <article
                            key={blog.id}
                            className="group space-y-4 pb-8 border-b border-gray-200 last:border-b-0"
                        >
                            <div className="mb-3 text-sm text-gray-500 flex items-center space-x-4">
                                <span>{blog.author || "Anonymous"}</span>
                                <span>•</span>
                                <time>{formatDate(blog.date)}</time>
                            </div>
                            <h2 className="text-2xl font-serif font-bold mb-4 text-gray-900 hover:text-blue-600 transition-colors">
                                {blog.title}
                            </h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                {blog.content
                                    ? `${blog.content.slice(0, 200)}...`
                                    : "No content available"}
                            </p>
                            <Link
                                href={`/blog/${blog.id}`}
                                className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                            >
                                Continue Reading →
                            </Link>
                        </article>
                    ))}
                </div>

                {/* Admin Panel Link */}
                <Link
                    href="/admin"
                    className="fixed bottom-6 right-6 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-green-600 transition-colors z-50"
                >
                    Admin Panel
                </Link>
            </div>
        </>
    );
};

export default FetchBlog;
