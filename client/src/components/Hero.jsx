import React from 'react'
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import heroImage from "@/assets/garage-hero.png";
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="pt-20 lg:pt-32 pb-16 lg:pb-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="animate-fade-in">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="block">Streamline Your</span>
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                Garage Operations
              </span>
            </h1>
            
            <p className="mt-6 text-xl text-muted-foreground max-w-2xl">
              Complete garage management system with multi-role access for receptionists, 
              mechanics, accountants, managers, and admins. Track cars, manage inventory, 
              handle quotations, and monitor finances - all in one platform.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link to="/register">
                <Button variant="hero" size="lg" className="group">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

              <Button variant="outline" size="lg" className="group">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-8">
              <div>
                <div className="text-3xl font-bold text-garage-green">500+</div>
                <div className="text-sm text-muted-foreground">Active Garages</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-garage-green">50K+</div>
                <div className="text-sm text-muted-foreground">Cars Managed</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-garage-green">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="animate-slide-in-right">
            <div className="relative">
              <img
                src={heroImage}
                alt="Modern garage workshop"
                className="w-full h-auto rounded-2xl shadow-elegant"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-garage-blue/20 to-garage-green/20 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
