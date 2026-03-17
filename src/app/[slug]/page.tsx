import VerticalFeed from "@/components/feed/VerticalFeed";
import { mockEstablishment, mockCategories, mockItems } from "@/lib/mock-data";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function MenuPage({ params }: PageProps) {
  const { slug } = await params;

  // For now, use mock data. Later, fetch from Supabase by slug.
  if (slug !== mockEstablishment.slug) {
    notFound();
  }

  return (
    <VerticalFeed
      items={mockItems}
      categories={mockCategories}
      establishmentName={mockEstablishment.name}
    />
  );
}
