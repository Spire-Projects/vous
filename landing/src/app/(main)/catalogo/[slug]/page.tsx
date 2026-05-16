import { ProductGallery } from "@/components/producto/ProductGallery";
import { ProductInfo } from "@/components/producto/ProductInfo";
import { RelatedProducts } from "@/components/producto/RelatedProducts";

export default function ProductoPage() {
  return (
    <div className="bg-vous-warm-white min-h-screen">
      <div className="max-w-[1440px] mx-auto px-5 md:px-20 py-12 md:py-16">
        {/* Main product section */}
        <div className="flex flex-col md:flex-row gap-10 lg:gap-20 mb-16">
          <ProductGallery />
          <ProductInfo />
        </div>

        {/* Related products */}
        <RelatedProducts />
      </div>
    </div>
  );
}
