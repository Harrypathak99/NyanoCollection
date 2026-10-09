"use client";

export function QuantityInput({
  value,
  onChange,
  small = false,
  max = 99,
}: {
  value: number;
  onChange: (value: number) => void;
  small?: boolean;
  max?: number;
}) {
  const size = small ? "h-8 w-8 text-sm" : "h-11 w-11";
  return (
    <div className="inline-flex items-center border border-line">
      <button type="button" aria-label="Decrease quantity" className={`${size} hover:text-accent`} onClick={() => onChange(value - 1)}>
        −
      </button>
      <input
        type="number"
        aria-label="Quantity"
        min={1}
        max={max}
        value={value}
        onChange={(e) => {
          const n = parseInt(e.target.value, 10);
          if (!Number.isNaN(n)) onChange(Math.max(1, Math.min(max, n)));
        }}
        className={`${small ? "w-8 text-sm" : "w-12"} [appearance:textfield] bg-transparent text-center focus:outline-none [&::-webkit-inner-spin-button]:appearance-none`}
      />
      <button
        type="button"
        aria-label="Increase quantity"
        className={`${size} hover:text-accent disabled:opacity-30`}
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
      >
        +
      </button>
    </div>
  );
}
