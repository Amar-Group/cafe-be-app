export type ReservationEntity = {
  id: number;
  billiard_table_id: number;
  guest_name: string;
  guest_phone: string;
  date: string;
  schedule_id: number;
  guest_count: number;
  notes: string | null;
  status: "pending" | "confirmed" | "preparing" | "completed" | "cancelled";
  created_at: Date;
  updated_at: Date;
};
