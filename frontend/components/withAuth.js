"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation"; // Correct hook for app directory
import axios from "axios";

const withAuth = (WrappedComponent) => {
    return (props) => {
        const router = useRouter();

        useEffect(() => {
            const verifyAuth = async () => {
                const token = localStorage.getItem("token");
                if (!token) {
                    router.push("/login");
                    return;
                }

                try {
                    await axios.get("http://localhost:8000/api/users/verify-token", {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                } catch {
                    localStorage.removeItem("token");
                    router.push("/login");
                }
            };

            verifyAuth();
        }, [router]);

        return <WrappedComponent {...props} />;
    };
};

export default withAuth;
