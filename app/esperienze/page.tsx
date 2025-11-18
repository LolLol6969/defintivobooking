"use client"

import { useEffect, useRef } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"

const experiences = [
  {
    title: "Ristorante Corallo: Un Viaggio Culinario Stellato",
    description:
      "Lasciatevi sedurre dai sapori autentici e innovativi del Ristorante Corallo. Il nostro Chef, rinomato per la sua creatività, seleziona solo ingredienti freschissimi e di stagione per proporre piatti che sono vere opere d'arte. Un'esperienza gastronomica indimenticabile, dove la tradizione italiana incontra l'eleganza contemporanea.",
    image: "/elegant-gourmet-dish-in-luxury-restaurant-setting.png",
    reverse: false,
    pricing: "Menu Degustazione: da €95 | Piatti à la carte: €50-150",
    details: "Aperto ogni sera dalle 19:00 alle 23:00. È fortemente consigliata la prenotazione.",
  },
  {
    title: "Elysian Spa: Oasi di Benessere e Rigenerazione",
    description:
      "Concedetevi un momento di puro relax nella nostra Elysian Spa, un santuario dedicato al benessere di corpo e mente. Offriamo una vasta gamma di trattamenti personalizzati, massaggi rigeneranti e percorsi benessere con saune, bagni turchi e piscine idromassaggio. Lasciatevi avvolgere da un'atmosfera di serenità e armonia.",
    image: "/luxury-spa-treatment-room-with-relaxing-ambiance.png",
    reverse: true,
    pricing: "Trattamenti individuali: da €90 | Pacchetti benessere: €180-400",
    details: "Aperto tutti i giorni dalle 09:00 alle 21:00. Accesso alle piscine termali incluso per gli ospiti.",
  },
  {
    title: "Infinity Pool & Spiaggia Privata: Lusso Sull'Acqua",
    description:
      "Godetevi il sole e il mare nella nostra spettacolare Infinity Pool, che si fonde con l'orizzonte dell'Adriatico. La nostra spiaggia privata, con sabbia dorata e servizio impeccabile, offre lettini confortevoli e cabanas esclusive per la massima privacy. Perfetto per rilassarsi, nuotare o sorseggiare un cocktail al tramonto.",
    image: "/infinity-pool-overlooking-ocean-with-luxury-beach-.png",
    reverse: false,
    pricing: "Accesso gratuito per gli ospiti del resort | Noleggio cabina privata: €60/giorno",
    details: "Piscina aperta dalle 08:00 alle 22:00 | Servizio spiaggia dalle 09:00 alle 19:00.",
  },
]

export default function EsperienzePage() {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const sectionsRef = useRef<HTMLDivElement>(null)

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
    if (sectionsRef.current) {
      const sections = sectionsRef.current.querySelectorAll(".experience-section")
      sections.forEach((section, index) => {
        setTimeout(() => {
          observer.observe(section)
        }, index * 200)
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
            className="text-4xl md:text-6xl font-bold text-center elysian-secondary mb-20 text-balance"
          >
            Esperienze Indimenticabili
          </h1>

          <div ref={sectionsRef} className="space-y-20">
            {experiences.map((experience, index) => (
              <div key={experience.title} className={`experience-section glass-panel p-8 md:p-12`}>
                <div
                  className={`grid md:grid-cols-2 gap-12 items-center ${experience.reverse ? "md:grid-flow-col-dense" : ""}`}
                >
                  <div className={experience.reverse ? "md:col-start-2" : ""}>
                    <h2 className="text-3xl md:text-4xl font-bold elysian-primary mb-6">{experience.title}</h2>
                    <p className="text-lg text-gray-700 leading-relaxed text-pretty mb-6">{experience.description}</p>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mb-4">
                      <p className="font-semibold text-elysian-primary mb-2">{experience.pricing}</p>
                      <p className="text-sm text-gray-600">{experience.details}</p>
                    </div>
                  </div>
                  <div className={experience.reverse ? "md:col-start-1" : ""}>
                    <img
                      src={experience.image || "/placeholder.svg"}
                      alt={experience.title}
                      className="rounded-2xl shadow-2xl w-full h-80 object-cover"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
