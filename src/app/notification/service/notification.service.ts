import { sendWhatsAppMessage } from "../../../lib/fonnte";
import { DishOrderReadRepository } from "../../cafe/dish_order/repository/dish-order-read.repository";
import { ReservationReadRepository } from "../../billiard/reservation/repository/reservation-read.repository";

export class NotificationService {
  static formatIDR(amount: number | string) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(Number(amount));
  }

  static async sendPaymentSuccessNotification(
    paymentType: "dish_order" | "reservation",
    referenceId: number
  ) {
    try {
      if (paymentType === "dish_order") {
        const dishOrder = await DishOrderReadRepository.getById(referenceId);
        if (!dishOrder) return;

        const details = await DishOrderReadRepository.getOrderDetailsWithDish(referenceId);
        
        let itemsList = "";
        details.forEach((item) => {
          itemsList += `- ${item.quantity}x ${item.dish_name || "Unknown Item"}\n`;
        });

        const message = 
`Halo *${dishOrder.guest_name}*,
Pembayaran pesanan kuliner Anda telah kami terima!

*Ringkasan Pesanan:*
${itemsList}
Subtotal: ${this.formatIDR(dishOrder.total)}
Total (inc. Tax & Service): *${this.formatIDR(dishOrder.nett_price)}*

Pesanan Anda segera disiapkan/diantarkan.
Terima kasih telah memesan di *Savoria Cafe*!`;

        await sendWhatsAppMessage(dishOrder.guest_phone, message);

      } else if (paymentType === "reservation") {
        const reservation = await ReservationReadRepository.getById(referenceId);
        if (!reservation) return;

        const dateObj = new Date(reservation.date);
        const dateString = dateObj.toLocaleDateString("id-ID", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        
        const startTime = reservation.schedule?.start_time?.slice(0, 5) || "";
        const endTime = reservation.schedule?.end_time?.slice(0, 5) || "";

        const message = 
`Halo *${reservation.guest_name}*,
Reservasi Anda berhasil dikonfirmasi!

*Detail Reservasi:*
Layanan: Billiard
Meja: ${reservation.billiard_table?.name || "Unknown"}
Tanggal: ${dateString}
Jam: ${startTime} - ${endTime}
Total Pembayaran: *${this.formatIDR(reservation.billiard_table?.price || 0)}*

Harap datang tepat waktu.
Terima kasih telah memesan di *Savoria Cafe*!`;

        await sendWhatsAppMessage(reservation.guest_phone, message);
      }
    } catch (error) {
      console.error("Failed to send payment success notification:", error);
    }
  }
}
