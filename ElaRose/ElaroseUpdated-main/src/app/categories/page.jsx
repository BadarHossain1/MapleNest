"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Grid, List, Filter } from "lucide-react"

// Mock categories data
const categories = [
  {
    id: 1,
    name: "Dresses",
    slug: "dresses",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=300&fit=crop",
    description: "Elegant dresses for every occasion",
    productCount: 45,
    featured: true
  },
  {
    id: 2,
    name: "Tops & Blouses",
    slug: "tops-blouses",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    description: "Stylish tops and comfortable blouses",
    productCount: 32,
    featured: true
  },
  {
    id: 3,
    name: "Bottoms",
    slug: "bottoms",
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=300&fit=crop",
    description: "Jeans, pants, and skirts",
    productCount: 28,
    featured: false
  },
  {
    id: 4,
    name: "Outerwear",
    slug: "outerwear",
    image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop",
    description: "Jackets, coats, and cardigans",
    productCount: 19,
    featured: true
  },
  {
    id: 5,
    name: "Accessories",
    slug: "accessories",
    image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=400&h=300&fit=crop",
    description: "Bags, jewelry, and fashion accessories",
    productCount: 67,
    featured: false
  },
  {
    id: 6,
    name: "Shoes",
    slug: "shoes",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop",
    description: "Comfortable and stylish footwear",
    productCount: 23,
    featured: true
  },
  {
    id: 7,
    name: "Lingerie",
    slug: "lingerie",
    image: "https://images.unsplash.com/photo-1571513722275-4b41940f54b8?w=400&h=300&fit=crop",
    description: "Intimate wear and sleepwear",
    productCount: 15,
    featured: false
  },
  {
    id: 8,
    name: "Activewear",
    slug: "activewear",
    image: "https://images.unsplash.com/photo-1506629905607-d4a3b29cc3d5?w=400&h=300&fit=crop",
    description: "Workout and athleisure wear",
    productCount: 34,
    featured: true
  }
]

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState("grid") // grid or list
  const [showOnlyFeatured, setShowOnlyFeatured] = useState(false)

  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFeatured = !showOnlyFeatured || category.featured
    return matchesSearch && matchesFeatured
  })

  const totalProducts = categories.reduce((sum, category) => sum + category.productCount, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#fef8f7] to-[#f2c9c7]/10">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#2d1b1e] mb-4 animate-fade-in">
            Shop by Category
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our curated collection across {categories.length} categories with over {totalProducts} beautiful pieces
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <Card className="glass">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* View Controls */}
                <div className="flex items-center space-x-4">
                  {/* Featured Filter */}
                  <Button
                    variant={showOnlyFeatured ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowOnlyFeatured(!showOnlyFeatured)}
                    className={showOnlyFeatured ? "bg-[#f2c9c7] text-[#2d1b1e] hover:bg-[#edb3b0]" : ""}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Featured Only
                  </Button>

                  {/* View Mode Toggle */}
                  <div className="flex border rounded-lg overflow-hidden">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className={`rounded-none ${viewMode === "grid" ? "bg-[#f2c9c7] text-[#2d1b1e]" : ""}`}
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className={`rounded-none ${viewMode === "list" ? "bg-[#f2c9c7] text-[#2d1b1e]" : ""}`}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredCategories.length} of {categories.length} categories
          </p>
        </div>

        {/* Categories Grid/List */}
        <div className={viewMode === "grid" 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
          : "space-y-4"
        }>
          {filteredCategories.map((category) => (
            <Link key={category.id} href={`/category/${category.slug}`}>
              <Card className="group glass hover-lift cursor-pointer overflow-hidden h-full">
                {viewMode === "grid" ? (
                  <>
                    {/* Grid View */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      
                      {/* Featured Badge */}
                      {category.featured && (
                        <Badge className="absolute top-3 left-3 bg-[#f2c9c7] text-[#2d1b1e] hover:bg-[#edb3b0]">
                          Featured
                        </Badge>
                      )}

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    <CardContent className="p-4">
                      <h3 className="text-lg font-semibold text-[#2d1b1e] mb-2 group-hover:text-[#f2c9c7] transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {category.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {category.productCount} items
                        </Badge>
                        <div className="text-[#f2c9c7] group-hover:translate-x-1 transition-transform duration-200">
                          →
                        </div>
                      </div>
                    </CardContent>
                  </>
                ) : (
                  <>
                    {/* List View */}
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                          <Image
                            src={category.image}
                            alt={category.name}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-[#2d1b1e] mb-1 group-hover:text-[#f2c9c7] transition-colors">
                                {category.name}
                                {category.featured && (
                                  <Badge className="ml-2 bg-[#f2c9c7] text-[#2d1b1e] hover:bg-[#edb3b0]">
                                    Featured
                                  </Badge>
                                )}
                              </h3>
                              <p className="text-sm text-muted-foreground mb-2">
                                {category.description}
                              </p>
                              <Badge variant="outline" className="text-xs">
                                {category.productCount} items
                              </Badge>
                            </div>
                            <div className="text-[#f2c9c7] group-hover:translate-x-1 transition-transform duration-200 ml-4">
                              →
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </>
                )}
              </Card>
            </Link>
          ))}
        </div>

        {/* No Results */}
        {filteredCategories.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-[#2d1b1e] mb-2">No categories found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search terms or filters
            </p>
            <Button 
              onClick={() => {
                setSearchTerm("")
                setShowOnlyFeatured(false)
              }}
              className="bg-[#f2c9c7] hover:bg-[#edb3b0] text-[#2d1b1e]"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="glass">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-[#2d1b1e] mb-4">
                Can't find what you're looking for?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Browse our complete product collection or contact us for personalized recommendations
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/products">
                  <Button size="lg" className="bg-[#f2c9c7] hover:bg-[#edb3b0] text-[#2d1b1e]">
                    View All Products
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" size="lg" className="border-[#f2c9c7] text-[#f2c9c7] hover:bg-[#f2c9c7]/10">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}