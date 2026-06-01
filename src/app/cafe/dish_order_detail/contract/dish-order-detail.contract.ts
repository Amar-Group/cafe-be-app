export type DishOrderDetailEntity = {
  id: number;
  dish_order_id: number;
  dish_id: number;
  quantity: number;
  notes: string | null;
  status: "pending" | "confirmed" | "preparing" | "completed" | "cancelled";
  created_at: Date;
  updated_at: Date;
};
