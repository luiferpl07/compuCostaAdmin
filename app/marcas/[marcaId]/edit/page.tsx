import ProductForm from "@/components/forms/product-form";

interface Props {
  params: {
    productId: string;
  };
}

export default async function EditProductPage({ params }: Props) {
  // Aquí puedes obtener los datos del producto para editar
  const product = await fetch(`/api/products/${params.productId}`).then(res => res.json());
  
  return <ProductForm initialData={product} />;
}