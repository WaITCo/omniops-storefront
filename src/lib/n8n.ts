export interface OrderPayload {
  customerEmail: string;
  customerName: string;
  productName: string;
  totalAmount: number;
}

/**
 * Sendet eine Bestellbestätigung an n8n.
 * Server-only: liest N8N_WEBHOOK_URL aus process.env.
 * Graceful Degradation: Fehler werden geloggt, nicht geworfen.
 */
export async function postOrderConfirmed(payload: OrderPayload): Promise<void> {
  const webhookUrl = process.env.N8N_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn('[n8n] N8N_WEBHOOK_URL not configured – skipping order notification');
    return;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerEmail: payload.customerEmail,
        customerName: payload.customerName,
        productName: payload.productName,
        totalAmount: payload.totalAmount,
      }),
    });

    if (!response.ok) {
      console.error(`[n8n] Webhook failed: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error('[n8n] Webhook error (non-blocking):', error);
  }
}
