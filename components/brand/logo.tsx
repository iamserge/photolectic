"use client";

import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "full" | "icon" | "wordmark";
  animated?: boolean;
}

const sizeMap = {
  sm: { icon: 24, text: "text-lg" },
  md: { icon: 32, text: "text-xl" },
  lg: { icon: 40, text: "text-2xl" },
  xl: { icon: 56, text: "text-4xl" },
};

export function Logo({
  className,
  size = "md",
  variant = "full",
  animated = false,
}: LogoProps) {
  const { icon: iconSize, text: textSize } = sizeMap[size];

  const IconSVG = () => (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        "transition-transform duration-500",
        animated && "group-hover:rotate-45"
      )}
    >
      {/* Outer aperture ring */}
      <circle
        cx="32"
        cy="32"
        r="28"
        stroke="url(#gradient-ring)"
        strokeWidth="2"
        fill="none"
        className={cn(animated && "animate-pulse")}
      />

      {/* Aperture blades */}
      <g className="origin-center">
        {[0, 60, 120, 180, 240, 300].map((rotation, i) => (
          <path
            key={i}
            d="M32 12 L38 20 L32 22 L26 20 Z"
            fill="url(#gradient-blade)"
            transform={`rotate(${rotation} 32 32)`}
            className={cn(
              "transition-all duration-300",
              animated && "group-hover:opacity-80"
            )}
          />
        ))}
      </g>

      {/* Inner eye/lens */}
      <circle
        cx="32"
        cy="32"
        r="10"
        fill="url(#gradient-center)"
        className={cn(
          "transition-all duration-500",
          animated && "group-hover:scale-110 origin-center"
        )}
      />

      {/* Light reflection */}
      <circle cx="28" cy="28" r="3" fill="white" opacity="0.6" />

      {/* Light rays emanating */}
      <g opacity="0.4">
        {[45, 135, 225, 315].map((rotation, i) => (
          <line
            key={i}
            x1="32"
            y1="4"
            x2="32"
            y2="8"
            stroke="url(#gradient-ray)"
            strokeWidth="2"
            strokeLinecap="round"
            transform={`rotate(${rotation} 32 32)`}
          />
        ))}
      </g>

      {/* Gradients */}
      <defs>
        <linearGradient id="gradient-ring" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="50%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
        <linearGradient id="gradient-blade" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>
        <radialGradient id="gradient-center" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FCD34D" />
          <stop offset="70%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </radialGradient>
        <linearGradient id="gradient-ray" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>
    </svg>
  );

  const Wordmark = () => (
    <span
      className={cn(
        "font-semibold tracking-tight",
        textSize,
        "bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-transparent"
      )}
    >
      Photo
      <span className="text-foreground">lectic</span>
    </span>
  );

  if (variant === "icon") {
    return (
      <div className={cn("group inline-flex items-center", className)}>
        <IconSVG />
      </div>
    );
  }

  if (variant === "wordmark") {
    return (
      <div className={cn("group inline-flex items-center", className)}>
        <Wordmark />
      </div>
    );
  }

  return (
    <div className={cn("group inline-flex items-center gap-3", className)}>
      <IconSVG />
      <Wordmark />
    </div>
  );
}

// Favicon component for generating favicon
export function LogoIcon({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="64" height="64" rx="12" fill="#0A0A0F" />
      <circle cx="32" cy="32" r="20" stroke="#F59E0B" strokeWidth="2" fill="none" />
      <circle cx="32" cy="32" r="8" fill="#F59E0B" />
      <circle cx="29" cy="29" r="2" fill="white" opacity="0.7" />
    </svg>
  );
}
