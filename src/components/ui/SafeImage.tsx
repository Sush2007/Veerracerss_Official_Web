"use client";

import React, { useState, useEffect } from "react";

interface SafeImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src"> {
  src?: string;
  fallbackSrc?: string;
  category?: "car" | "avatar" | "logo" | "creative" | "default";
}

const DEFAULT_FALLBACKS: Record<string, string> = {
  car: "/cars/aether-spotlight.jpg",
  avatar: "/members/default-avatar.svg",
  logo: "/sponsors/crosshead.svg",
  creative: "/creatives/season-opener-2025.jpg",
  default: "/members/default-avatar.svg",
};

/**
 * Universal Resilient Image Component
 * Prevents broken image sync issues by catching 404s/network errors,
 * trying sister extensions (.png <-> .jpg <-> .webp), and cleanly cascading
 * to category defaults without rendering broken image icons.
 */
export function SafeImage({
  src,
  fallbackSrc,
  category = "default",
  alt = "Asset",
  className = "",
  onError,
  ...props
}: SafeImageProps) {
  const [currentSrc, setCurrentSrc] = useState<string>(src || "");
  const [attemptCount, setAttemptCount] = useState<number>(0);
  const [hasFailedCompletely, setHasFailedCompletely] = useState<boolean>(false);

  useEffect(() => {
    setCurrentSrc(src || "");
    setAttemptCount(0);
    setHasFailedCompletely(!src);
  }, [src]);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (onError) onError(e);

    const safeDefault = fallbackSrc || DEFAULT_FALLBACKS[category] || DEFAULT_FALLBACKS.default;

    // Step 1: Try swapping extension if local path
    if (attemptCount === 0 && currentSrc.startsWith("/")) {
      const lower = currentSrc.toLowerCase();
      let nextCandidate: string | null = null;
      if (lower.endsWith(".png")) nextCandidate = currentSrc.replace(/\.png$/i, ".jpg");
      else if (lower.endsWith(".jpg")) nextCandidate = currentSrc.replace(/\.jpg$/i, ".png");
      else if (lower.endsWith(".jpeg")) nextCandidate = currentSrc.replace(/\.jpeg$/i, ".png");
      else if (lower.endsWith(".webp")) nextCandidate = currentSrc.replace(/\.webp$/i, ".jpg");

      if (nextCandidate && nextCandidate !== currentSrc) {
        setAttemptCount(1);
        setCurrentSrc(nextCandidate);
        return;
      }
    }

    // Step 2: Try explicit fallbackSrc or category fallback
    if (attemptCount <= 1 && currentSrc !== safeDefault) {
      setAttemptCount(2);
      setCurrentSrc(safeDefault);
      return;
    }

    // Step 3: Completely failed, avoid endless loops
    setHasFailedCompletely(true);
  };

  if (hasFailedCompletely || !currentSrc) {
    return (
      <div
        className={`flex items-center justify-center bg-[#101115] border border-white/10 text-white/40 font-mono text-[10px] uppercase select-none ${className}`}
      >
        <span className="truncate px-2">{alt || "Asset"}</span>
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      onError={handleError}
      loading="lazy"
      {...props}
    />
  );
}
