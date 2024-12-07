import React from "react";
import Link from "next/link";

const AdminPage = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <div className="text-center space-y-8">
                {/* <img
                    src="/admin.jpg" // Replace with your illustration file
                    alt="Welcome Admin"
                    className="mx-auto w-64"
                /> */}
                <h1 className="text-4xl md:text-5xl font-extrabold">
                    Welcome, Admin!
                </h1>
                <p className="text-lg md:text-xl text-white/80">
                    Manage your platform with ease. Get started by logging in or signing up.
                </p>
                <div className="flex justify-center space-x-6">
                    <Link href="/login">
                        <p className="bg-white text-blue-600 px-6 py-3 rounded-full shadow-lg font-bold hover:bg-gray-100 transition-all">
                            Login
                        </p>
                    </Link>
                    {/* <Link href="/signup">
                        <p className="bg-blue-700 px-6 py-3 rounded-full shadow-lg font-bold hover:bg-blue-800 transition-all">
                            Signup
                        </p>
                    </Link> */}
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
