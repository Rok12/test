import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function GalleryPage() {
  // Sample gallery items
  const galleryItems = [
    {
      id: 1,
      name: "Modern Bookshelf",
      type: "bookshelf",
      material: "Oak",
      price: 349,
      image: "/placeholder.svg?height=400&width=400&text=Bookshelf",
    },
    {
      id: 2,
      name: "Dining Table",
      type: "table",
      material: "Walnut",
      price: 599,
      image: "/placeholder.svg?height=400&width=400&text=Table",
    },
    {
      id: 3,
      name: "Storage Cabinet",
      type: "cabinet",
      material: "Pine",
      price: 429,
      image: "/placeholder.svg?height=400&width=400&text=Cabinet",
    },
    {
      id: 4,
      name: "Office Desk",
      type: "desk",
      material: "Maple",
      price: 499,
      image: "/placeholder.svg?height=400&width=400&text=Desk",
    },
    {
      id: 5,
      name: "Media Sideboard",
      type: "sideboard",
      material: "Cherry",
      price: 649,
      image: "/placeholder.svg?height=400&width=400&text=Sideboard",
    },
    {
      id: 6,
      name: "Compact Bookshelf",
      type: "bookshelf",
      material: "Oak",
      price: 299,
      image: "/placeholder.svg?height=400&width=400&text=Bookshelf",
    },
  ]

  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gallery</h1>
          <p className="text-gray-600">Browse our collection of pre-designed furniture or customize your own</p>
        </div>
        <Button asChild className="bg-black text-white hover:bg-black/90">
          <Link href="/builder">
            Design Your Own
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleryItems.map((item) => (
          <div key={item.id} className="border rounded-lg overflow-hidden group">
            <div className="aspect-square relative overflow-hidden bg-gray-100">
              <img
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                className="object-cover w-full h-full transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="flex gap-2">
                  <Button asChild size="sm" variant="secondary">
                    <Link href={`/builder?template=${item.id}`}>Customize</Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link href="#">Quick Buy</Link>
                  </Button>
                </div>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg">{item.name}</h3>
              <div className="flex justify-between items-center mt-2">
                <div className="text-sm text-gray-600">
                  {item.material} {item.type}
                </div>
                <div className="font-bold">${item.price}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
