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

const BlogModal = ({ blog, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <h2 className="text-3xl font-bold mb-4">{blog.title}</h2>
                <div className="text-gray-600 mb-4">
                    <span>By {blog.author}</span>
                    {blog.date && (
                        <span className="ml-4">{formatDate(blog.date)}</span>
                    )}
                </div>
                <p className="text-gray-800 leading-relaxed">{blog.content}</p>
                <button
                    onClick={onClose}
                    className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

const FetchBlog = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedBlog, setSelectedBlog] = useState(null);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:8000/api/posts"
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

    if (loading) return <div className="text-center text-xl">Loading...</div>;
    if (error) return <div className="text-red-500">Error: {error}</div>;

    return (
        <>
            <div className="max-w-6xl mx-auto px-4 py-8 relative">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-8 border-b-4 border-blue-500 pb-4">
                        Blogs
                    </h1>
                </div>
                {/* Admin Button */}
                <Link
                    href="/admin"
                    className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg hover:bg-green-600 transition-colors z-50"
                >
                    Admin Panel
                </Link>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {blogs.map((blog) => (
                        <div
                            key={blog.id}
                            className="bg-white shadow-lg rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
                        >
                            <div className="p-6 flex flex-col h-full">
                                <h2 className="text-2xl font-bold text-gray-800 mb-3 hover:text-blue-600 transition-colors">
                                    {blog.title || "Untitled"}
                                </h2>
                                <div className="flex items-center text-gray-500 mb-4 space-x-4">
                                    <span className="font-medium">
                                        {blog.author || "Anonymous"}
                                    </span>
                                    {blog.date && (
                                        <span>{formatDate(blog.date)}</span>
                                    )}
                                </div>
                                <p className="text-gray-600 leading-relaxed flex-grow">
                                    {blog.content
                                        ? blog.content.length > 200
                                            ? `${blog.content.slice(0, 200)}...`
                                            : blog.content
                                        : "No content available"}
                                </p>
                                <div className="mt-4 flex justify-end">
                                    <button
                                        onClick={() => setSelectedBlog(blog)}
                                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                                    >
                                        Read More
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {selectedBlog && (
                <BlogModal
                    blog={selectedBlog}
                    onClose={() => setSelectedBlog(null)}
                />
            )}
        </>
    );
};

export default FetchBlog;
