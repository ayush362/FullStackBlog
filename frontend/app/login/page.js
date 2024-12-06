"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem("token");

            if (token) {
                try {
                    const response = await axios.get(
                        "http://localhost:8000/api/users/verify-token",
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    if (response.data.valid) {
                        router.push("/createBlog");
                    }
                } catch (err) {
                    // Invalid or expired token, remove it
                    localStorage.removeItem("token");
                }
            }
        };

        verifyToken();
    }, [router]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post(
                "http://localhost:8000/api/users/login",
                { email, password }
            );

            // Save token to localStorage
            const token = response.data.token;
            localStorage.setItem("token", token);

            // Redirect to CreateBlog page
            router.push("/createBlog");
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        }
    };
    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/login");
    };
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-700 to-blue-800">
            <div className="bg-white p-10 rounded-2xl shadow-2xl w-96 max-w-md">
                <h2 className="text-3xl font-serif text-center text-purple-900 mb-8">
                    Login
                </h2>
                <form onSubmit={handleLogin}>
                    <div className="mb-6">
                        <label
                            htmlFor="email"
                            className="block text-lg font-medium text-gray-800 mb-2"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            required
                        />
                    </div>
                    <div className="mb-8">
                        <label
                            htmlFor="password"
                            className="block text-lg font-medium text-gray-800 mb-2"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            required
                        />
                    </div>
                    {error && (
                        <div className="mb-6 text-center text-red-500 text-lg font-medium">
                            {error}
                        </div>
                    )}
                    <button
                        type="submit"
                        className="w-full py-3 text-white bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg font-semibold hover:bg-gradient-to-l hover:from-blue-800 hover:to-blue-600 transition-all duration-300"
                    >
                        Login
                    </button>
                </form>
                <div className="text-center mt-6">
                    <p className="text-lg text-gray-600">
                        Don't have an account?{" "}
                        <a
                            href="/signup"
                            className="text-blue-600 hover:underline font-semibold"
                        >
                            Sign up
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
