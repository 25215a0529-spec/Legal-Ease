"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Github, Twitter, Linkedin, Mail } from "lucide-react"

const footerLinks = {
  product: [
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "API", href: "#api" },
    { name: "Documentation", href: "#docs" },
  ],
  company: [
    { name: "About", href: "#about" },
    { name: "Blog", href: "#blog" },
    { name: "Careers", href: "#careers" },
    { name: "Contact", href: "#contact" },
  ],
  legal: [
    { name: "Privacy Policy", href: "#privacy" },
    { name: "Terms of Service", href: "#terms" },
    { name: "Cookie Policy", href: "#cookies" },
    { name: "Security", href: "#security" },
  ],
}

const socialLinks = [
  { name: "GitHub", href: "#", icon: Github },
  { name: "Twitter", href: "#", icon: Twitter },
  { name: "LinkedIn", href: "#", icon: Linkedin },
  { name: "Email", href: "mailto:contact@legalease.ai", icon: Mail },
]

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="container-linear px-4 sm:px-6">
        <div className="py-8 sm:py-12 lg:py-16">
          <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-4">
            {/* Brand Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:col-span-1 text-center sm:text-left"
            >
              <Link href="/" className="flex items-center justify-center sm:justify-start space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <span className="text-sm font-bold">LE</span>
                </div>
                <span className="text-lg sm:text-xl font-bold text-gradient-primary">
                  LegalEase
                </span>
              </Link>
              <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-muted-foreground max-w-xs mx-auto sm:mx-0">
                Transform complex legal documents into clear, actionable insights with our cutting-edge AI-powered analysis platform.
              </p>
              <div className="mt-4 sm:mt-6 flex justify-center sm:justify-start space-x-3 sm:space-x-4">
                {socialLinks.map((social) => (
                  <Link
                    key={social.name}
                    href={social.href}
                    className="text-muted-foreground hover:text-foreground transition-colors p-1"
                  >
                    <span className="sr-only">{social.name}</span>
                    <social.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Links Sections */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-3 lg:col-span-3 mt-8 sm:mt-0"
            >
              <div className="text-center sm:text-left">
                <h3 className="text-sm font-semibold text-foreground">Product</h3>
                <ul className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
                  {footerLinks.product.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="text-center sm:text-left">
                <h3 className="text-sm font-semibold text-foreground">Company</h3>
                <ul className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
                  {footerLinks.company.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="text-center sm:text-left">
                <h3 className="text-sm font-semibold text-foreground">Legal</h3>
                <ul className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
                  {footerLinks.legal.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>

      </div>
    </footer>
  )
}
