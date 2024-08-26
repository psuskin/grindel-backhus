// app/shop/[id]/page.tsx

import ProductDetails from "../../../../components/Products/ProductDetails";

export default function ProductDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="mt-36">
      <ProductDetails id={params.id} />
    </div>
  );
}
