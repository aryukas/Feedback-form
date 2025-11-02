// app/dashboard/page.tsx
"use client";
import { useEffect, useState } from "react";
import { subscribeProducts, Product } from "@/lib/firestore";
import ProductTable from "./ProductTable";
import AddProduct from "./AddProduct";
import InvoiceForm from "./InvoiceForm";
import { useAuth } from "@/lib/auth";

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const { user, logout } = useAuth();

  useEffect(() => {
    const unsub = subscribeProducts((items) => setProducts(items));
    return () => unsub();
  }, []);

  const totalValue = products.reduce((s, p) => s + (p.qty || 0) * (p.price || 0), 0);
  const lowStock = products.filter((p) => (p.qty || 0) < 5).length;

  return (
    <div className="min-h-screen p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div>
          <span className="mr-4">{user?.email}</span>
          <button onClick={() => logout()} className="px-3 py-1 border rounded">Logout</button>
        </div>
      </header>

      <section className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 border rounded">Total Products: {products.length}</div>
        <div className="p-4 border rounded">Low Stock: {lowStock}</div>
        <div className="p-4 border rounded">Total Value: ₹{totalValue.toFixed(2)}</div>
      </section>

      <section className="mb-6">
        <AddProduct />
      </section>

      <section className="mb-6">
        <InvoiceForm products={products} />
      </section>

      <section>
        <ProductTable products={products} />
      </section>
    </div>
  );
}
