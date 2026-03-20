'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { useCartStore } from '@/lib/cart-store';

interface FormData {
  firstName: string;
  lastName: string;
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

  // Suppress unused-variable warnings for props passed to API
  void productId;
  void variantId;

  async function onSubmit(data: FormData) {
    setApiError(null);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: `${data.firstName} ${data.lastName}`.trim(),
          customerEmail: data.email,
          company: data.company,
          productName,
          totalAmount: price,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setApiError((body as { message?: string }).message ?? t('errors.generic'));
        return;
      }

      clearCart();
      router.push('/danke');
    } catch {
      setApiError(t('errors.network'));
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      {/* Kontaktdaten-Card */}
      <div className="rounded-2xl border border-muted bg-white p-6">
        <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground/60 mb-5">
          {t('sectionContact')}
        </h2>

        {/* Vorname / Nachname – 2-spaltig */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground block mb-2">
              {t('firstName')} *
            </label>
            <input
              {...register('firstName', { required: true, minLength: 1 })}
              autoComplete="given-name"
              className="w-full border border-muted bg-background px-4 py-3 font-sans text-foreground focus:outline-none focus:border-foreground transition-colors rounded-md"
            />
            {errors.firstName && (
              <p className="font-mono text-xs text-accent mt-1">{t('errors.required')}</p>
            )}
          </div>

          <div>
            <label className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground block mb-2">
              {t('lastName')} *
            </label>
            <input
              {...register('lastName', { required: true, minLength: 1 })}
              autoComplete="family-name"
              className="w-full border border-muted bg-background px-4 py-3 font-sans text-foreground focus:outline-none focus:border-foreground transition-colors rounded-md"
            />
            {errors.lastName && (
              <p className="font-mono text-xs text-accent mt-1">{t('errors.required')}</p>
            )}
          </div>
        </div>

        {/* E-Mail – full width */}
        <div className="mb-4">
          <label className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground block mb-2">
            {t('email')} *
          </label>
          <input
            {...register('email', {
              required: true,
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'invalid' },
            })}
            type="email"
            autoComplete="email"
            className="w-full border border-muted bg-background px-4 py-3 font-sans text-foreground focus:outline-none focus:border-foreground transition-colors rounded-md"
          />
          {errors.email && (
            <p className="font-mono text-xs text-accent mt-1">{t('errors.invalidEmail')}</p>
          )}
        </div>

        {/* Unternehmen (optional) */}
        <div>
          <label className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground block mb-2">
            {t('company')}
          </label>
          <input
            {...register('company')}
            autoComplete="organization"
            className="w-full border border-muted bg-background px-4 py-3 font-sans text-foreground focus:outline-none focus:border-foreground transition-colors rounded-md"
          />
        </div>
      </div>

      {/* Bestelldetails-Card (readonly) */}
      <div className="rounded-2xl border border-muted bg-white p-6">
        <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground/60 mb-5">
          {t('sectionOrder')}
        </h2>
        <div>
          <label className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground/50 block mb-2">
            {t('product')}
          </label>
          <input
            value={productName}
            readOnly
            className="w-full border border-muted bg-muted px-4 py-3 font-sans text-foreground/60 cursor-not-allowed rounded-md"
          />
        </div>
      </div>

      {apiError && (
        <p className="font-mono text-xs text-accent border border-accent px-4 py-3 rounded-md">
          {apiError}
        </p>
      )}

      <Button type="submit" variant="primary" size="lg" loading={isSubmitting}>
        {t('submit')}
      </Button>
    </form>
  );
}
