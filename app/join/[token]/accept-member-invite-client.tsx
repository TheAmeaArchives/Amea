"use client";

import { useEffect, useMemo, useState } from "react";
import { authClient } from "@/lib/auth/client";
import type { MemberInvite } from "@/lib/types";
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

type SessionPayload = {
  user?: {
    email?: string;
  } | null;
};

export default function AcceptMemberInviteClient({
  invite,
  token,
}: {
  invite: MemberInvite | null;
  token: string;
}) {
  const invitedEmail = useMemo(
    () => invite?.invitee_email?.trim().toLowerCase() ?? invite?.email?.trim().toLowerCase() ?? "",
    [invite],
  );
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [otp, setOtp] = useState("");
  const [otpRequested, setOtpRequested] = useState(false);
  const [requestingOtp, setRequestingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState("");

  async function refreshSession() {
    setCheckingSession(true);
    try {
      const response = await fetch("/api/auth/get-session", {
        method: "GET",
        cache: "no-store",
        credentials: "include",
      });

      if (!response.ok) {
        setSessionEmail(null);
        return;
      }

      const payload = (await response.json()) as SessionPayload | null;
      setSessionEmail(payload?.user?.email?.trim().toLowerCase() ?? null);
    } catch {
      setSessionEmail(null);
    } finally {
      setCheckingSession(false);
    }
  }

  useEffect(() => {
    void refreshSession();
  }, []);

  async function acceptInvite() {
    setError("");
    setAccepting(true);

    try {
      const response = await fetch(`/api/public/member-invites/${encodeURIComponent(token)}/accept`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        const payload = (await response.json()) as {
          error?: {
            message?: string;
          };
        };
        throw new Error(payload.error?.message ?? "Failed to accept invite.");
      }

      window.location.assign("/profile");
    } catch (acceptError) {
      setError(toErrorMessage(acceptError, "Failed to accept invite."));
    } finally {
      setAccepting(false);
    }
  }

  async function requestOtp() {
    if (!invitedEmail) {
      setError("Invite email is missing.");
      return;
    }

    setError("");
    setRequestingOtp(true);

    try {
      await authClient.emailOtp.sendVerificationOtp({
        email: invitedEmail,
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

  async function verifyOtpAndAccept() {
    if (!invitedEmail || !otp.trim()) {
      setError("Verification code is required.");
      return;
    }

    setError("");
    setVerifyingOtp(true);

    try {
      await authClient.signIn.emailOtp({
        email: invitedEmail,
        otp: otp.trim(),
      });

      await refreshSession();
      await acceptInvite();
    } catch (verifyError) {
      setError(toErrorMessage(verifyError, "Invalid verification code."));
    } finally {
      setVerifyingOtp(false);
    }
  }

  async function signOutCurrentUser() {
    setSigningOut(true);
    setError("");

    try {
      await fetch("/api/auth/sign-out", {
        method: "POST",
        credentials: "include",
      });
      setSessionEmail(null);
      setOtp("");
      setOtpRequested(false);
      await refreshSession();
    } catch (signOutError) {
      setError(toErrorMessage(signOutError, "Failed to sign out."));
    } finally {
      setSigningOut(false);
    }
  }

  if (!invite) {
    return (
      <div className="mx-auto flex min-h-screen max-w-xl items-center justify-center px-4">
        <div className="w-full rounded-2xl border bg-white p-8 text-center">
          <h1 className="text-2xl font-bold">Invite not found</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            This invite link is invalid or no longer exists.
          </p>
        </div>
      </div>
    );
  }

  const isInviteUsable = invite.status === "pending";
  const hasMatchingSession = sessionEmail === invitedEmail && invitedEmail.length > 0;
  const hasDifferentSession = Boolean(sessionEmail) && sessionEmail !== invitedEmail;

  return (
    <div className="mx-auto flex min-h-screen max-w-xl items-center justify-center px-4 py-10">
      <div className="w-full rounded-2xl border bg-white p-8 shadow-sm">
        <p className="text-sm font-medium text-default">Member Invitation</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          Join AMEA
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          You were invited as <span className="font-medium text-foreground">{invite.full_name}</span> with the role <span className="font-medium text-foreground">{invite.role}</span>.
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          This invite was sent to <span className="font-medium text-foreground">{invitedEmail}</span>.
        </p>

        {!isInviteUsable ? (
          <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            This invite is {invite.status}. Ask your AMEA contact to send a new one if you still need access.
          </div>
        ) : null}

        {error ? (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {isInviteUsable ? (
          <div className="mt-8 space-y-4">
            {checkingSession ? (
              <p className="text-sm text-muted-foreground">Checking your session...</p>
            ) : hasMatchingSession ? (
              <>
                <p className="text-sm text-muted-foreground">
                  Signed in as the invited user. You can join now.
                </p>
                <Button onClick={acceptInvite} disabled={accepting} className="w-full">
                  {accepting ? "Joining..." : "Accept Invite & Join"}
                </Button>
              </>
            ) : hasDifferentSession ? (
              <>
                <p className="text-sm text-muted-foreground">
                  You are signed in as <span className="font-medium text-foreground">{sessionEmail}</span>. Sign out first, then continue with the invited email.
                </p>
                <Button variant="outline" onClick={signOutCurrentUser} disabled={signingOut} className="w-full">
                  {signingOut ? "Signing out..." : "Sign Out"}
                </Button>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="join-email">Invited email</Label>
                  <Input id="join-email" value={invitedEmail} disabled />
                </div>

                {otpRequested ? (
                  <div className="space-y-2">
                    <Label htmlFor="join-otp">Verification code</Label>
                    <Input
                      id="join-otp"
                      value={otp}
                      onChange={(event) => setOtp(event.target.value)}
                      inputMode="numeric"
                      placeholder="Enter the code sent to your email"
                    />
                  </div>
                ) : null}

                {!otpRequested ? (
                  <Button onClick={requestOtp} disabled={requestingOtp} className="w-full">
                    {requestingOtp ? "Sending code..." : "Send Verification Code"}
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={verifyOtpAndAccept}
                      disabled={verifyingOtp || !otp.trim()}
                      className="w-full"
                    >
                      {verifyingOtp ? "Joining..." : "Verify & Join"}
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={requestOtp}
                      disabled={requestingOtp}
                      className="w-full"
                    >
                      {requestingOtp ? "Resending..." : "Resend Code"}
                    </Button>
                  </>
                )}
              </>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
