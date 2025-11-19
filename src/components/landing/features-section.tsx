import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Activity, Calendar, FileText, Heart, Shield, Users, BarChart3, Bell, Database, Anchor, ClipboardList, Settings } from 'lucide-react'

const features = [
    {
        icon: Activity,
        title: "Real-time Tracking",
        description: "Monitor vessel location, fuel consumption, and operational status with continuous tracking and automated alerts.",
        color: "#10B981",
    },
    {
        icon: Calendar,
        title: "Supply Scheduling",
        description: "Comprehensive supply chain scheduling, delivery route planning, and port management coordination.",
        color: "#2563EB",
    },
    {
        icon: FileText,
        title: "Compliance Documentation",
        description: "Automated regulatory compliance reports and documentation for international maritime requirements.",
        color: "#8B5CF6",
    },
    {
        icon: Heart,
        title: "Maintenance Tracking",
        description: "Monitor vessel maintenance, equipment repair schedules, and preventive maintenance with detailed records.",
        color: "#EF4444",
    },
    {
        icon: Shield,
        title: "Data Security",
        description: "Enterprise-grade security with encrypted data storage and role-based access controls for maritime operations.",
        color: "#64748B",
    },
    {
        icon: Users,
        title: "Team Collaboration",
        description: "Multi-user access with customizable permissions for captains, crew, operators, and shore management.",
        color: "#F59E0B",
    },
    {
        icon: BarChart3,
        title: "Analytics Dashboard",
        description: "Comprehensive analytics and insights to optimize fleet operations and reduce operational costs.",
        color: "#2563EB",
    },
    {
        icon: Bell,
        title: "Smart Notifications",
        description: "Intelligent alerts for fuel levels, maintenance due dates, supply deliveries, and port schedules.",
        color: "#10B981",
    },
    {
        icon: Database,
        title: "Data Integration",
        description: "Seamless integration with vessel equipment, port systems, and existing logistics management systems.",
        color: "#8B5CF6",
    },
    {
        icon: Anchor,
        title: "Maritime Protocols",
        description: "Standardized protocols for different vessel types with customizable operational procedures.",
        color: "#EF4444",
    },
    {
        icon: ClipboardList,
        title: "Inventory Management",
        description: "Track supplies, fuel reserves, spare parts, and materials with automated reorder notifications.",
        color: "#F59E0B",
    },
    {
        icon: Settings,
        title: "Customizable Workflows",
        description: "Adapt the system to your fleet's specific needs with flexible configuration options.",
        color: "#64748B",
    },
]

export function FeaturesSection() {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                        Everything You Need for Maritime Supply Management
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        ShipHub provides comprehensive tools to streamline your supply chain and fleet operations while ensuring regulatory compliance and operational efficiency.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <Card key={index} className="border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                            <CardHeader>
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 rounded-lg" style={{ backgroundColor: `${feature.color}15` }}>
                                        <feature.icon className="h-6 w-6" style={{ color: feature.color }} />
                                    </div>
                                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-gray-600 leading-relaxed">{feature.description}</CardDescription>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
