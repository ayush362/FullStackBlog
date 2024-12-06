"use client";

import React, { useState } from "react";
import axios from "axios";
import withAuth from "@/components/withAuth";
const token = localStorage.getItem("token");

import { useRouter } from "next/navigation";

const CreateBlog = () => {
    const [activeTab, setActiveTab] = useState("manual");
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [content, setContent] = useState("");
    const [contentPrompt, setContentPrompt] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/login");
    };
    const handleCreateBlog = async (e) => {
        e.preventDefault();
        setMessage("");
        try {
            const response = await axios.post(
                "http://localhost:8000/api/posts",
                {
                    title,
                    author,
                    content,
                }
            );
            setMessage(response.data.message);
            setTitle("");
            setAuthor("");
            setContent("");
        } catch (error) {
            setMessage(
                error.response?.data?.message || "Failed to create blog"
            );
        }
    };

    const handleCreateBlogWithLLM = async (e) => {
        e.preventDefault();
        setMessage("");
        setIsLoading(true);
        try {
            const response = await axios.post(
                "http://localhost:8000/api/posts/create-with-llm",
                {
                    title,
                    author,
                    contentPrompt,
                }
            );
            setMessage(response.data.message);
            setTitle("");
            setAuthor("");
            setContentPrompt("");
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                    "Failed to create blog with LLM"
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-600 to-purple-800 flex items-center justify-center">
            <div className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-center text-purple-700 mb-6">
                    Create a Blog
                </h1>
                <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-800 transition-all duration-300"
                >
                    Logout
                </button>
                {/* Tab Navigation */}
                <div className="flex justify-center mb-6 border-b-2 border-gray-300">
                    <button
                        className={`px-6 py-2 text-lg font-medium ${
                            activeTab === "manual"
                                ? "border-b-4 border-purple-600 text-purple-600"
                                : "text-gray-600 hover:text-purple-600"
                        }`}
                        onClick={() => setActiveTab("manual")}
                    >
                        Manual Blog
                    </button>
                    <button
                        className={`px-6 py-2 text-lg font-medium ${
                            activeTab === "ai"
                                ? "border-b-4 border-blue-600 text-blue-600"
                                : "text-gray-600 hover:text-blue-600"
                        }`}
                        onClick={() => setActiveTab("ai")}
                    >
                        AI Blog
                    </button>
                </div>

                {/* Tab Content */}
                {activeTab === "manual" && (
                    <form onSubmit={handleCreateBlog}>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                            Manual Blog Creation
                        </h2>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">
                                Title
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">
                                Author
                            </label>
                            <input
                                type="text"
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">
                                Content
                            </label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                rows="5"
                                required
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            className="w-full py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition duration-300"
                        >
                            Create Blog
                        </button>
                    </form>
                )}

                {activeTab === "ai" && (
                    <form onSubmit={handleCreateBlogWithLLM}>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                            Generate Blog Content with AI
                        </h2>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">
                                Title
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">
                                Author
                            </label>
                            <input
                                type="text"
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">
                                Content Prompt
                            </label>
                            <textarea
                                value={contentPrompt}
                                onChange={(e) =>
                                    setContentPrompt(e.target.value)
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                rows="5"
                                required
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
                            disabled={isLoading}
                        >
                            {isLoading ? "Generating..." : "Generate Blog"}
                        </button>
                    </form>
                )}

                {/* Message Display */}
                {message && (
                    <div className="mt-6 text-center text-lg font-medium text-green-600">
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
};

export default withAuth(CreateBlog);
