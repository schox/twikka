import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const APP_ID = 'twikka-admin';

/**
 * POST /api/auth/request-otp
 *
 * Gated OTP request for Twikka Admin.
 * Uses a security-definer RPC function (check_otp_access) to validate
 * that the user exists in user_data with admin=true and active=true —
 * without requiring the secret key. Only the publishable key is used.
 *
 * Returns generic responses to prevent user enumeration.
 */
export async function POST(request: NextRequest) {
  try {
    const { identifier, channel } = await request.json();

    // Validate request
    if (!identifier || typeof identifier !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Invalid request' },
        { status: 400 },
      );
    }

    if (channel && !['email', 'sms'].includes(channel)) {
      return NextResponse.json(
        { success: false, error: 'Invalid channel' },
        { status: 400 },
      );
    }

    // Normalize identifier
    const normalizedIdentifier = identifier.trim().toLowerCase();
    const isPhone =
      normalizedIdentifier.startsWith('+') ||
      /^\d{10,}$/.test(normalizedIdentifier.replace(/\D/g, ''));
    const effectiveChannel = channel ?? (isPhone ? 'sms' : 'email');

    // Create Supabase client with publishable key (no secret key needed)
    const supabaseUrl =
      process.env.TWIKKA_SUPABASE_URL ?? process.env.NEXT_PUBLIC_TWIKKA_SUPABASE_URL;
    const supabaseKey =
      process.env.TWIKKA_SUPABASE_PUBLISHABLE_KEY ??
      process.env.NEXT_PUBLIC_TWIKKA_SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('[request-otp] Missing Supabase configuration');
      return NextResponse.json(
        { success: false, error: 'Server configuration error' },
        { status: 500 },
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Check access via security-definer RPC (no secret key needed)
    const { data: accessResult, error: rpcError } = await supabase.rpc('check_otp_access', {
      p_identifier: normalizedIdentifier,
      p_app_id: APP_ID,
    });

    if (rpcError) {
      console.error('[request-otp] RPC error:', rpcError);
      return NextResponse.json(
        { success: false, error: 'Unable to process request' },
        { status: 500 },
      );
    }

    // If no rows returned, user doesn't exist or doesn't have admin access
    if (!accessResult || accessResult.length === 0) {
      // Return generic success to prevent user enumeration
      return NextResponse.json({
        success: true,
        message: `If an account exists with this ${isPhone ? 'phone number' : 'email'}, a verification code has been sent.`,
      });
    }

    const { user_email, user_phone } = accessResult[0];

    // Send OTP via Supabase Auth (works with publishable key)
    let otpError;

    if (effectiveChannel === 'sms') {
      const targetPhone = user_phone ?? normalizedIdentifier;
      const { error } = await supabase.auth.signInWithOtp({
        phone: targetPhone,
        options: {
          shouldCreateUser: false,
        },
      });
      otpError = error;
    } else {
      const { error } = await supabase.auth.signInWithOtp({
        email: user_email,
        options: {
          shouldCreateUser: false,
        },
      });
      otpError = error;
    }

    if (otpError) {
      console.error('[request-otp] OTP send error:', otpError);
      return NextResponse.json(
        { success: false, error: 'Failed to send verification code' },
        { status: 500 },
      );
    }

    console.log(
      `[request-otp] OTP sent successfully to ${normalizedIdentifier} via ${effectiveChannel}`,
    );

    return NextResponse.json({
      success: true,
      message: `Verification code sent to your ${effectiveChannel === 'sms' ? 'phone' : 'email'}`,
    });
  } catch (error) {
    console.error('[request-otp] Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 },
    );
  }
}
