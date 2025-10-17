import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Product {
  id: string;
  name: string;
  description: string;
  base_price: number;
  image_url: string;
  category_id: string;
  variants: ProductVariant[];
}

interface ProductVariant {
  id: string;
  variant_name: string;
  price: number;
  is_available: boolean;
}

const Products = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("products")
        .select(`
          *,
          variants:product_variants(*)
        `)
        .eq("is_active", true);

      const categoryFilter = searchParams.get("category");
      if (categoryFilter) {
        const { data: category } = await supabase
          .from("categories")
          .select("id")
          .eq("slug", categoryFilter)
          .single();
        
        if (category) {
          query = query.eq("category_id", category.id);
        }
      }

      const { data, error } = await query;

      if (error) throw error;
      setProducts(data as Product[]);
    } catch (error: any) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (variantId: string, productId: string) => {
    if (!user) {
      toast.error("Please login to add items to cart");
      return;
    }

    try {
      const { error } = await supabase
        .from("cart_items")
        .upsert({
          user_id: user.id,
          product_id: productId,
          variant_id: variantId,
          quantity: 1,
        }, {
          onConflict: "user_id,variant_id"
        });

      if (error) throw error;

      toast.success("Added to cart!");
      setSelectedProduct(null);
    } catch (error: any) {
      toast.error("Failed to add to cart");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-20 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Our Chocolate Collection</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square bg-secondary relative overflow-hidden">
                {product.image_url && (
                  <img 
                    src={product.image_url} 
                    alt={product.name}
                    className="object-cover w-full h-full"
                  />
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-lg font-bold text-primary">
                    From ₹{product.base_price}
                  </p>
                  <Button
                    onClick={() => setSelectedProduct(product)}
                    size="sm"
                  >
                    View Options
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedProduct?.name}</DialogTitle>
            <DialogDescription>{selectedProduct?.description}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="font-semibold">Select Size/Option:</p>
            {selectedProduct?.variants.map((variant) => (
              <div key={variant.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{variant.variant_name}</p>
                  <p className="text-sm text-muted-foreground">₹{variant.price}</p>
                </div>
                <Button
                  onClick={() => addToCart(variant.id, selectedProduct.id)}
                  disabled={!variant.is_available}
                >
                  Add to Cart
                </Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Products;