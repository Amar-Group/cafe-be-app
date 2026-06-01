export type DishEntity = {
  id: number;
  dish_category_id: number;
  name: string;
  slug: string;
  description: string | null;
  price: string;
  thumbnail: string | null;
  thumbnail_public_id: string | null;
  is_available: boolean;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
};
