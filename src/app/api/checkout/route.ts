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

  const payload = JSON.stringify({ customerName, customerEmail, company, productName, totalAmount });

  async function callWebhook(url: string, label: string) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
      });
      if (!res.ok) {
        console.error(`[checkout] ${label} failed: ${res.status} ${res.statusText}`);
      }
    } catch (err) {
      console.error(`[checkout] ${label} error (non-blocking):`, err);
    }
  }

  const webhooks: Promise<void>[] = [];
  if (process.env.N8N_WEBHOOK_URL) {
    webhooks.push(callWebhook(process.env.N8N_WEBHOOK_URL, 'email webhook'));
  } else {
    console.warn('[checkout] N8N_WEBHOOK_URL not configured – skipping email webhook');
  }
  if (process.env.N8N_CRM_WEBHOOK_URL) {
    webhooks.push(callWebhook(process.env.N8N_CRM_WEBHOOK_URL, 'crm webhook'));
  } else {
    console.warn('[checkout] N8N_CRM_WEBHOOK_URL not configured – skipping crm webhook');
  }

  await Promise.all(webhooks);

  return NextResponse.json({ success: true });
}
