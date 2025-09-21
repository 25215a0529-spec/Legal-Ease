"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { FileText, Download, Search, Filter, Star, Users, Building, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"

const templateCategories = [
  { id: "all", name: "All Templates", icon: FileText, count: 24 },
  { id: "business", name: "Business", icon: Building, count: 12 },
  { id: "employment", name: "Employment", icon: Users, count: 6 },
  { id: "real-estate", name: "Real Estate", icon: Home, count: 4 },
  { id: "personal", name: "Personal", icon: Star, count: 2 }
]

const documentTemplates = [
  {
    id: 1,
    title: "Non-Disclosure Agreement (NDA)",
    description: "Protect confidential information in business relationships and partnerships",
    category: "business",
    rating: 4.9,
    downloads: 1250,
    preview: "Comprehensive NDA template with mutual confidentiality provisions...",
    tags: ["Confidentiality", "Business", "Partnership"]
  },
  {
    id: 2,
    title: "Employment Contract",
    description: "Standard employment agreement template with customizable terms",
    category: "employment",
    rating: 4.8,
    downloads: 980,
    preview: "Full-time employment contract covering salary, benefits, and obligations...",
    tags: ["Employment", "HR", "Full-time"]
  },
  {
    id: 3,
    title: "Service Agreement",
    description: "Professional services contract template for consultants and freelancers",
    category: "business",
    rating: 4.7,
    downloads: 850,
    preview: "Service agreement outlining scope, deliverables, and payment terms...",
    tags: ["Services", "Consulting", "Freelance"]
  },
  {
    id: 4,
    title: "Rental Agreement",
    description: "Residential property lease agreement with standard terms and conditions",
    category: "real-estate",
    rating: 4.6,
    downloads: 720,
    preview: "Residential lease covering rent, deposits, and tenant responsibilities...",
    tags: ["Rental", "Lease", "Property"]
  },
  {
    id: 5,
    title: "Partnership Agreement",
    description: "Business partnership contract template for joint ventures",
    category: "business",
    rating: 4.8,
    downloads: 650,
    preview: "Partnership agreement defining roles, responsibilities, and profit sharing...",
    tags: ["Partnership", "Joint Venture", "Business"]
  },
  {
    id: 6,
    title: "Freelance Contract",
    description: "Independent contractor agreement for project-based work",
    category: "employment",
    rating: 4.7,
    downloads: 580,
    preview: "Freelance contract covering project scope, timeline, and payments...",
    tags: ["Freelance", "Contract", "Independent"]
  },
  {
    id: 7,
    title: "Purchase Agreement",
    description: "Asset purchase agreement for business acquisitions",
    category: "business",
    rating: 4.9,
    downloads: 420,
    preview: "Comprehensive purchase agreement with due diligence provisions...",
    tags: ["Purchase", "Acquisition", "Assets"]
  },
  {
    id: 8,
    title: "Loan Agreement",
    description: "Personal loan agreement template with repayment terms",
    category: "personal",
    rating: 4.5,
    downloads: 380,
    preview: "Personal loan agreement outlining principal, interest, and repayment...",
    tags: ["Loan", "Personal", "Finance"]
  }
]

export default function TemplatesPage() {
  const [selectedCategory, setSelectedCategory] = React.useState("all")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [filteredTemplates, setFilteredTemplates] = React.useState(documentTemplates)

  React.useEffect(() => {
    let filtered = documentTemplates

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(template => template.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(template =>
        template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    setFilteredTemplates(filtered)
  }, [selectedCategory, searchQuery])

  const handleDownload = (template: any) => {
    // Simulate download
    alert(`Downloading ${template.title}...`)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="container-linear">
          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-6">
                <FileText className="h-8 w-8" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
                Legal{" "}
                <span className="text-gradient-primary">Templates</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl">
                Download professional legal document templates crafted by legal experts. Save time and ensure compliance with industry-standard agreements.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 border-b border-border/50">
        <div className="container-linear">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {templateCategories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex items-center space-x-2"
                >
                  <category.icon className="h-4 w-4" />
                  <span>{category.name}</span>
                  <Badge variant="secondary" className="ml-1">
                    {category.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Templates Grid */}
      <section className="py-16">
        <div className="container-linear">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">
              {selectedCategory === "all" ? "All Templates" : templateCategories.find(c => c.id === selectedCategory)?.name}
            </h2>
            <p className="text-muted-foreground">
              {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} found
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full shadow-linear hover:shadow-linear-lg transition-all duration-300 group">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {template.title}
                        </CardTitle>
                        <CardDescription className="mt-2">
                          {template.description}
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{template.rating}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Preview */}
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-sm text-muted-foreground italic">
                        "{template.preview}"
                      </p>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {template.tags.map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Stats and Download */}
                    <div className="flex items-center justify-between pt-4 border-t border-border/50">
                      <div className="text-sm text-muted-foreground">
                        {template.downloads.toLocaleString()} downloads
                      </div>
                      <Button
                        onClick={() => handleDownload(template)}
                        size="sm"
                        className="group-hover:shadow-md transition-all"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No templates found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-muted/30">
        <div className="container-linear">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Need a Custom Template?</h2>
            <p className="text-muted-foreground mb-8">
              Can't find what you're looking for? Our legal experts can create custom templates tailored to your specific needs.
            </p>
            <Button size="lg" className="shadow-linear-lg">
              Request Custom Template
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
