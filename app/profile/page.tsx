"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { MemberProfile } from "@/lib/types";
import ImageUpload from "@/components/admin/image-upload";

type LoadState = "loading" | "ready" | "unauthorized";

export default function ProfilePage() {
  const [state, setState] = useState<LoadState>("loading");
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadProfile() {
      const response = await fetch("/api/member/profile/current", {
        cache: "no-store",
        credentials: "include",
      });

      if (!response.ok) {
        setState("unauthorized");
        return;
      }

      const payload = (await response.json()) as {
        data?: MemberProfile;
      };

      const nextProfile = payload.data ?? null;
      setProfile(nextProfile);
      setFullName(nextProfile?.full_name ?? "");
      setUsername(nextProfile?.username ?? "");
      setBio(nextProfile?.bio ?? "");
      setImageUrl(nextProfile?.image_url ?? null);
      setState("ready");
    }

    void loadProfile();
  }, []);

  async function handleSave() {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/member/profile/current", {
        method: "PATCH",
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          full_name: fullName,
          username,
          bio,
          image_url: imageUrl,
        }),
      });

      const payload = (await response.json()) as {
        data?: MemberProfile;
        error?: {
          message?: string;
        };
      };

      if (!response.ok || !payload.data) {
        throw new Error(payload.error?.message ?? "Failed to save profile.");
      }

      setProfile(payload.data);
      setFullName(payload.data.full_name);
      setUsername(payload.data.username);
      setBio(payload.data.bio ?? "");
      setImageUrl(payload.data.image_url ?? null);
      setSuccess("Profile updated.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  }

  if (state === "loading") {
    return <div className="mx-auto max-w-3xl px-4 py-12">Loading profile...</div>;
  }

  if (state === "unauthorized" || !profile) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="mt-3 text-muted-foreground">
          You need to sign in with an invited member account first.
        </p>
        <Button className="mt-6" onClick={() => window.location.assign("/login")}>
          Go to Login
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
        <p className="mt-2 text-muted-foreground">
          Update how your AMEA member profile appears on the platform and team section.
        </p>
      </div>

      <div className="rounded-2xl border bg-white p-6 space-y-6">
        <div className="space-y-2">
          <Label>Profile picture</Label>
          <ImageUpload
            value={imageUrl}
            onChange={setImageUrl}
            folder="members"
            uploadEndpoint="/api/member/uploads/image"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="profile-full-name">Name</Label>
          <Input
            id="profile-full-name"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="profile-username">Username</Label>
          <Input
            id="profile-username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Letters, numbers, and underscores only.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="profile-bio">Bio</Label>
          <Textarea
            id="profile-bio"
            value={bio}
            onChange={(event) => setBio(event.target.value)}
            rows={5}
          />
        </div>

        {error ? <p className="text-sm font-medium text-default">{error}</p> : null}
        {success ? <p className="text-sm font-medium text-green-600">{success}</p> : null}

        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Profile"}
        </Button>
      </div>
    </div>
  );
}
