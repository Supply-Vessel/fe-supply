import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { CheckCircle, Users, Anchor, UserCheck, Shield } from 'lucide-react'

const benefits = {
    captains: [
        "Real-time vessel monitoring and control",
        "Automated safety compliance tracking",
        "Weather and route optimization",
        "Integrated crew management",
        "Comprehensive operational reporting",
        "Mobile access for bridge operations",
    ],
    operators: [
        "Centralized fleet management",
        "Automated maintenance alerts",
        "Fuel consumption tracking",
        "Preventive maintenance scheduling",
        "Regulatory compliance documentation",
        "Multi-vessel operation management",
    ],
    managers: [
        "Complete fleet oversight",
        "Resource allocation optimization",
        "Compliance audit preparation",
        "Cost tracking and budgeting",
        "Performance monitoring",
        "Institutional reporting",
    ],
    technicians: [
        "Simplified maintenance workflows",
        "Mobile-friendly task management",
        "Automated inspection schedules",
        "Quick status updates",
        "Equipment service tracking",
        "Training module access",
    ],
}

export function BenefitsSection() {
    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                        Designed for Every Role in Your Fleet
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        ShipHub adapts to the unique needs of each team member, from captains to technicians, ensuring everyone has the tools they need to excel.
                    </p>
                </div>

                <Tabs defaultValue="captains" className="max-w-4xl mx-auto">
                    <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-8">
                        <TabsTrigger value="captains" className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span className="hidden sm:inline">Captains</span>
                        </TabsTrigger>
                        <TabsTrigger value="operators" className="flex items-center gap-2">
                            <Anchor className="h-4 w-4" />
                            <span className="hidden sm:inline">Operators</span>
                        </TabsTrigger>
                        <TabsTrigger value="managers" className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            <span className="hidden sm:inline">Managers</span>
                        </TabsTrigger>
                        <TabsTrigger value="technicians" className="flex items-center gap-2">
                            <UserCheck className="h-4 w-4" />
                            <span className="hidden sm:inline">Technicians</span>
                        </TabsTrigger>
                    </TabsList>

                    {Object.entries(benefits).map(([role, benefitList]) => (
                        <TabsContent key={role} value={role}>
                            <Card>
                                <CardHeader className="text-center">
                                    <CardTitle className="text-2xl capitalize">{role}</CardTitle>
                                    <CardDescription className="text-lg">
                                        Specialized tools and features designed for {role}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {benefitList.map((benefit, index) => (
                                            <div key={index} className="flex items-center space-x-3">
                                                <CheckCircle className="h-5 w-5 text-[#10B981] flex-shrink-0" />
                                                <span className="text-gray-700">{benefit}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
        </section>
    )
}
