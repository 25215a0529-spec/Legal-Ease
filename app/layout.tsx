import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ErrorBoundary } from "@/components/ui/error-boundary"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LegalEase - AI-Powered Legal Document Analysis",
  description: "Analyze legal documents with AI, get risk assessments, and access professional legal templates. Streamline your legal workflow with intelligent document processing.",
  keywords: ["legal analysis", "AI", "document review", "risk assessment", "legal templates", "contract analysis"],
  authors: [{ name: "LegalEase Team" }],
  metadataBase: new URL(process.env.NODE_ENV === 'production' ? 'https://legalease.app' : 'http://localhost:3000'),
  openGraph: {
    title: "LegalEase - AI-Powered Legal Document Analysis",
    description: "Analyze legal documents with AI, get risk assessments, and access professional legal templates.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "LegalEase - AI-Powered Legal Document Analysis",
    description: "Analyze legal documents with AI, get risk assessments, and access professional legal templates.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ErrorBoundary>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange={false}
          >
            <div className="relative flex min-h-screen flex-col">
              <main className="flex-1">
                {children}
              </main>
            </div>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
