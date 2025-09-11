"use client"

import { useEffect, useRef } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link" // Importa il componente Link

const suites = [
  {
    name: "Ocean Dream",
    image: "/luxury-ocean-view-suite-with-modern-design.png",
    roomType: "XXD",
    feature: "Vista Mare Panoramica",
    price: "€280",
    period: "a notte",
    description: "Lasciatevi incantare dalla vista mozzafiato sull'Adriatico. Questa suite, arredata con un design moderno e raffinato, offre un balcone privato, un letto king-size e un bagno di lusso con doccia emozionale. Perfetta per chi cerca romanticismo e relax al suono delle onde.",
  },
  {
    name: "Sky Loft",
    image: "/luxury-penthouse-suite-with-sky-view.png",
    roomType: "MX",
    feature: "Terrazza Privata",
    price: "€420",
    period: "a notte",
    description: "Un'esperienza esclusiva vi attende nel nostro Sky Loft. Situato all'ultimo piano, vanta una spaziosa terrazza privata con idromassaggio e vista a 360° sul mare e sulla pineta. Ideale per chi desidera privacy, ampi spazi e tramonti indimenticabili.",
  },
  {
    name: "Garden Haven",
    image: "/luxury-garden-suite-with-private-patio.png",
    roomType: "MD",
    feature: "Giardino Privato",
    price: "€350",
    period: "a notte",
    description: "Un rifugio di pace immerso nel verde. Questa suite offre accesso diretto a un incantevole giardino privato, ideale per colazioni all'aperto o momenti di lettura in totale tranquillità. Gli interni sono luminosi e accoglienti, con un tocco di eleganza naturale.",
  },
  {
    name: "Elysian Presidential",
    image: "/luxury-presidential-suite-with-elegant-decor.png",
    roomType: "XXV",
    feature: "Suite Presidenziale",
    price: "€750",
    period: "a notte",
    description: "Il culmine del lusso e dell'esclusività. La Elysian Presidential Suite offre un salone sontuoso, due camere da letto eleganti, bagni in marmo con vasca idromassaggio e un servizio maggiordomo dedicato. Un'esperienza senza pari per gli ospiti più esigenti.",
  },
]

export default function SuitePage() {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

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

    if (titleRef.current) observer.observe(titleRef.current)
    if (cardsRef.current) {
      const cards = cardsRef.current.querySelectorAll(".suite-card")
      cards.forEach((card, index) => {
        setTimeout(() => {
          observer.observe(card)
        }, index * 100)
      })
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen beach-background">
      <Header />

      <div className="pt-24 pb-20 px-6">
        <div className="container mx-auto max-w-7xl">
          <h1
            ref={titleRef}
            className="text-4xl md:text-6xl font-bold text-center elysian-secondary mb-16 text-balance"
          >
            Il Tuo Rifugio Privato
          </h1>

          <div ref={cardsRef} className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            {suites.map((suite, index) => (
              <div
                key={suite.name}
                className="suite-card glass-panel p-6 hover:transform hover:scale-105 transition-all duration-300"
              >
                <img
                  src={suite.image || "/placeholder.svg"}
                  alt={suite.name}
                  className="w-full h-64 object-cover rounded-xl mb-6"
                />
                <h3 className="text-2xl font-bold elysian-primary mb-4">{suite.name}</h3>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-right">
                    <span className="text-3xl font-bold elysian-primary">{suite.price}</span>
                    <span className="text-gray-600 ml-1">{suite.period}</span>
                  </div>
                </div>
                  <p className="text-gray-700">
                    <span className="font-semibold">Tipo Camera:</span> {suite.roomType}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Caratteristica:</span> {suite.feature}
                  </p>
            
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">{suite.description}</p>
                {/* Modificato il pulsante per essere un Link a /prenota */}
                <Link href="/prenota" className="w-full bg-elysian-primary text-elysian-secondary py-3 rounded-full font-semibold hover:bg-opacity-90 transition-all duration-300 text-center block">
                  Verifica Disponibilità
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}