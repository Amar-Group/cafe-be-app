import { Context } from "hono";
import {
  CreatePaymentRequestDto,
  UpdatePaymentRequestDto,
} from "../dto/payment-request.dto";
import { PaymentService } from "../service/payment.service";

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
}
