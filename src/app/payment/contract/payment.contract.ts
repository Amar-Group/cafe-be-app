export type PaymentEntity = {
  id: number;
  type: "dish_order" | "reservation";
  dish_order_id: number | null;
  reservation_id: number | null;
  method: "qris" | "bank_transfer" | "cash" | "ewallet" | "credit_card";
  provider: "midtrans" | "xendit" | "manual" | "cashier";
  transaction_id: string | null;
  gross_amount: string;
  status: "pending" | "paid" | "failed" | "expired" | "cancelled" | "refunded";
  url: string | null;
  snap_token: string | null;
  paid_at: Date | null;
  expired_at: Date | null;
  created_at: Date;
  updated_at: Date;
};
