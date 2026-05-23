import { createRoute } from "@hono/zod-openapi";
import {
  apiErrorResponseSchema,
  createNumericPathParamsSchema,
  jsonResponse,
  protectedSecurity,
  errorResponses,
} from "../../../docs/openapi-common";
import {
  createPaymentRequestSchema,
  updatePaymentRequestSchema,
} from "../dto/payment-request.dto";
import {
  paymentListResponseSchema,
  paymentDetailResponseSchema,
  paymentMutationResponseSchema,
} from "../dto/payment-response.dto";

const tags = ["Payments"];
const paymentIdParamsSchema = createNumericPathParamsSchema("id");

export const getAllPaymentsRoute = createRoute({
  method: "get",
  path: "/",
  tags,
  summary: "Get all payments",
  security: protectedSecurity,
  responses: {
    200: jsonResponse(paymentListResponseSchema, "Payments fetched successfully"),
    401: errorResponses[401],
    403: errorResponses[403],
    500: errorResponses[500],
  },
});

export const getPaymentByIdRoute = createRoute({
  method: "get",
  path: "/{id}",
  tags,
  summary: "Get payment by id",
  security: protectedSecurity,
  request: {
    params: paymentIdParamsSchema,
  },
  responses: {
    200: jsonResponse(paymentDetailResponseSchema, "Payment fetched successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Invalid payment id"),
    401: errorResponses[401],
    403: errorResponses[403],
    404: jsonResponse(apiErrorResponseSchema, "Payment not found"),
    500: errorResponses[500],
  },
});

export const createPaymentRoute = createRoute({
  method: "post",
  path: "/",
  tags,
  summary: "Create payment",
  security: protectedSecurity,
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: createPaymentRequestSchema,
        },
      },
    },
  },
  responses: {
    201: jsonResponse(paymentMutationResponseSchema, "Payment created successfully"),
    ...errorResponses,
  },
});

export const updatePaymentRoute = createRoute({
  method: "put",
  path: "/{id}",
  tags,
  summary: "Update payment",
  security: protectedSecurity,
  request: {
    params: paymentIdParamsSchema,
    body: {
      required: true,
      content: {
        "application/json": {
          schema: updatePaymentRequestSchema,
        },
      },
    },
  },
  responses: {
    200: jsonResponse(paymentMutationResponseSchema, "Payment updated successfully"),
    ...errorResponses,
    404: jsonResponse(apiErrorResponseSchema, "Payment not found"),
  },
});

export const deletePaymentRoute = createRoute({
  method: "delete",
  path: "/{id}",
  tags,
  summary: "Delete payment",
  security: protectedSecurity,
  request: {
    params: paymentIdParamsSchema,
  },
  responses: {
    200: jsonResponse(paymentMutationResponseSchema, "Payment deleted successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Invalid payment id"),
    401: errorResponses[401],
    403: errorResponses[403],
    404: jsonResponse(apiErrorResponseSchema, "Payment not found"),
    500: errorResponses[500],
  },
});
