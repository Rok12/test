import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center px-4 py-24 md:py-32 bg-[#f9f8f6]">
        <div className="container max-w-5xl">
          <div className="grid gap-8 md:grid-cols-2 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Bespoke furniture
                <span className="block h-1 w-48 bg-amber-400 mt-2"></span>
              </h1>
              <p className="text-lg text-gray-700">
                Easily plan your bespoke furniture with our dynamic 3D configurator or choose and adapt from our
                prefabricated furniture designs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button asChild size="lg" className="bg-black text-white hover:bg-black/90">
                  <Link href="/builder">DESIGN NOW</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="group">
                  <Link href="/gallery" className="flex items-center">
                    BROWSE GALLERY
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative aspect-[4/3] bg-white rounded-lg shadow-lg overflow-hidden">
              <img
                src="/placeholder.svg?height=600&width=800"
                alt="Custom furniture showcase"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Design your perfect furniture in just a few clicks</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Choose your furniture type", description: "Select from shelves, tables, cabinets and more" },
              {
                title: "Customize dimensions",
                description: "Adjust width, height and depth to fit your space perfectly",
              },
              {
                title: "Select materials & finishes",
                description: "Pick from premium woods and finishes for your unique piece",
              },
            ].map((feature, i) => (
              <div key={i} className="bg-[#f9f8f6] p-6 rounded-lg">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-amber-800 font-bold">{i + 1}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button asChild size="lg" className="bg-black text-white hover:bg-black/90">
              <Link href="/builder">START DESIGNING</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-16 bg-[#f9f8f6]">
        <div className="container max-w-4xl">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0">
              <img src="/placeholder.svg?height=96&width=96" alt="Customer" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-lg italic mb-4">
                "We combine innovative design tools and cutting-edge production techniques to ensure each exclusive
                furniture piece is individual to you. Our trusted craftspeople are experts in their field and only use
                premium woods from sustainable European forestry."
              </p>
              <p className="font-semibold">Tim Smith, Founder</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
