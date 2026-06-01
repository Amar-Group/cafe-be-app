import {
  CreatePaymentRequestDto,
  UpdatePaymentRequestDto,
} from "../dto/payment-request.dto";
import { PaymentResponseDto } from "../dto/payment-response.dto";
import { PaymentReadRepository } from "../repository/payment-read.repository";
import { PaymentWriteRepository } from "../repository/payment-write.repository";
import { snap } from "../../../lib/midtrans";
import { DishOrderWriteRepository } from "../../cafe/dish_order/repository/dish-order-write.repository";
import { ReservationWriteRepository } from "../../billiard/reservation/repository/reservation-write.repository";
import { NotificationService } from "../../notification/service/notification.service";

export class PaymentService {
  static async getAll() {
    return PaymentReadRepository.getAll();
  }

  static async getById(id: number) {
    return PaymentReadRepository.getById(id);
  }

  static async create(payload: CreatePaymentRequestDto) {
    // Transform string dates to Date objects if provided
    const data: any = {
      ...payload,
      paid_at: payload.paid_at ? new Date(payload.paid_at) : null,
      expired_at: payload.expired_at ? new Date(payload.expired_at) : null,
    };

    if (payload.method === "cash") {
      data.status = "paid";
      data.paid_at = new Date();
    } else {
      if (payload.dish_order_id) {
        const existingPending = await PaymentReadRepository.getPendingByDishOrderId(payload.dish_order_id);
        if (existingPending) {
          if (existingPending.snap_token) {
            return {
              id: existingPending.id,
              snap_token: existingPending.snap_token,
              url: existingPending.url,
              transaction_id: existingPending.transaction_id,
            };
          } else {
            // Delete dangling pending without token
            await PaymentWriteRepository.delete(existingPending.id);
          }
        }
      }
    }

    const result = await PaymentWriteRepository.create(data);

    if (payload.method === "cash") {
      if (payload.type === "dish_order" && payload.dish_order_id) {
        await DishOrderWriteRepository.update(payload.dish_order_id, { status: "completed" });
        await NotificationService.sendPaymentSuccessNotification("dish_order", payload.dish_order_id);
      } else if (payload.type === "reservation" && payload.reservation_id) {
        await ReservationWriteRepository.update(payload.reservation_id, { status: "completed" });
        await NotificationService.sendPaymentSuccessNotification("reservation", payload.reservation_id);
      }
    }

    if (payload.provider === "midtrans") {
      try {
        const orderId = `PAY-${result.id}-${Date.now()}`;
        const parameter = {
          transaction_details: {
            order_id: orderId,
            gross_amount: Math.round(Number(payload.gross_amount)),
          },
          credit_card: {
            secure: true,
          },
        };
        const transaction = await snap.createTransaction(parameter);
        
        await PaymentWriteRepository.update(result.id, {
          snap_token: transaction.token,
          url: transaction.redirect_url,
          transaction_id: orderId,
        });

        return { 
          id: result.id, 
          snap_token: transaction.token, 
          url: transaction.redirect_url,
          transaction_id: orderId
        };
      } catch (e: any) {
        console.error("Midtrans Snap Error:", e);
        await PaymentWriteRepository.delete(result.id);
        throw new Error(e.message?.includes("401") 
          ? "Gagal terhubung ke Midtrans. Pastikan MIDTRANS_SERVER_KEY dan MIDTRANS_CLIENT_KEY sudah diatur di file .env backend." 
          : "Gagal membuat transaksi Midtrans: " + e.message);
      }
    }

    return result;
  }

  static async update(id: number, payload: UpdatePaymentRequestDto) {
    const payment = await PaymentReadRepository.getById(id);

    if (!payment) {
      return null;
    }

    // Transform string dates to Date objects if provided
    const data: any = { ...payload };
    if (payload.paid_at !== undefined) {
      data.paid_at = payload.paid_at ? new Date(payload.paid_at) : null;
    }
    if (payload.expired_at !== undefined) {
      data.expired_at = payload.expired_at ? new Date(payload.expired_at) : null;
    }

    const result = await PaymentWriteRepository.update(id, data);

    if (data.status === "paid") {
      if (payment.type === "dish_order" && payment.dish_order_id) {
        await DishOrderWriteRepository.update(payment.dish_order_id, { status: "completed" });
        await NotificationService.sendPaymentSuccessNotification("dish_order", payment.dish_order_id);
      } else if (payment.type === "reservation" && payment.reservation_id) {
        await ReservationWriteRepository.update(payment.reservation_id, { status: "completed" });
        await NotificationService.sendPaymentSuccessNotification("reservation", payment.reservation_id);
      }
    }

    return { payment, result };
  }

  static async delete(id: number) {
    const payment = await PaymentReadRepository.getById(id);

    if (!payment) {
      return null;
    }

    const result = await PaymentWriteRepository.delete(id);
    return { payment, result };
  }
}
