import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const schema = z.object({
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  company: z.string().optional(),
  productName: z.string(),
  totalAmount: z.number().positive(),
});

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: 'Validation error', errors: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const { customerName, customerEmail, company, productName, totalAmount } = parsed.data;

  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerName, customerEmail, company, productName, totalAmount }),
      });
      if (!res.ok) {
        console.error(`[checkout] n8n webhook failed: ${res.status} ${res.statusText}`);
      }
    } catch (err) {
      // Graceful degradation – Danke-Seite trotzdem zeigen
      console.error('[checkout] n8n webhook error (non-blocking):', err);
    }
  } else {
    console.warn('[checkout] N8N_WEBHOOK_URL not configured – skipping webhook');
  }

  return NextResponse.json({ success: true });
}
