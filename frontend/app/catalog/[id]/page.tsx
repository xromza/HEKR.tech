import { getProduct } from "@/app/lib/Product";
import ProductGallery from "@/components/ProductGallery";
import ProductForm from "@/components/ProductForm"; 

export default async function CardPage({
  params,
}: { params: Promise<{ id: string }>; }) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    //return <div></div>
    return <div className="w-full flex justify-center items-center">Товар не найден</div>
  }

  const allImages = product.variants.flatMap(v => v.images);
  const mainImage = {
    id: 0,
    url: product.mainImageUrl,
    type: 'MAIN' as const,
    sortOrder: 0,
    createdAt: ''
  };
  
  const uniqueImages = [mainImage, ...allImages].filter(
    (img, index, self) => index === self.findIndex((t) => t.url === img.url)
  );

  return (
    <div className="w-full flex flex-col items-center mx-auto max-w-[1920px] px-4 md:px-15">
      <div className="w-full flex flex-col lg:flex-row gap-12 xl:gap-40 py-10">
        
        <div className="w-full lg:flex-1">
          <ProductGallery images={uniqueImages} title={product.title} />
        </div>

        <ProductForm product={product} />
        
      </div>
    </div>
  );
}