export type DishOrderEntity = {
  id: number;
  guest_name: string;
  guest_phone: string;
  total: string;
  tax: string;
  service_fee: string;
  nett_price: string;
  payment_status?: string | null;
  payment_method?: string | null;
  created_at: Date;
  updated_at: Date;
};
