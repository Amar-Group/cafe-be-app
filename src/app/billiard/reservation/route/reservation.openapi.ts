import { createRoute } from "@hono/zod-openapi";
import {
  apiErrorResponseSchema,
  createNumericPathParamsSchema,
  jsonResponse,
  protectedSecurity,
  errorResponses,
} from "../../../../docs/openapi-common";
import {
  createReservationRequestSchema,
  updateReservationRequestSchema,
} from "../dto/reservation-request.dto";
import {
  reservationListResponseSchema,
  reservationDetailResponseSchema,
  reservationMutationResponseSchema,
} from "../dto/reservation-response.dto";

const tags = ["Reservations"];
const reservationIdParamsSchema = createNumericPathParamsSchema("id");

export const getAllReservationsRoute = createRoute({
  method: "get",
  path: "/",
  tags,
  summary: "Get all reservations",
  security: protectedSecurity,
  responses: {
    200: jsonResponse(reservationListResponseSchema, "Reservations fetched successfully"),
    401: errorResponses[401],
    403: errorResponses[403],
    500: errorResponses[500],
  },
});

export const getReservationByIdRoute = createRoute({
  method: "get",
  path: "/{id}",
  tags,
  summary: "Get reservation by id",
  security: protectedSecurity,
  request: {
    params: reservationIdParamsSchema,
  },
  responses: {
    200: jsonResponse(reservationDetailResponseSchema, "Reservation fetched successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Invalid reservation id"),
    401: errorResponses[401],
    403: errorResponses[403],
    404: jsonResponse(apiErrorResponseSchema, "Reservation not found"),
    500: errorResponses[500],
  },
});

export const createReservationRoute = createRoute({
  method: "post",
  path: "/",
  tags,
  summary: "Create reservation",
  security: protectedSecurity,
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: createReservationRequestSchema,
        },
      },
    },
  },
  responses: {
    201: jsonResponse(reservationMutationResponseSchema, "Reservation created successfully"),
    ...errorResponses,
  },
});

export const updateReservationRoute = createRoute({
  method: "put",
  path: "/{id}",
  tags,
  summary: "Update reservation",
  security: protectedSecurity,
  request: {
    params: reservationIdParamsSchema,
    body: {
      required: true,
      content: {
        "application/json": {
          schema: updateReservationRequestSchema,
        },
      },
    },
  },
  responses: {
    200: jsonResponse(reservationMutationResponseSchema, "Reservation updated successfully"),
    ...errorResponses,
    404: jsonResponse(apiErrorResponseSchema, "Reservation not found"),
  },
});

export const deleteReservationRoute = createRoute({
  method: "delete",
  path: "/{id}",
  tags,
  summary: "Delete reservation",
  security: protectedSecurity,
  request: {
    params: reservationIdParamsSchema,
  },
  responses: {
    200: jsonResponse(reservationMutationResponseSchema, "Reservation deleted successfully"),
    400: jsonResponse(apiErrorResponseSchema, "Invalid reservation id"),
    401: errorResponses[401],
    403: errorResponses[403],
    404: jsonResponse(apiErrorResponseSchema, "Reservation not found"),
    500: errorResponses[500],
  },
});
