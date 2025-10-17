import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import heroImage from "@/assets/hero-chocolate.jpg";
import { Instagram, Phone } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const categories = [
    { name: "Kunafa Special", slug: "kunafa-special", desc: "Exotic Middle Eastern fusion" },
    { name: "Classic Bars", slug: "classic-bars", desc: "Timeless chocolate perfection" },
    { name: "Signature Blends", slug: "signature-blends", desc: "Unique flavor combinations" },
    { name: "Inspired Bars", slug: "inspired-bars", desc: "Creative chocolate creations" },
    { name: "Premium Collection", slug: "premium-collection", desc: "Luxurious indulgence" },
    { name: "Special Bars", slug: "special-bars", desc: "Artisanal delights" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70" />
        </div>
        
        <div className="relative z-10 text-center text-primary-foreground px-4 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            One Bite & You'll Melt into Bliss!
          </h1>
          <p className="text-xl md:text-2xl mb-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Handcrafted chocolates made with love and finest ingredients
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate("/products")}
            className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-8 py-6 animate-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            Shop Now
          </Button>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Our Collections</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Card 
                key={category.slug}
                className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group border-2 hover:border-primary"
                onClick={() => navigate(`/products?category=${category.slug}`)}
              >
                <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <p className="text-muted-foreground">{category.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-6">Ready to Experience Bliss?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Explore our complete collection of handcrafted chocolates and find your perfect indulgence
          </p>
          <Button 
            size="lg"
            onClick={() => navigate("/products")}
            className="text-lg px-8 py-6"
          >
            View All Products
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">D's Choco Bliss</h3>
          <div className="flex items-center justify-center space-x-6 mb-4">
            <a href="tel:+919023974421" className="flex items-center space-x-2 hover:text-accent transition-colors">
              <Phone className="h-5 w-5" />
              <span>+91 90239 74421</span>
            </a>
            <a 
              href="https://www.instagram.com/D_CHOCO_BLISS" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 hover:text-accent transition-colors"
            >
              <Instagram className="h-5 w-5" />
              <span>@D_CHOCO_BLISS</span>
            </a>
          </div>
          <p className="text-sm opacity-80">
            © 2025 D's Choco Bliss. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;