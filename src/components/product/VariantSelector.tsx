'use client';

import type { ProductOption, ProductVariant } from '@/lib/strapi-types';

interface VariantSelectorProps {
  options: ProductOption[];
  variants: ProductVariant[];
  selectedOptions: Record<string, string>;
  onSelect: (optionName: string, value: string) => void;
}

export function VariantSelector({
  options,
  variants,
  selectedOptions,
  onSelect,
}: VariantSelectorProps) {
  function isValueAvailable(optionName: string, value: string): boolean {
    const testOptions = { ...selectedOptions, [optionName]: value };
    return variants.some((v) => {
      if (!v.is_active) return false;
      if (v.stock_quantity === 0) return false;
      return Object.entries(testOptions).every(
        ([key, val]) => v.selected_options[key] === val
      );
    });
  }

  return (
    <div className="flex flex-col gap-6">
      {options.map((option) => (
        <div key={option.id}>
          <p className="font-mono text-xs uppercase tracking-wider text-foreground mb-3">
            {option.name}
          </p>
          <div className="flex flex-wrap gap-2">
            {option.values.map((val) => {
              const available = isValueAvailable(option.name, val.value);
              const selected = selectedOptions[option.name] === val.value;

              return (
                <button
                  key={val.id}
                  onClick={() => available && onSelect(option.name, val.value)}
                  disabled={!available}
                  className={[
                    'px-4 py-2 font-mono text-sm border transition-colors',
                    selected
                      ? 'border-foreground bg-foreground text-background'
                      : available
                      ? 'border-muted text-foreground hover:border-foreground'
                      : 'border-muted text-foreground/30 line-through cursor-not-allowed',
                  ].join(' ')}
                >
                  {val.value}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
