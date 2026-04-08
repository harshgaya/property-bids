"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  RiHome4Fill,
  RiPhoneLine,
  RiShieldCheckLine,
  RiArrowRightLine,
  RiLockLine,
} from "react-icons/ri";
import { SITE } from "@/constants";

const RESEND_SECONDS = 120;

export default function LoginClient() {
  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [devOtp, setDevOtp] = useState("");
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);
  const params = useSearchParams();
  const router = useRouter();
  const redirect = params.get("redirect") || "/";

  useEffect(() => () => clearInterval(timerRef.current), []);

  function startTimer() {
    setTimer(RESEND_SECONDS);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }

  function fmt(s) {
    return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
  }

  async function sendOtp() {
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError("Enter a valid 10-digit number");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setSessionId(data.sessionId);
      if (data.otp) setDevOtp(data.otp);
      setStep("otp");
      startTimer();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp() {
    if (otp.length !== 6) {
      setError("Enter the 6-digit OTP");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp, sessionId }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      router.push(redirect);
      router.refresh();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center shadow-md">
              <RiHome4Fill className="text-white text-lg" />
            </div>
            <span className="text-2xl font-black text-gray-900">
              Property<span className="text-green-600">Bids</span>
            </span>
          </Link>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1">
            {step === "phone" ? "Log in or Sign up" : "Enter OTP"}
          </h1>
          <p className="text-gray-500 text-sm">
            {step === "phone"
              ? "Enter your mobile number to continue"
              : `OTP sent to +91 ${phone}`}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-7">
          {step === "phone" ? (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                  Mobile Number
                </label>
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-100 transition">
                  <div className="flex items-center gap-2 px-3 py-3 bg-gray-50 border-r border-gray-200">
                    <span className="text-sm font-medium text-gray-700">
                      🇮🇳 +91
                    </span>
                  </div>
                  <input
                    type="tel"
                    maxLength={10}
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value.replace(/\D/g, ""))
                    }
                    onKeyDown={(e) => e.key === "Enter" && sendOtp()}
                    placeholder="98765 43210"
                    className="flex-1 px-3 py-3 text-sm outline-none bg-transparent"
                    autoFocus
                  />
                </div>
              </div>
              {error && (
                <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-xl">
                  {error}
                </p>
              )}
              <button
                onClick={sendOtp}
                disabled={loading || phone.length !== 10}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 disabled:opacity-50 transition-all"
              >
                {loading ? (
                  "Sending..."
                ) : (
                  <>
                    <RiPhoneLine /> Send OTP <RiArrowRightLine />
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                  6-digit OTP
                </label>
                <input
                  type="tel"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  onKeyDown={(e) => e.key === "Enter" && verifyOtp()}
                  placeholder="• • • • • •"
                  className="w-full px-4 py-3.5 text-center text-2xl font-bold tracking-widest border border-gray-200 rounded-xl outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition"
                  autoFocus
                />
                {devOtp && (
                  <p className="text-xs text-blue-500 text-center mt-1">
                    Dev OTP: <strong>{devOtp}</strong>
                  </p>
                )}
              </div>

              {error && (
                <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-xl">
                  {error}
                </p>
              )}

              <button
                onClick={verifyOtp}
                disabled={loading || otp.length !== 6}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 disabled:opacity-50 transition-all"
              >
                {loading ? (
                  "Verifying..."
                ) : (
                  <>
                    <RiShieldCheckLine /> Verify & Continue
                  </>
                )}
              </button>

              {/* Resend row */}
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => {
                    setStep("phone");
                    setOtp("");
                    setError("");
                    clearInterval(timerRef.current);
                    setTimer(0);
                  }}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  ← Change number
                </button>
                {timer > 0 ? (
                  <span className="text-sm text-gray-400">
                    Resend in{" "}
                    <strong className="text-gray-600">{fmt(timer)}</strong>
                  </span>
                ) : (
                  <button
                    onClick={sendOtp}
                    disabled={loading}
                    className="text-sm font-semibold text-green-600 hover:text-green-700 disabled:opacity-50"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-2 mt-5 text-xs text-gray-400">
          <RiLockLine /> No password. OTP expires in 10 minutes.
        </div>
        <p className="text-center text-xs text-gray-400 mt-3">
          By continuing you agree to{" "}
          <Link href="/terms" className="underline hover:text-green-600">
            Terms
          </Link>{" "}
          &amp;{" "}
          <Link href="/privacy" className="underline hover:text-green-600">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
