"use client";

import { useSession } from "next-auth/react";

export default function ProfileSettings() {
  const { data: session } = useSession();

  return (
    <div>
      <p>Logged in as <strong>{session?.user?.name}</strong></p>
      <p className="mb-5">Your E-mail is: <strong>{session?.user?.email}</strong></p>
      <p>Welcome to the Lavender platform.</p>
    </div>
  );
}