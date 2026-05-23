import { createRoute, z } from "@hono/zod-openapi";
import {
  apiErrorResponseSchema,
  createSuccessEnvelopeSchema,
  jsonResponse,
  protectedSecurity,
  errorResponses,
} from "../../../docs/openapi-common";
import { uploadSignatureResponseSchema } from "../../../docs/openapi-schemas";

export const uploadSignatureEnvelopeSchema = createSuccessEnvelopeSchema(
  "UploadSignatureEnvelopeResponse",
  uploadSignatureResponseSchema,
  "Upload signature created successfully",
);

export const createUploadSignatureRoute = createRoute({
  method: "post",
  path: "/signature",
  tags: ["Uploads"],
  summary: "Create Cloudinary signed upload params",
  security: protectedSecurity,
  request: {
    query: z.object({
      category: z.enum(["cafe", "billiard"]).optional(),
    }),
  },
  responses: {
    200: jsonResponse(
      uploadSignatureEnvelopeSchema,
      "Upload signature created successfully",
    ),
    400: jsonResponse(apiErrorResponseSchema, "Validation error"),
    401: errorResponses[401],
    500: errorResponses[500],
  },
});
