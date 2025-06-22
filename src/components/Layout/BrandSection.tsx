"use client"

import { useEffect, useRef } from "react"
import { BarChart3, Users, CheckSquare, FileText } from "lucide-react"

export function BrandSection() {
  const particlesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const createParticles = () => {
      if (!particlesRef.current) return

      const particleCount = 30
      particlesRef.current.innerHTML = ""

      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement("div")
        particle.className = "absolute w-1 h-1 bg-white/50 rounded-full animate-float"

        const size = Math.random() * 4 + 2
        particle.style.width = `${size}px`
        particle.style.height = `${size}px`

        particle.style.left = `${Math.random() * 100}%`
        particle.style.top = `${Math.random() * 100}%`
        particle.style.opacity = `${Math.random() * 0.5 + 0.3}`

        const duration = Math.random() * 20 + 10
        particle.style.animationDuration = `${duration}s`
        particle.style.animationDelay = `${Math.random() * 5}s`

        particlesRef.current.appendChild(particle)
      }
    }

    createParticles()
  }, [])

  const features = [
    { icon: BarChart3, text: "Suivi en temps réel" },
    { icon: Users, text: "Collaboration d'équipe" },
    { icon: CheckSquare, text: "Gestion des tâches" },
    { icon: FileText, text: "Rapports détaillés" },
  ]

  return (
    <div className="flex-1 bg-gradient-to-br from-inwi-purple to-inwi-dark-purple flex flex-col justify-center items-center p-8 relative overflow-hidden shadow-2xl">
      {/* Background circles */}
      <div className="absolute w-72 h-72 bg-white/10 rounded-full -top-24 -left-24 animate-float" />
      <div
        className="absolute w-96 h-96 bg-white/5 rounded-full -bottom-48 -right-48 animate-float"
        style={{ animationDelay: "2s", animationDuration: "20s" }}
      />
      <div
        className="absolute w-48 h-48 bg-white/15 rounded-full top-1/3 right-1/4 animate-float"
        style={{ animationDelay: "1s", animationDuration: "15s" }}
      />
      <div
        className="absolute w-32 h-32 bg-white/20 rounded-full bottom-1/4 left-1/4 animate-float"
        style={{ animationDelay: "3s", animationDuration: "18s" }}
      />
      <div
        className="absolute w-20 h-20 bg-white/25 rounded-full top-1/4 left-1/5 animate-float"
        style={{ animationDelay: "0.5s", animationDuration: "12s" }}
      />

      {/* Particles */}
      <div ref={particlesRef} className="absolute inset-0" />

      <div className="relative z-10 max-w-lg text-center">
        {/* Logo */}
        <div className="w-44 mb-8 mx-auto p-4 bg-white/10 rounded-2xl backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:bg-white/15">
          <div className="text-6xl font-bold text-white">INWI</div>
        </div>

        <h1 className="text-4xl font-bold text-white mb-6 leading-tight">
          Plateforme de Gestion des Projets
          <div className="w-20 h-1 bg-gradient-to-r from-inwi-tertiary to-inwi-accent rounded-full mx-auto mt-4 transition-all duration-500 hover:w-32" />
        </h1>

        <p className="text-white/90 text-xl leading-relaxed mb-8">
          Bienvenue sur la plateforme de gestion des projets d'INWI. Connectez-vous pour accéder à vos projets, suivre
          leur avancement et collaborer avec votre équipe.
        </p>

        <div className="grid grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/15 backdrop-blur-sm p-6 rounded-2xl border border-white/10 transition-all duration-500 hover:bg-white/20 hover:-translate-y-2 hover:scale-105 group cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4 mx-auto transition-all duration-300 group-hover:bg-white/30 group-hover:scale-110">
                <feature.icon className="h-6 w-6 text-white transition-transform duration-300 group-hover:scale-110" />
              </div>
              <div className="text-white font-medium text-center transition-transform duration-300 group-hover:translate-x-1">
                {feature.text}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
