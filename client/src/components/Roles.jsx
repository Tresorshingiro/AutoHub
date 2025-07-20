import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  UserCheck, 
  Wrench, 
  Calculator, 
  Crown, 
  Shield,
  Phone,
  ClipboardCheck,
  TrendingUp
} from "lucide-react";

const Roles = () => {
    const roles = [
    {
      icon: Phone,
      title: "Receptionist",
      description: "Manage customer interactions, appointments, and front desk operations",
      permissions: ["Customer Management", "Appointment Scheduling", "Basic Reporting", "Phone Support"],
      color: "bg-blue-500/10 text-blue-700",
    },
    {
      icon: Wrench,
      title: "Mechanic",
      description: "Access vehicle diagnostics, service records, and work order management",
      permissions: ["Vehicle Diagnostics", "Service Records", "Work Orders", "Inventory Access"],
      color: "bg-green-500/10 text-green-700",
    },
    {
      icon: Calculator,
      title: "Accountant",
      description: "Handle financial tracking, invoicing, and expense management",
      permissions: ["Financial Reports", "Invoice Management", "Expense Tracking", "Tax Reports"],
      color: "bg-purple-500/10 text-purple-700",
    },
    {
      icon: TrendingUp,
      title: "Manager",
      description: "Oversee operations, staff management, and performance analytics",
      permissions: ["Staff Management", "Performance Analytics", "Operations Control", "Strategic Planning"],
      color: "bg-orange-500/10 text-orange-700",
    },
    {
      icon: Crown,
      title: "Admin",
      description: "Full system access with complete control over all operations",
      permissions: ["System Configuration", "User Management", "All Reports", "Security Settings"],
      color: "bg-red-500/10 text-red-700",
    },
  ];
  return (
    <section id="roles" className="py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Built for{" "}
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              Every Role
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Tailored access and functionality for each team member, ensuring everyone 
            has the right tools and permissions for their responsibilities.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {roles.map((role, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-elegant transition-all duration-300 hover:-translate-y-2"
            >
              <CardHeader>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 rounded-lg bg-gradient-hero">
                    <role.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl">{role.title}</CardTitle>
                </div>
                <CardDescription className="text-base">
                  {role.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-foreground mb-3">Key Permissions:</h4>
                  <div className="flex flex-wrap gap-2">
                    {role.permissions.map((permission, permIndex) => (
                      <Badge 
                        key={permIndex} 
                        variant="secondary"
                        className="text-xs"
                      >
                        {permission}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-2 bg-muted/50 rounded-full px-6 py-3">
            <Shield className="h-5 w-5 text-garage-green" />
            <span className="text-sm font-medium">
              Secure role-based access ensures data protection and operational efficiency
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Roles
