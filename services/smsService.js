export async function sendSMS(mobile, message) {

  const response = await fetch(
    `${process.env.SMS_GATEWAY_URL}/send-sms`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.SMS_GATEWAY_API_KEY,
      },
      body: JSON.stringify({
        mobile,
        message,
      }),
    }
  );

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || "SMS sending failed");
  }

  return data;
}