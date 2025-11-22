"use client"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [logoClickCount, setLogoClickCount] = useState(0)

  useEffect(() => {
    setMounted(true)

    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (logoClickCount === 0) return

    const timer = setTimeout(
      () => {
        if (logoClickCount === 3) {
          router.push("/calendar")
        }
        setLogoClickCount(0)
      },
      logoClickCount === 3 ? 0 : 500,
    )

    return () => clearTimeout(timer)
  }, [logoClickCount, router])

  const handleLogoClick = () => {
    setLogoClickCount((prev) => (prev + 1) % 4)
  }

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/suite", label: "Suite" },
    { href: "/esperienze", label: "Esperienze" },
    { href: "/prenota", label: "Prenota" },
    { href: "/contatti", label: "Contatti" },
  ]

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  if (!mounted) return null

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "py-2" : "py-4"}`}>
        <div className="container mx-auto px-6">
          <nav
            className={`relative rounded-2xl transition-all duration-500 ${
              scrolled
                ? "bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl"
                : "bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl"
            }`}
            style={{
              background: scrolled
                ? "linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))"
                : "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02))",
            }}
          >
            <div className="flex items-center justify-between px-8 py-4">
              <button
                onClick={handleLogoClick}
                className="group flex items-center space-x-3 text-2xl font-bold text-white hover:text-[#F0EAD6] transition-all duration-300 cursor-pointer"
              >
                <span className="bg-gradient-to-r from-white to-[#F0EAD6] bg-clip-text text-transparent">
                  Orla Resort
                </span>
              </button>

              <div className="hidden md:flex items-center space-x-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group relative px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                      pathname === item.href
                        ? "bg-white/20 text-white shadow-lg backdrop-blur-sm border border-white/30"
                        : "text-white/80 hover:text-white hover:bg-white/10 hover:backdrop-blur-sm"
                    }`}
                  >
                    <span>{item.label}</span>
                    {pathname === item.href && (
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#701C1C]/20 to-transparent animate-pulse"></div>
                    )}
                  </Link>
                ))}
              </div>

              <button
                className="md:hidden relative p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-105"
                onClick={toggleMobileMenu}
                aria-label="Toggle mobile menu"
              >
                <div className="w-6 h-6 flex flex-col justify-center items-center">
                  <span
                    className={`block w-5 h-0.5 bg-current transition-all duration-300 ${
                      isMobileMenuOpen ? "rotate-45 translate-y-1" : "-translate-y-1"
                    }`}
                  ></span>
                  <span
                    className={`block w-5 h-0.5 bg-current transition-all duration-300 ${
                      isMobileMenuOpen ? "opacity-0" : "opacity-100"
                    }`}
                  ></span>
                  <span
                    className={`block w-5 h-0.5 bg-current transition-all duration-300 ${
                      isMobileMenuOpen ? "-rotate-45 -translate-y-1" : "translate-y-1"
                    }`}
                  ></span>
                </div>
              </button>
            </div>
          </nav>
        </div>

        <div
          className={`md:hidden fixed inset-0 z-40 transition-all duration-500 ${
            isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
          style={{
            background: isMobileMenuOpen ? "rgba(0, 0, 0, 0.3)" : "transparent",
            backdropFilter: isMobileMenuOpen ? "blur(10px)" : "none",
          }}
          onClick={closeMobileMenu}
        >
          <div
            className={`fixed top-0 right-0 h-full w-80 transform transition-all duration-500 ease-out ${
              isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))",
              backdropFilter: "blur(25px)",
              WebkitBackdropFilter: "blur(25px)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRight: "none",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pt-24 px-8">
              <div className="mb-8 text-center">
                <h3 className="text-2xl font-bold text-white mb-2">Menu</h3>
                <div className="w-16 h-0.5 bg-gradient-to-r from-[#701C1C] to-[#F0EAD6] mx-auto"></div>
              </div>

              {navItems.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className={`group flex items-center space-x-4 py-4 px-6 mb-3 rounded-2xl text-lg font-medium transition-all duration-300 ${
                    pathname === item.href
                      ? "bg-white/20 text-white shadow-lg border border-white/30"
                      : "text-white/80 hover:text-white hover:bg-white/10 hover:translate-x-2"
                  }`}
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    transform: isMobileMenuOpen ? "translateX(0)" : "translateX(100px)",
                    opacity: isMobileMenuOpen ? 1 : 0,
                    transition: `all 0.5s ease-out ${index * 0.1}s`,
                  }}
                >
                  <span>{item.label}</span>
                  {pathname === item.href && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-[#701C1C] animate-pulse"></div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
