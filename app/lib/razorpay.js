import Razorpay from "razorpay";

export function getRazorpayInstance() {
  const keyId = process.env.rzp_test_TCfojtZWQ8AF2e;
  const keySecret = process.env.1tOHJTuFryzD4LdgULTqazDG;

  if (!keyId || !keySecret) {
    throw new Error("Razorpay environment variables are missing");
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret
  });
}
