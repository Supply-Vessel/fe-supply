import { Button } from "@/src/components/ui/button"
import { ArrowRight, Shield, Users, BarChart3 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function HeroSection() {
    const router = useRouter();
    return (
        <section className="relative bg-gradient-to-br from-[#2563EB]/5 to-[#8B5CF6]/5 py-20 lg:py-32">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-gray-900">
                                Advanced Maritime Supply Management
                            </h1>
                            <p className="text-xl text-gray-600 leading-relaxed">
                                Streamline your maritime operations with ShipHub - the comprehensive platform for managing ship supplies, inventory, and logistics with precision and efficiency.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button 
                                onClick={() => {
                                    router.push('/signup');
                                }}
                                size="lg" 
                                className="bg-[#2563EB] hover:bg-[#2563EB]/90 text-white px-8 py-3"
                            >
                                Start Free Trial
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                            <Button
                                disabled
                                size="lg"
                                variant="outline"
                                className="border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB]/5 px-8 py-3"
                            >
                                Watch Demo
                            </Button>
                        </div>

                        <div className="grid grid-cols-3 gap-8 pt-8">
                            <div className="text-center">
                                <div className="flex justify-center mb-2">
                                    <Shield className="h-8 w-8 text-[#10B981]" />
                                </div>
                                <div className="text-2xl font-bold text-gray-900">99.9%</div>
                                <div className="text-sm text-gray-600">Uptime Guarantee</div>
                            </div>
                            <div className="text-center">
                                <div className="flex justify-center mb-2">
                                    <Users className="h-8 w-8 text-[#2563EB]" />
                                </div>
                                <div className="text-2xl font-bold text-gray-900">1000+</div>
                                <div className="text-sm text-gray-600">Shipping Companies</div>
                            </div>
                            <div className="text-center">
                                <div className="flex justify-center mb-2">
                                    <BarChart3 className="h-8 w-8 text-[#8B5CF6]" />
                                </div>
                                <div className="text-2xl font-bold text-gray-900">50K+</div>
                                <div className="text-sm text-gray-600">Vessels Managed</div>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-gray-900">Supply Overview</h3>
                                    <div className="flex space-x-2">
                                        <div className="w-3 h-3 bg-[#10B981] rounded-full"></div>
                                        <div className="w-3 h-3 bg-[#F59E0B] rounded-full"></div>
                                        <div className="w-3 h-3 bg-[#EF4444] rounded-full"></div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-2 h-2 bg-[#10B981] rounded-full"></div>
                                            <span className="text-sm font-medium">Fuel & Lubricants</span>
                                        </div>
                                        <span className="text-sm text-gray-600">892 active</span>
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-2 h-2 bg-[#2563EB] rounded-full"></div>
                                            <span className="text-sm font-medium">Equipment & Parts</span>
                                        </div>
                                        <span className="text-sm text-gray-600">1,245 active</span>
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-2 h-2 bg-[#8B5CF6] rounded-full"></div>
                                            <span className="text-sm font-medium">Spare Parts</span>
                                        </div>
                                        <span className="text-sm text-gray-600">3,087 active</span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-200">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Stock Status</span>
                                        <span className="font-medium text-[#10B981]">98.2% In Stock</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}