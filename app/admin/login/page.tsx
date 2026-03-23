"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

type ErrorPayload = {
  error?: {
    message?: string;
  };
};

async function parseErrorMessage(response: Response, fallback: string): Promise<string> {
  try {
    const payload = (await response.json()) as ErrorPayload;
    return payload.error?.message ?? fallback;
  } catch {
    return fallback;
  }
}

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [otpRequested, setOtpRequested] = useState(false);
  const [requestingOtp, setRequestingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!otpRequested) {
      setRequestingOtp(true);
      try {
        const response = await fetch("/api/auth/otp/request", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ email: email.trim() }),
        });

        if (!response.ok) {
          setError(await parseErrorMessage(response, "Failed to send verification code."));
          return;
        }

        setOtpRequested(true);
        setOtp("");
      } finally {
        setRequestingOtp(false);
        setLoading(false);
      }
      return;
    }

    setVerifyingOtp(true);
    try {
      const response = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          otp: otp.trim(),
        }),
      });

      if (!response.ok) {
        setError(await parseErrorMessage(response, "Invalid verification code."));
        return;
      }

      router.push("/admin");
      router.refresh();
    } finally {
      setVerifyingOtp(false);
      setLoading(false);
    }
  }

  async function resendOtp() {
    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    setError("");
    setRequestingOtp(true);
    try {
      const response = await fetch("/api/auth/otp/request", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (!response.ok) {
        setError(await parseErrorMessage(response, "Failed to resend verification code."));
      }
    } finally {
      setRequestingOtp(false);
    }
  }

  const isBusy = loading || requestingOtp || verifyingOtp;

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center space-y-4">
          <Image src="/logo.svg" alt="Amea" width={60} height={60} />
          <h1 className="text-2xl font-bold tracking-tight aileron">
            Admin Portal
          </h1>
          <p className="text-sm text-black/50">
            Sign in to manage The Amea Archives
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@amea.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={otpRequested}
            />
          </div>

          {otpRequested && (
            <div className="space-y-2">
              <Label htmlFor="otp">One-Time Passcode</Label>
              <Input
                id="otp"
                type="text"
                inputMode="numeric"
                placeholder="Enter the code sent to your email"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
          )}

          {error && (
            <p className="text-sm text-default font-medium">{error}</p>
          )}

          {otpRequested && (
            <button
              type="button"
              onClick={resendOtp}
              className="text-sm text-default hover:underline disabled:opacity-60"
              disabled={requestingOtp}
            >
              {requestingOtp ? "Resending..." : "Resend code"}
            </button>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isBusy || (otpRequested && !otp.trim())}
          >
            {!otpRequested && isBusy
              ? "Sending code..."
              : otpRequested && isBusy
                ? "Signing in..."
                : otpRequested
                  ? "Verify & Sign In"
                  : "Send Verification Code"}
          </Button>
        </form>
      </div>
    </div>
  );
}
