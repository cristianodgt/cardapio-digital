"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { MenuItem } from "@/lib/types";

interface MediaPlayerProps {
  item: MenuItem;
  isActive: boolean;
}

export default function MediaPlayer({ item, isActive }: MediaPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!videoRef.current) return;
    if (isActive) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isActive]);

  if (item.media_type === "video") {
    return (
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          src={item.media_url}
          poster={item.thumbnail_url}
          loop
          muted
          playsInline
          onLoadedData={() => setIsLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
        {!isLoaded && (
          <div className="absolute inset-0 bg-zinc-900 animate-pulse" />
        )}
      </div>
    );
  }

  return (
    <div className="absolute inset-0">
      <Image
        src={item.media_url}
        alt={item.name}
        fill
        sizes="100vw"
        priority={isActive}
        onLoad={() => setIsLoaded(true)}
        className={`object-cover transition-opacity duration-500 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      />
      {!isLoaded && (
        <div className="absolute inset-0 bg-zinc-900 animate-pulse" />
      )}
    </div>
  );
}
