import { Card, CardContent } from "@/src/components/ui/card"
import { Star } from 'lucide-react'

const testimonials = [
    {
        name: "Captain James Morrison",
        role: "Fleet Captain",
        institution: "Atlantic Shipping Lines",
        content:
        "ShipHub has revolutionized how we manage our fleet operations. The real-time tracking and maintenance scheduling features have improved our efficiency by 40% and reduced unexpected downtime.",
        rating: 5,
    },
    {
        name: "Dr. Elizabeth Chen",
        role: "Operations Director",
        institution: "Pacific Marine Logistics",
        content:
        "The compliance reporting features are outstanding. We've reduced our regulatory audit preparation time from weeks to days, and the automated documentation is incredibly thorough and accurate.",
        rating: 5,
    },
    {
        name: "Robert Williams",
        role: "Supply Chain Manager",
        institution: "Global Shipping Solutions",
        content:
        "As a logistics manager overseeing multiple vessels, ShipHub gives me the centralized view I need. The inventory alerts have helped us maintain optimal supply levels and reduce costs significantly.",
        rating: 5,
    },
]

export function TestimonialsSection() {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                        Trusted by Leading Shipping Companies
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        See how ShipHub is helping shipping companies and maritime operators worldwide optimize their operations and reduce costs.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <Card key={index} className="border border-gray-200">
                            <CardContent className="p-6">
                                <div className="flex items-center mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="h-5 w-5 text-[#F59E0B] fill-current" />
                                    ))}
                                </div>
                                <blockquote className="text-gray-700 mb-6 leading-relaxed">"{testimonial.content}"</blockquote>
                                <div>
                                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                                    <div className="text-sm text-[#2563EB]">{testimonial.institution}</div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
