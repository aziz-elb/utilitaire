"use client"

interface LoadingOverlayProps {
  isVisible: boolean
}

export function LoadingOverlay({ isVisible }: LoadingOverlayProps) {
  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-inwi-purple to-inwi-dark-purple flex items-center justify-center z-50 transition-opacity duration-500">
      <div className="flex flex-col items-center gap-8">
        {/* Logo container with pulsing effect */}
        <div className="relative w-44 h-44 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-white/10 animate-ping" />
          <div className="absolute inset-2 rounded-full bg-white/20 animate-pulse" />
          <div className="relative w-36 h-36 bg-white rounded-full flex items-center justify-center animate-bounce">
            <div className="text-4xl font-bold text-inwi-purple">INWI</div>
          </div>
        </div>

        {/* Spinner */}
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 border-4 border-white/20 rounded-full" />
          <div className="absolute inset-0 border-4 border-transparent border-t-white rounded-full animate-spin" />
          <div
            className="absolute inset-2 border-4 border-transparent border-t-white/80 rounded-full animate-spin"
            style={{ animationDirection: "reverse", animationDelay: "0.2s" }}
          />
          <div
            className="absolute inset-4 border-4 border-transparent border-t-white/60 rounded-full animate-spin"
            style={{ animationDelay: "0.4s" }}
          />
          <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>

        {/* Loading text */}
        <div className="text-white text-2xl font-medium tracking-wider flex">
          {"Chargement...".split("").map((char, index) => (
            <span key={index} className="animate-bounce" style={{ animationDelay: `${index * 0.1}s` }}>
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
