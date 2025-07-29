import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Star, Zap, Crown } from "lucide-react"
import { Link } from "react-router-dom"

const Pricing = () => {
  const pricingPlans = [
    {
      name: "Starter",
      price: "RF40,000",
      period: "/month",
      description: "Perfect for small garages just getting started",
      icon: Zap,
      features: [
        "Up to 50 vehicles/month",
        "Basic inventory management",
        "Standard quotations",
        "2 user accounts",
        "Email support",
        "Basic reports",
        "Mobile app access"
      ],
      recommended: false,
      buttonText: "Start Free Trial",
      buttonVariant: "outline"
    },
    {
      name: "Professional",
      price: "RF100,000",
      period: "/month",
      description: "Ideal for growing garages with multiple staff",
      icon: Star,
      features: [
        "Up to 200 vehicles/month",
        "Advanced inventory & alerts",
        "Custom quotation templates",
        "5 user accounts",
        "Priority support",
        "Advanced analytics",
        "Multi-location support",
        "API access",
        "Automated backups"
      ],
      recommended: true,
      buttonText: "Start Free Trial",
      buttonVariant: "cta"
    },
    {
      name: "Enterprise",
      price: "RF280,000",
      period: "/month",
      description: "For large operations with advanced needs",
      icon: Crown,
      features: [
        "Unlimited vehicles",
        "Full inventory management",
        "White-label quotations",
        "Unlimited users",
        "24/7 phone support",
        "Custom reports",
        "Multiple locations",
        "Advanced integrations",
        "Dedicated account manager",
        "On-premise deployment option"
      ],
      recommended: false,
      buttonText: "Contact Sales",
      buttonVariant: "outline"
    }
  ]

  return (
    <section id="pricing" className="py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Simple, Transparent{" "}
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              Pricing
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Choose the perfect plan for your garage. All plans include a 14-day free trial 
            with no credit card required.
          </p>
          <div className="flex justify-center">
            <Badge variant="secondary" className="px-4 py-2 text-sm">
              🎉 Save 20% with annual billing
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative group hover:shadow-card transition-all duration-300 hover:-translate-y-1 ${
                plan.recommended 
                  ? 'border-garage-green shadow-lg ring-2 ring-garage-green/20' 
                  : 'border-0 bg-gradient-card hover:shadow-glow'
              }`}
            >
              {plan.recommended && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-garage-green text-white px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-6">
                <div className="mx-auto w-12 h-12 bg-gradient-hero rounded-lg flex items-center justify-center mb-4">
                  <plan.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <CardDescription className="text-base mt-2">
                  {plan.description}
                </CardDescription>
                <div className="mt-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground text-lg">{plan.period}</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="h-5 w-5 text-garage-green mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="pt-4">
                  {plan.name === "Enterprise" ? (
                    <Button 
                      variant={plan.buttonVariant} 
                      className="w-full"
                      onClick={() => {
                        // Scroll to contact section
                        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
                      }}
                    >
                      {plan.buttonText}
                    </Button>
                  ) : (
                    <Link to="/register" className="block">
                      <Button variant={plan.buttonVariant} className="w-full">
                        {plan.buttonText}
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <h3 className="font-semibold text-lg mb-2">14-Day Free Trial</h3>
              <p className="text-muted-foreground text-sm">
                Try AutoHub risk-free for 14 days. No credit card required.
              </p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg mb-2">Cancel Anytime</h3>
              <p className="text-muted-foreground text-sm">
                No long-term contracts. Cancel or change your plan anytime.
              </p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg mb-2">24/7 Support</h3>
              <p className="text-muted-foreground text-sm">
                Get help when you need it with our dedicated support team.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Pricing
