"use client"

import { useEffect, useState } from "react"

export function InitialLoader() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 2
      })
    }, 60)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-inwi-purple via-inwi-dark-purple to-inwi-pink flex items-center justify-center z-50 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {/* Floating circles */}
        <div className="absolute w-96 h-96 bg-white/5 rounded-full -top-48 -left-48 animate-pulse" />
        <div
          className="absolute w-80 h-80 bg-white/10 rounded-full top-1/4 -right-40 animate-bounce"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute w-64 h-64 bg-white/15 rounded-full bottom-1/4 left-1/4 animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute w-48 h-48 bg-white/20 rounded-full -bottom-24 -right-24 animate-bounce"
          style={{ animationDelay: "0.5s" }}
        />

        {/* Rotating gradient overlay */}
        <div className="absolute inset-0 bg-gradient-conic from-transparent via-white/5 to-transparent animate-spin-slow" />

        {/* Particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/40 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center gap-12">
        {/* Logo container with multiple animation layers */}
        <div className="relative">
          {/* Outer glow ring */}
          <div className="absolute inset-0 w-56 h-56 rounded-full bg-gradient-to-r from-inwi-tertiary via-white to-inwi-accent opacity-20 animate-ping" />

          {/* Middle pulse ring */}
          <div className="absolute inset-4 w-48 h-48 rounded-full bg-gradient-to-r from-white/30 to-white/10 animate-pulse" />

          {/* Inner rotating ring */}
          <div className="absolute inset-8 w-40 h-40 rounded-full border-4 border-transparent border-t-white/60 border-r-white/40 animate-spin" />

          {/* Logo background */}
          <div className="relative w-56 h-56 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
            <div className="w-44 h-44 rounded-full bg-white flex items-center justify-center shadow-2xl animate-bounce">
              <div className="text-center">
                <div className="text-5xl font-bold text-inwi-purple mb-2">INWI</div>
                <div className="text-sm text-inwi-purple/70 font-medium tracking-wider">TELECOM</div>
              </div>
            </div>
          </div>

          {/* Orbiting dots */}
          <div className="absolute inset-0 w-56 h-56 animate-spin-slow">
            <div className="absolute w-4 h-4 bg-white rounded-full top-0 left-1/2 transform -translate-x-1/2 animate-pulse" />
            <div
              className="absolute w-3 h-3 bg-white/80 rounded-full top-1/2 right-0 transform -translate-y-1/2 animate-pulse"
              style={{ animationDelay: "0.5s" }}
            />
            <div
              className="absolute w-4 h-4 bg-white rounded-full bottom-0 left-1/2 transform -translate-x-1/2 animate-pulse"
              style={{ animationDelay: "1s" }}
            />
            <div
              className="absolute w-3 h-3 bg-white/80 rounded-full top-1/2 left-0 transform -translate-y-1/2 animate-pulse"
              style={{ animationDelay: "1.5s" }}
            />
          </div>
        </div>

        {/* Loading text with wave animation */}
        <div className="text-center">
          <div className="text-white text-3xl font-light tracking-widest mb-4 flex justify-center">
            {"Chargement".split("").map((char, index) => (
              <span key={index} className="inline-block animate-bounce" style={{ animationDelay: `${index * 0.1}s` }}>
                {char}
              </span>
            ))}
            <span className="ml-2 flex">
              <span className="animate-bounce" style={{ animationDelay: "1s" }}>
                .
              </span>
              <span className="animate-bounce" style={{ animationDelay: "1.2s" }}>
                .
              </span>
              <span className="animate-bounce" style={{ animationDelay: "1.4s" }}>
                .
              </span>
            </span>
          </div>

          <div className="text-white/70 text-lg font-light">Plateforme de Gestion des Projets</div>
        </div>

        {/* Progress bar */}
        <div className="w-80 bg-white/20 rounded-full h-2 overflow-hidden backdrop-blur-sm">
          <div
            className="h-full bg-gradient-to-r from-white via-inwi-tertiary to-white rounded-full transition-all duration-300 ease-out relative overflow-hidden"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
          </div>
        </div>

        {/* Progress percentage */}
        <div className="text-white/90 text-xl font-light tabular-nums">{progress}%</div>

        {/* Feature highlights */}
        <div className="grid grid-cols-2 gap-6 mt-8">
          {[
            { icon: "📊", text: "Suivi temps réel", delay: "0s" },
            { icon: "👥", text: "Collaboration", delay: "0.5s" },
            { icon: "✅", text: "Gestion tâches", delay: "1s" },
            { icon: "📈", text: "Rapports", delay: "1.5s" },
          ].map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-3 text-white/80 animate-fade-in"
              style={{ animationDelay: feature.delay }}
            >
              <span className="text-2xl animate-bounce" style={{ animationDelay: feature.delay }}>
                {feature.icon}
              </span>
              <span className="text-sm font-light">{feature.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom decorative wave */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/5 to-transparent">
        <svg className="absolute bottom-0 w-full h-16 text-white/10" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            opacity=".25"
            className="animate-pulse"
          />
          <path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            opacity=".5"
            className="animate-pulse"
            style={{ animationDelay: "1s" }}
          />
          <path
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
            className="animate-pulse"
            style={{ animationDelay: "2s" }}
          />
        </svg>
      </div>
    </div>
  )
}
