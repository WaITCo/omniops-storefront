'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { useCartStore } from '@/lib/cart-store';

interface FormData {
  firstName: string;
  email: string;
  company?: string;
}

interface CheckoutFormProps {
  productName: string;
  productId: string;
  variantId?: string;
  price: number;
}

export function CheckoutForm({
  productName,
  productId,
  variantId,
  price,
}: CheckoutFormProps) {
  const t = useTranslations('checkout');
  const router = useRouter();
  const clearCart = useCartStore((s) => s.clearCart);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  async function onSubmit(data: FormData) {
    setApiError(null);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: data.firstName,
          customerEmail: data.email,
          company: data.company,
          productName,
          totalAmount: price,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setApiError(body.message ?? 'Fehler bei der Bestellung');
        return;
      }

      clearCart();
      router.push('/danke');
    } catch {
      setApiError('Netzwerkfehler – bitte versuche es erneut');
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      {/* Vorname */}
      <div>
        <label className="font-mono text-xs uppercase tracking-wider text-foreground block mb-2">
          {t('firstName')} *
        </label>
        <input
          {...register('firstName', { required: true, minLength: 1 })}
          className="w-full border border-muted bg-background px-4 py-3 font-sans text-foreground focus:outline-none focus:border-foreground transition-colors"
        />
        {errors.firstName && (
          <p className="font-mono text-xs text-accent mt-1">{t('errors.required')}</p>
        )}
      </div>

      {/* E-Mail */}
      <div>
        <label className="font-mono text-xs uppercase tracking-wider text-foreground block mb-2">
          {t('email')} *
        </label>
        <input
          {...register('email', {
            required: true,
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'invalid' },
          })}
          type="email"
          className="w-full border border-muted bg-background px-4 py-3 font-sans text-foreground focus:outline-none focus:border-foreground transition-colors"
        />
        {errors.email && (
          <p className="font-mono text-xs text-accent mt-1">{t('errors.invalidEmail')}</p>
        )}
      </div>

      {/* Unternehmen (optional) */}
      <div>
        <label className="font-mono text-xs uppercase tracking-wider text-foreground block mb-2">
          Unternehmen
        </label>
        <input
          {...register('company')}
          className="w-full border border-muted bg-background px-4 py-3 font-sans text-foreground focus:outline-none focus:border-foreground transition-colors"
        />
      </div>

      {/* Produkt (readonly) */}
      <div>
        <label className="font-mono text-xs uppercase tracking-wider text-foreground/50 block mb-2">
          Produkt
        </label>
        <input
          value={productName}
          readOnly
          className="w-full border border-muted bg-muted px-4 py-3 font-sans text-foreground/60 cursor-not-allowed"
        />
      </div>

      {apiError && (
        <p className="font-mono text-xs text-accent border border-accent px-4 py-3">
          {apiError}
        </p>
      )}

      <Button type="submit" variant="primary" size="lg" loading={isSubmitting}>
        {t('submit')}
      </Button>
    </form>
  );
}
