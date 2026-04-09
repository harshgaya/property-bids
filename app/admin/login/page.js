"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  RiShieldCheckLine,
  RiEyeLine,
  RiEyeOffLine,
  RiLockLine,
} from "react-icons/ri";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    if (!username || !password) {
      setError("Enter username and password");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      router.push("/admin");
      router.refresh();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-900/40">
            <RiShieldCheckLine className="text-white text-2xl" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Admin Panel</h1>
          <p className="text-gray-500 text-sm mt-1">PropertyBids</p>
        </div>

        {/* Card */}
        <form
          onSubmit={handleLogin}
          className="bg-gray-900 rounded-2xl border border-gray-800 p-7 space-y-4"
        >
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              autoFocus
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-600 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-600 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition text-sm pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                {showPw ? <RiEyeOffLine /> : <RiEyeLine />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-xs bg-red-950 border border-red-900 px-3 py-2 rounded-xl">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 disabled:opacity-50 transition-colors text-sm"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{" "}
                Signing in...
              </>
            ) : (
              <>
                <RiLockLine /> Sign In
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-gray-700 mt-6">
          This area is restricted to administrators only.
        </p>
      </div>
    </div>
  );
}
