export interface Establishment {
  id: string;
  name: string;
  slug: string;
  logo_url: string;
  whatsapp: string;
  created_at: string;
}

export interface Category {
  id: string;
  establishment_id: string;
  name: string;
  order: number;
  created_at: string;
}

export interface MenuItem {
  id: string;
  category_id: string;
  establishment_id: string;
  name: string;
  description: string;
  price: number;
  media_url: string;
  media_type: "image" | "video";
  thumbnail_url?: string;
  is_featured: boolean;
  is_available: boolean;
  order: number;
  created_at: string;
  // Extra media for horizontal detail view
  gallery?: string[];
}
