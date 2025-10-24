import { useState } from "react";
import { useAuth } from "..//utils/AuthContext";

export default function LoginPage() {
    const { login } = useAuth();
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await login(userName, password);
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#074B83]">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-96">
                <h1 className="text-3xl font-bold text-center text-[#074B83] mb-6">
                    Welcome Back
                </h1>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Username</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#074B83]"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            placeholder="Enter your username"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Password</label>
                        <input
                            type="password"
                            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#074B83]"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#EE222F] hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition-all disabled:opacity-70"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
}
