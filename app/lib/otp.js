export function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendOtpSms(mobile, otp) {
  console.log(`OTP for ${mobile}: ${otp}`);

  /*
  Production example:
  await fetch("https://control.msg91.com/api/v5/otp", {
    method: "POST",
    headers: {
      authkey: process.env.OTP_PROVIDER_API_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      mobile,
      otp
    })
  });
  */

  return true;
}
