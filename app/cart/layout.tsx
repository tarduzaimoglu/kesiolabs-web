import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sepet",
  alternates: { canonical: "/cart" },
};

export default function CartLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
