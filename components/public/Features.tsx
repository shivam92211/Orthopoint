import { Shield, Award, Headphones, Truck, CheckCircle, FileCheck } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Quality Certified",
    description: "ISO 13485 certified surgical instruments meeting international medical standards",
    color: "bg-secondary/10 text-secondary",
  },
  {
    icon: Award,
    title: "20+ Years Experience",
    description: "Trusted by healthcare professionals worldwide for precision and reliability",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: CheckCircle,
    title: "100% Authentic",
    description: "Genuine products from verified manufacturers with quality guarantees",
    color: "bg-secondary/10 text-secondary",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Quick and secure shipping to hospitals and clinics across the country",
    color: "bg-accent/10 text-accent",
  },
  {
    icon: Headphones,
    title: "Expert Support",
    description: "Dedicated customer service and technical assistance for all products",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: FileCheck,
    title: "Complete Documentation",
    description: "All necessary certifications and documentation provided with every order",
    color: "bg-secondary/10 text-secondary",
  },
];

export default function Features() {
  return (
    <section className="py-16 md:py-24 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-block bg-secondary/10 text-secondary font-semibold text-sm px-4 py-2 rounded-full mb-4">
            WHY CHOOSE US
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Your Trusted Partner in Medical Equipment
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Professional surgical instruments and medical supplies backed by quality certifications and expert support
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-border group"
              >
                <div className={`inline-flex p-3 rounded-lg ${feature.color} mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Stats Bar */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-border">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">5000+</div>
              <div className="text-muted-foreground">Products</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-secondary mb-2">1000+</div>
              <div className="text-muted-foreground">Happy Clients</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">20+</div>
              <div className="text-muted-foreground">Years Exp.</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-secondary mb-2">100%</div>
              <div className="text-muted-foreground">Authentic</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
