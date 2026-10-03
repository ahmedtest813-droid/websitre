"use client";

import { useState } from "react";
import { Button } from "./Button";
import { LinkIcon } from "./Icons";

export function CopyLinkButton({ label = "Copy share link" }: { label?: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");

  async function copy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
    setTimeout(() => setStatus("idle"), 2500);
  }

  return (
    <Button variant="secondary" onClick={copy}>
      <LinkIcon className="size-4" />
      <span aria-live="polite">
        {status === "copied" ? "Link copied" : status === "failed" ? "Copy the address bar link" : label}
      </span>
    </Button>
  );
}
