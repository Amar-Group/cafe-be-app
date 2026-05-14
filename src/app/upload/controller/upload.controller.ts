import { Context } from "hono";
import { createSignedUploadParams } from "../../../utils/cloudinary";

export class UploadController {
  static async createSignature(c: Context) {
    const signedParams = createSignedUploadParams();

    return c.json({
      success: true,
      data: signedParams,
      message: "Upload signature created successfully",
    });
  }
}
