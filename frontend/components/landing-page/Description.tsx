import { CheckCircle2 } from "lucide-react";
import React from "react";

function Description() {
  return (
    <section className="bg-muted/40 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Why Choose FlowDesk?
          </h2>
          <p className="text-xl text-muted-foreground">
            Enterprise-grade features at a fraction of the cost
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              title: "Multi-Tenant Architecture",
              desc: "Perfect for agencies and resellers. Manage multiple businesses from one platform.",
            },
            {
              title: "Role-Based Access Control",
              desc: "Granular permissions system ensures data security and proper access management.",
            },
            {
              title: "Real-Time Analytics",
              desc: "Make data-driven decisions with comprehensive dashboards and custom reports.",
            },
            {
              title: "Mobile Ready",
              desc: "Responsive design works seamlessly on mobile, tablet, and desktop devices.",
            },
            {
              title: "Cloud Hosted",
              desc: "No installation required. Access your data anywhere with enterprise-grade security.",
            },
            {
              title: "API First Design",
              desc: "Integrate with your existing tools via our comprehensive REST API.",
            },
          ].map((item, idx) => (
            <div key={idx} className="flex gap-4">
              <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  {item.title}
                </h4>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Description;
