import { Context } from "hono";
import {
  CreatePaymentRequestDto,
  UpdatePaymentRequestDto,
} from "../dto/payment-request.dto";
import { PaymentService } from "../service/payment.service";
import { PaymentReadRepository } from "../repository/payment-read.repository";
import { PaymentWriteRepository } from "../repository/payment-write.repository";
import * as crypto from "crypto";
import { coreApi } from "../../../lib/midtrans";

export class PaymentController {
  static async getAll(c: Context) {
    const payments = await PaymentService.getAll();

    return c.json({
      success: true,
      data: payments,
      message: "Payments fetched successfully",
    });
  }

  static async getById(c: Context) {
    const id = Number(c.req.param("id"));
    const payment = await PaymentService.getById(id);

    if (!payment) {
      return c.json({ success: false, message: "Payment not found" }, 404);
    }

    return c.json({
      success: true,
      data: payment,
      message: "Payment fetched successfully",
    });
  }

  static async create(c: Context) {
    const body: CreatePaymentRequestDto = await c.req.json();
    const result = await PaymentService.create(body);

    return c.json(
      {
        success: true,
        data: result,
        message: "Payment created successfully",
      },
      201,
    );
  }

  static async update(c: Context) {
    const id = Number(c.req.param("id"));
    const body: UpdatePaymentRequestDto = await c.req.json();
    const updateResult = await PaymentService.update(id, body);

    if (!updateResult) {
      return c.json({ success: false, message: "Payment not found" }, 404);
    }

    return c.json({
      success: true,
      data: updateResult.result,
      message: "Payment updated successfully",
    });
  }

  static async delete(c: Context) {
    const id = Number(c.req.param("id"));
    const deleteResult = await PaymentService.delete(id);

    if (!deleteResult) {
      return c.json({ success: false, message: "Payment not found" }, 404);
    }

    return c.json({
      success: true,
      data: deleteResult.result,
      message: "Payment deleted successfully",
    });
  }

  static async syncMidtrans(c: Context) {
    const id = Number(c.req.param("id"));
    const payment = await PaymentService.getById(id);

    if (!payment) {
      return c.json({ success: false, message: "Payment not found" }, 404);
    }

    if (payment.status === "paid") {
      return c.json({ success: true, data: payment, message: "Payment already paid" });
    }

    if (!payment.transaction_id) {
      return c.json({ success: false, message: "No Midtrans transaction ID found" }, 400);
    }

    try {
      const statusResponse = await coreApi.transaction.status(payment.transaction_id);
      
      const transactionStatus = statusResponse.transaction_status;
      const fraudStatus = statusResponse.fraud_status;

      let paymentStatus: "pending" | "paid" | "failed" | "expired" | "cancelled" | "refunded" = "pending";

      if (transactionStatus === "capture") {
        if (fraudStatus === "challenge") {
          paymentStatus = "pending";
        } else if (fraudStatus === "accept") {
          paymentStatus = "paid";
        }
      } else if (transactionStatus === "settlement") {
        paymentStatus = "paid";
      } else if (transactionStatus === "cancel" || transactionStatus === "deny" || transactionStatus === "expire") {
        paymentStatus = transactionStatus === "expire" ? "expired" : "failed";
      } else if (transactionStatus === "pending") {
        paymentStatus = "pending";
      }

      if (paymentStatus === "paid") {
        await PaymentService.update(id, {
          status: paymentStatus,
          paid_at: new Date().toISOString(),
        });
      } else if (paymentStatus !== "pending") {
        await PaymentService.update(id, { status: paymentStatus });
      }

      const updatedPayment = await PaymentService.getById(id);

      return c.json({
        success: true,
        data: updatedPayment,
        message: "Payment synced successfully",
      });
    } catch (e: any) {
      console.error("Sync Midtrans Error:", e);
      if (e.message?.includes("404")) {
         return c.json({ success: false, message: "Transaction not found in Midtrans" }, 404);
      }
      return c.json({ success: false, message: "Failed to sync with Midtrans" }, 500);
    }
  }

  static async midtransWebhook(c: Context) {
    try {
      const body = await c.req.json();
      
      const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
      const signatureKey = body.signature_key;
      const orderId = body.order_id;
      const statusCode = body.status_code;
      const grossAmount = body.gross_amount;
      
      const hash = crypto.createHash("sha512");
      hash.update(`${orderId}${statusCode}${grossAmount}${serverKey}`);
      const calculatedSignature = hash.digest("hex");
      
      if (signatureKey !== calculatedSignature) {
        return c.json({ success: false, message: "Invalid signature" }, 403);
      }

      const transactionStatus = body.transaction_status;
      const fraudStatus = body.fraud_status;

      let paymentStatus: "pending" | "paid" | "failed" | "expired" | "cancelled" | "refunded" = "pending";

      if (transactionStatus === "capture") {
        if (fraudStatus === "challenge") {
          paymentStatus = "pending";
        } else if (fraudStatus === "accept") {
          paymentStatus = "paid";
        }
      } else if (transactionStatus === "settlement") {
        paymentStatus = "paid";
      } else if (transactionStatus === "cancel" || transactionStatus === "deny" || transactionStatus === "expire") {
        paymentStatus = transactionStatus === "expire" ? "expired" : "failed";
      } else if (transactionStatus === "pending") {
        paymentStatus = "pending";
      }

      // Find the payment by transaction_id
      // For this we need a method in repo or just use db directly, wait, let's parse orderId: PAY-{id}-{timestamp}
      const parts = orderId.split("-");
      if (parts.length >= 2 && parts[0] === "PAY") {
        const paymentId = Number(parts[1]);
        const payment = await PaymentReadRepository.getById(paymentId);
        if (payment && payment.status !== "paid") { // Only update if not already paid
          await PaymentService.update(paymentId, {
            status: paymentStatus,
            paid_at: paymentStatus === "paid" ? new Date().toISOString() : undefined,
          });
        }
      }

      return c.json({ success: true, message: "Webhook processed" });
    } catch (e: any) {
      console.error("Webhook error:", e);
      return c.json({ success: false, message: e.message }, 500);
    }
  }
}
