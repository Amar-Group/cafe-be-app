export async function sendWhatsAppMessage(target: string, message: string) {
  const token = process.env.FONNTE_API_TOKEN;
  
  if (!token) {
    console.warn("FONNTE_API_TOKEN is not set. WhatsApp message was not sent.");
    return false;
  }

  try {
    const formData = new FormData();
    formData.append("target", target);
    formData.append("message", message);
    
    // Default country code id (62) helps format local numbers automatically
    formData.append("countryCode", "62");

    const response = await fetch("https://api.fonnte.com/send", {
      method: "POST",
      headers: {
        Authorization: token,
      },
      body: formData,
    });

    const result = await response.json();
    
    if (result.status === true) {
      console.log(`WhatsApp message sent to ${target}`);
      return true;
    } else {
      console.error(`Failed to send WhatsApp message to ${target}:`, result);
      return false;
    }
  } catch (error) {
    console.error("Error sending WhatsApp message via Fonnte:", error);
    return false;
  }
}
