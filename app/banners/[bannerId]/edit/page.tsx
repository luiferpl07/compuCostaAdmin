import BannerForm from "@/components/forms/banner-form";

interface Props {
  params: {
    bannerId: string; // Cambia esto para que coincida con el nombre del parámetro
  };
}

export default async function EditBannerPage({ params }: Props) {
  console.log("Params:", params); // Para depuración

  if (!params.bannerId) {
    console.error("El ID del banner no está definido");
    return <div>Error: El ID del banner no está disponible.</div>;
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"; // Base URL
    const response = await fetch(`${baseUrl}/api/banners/${params.bannerId}`);
    
    if (!response.ok) {
      console.error(`Error al obtener el banner: ${response.statusText}`);
      return <div>Error al cargar los datos del banner.</div>;
    }

    const banner = await response.json();
    return <BannerForm key={banner.id} initialData={banner} />;
  } catch (error) {
    console.error("Error al obtener los datos del banner:", error);
    return <div>Error al cargar los datos del banner.</div>;
  }
}
