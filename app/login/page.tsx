"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

async function resolveDestination(): Promise<string> {
  const [memberResponse, adminResponse] = await Promise.all([
    fetch("/api/member/profile/current", { cache: "no-store", credentials: "include" }),
    fetch("/api/admin/current-admin/profile", { cache: "no-store", credentials: "include" }),
  ]);

  if (adminResponse.ok) return "/admin";
  if (memberResponse.ok) return "/profile";
  return "/";
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpRequested, setOtpRequested] = useState(false);
  const [requestingOtp, setRequestingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [error, setError] = useState("");

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

      window.location.assign(await resolveDestination());
    } catch (verifyError) {
      setError(toErrorMessage(verifyError, "Invalid verification code."));
    } finally {
      setVerifyingOtp(false);
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!otpRequested) {
      await requestOtp();
      return;
    }

    await verifyOtp();
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md items-center px-4">
      <div className="w-full rounded-2xl border bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight">Sign in</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Use your email to sign in to the AMEA platform.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="login-email">Email</Label>
            <Input
              id="login-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={otpRequested}
              placeholder="you@example.com"
            />
          </div>

          {otpRequested ? (
            <div className="space-y-2">
              <Label htmlFor="login-otp">Verification code</Label>
              <Input
                id="login-otp"
                value={otp}
                onChange={(event) => setOtp(event.target.value)}
                inputMode="numeric"
                placeholder="Enter the code sent to your email"
              />
            </div>
          ) : null}

          {error ? <p className="text-sm font-medium text-default">{error}</p> : null}

          <Button type="submit" className="w-full" disabled={requestingOtp || verifyingOtp}>
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
