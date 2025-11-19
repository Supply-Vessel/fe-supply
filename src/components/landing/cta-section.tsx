import { Button } from "@/src/components/ui/button"
import { ArrowRight, CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function CTASection() {
    const router = useRouter();
    return (
        <section className="py-20 bg-gradient-to-br from-[#2563EB] to-[#8B5CF6]">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="max-w-4xl mx-auto text-center text-white">
                    <h2 className="text-3xl lg:text-4xl font-bold mb-6">Ready to Transform Your Maritime Operations?</h2>
                    <p className="text-xl mb-8 opacity-90">
                        Join thousands of shipping companies already using ShipHub to optimize their fleet operations and supply chain management.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        <div className="flex items-center justify-center space-x-2">
                            <CheckCircle className="h-5 w-5 text-[#10B981]" />
                            <span>30-day free trial</span>
                        </div>
                        <div className="flex items-center justify-center space-x-2">
                            <CheckCircle className="h-5 w-5 text-[#10B981]" />
                            <span>No setup fees</span>
                        </div>
                        <div className="flex items-center justify-center space-x-2">
                            <CheckCircle className="h-5 w-5 text-[#10B981]" />
                            <span>24/7 support</span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button 
                            onClick={() => {
                                router.push('/signup');
                            }}
                            size="lg" 
                            className="bg-white text-[#2563EB] hover:bg-gray-100 px-8 py-3"
                        >
                            Start Free Trial
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                        <Button 
                            disabled
                            size="lg" 
                            variant="outline" 
                            className="border-white text-[#2563EB] hover:bg-white/10 px-8 py-3"
                        >
                            Schedule Demo
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}