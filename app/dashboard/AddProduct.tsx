// app/dashboard/AddProduct.tsx
"use client";

import { useState } from "react";
import { addProduct } from "@/lib/firestore";
import { v4 as uuidv4 } from "uuid";

export default function AddProduct() {
  const [name, setName] = useState("");
  const [qty, setQty] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [category, setCategory] = useState("");
  const [supplier, setSupplier] = useState("");
  const [image, setImage] = useState<File | undefined>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !category || !supplier) {
      alert("Please fill all fields");
      return;
    }

    const sku = `SKU-${uuidv4().slice(0, 8)}`;
    const product = { name, sku, qty, price, category, supplier };

    try {
      await addProduct(product, image);
      alert("✅ Product added successfully!");
      setName("");
      setQty(0);
      setPrice(0);
      setCategory("");
      setSupplier("");
      setImage(undefined);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to add product. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 border rounded max-w-xl bg-white shadow-sm"
    >
      <h3 className="font-semibold text-lg mb-3">Add Product</h3>

      <input
        className="w-full p-2 border rounded mb-2"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Product Name"
      />

      <div className="flex gap-2 mb-2">
        <input
          type="number"
          className="w-1/2 p-2 border rounded"
          value={qty}
          onChange={(e) => setQty(Number(e.target.value))}
          placeholder="Quantity"
        />
        <input
          type="number"
          className="w-1/2 p-2 border rounded"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          placeholder="Price"
        />
      </div>

      <input
        className="w-full p-2 border rounded mb-2"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Category"
      />

      <input
        className="w-full p-2 border rounded mb-2"
        value={supplier}
        onChange={(e) => setSupplier(e.target.value)}
        placeholder="Supplier"
      />

      <input
        type="file"
        className="w-full p-2 border rounded mb-3"
        accept="image/*"
        onChange={(e) => setImage(e.target.files?.[0])}
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Add Product
      </button>
    </form>
  );
}
