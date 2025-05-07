import Link from "next/link"
import { Mail, Phone } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function HelpPage() {
  // FAQ items
  const faqItems = [
    {
      question: "How does the furniture builder work?",
      answer:
        "Our furniture builder allows you to customize furniture by selecting the type, dimensions, materials, and additional features. You can see your design in real-time with our 3D preview tool, adjust it until it's perfect, and then place your order.",
    },
    {
      question: "What materials do you use?",
      answer:
        "We use high-quality, sustainable woods including oak, walnut, pine, maple, and cherry. All our wood is sourced from responsibly managed forests with proper certification.",
    },
    {
      question: "How long does delivery take?",
      answer:
        "Delivery times vary based on your location and the complexity of your furniture. Typically, custom pieces take 3-4 weeks for production plus delivery time. Standard designs may ship faster.",
    },
    {
      question: "Can I save my design and come back later?",
      answer:
        "Yes! You can save your design by clicking the 'Save' button in the builder. You'll receive a unique link that you can use to return to your design at any time.",
    },
    {
      question: "Do you offer assembly services?",
      answer:
        "Yes, we offer professional assembly services for an additional fee. You can select this option during checkout.",
    },
    {
      question: "What is your return policy?",
      answer:
        "For standard items, we offer a 30-day return policy. For custom-designed furniture, we cannot accept returns unless there's a manufacturing defect. We recommend reviewing your design carefully before placing an order.",
    },
  ]

  return (
    <div className="container py-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Services & Help</h1>

        {/* Contact Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-gray-600 mt-0.5" />
                <div>
                  <p className="font-medium">Phone Support</p>
                  <p className="text-gray-600">0330 808 4870</p>
                  <p className="text-sm text-gray-500">Mon-Fri: 9am-6pm</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-gray-600 mt-0.5" />
                <div>
                  <p className="font-medium">Email Support</p>
                  <p className="text-gray-600">support@furniturebuilder.com</p>
                  <p className="text-sm text-gray-500">We respond within 24 hours</p>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <Button asChild className="w-full">
                <Link href="#">Schedule a Consultation</Link>
              </Button>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Our Services</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <svg className="h-5 w-5 text-green-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Custom furniture design</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="h-5 w-5 text-green-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Professional delivery</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="h-5 w-5 text-green-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Assembly service</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="h-5 w-5 text-green-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Design consultation</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="h-5 w-5 text-green-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>5-year warranty</span>
              </li>
            </ul>
            <div className="mt-6">
              <Button asChild variant="outline" className="w-full">
                <Link href="#">Learn More About Our Services</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* CTA Section */}
        <div className="bg-gray-100 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-semibold mb-4">Ready to Design Your Perfect Furniture?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Start creating your custom furniture piece today with our easy-to-use 3D builder tool. No design experience
            needed!
          </p>
          <Button asChild size="lg" className="bg-black text-white hover:bg-black/90">
            <Link href="/builder">Start Designing Now</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
