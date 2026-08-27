export interface Artwork {
  id: number;
  title: string;
  title_en?: string | null;
  artist_name?: string | null;
  price: number;
  category?: string | null;
  medium?: string | null;
  size_cm?: string | null;
  description?: string | null;
  description_en?: string | null;
  status: 'available' | 'sold' | 'reserved';
  stock: number;
  created_year?: number | null;
  tags?: string[] | null;
  image_filename?: string | null;
  image_url?: string | null;
  created_at?: string | null;
}

export interface Order {
  id: string;
  artwork_id: number;
  artwork?: Artwork;
  buyer_name: string;
  buyer_email: string;
  buyer_phone?: string | null;
  amount: number;
  payment_key?: string | null;
  status: 'pending' | 'paid' | 'cancelled';
  created_at?: string | null;
}
