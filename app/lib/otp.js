export function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendOtpSms(mobile, otp) {
  console.log(`OTP for ${mobile}: ${otp}`);

  // Later connect MSG91 or Fast2SMS here.

  return true;
}
