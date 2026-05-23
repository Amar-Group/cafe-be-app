export type BilliardTableEntity = {
  id: number;
  table_type_id: number;
  name: string;
  slug: string;
  price: string;
  thumbnail: string | null;
  thumbnail_public_id: string | null;
  is_available: boolean;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
};
