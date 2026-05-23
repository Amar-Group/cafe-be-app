import { Context } from "hono";
import { createSignedUploadParams } from "../../../utils/cloudinary";

export class UploadController {
  static async createSignature(c: Context) {
    const query = c.req.valid("query" as never) as { category?: "cafe" | "billiard" };
    const signedParams = createSignedUploadParams(query.category);

    return c.json({
      success: true,
      data: signedParams,
      message: "Upload signature created successfully",
    });
  }
}
