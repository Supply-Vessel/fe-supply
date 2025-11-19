import { Ship, Mail, Phone, MapPin } from 'lucide-react'

export function Footer() {
    const footerLinks = {
        product: [
            { name: "Features", href: "#" },
            { name: "Pricing", href: "#" },
            { name: "Security", href: "#" },
            { name: "Integrations", href: "#" },
        ],
        company: [
            { name: "About Us", href: "#" },
            { name: "Careers", href: "#" },
            { name: "Press", href: "#" },
            { name: "Contact", href: "#" },
        ],
        resources: [
            { name: "Documentation", href: "#" },
            { name: "Help Center", href: "#" },
            { name: "Webinars", href: "#" },
            { name: "Blog", href: "#" },
        ],
        legal: [
            { name: "Privacy Policy", href: "#" },
            { name: "Terms of Service", href: "#" },
            { name: "GDPR", href: "#" },
            { name: "Compliance", href: "#" },
        ],
    }

    return (
        <footer className="bg-gray-900 text-white">
            <div className="container mx-auto px-4 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
                    {/* Company Info */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="p-2 bg-[#2563EB] rounded-lg">
                                <Ship className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold">ShipHub</span>
                        </div>
                        <p className="text-gray-400 mb-6 leading-relaxed">
                            The leading platform for maritime supply management and fleet operations, helping shipping companies worldwide optimize their logistics and improve operational efficiency.
                        </p>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                                <Mail className="h-4 w-4 text-gray-400" />
                                <span className="text-gray-400">contact@shiphub.com</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Phone className="h-4 w-4 text-gray-400" />
                                <span className="text-gray-400">+1 (555) 123-4567</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <MapPin className="h-4 w-4 text-gray-400" />
                                <span className="text-gray-400">Rotterdam, Netherlands</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer Links */}
                    <div>
                        <h3 className="font-semibold mb-4">Product</h3>
                        <ul className="space-y-2">
                            {footerLinks.product.map((link) => (
                                <li key={link.name}>
                                    <a href={link.href} className="text-gray-400 hover:text-white transition-colors">
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Company</h3>
                        <ul className="space-y-2">
                            {footerLinks.company.map((link) => (
                                <li key={link.name}>
                                    <a href={link.href} className="text-gray-400 hover:text-white transition-colors">
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Resources</h3>
                        <ul className="space-y-2">
                            {footerLinks.resources.map((link) => (
                                <li key={link.name}>
                                    <a href={link.href} className="text-gray-400 hover:text-white transition-colors">
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Legal</h3>
                        <ul className="space-y-2">
                            {footerLinks.legal.map((link) => (
                                <li key={link.name}>
                                    <a href={link.href} className="text-gray-400 hover:text-white transition-colors">
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-12 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-400 text-sm">© 2025 ShipHub. All rights reserved.</p>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                                Privacy
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                                Terms
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                                Cookies
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
