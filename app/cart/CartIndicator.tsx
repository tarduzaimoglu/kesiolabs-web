"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart/CartContext";

export default function CartIndicator() {
  const { qtyCount } = useCart();

  return (
    <Link
      href="/cart"
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-slate-50"
      aria-label="Sepet"
    >
      <ShoppingBag className="h-5 w-5 text-slate-900" />
      {qtyCount > 0 && (
        <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-blue-600 px-1 text-[11px] font-semibold text-white">
          {qtyCount}
        </span>
      )}
    </Link>
  );
}
