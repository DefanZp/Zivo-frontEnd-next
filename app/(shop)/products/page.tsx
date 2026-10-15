import { Suspense } from "react";
import { Products } from "@/features/products/products";

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-5 py-12">
          Loading products...
        </div>
      }
    >
      <Products />
    </Suspense>
  );
}
