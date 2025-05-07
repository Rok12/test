import Link from "next/link"
import { Phone } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-100 border-t">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold text-lg mb-4">About Us</h3>
            <p className="text-gray-600 text-sm">
              We create bespoke furniture tailored to your needs, using sustainable materials and expert craftsmanship.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <Phone className="h-4 w-4" />
              <span>0330 808 4870</span>
            </div>
            <p className="text-sm text-gray-600">Free one-to-one consultation</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/gallery" className="text-gray-600 hover:text-gray-900">
                  Shop for furniture
                </Link>
              </li>
              <li>
                <Link href="/builder" className="text-gray-600 hover:text-gray-900">
                  Design your own
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-gray-600 hover:text-gray-900">
                  Services & Help
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-8 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Furniture Builder. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
