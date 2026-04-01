"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth/client";

function toErrorMessage(error: unknown, fallback: string): string {
  if (error && typeof error === "object") {
    const maybeError = error as {
      error?: {
        message?: string;
      };
      message?: string;
    };

    return maybeError.error?.message ?? maybeError.message ?? fallback;
  }

  return fallback;
}

async function ensureAdminAccess(): Promise<string | null> {
  const response = await fetch("/api/admin/current-admin/profile", {
    method: "GET",
    cache: "no-store",
    credentials: "include",
  });

  if (response.ok) {
    return null;
  }

  try {
    const payload = (await response.json()) as {
      error?: {
        message?: string;
      };
    };
    return payload.error?.message ?? "This account does not have admin access.";
  } catch {
    return "This account does not have admin access.";
  }
}

export default function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [otpRequested, setOtpRequested] = useState(false);
  const [requestingOtp, setRequestingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  async function requestOtp() {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      setError("Email is required.");
      return;
    }

    setError("");
    setRequestingOtp(true);

    try {
      await authClient.emailOtp.sendVerificationOtp({
        email: normalizedEmail,
        type: "sign-in",
      });

      setOtpRequested(true);
      setOtp("");
    } catch (requestError) {
      setError(toErrorMessage(requestError, "Failed to send verification code."));
    } finally {
      setRequestingOtp(false);
    }
  }

  async function verifyOtp() {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !otp.trim()) {
      setError("Email and verification code are required.");
      return;
    }

    setError("");
    setVerifyingOtp(true);

    try {
      await authClient.signIn.emailOtp({
        email: normalizedEmail,
        otp: otp.trim(),
      });

      const adminAccessError = await ensureAdminAccess();
      if (adminAccessError) {
        setError(adminAccessError);
        return;
      }

      window.location.assign("/admin");
    } catch (verifyError) {
      setError(toErrorMessage(verifyError, "Invalid verification code."));
    } finally {
      setVerifyingOtp(false);
    }
  }

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();

    if (!otpRequested) {
      await requestOtp();
      return;
    }

    await verifyOtp();
  }

  const isBusy = requestingOtp || verifyingOtp;

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center space-y-4">
          <Image src="/logo.svg" alt="Amea" width={60} height={60} />
          <h1 className="text-2xl font-bold tracking-tight aileron">Admin Portal</h1>
          <p className="text-sm text-black/50">Sign in to manage The Amea Archives</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@amea.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              disabled={otpRequested}
            />
          </div>

          {otpRequested ? (
            <div className="space-y-2">
              <Label htmlFor="otp">One-Time Passcode</Label>
              <Input
                id="otp"
                type="text"
                inputMode="numeric"
                placeholder="Enter the code sent to your email"
                value={otp}
                onChange={(event) => setOtp(event.target.value)}
                required
              />
            </div>
          ) : null}

          {error ? <p className="text-sm text-default font-medium">{error}</p> : null}

          {otpRequested ? (
            <button
              type="button"
              onClick={requestOtp}
              className="text-sm text-default hover:underline disabled:opacity-60"
              disabled={requestingOtp}
            >
              {requestingOtp ? "Resending..." : "Resend code"}
            </button>
          ) : null}

          <Button type="submit" className="w-full" disabled={isBusy || (otpRequested && !otp.trim())}>
            {!otpRequested
              ? requestingOtp
                ? "Sending code..."
                : "Send Verification Code"
              : verifyingOtp
                ? "Signing in..."
                : "Verify & Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}
