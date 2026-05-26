import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

// Generate 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Calculate OTP expiry (10 minutes from now)
function getOTPExpiry() {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 10);
  return now;
}

export async function POST(request) {
  try {
    const { mobile } = await request.json();

    // Validate mobile number
    if (!mobile || !/^\d{10}$/.test(mobile)) {
      return new Response(
        JSON.stringify({ error: 'Invalid mobile number' }),
        { status: 400 }
      );
    }

    const otp = generateOTP();
    const expiresAt = getOTPExpiry();

    // Save OTP to database
    await prisma.otp.create({
      data: {
        mobile,
        code: otp,
        expiresAt,
        verified: false,
      },
    });

    // TODO: Send OTP via SMS (Twilio, AWS SNS, etc.)
    console.log(`OTP for ${mobile}: ${otp}`);

    return new Response(
      JSON.stringify({ 
        message: 'OTP sent successfully',
        mobile: mobile
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending OTP:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to send OTP' }),
      { status: 500 }
    );
  }
}
