import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Car, 
  DollarSign, 
  Receipt, 
  Package, 
  BarChart3, 
  Users, 
  Shield, 
  Clock 
} from "lucide-react";

const Features = () => {
    const features = [
    {
      icon: Car,
      title: "Vehicle Management",
      description: "Complete car records, service history, and maintenance tracking in one centralized system.",
    },
    {
      icon: DollarSign,
      title: "Financial Tracking",
      description: "Monitor income and expenses with detailed reporting and real-time financial insights.",
    },
    {
      icon: Receipt,
      title: "Smart Quotations",
      description: "Generate professional quotes instantly with customizable templates and pricing.",
    },
    {
      icon: Package,
      title: "Inventory Control",
      description: "Track parts, tools, and supplies with automated reorder alerts and supplier management.",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Comprehensive dashboards and reports to optimize your garage performance.",
    },
    {
      icon: Users,
      title: "Multi-Role Access",
      description: "Role-based permissions for receptionists, mechanics, accountants, managers, and admins.",
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Enterprise-grade security with automatic backups and 99.9% uptime guarantee.",
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Round-the-clock customer support to keep your operations running smoothly.",
    },
  ];

  return (
    <section id="features" className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Everything You Need to{" "}
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              Manage Your Garage
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From vehicle tracking to financial management, AutoHub provides all the tools 
            your garage needs to operate efficiently and profitably.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-card transition-all duration-300 hover:-translate-y-1 border-0 bg-gradient-card hover:shadow-glow"
            >
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-gradient-hero rounded-lg flex items-center justify-center mb-4 group-hover:animate-float transition-transform duration-300">
                  <feature.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-lg group-hover:text-garage-green transition-colors duration-300">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features