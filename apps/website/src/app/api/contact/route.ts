import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    // Get client IP for audit trail
    const forwardedFor = request.headers.get('x-forwarded-for');
    const clientIp = forwardedFor?.split(',')[0]?.trim() || 'unknown';

    const body = await request.json();
    const { firstName, lastName, email, phone, interest, message, website, formType } = body;

    // Honeypot check
    if (website) {
      return NextResponse.json({ success: true }); // Silently fail for bots
    }

    // Basic validation
    if (!firstName || !email || !interest) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = await createServerClient();

    // Determine form type/label based on submission source
    const isSupport = formType === 'support';
    const dbFormType = isSupport ? 'support' : 'contact';
    const label = isSupport ? 'Support Form - Support Page' : 'Contact Form - Contact Page';

    // Save to Twikka's web_form_submission
    const { error } = await (supabase as any)
      .from('web_form_submission')
      .insert({
        form_type: dbFormType,
        label,
        form_data: {
          firstName,
          lastName: lastName || null,
          email: email.toLowerCase(),
          phone: phone || null,
          subject: interest,
          message: message || null,
          ipAddress: clientIp,
          source: 'twikka-website',
          submittedAt: new Date().toISOString(),
        },
      });

    if (error) {
      console.error('Contact form submission error:', error);
      return NextResponse.json({ error: 'Failed to submit form' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
