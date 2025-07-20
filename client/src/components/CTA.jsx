import React from 'react'
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";

const CTA = () => {
      const benefits = [
    "30-day free trial",
    "No setup fees",
    "24/7 customer support",
    "Free data migration"
  ];
  return (
    <section className="py-16 lg:py-24 bg-gradient-hero relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-white/5 bg-[radial-gradient(circle_at_1px_1px,_white_1px,_transparent_0)] bg-[length:60px_60px]"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
            Ready to Transform Your Garage Operations?
          </h2>
          
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Join hundreds of successful garages using AutoHub to streamline operations, 
            increase efficiency, and boost profitability.
          </p>

          {/* Benefits */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12 max-w-3xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-2 text-primary-foreground/90">
                <CheckCircle className="h-5 w-5 text-garage-green flex-shrink-0" />
                <span className="text-sm">{benefit}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              variant="secondary" 
              size="lg" 
              className="group bg-background text-foreground hover:bg-background/90 shadow-elegant"
            >
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
            >
              Schedule a Demo
            </Button>
          </div>

          <p className="text-sm text-primary-foreground/70 mt-6">
            No credit card required • Cancel anytime • Get started in minutes
          </p>
        </div>
      </div>
    </section>
  )
}

export default CTA
