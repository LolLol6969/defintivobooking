"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function HomePage() {
  const heroRef = useRef<HTMLElement>(null)
  const welcomeRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in-up")
        }
      })
    }, observerOptions)

    if (heroRef.current) observer.observe(heroRef.current)
    if (welcomeRef.current) observer.observe(welcomeRef.current)

    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen beach-background">
      <Header />

      {/* Hero Section */}
      <section ref={heroRef} className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center px-6 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-high-contrast mb-6 text-balance glass-text-bg">
            Orla Resort
          </h1>
          <p className="text-xl md:text-2xl text-high-contrast mb-8 font-light text-pretty glass-text-bg">
            Scopri un'oasi di lusso e serenità a Lido degli Estensi, dove ogni dettaglio è pensato per un'esperienza indimenticabile.
          </p>
          <Link
            href="/suite"
            className="inline-block bg-elysian-primary text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 shadow-2xl border-2 border-white/30"
          >
            Esplora le Nostre Suite
          </Link>
        </div>
      </section>

      {/* Welcome Section */}
      <section ref={welcomeRef} className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="glass-panel p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-readable-dark mb-6">Benvenuti nel Vostro Paradiso Personale</h2>
                <p className="text-lg text-gray-900 mb-6 leading-relaxed font-medium">
                  Orla Resort è più di un semplice hotel: è una promessa di evasione e benessere. Situato sulla splendida costa di Lido degli Estensi, il nostro resort di lusso offre un'ospitalità raffinata, un design elegante e servizi impeccabili.
                </p>
                <p className="text-lg text-gray-900 leading-relaxed font-medium">
                  Lasciatevi coccolare dalle nostre suite esclusive, dalle delizie culinarie e dalle esperienze uniche, tutte pensate per creare ricordi preziosi che dureranno una vita.
                </p>
              </div>
              <div className="relative">
                <img
                  src="/images/hero.png"
                  alt="Lobby elegante dell'hotel"
                  className="rounded-2xl shadow-2xl w-full h-80 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
