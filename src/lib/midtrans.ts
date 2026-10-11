import * as midtransClient from "midtrans-client";

const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";

export const snap: any = new midtransClient.Snap({
  isProduction: isProduction,
  serverKey: process.env.MIDTRANS_SERVER_KEY || "",
  clientKey: process.env.MIDTRANS_CLIENT_KEY || "",
});

export const coreApi: any = new midtransClient.CoreApi({
  isProduction: isProduction,
  serverKey: process.env.MIDTRANS_SERVER_KEY || "",
  clientKey: process.env.MIDTRANS_CLIENT_KEY || "",
});
