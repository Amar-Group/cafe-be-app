import {
  CreatePaymentRequestDto,
  UpdatePaymentRequestDto,
} from "../dto/payment-request.dto";
import { PaymentResponseDto } from "../dto/payment-response.dto";
import { PaymentReadRepository } from "../repository/payment-read.repository";
import { PaymentWriteRepository } from "../repository/payment-write.repository";

export class PaymentService {
  static async getAll() {
    return PaymentReadRepository.getAll();
  }

  static async getById(id: number) {
    return PaymentReadRepository.getById(id);
  }

  static async create(payload: CreatePaymentRequestDto) {
    // Transform string dates to Date objects if provided
    const data = {
      ...payload,
      paid_at: payload.paid_at ? new Date(payload.paid_at) : null,
      expired_at: payload.expired_at ? new Date(payload.expired_at) : null,
    };
    return PaymentWriteRepository.create(data as any);
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
