"use client";

import { db, storage } from "./firebase"; // ✅ Corrected import
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

// ✅ Define Product type
export type Product = {
  id?: string;
  name: string;
  sku: string;
  category?: string;
  qty: number;
  price: number;
  supplier?: string;
  createdAt?: any;
  imageUrl?: string;
};

// ✅ Firestore collections
const productsCol = collection(db, "products");
const logsCol = collection(db, "logs");

// ✅ Add new product
export const addProduct = async (p: Product, imageFile?: File) => {
  let imageUrl = "";

  // Upload image if provided
  if (imageFile) {
    const fileRef = ref(storage, `product-images/${uuidv4()}_${imageFile.name}`);
    await uploadBytes(fileRef, imageFile);
    imageUrl = await getDownloadURL(fileRef);
  }

  // Add product to Firestore
  const docRef = await addDoc(productsCol, {
    ...p,
    qty: Number(p.qty),
    price: Number(p.price),
    imageUrl,
    createdAt: serverTimestamp(),
  });

  // Log action
  await addDoc(logsCol, {
    action: "add",
    productId: docRef.id,
    timestamp: serverTimestamp(),
  });

  return docRef;
};

// ✅ Update existing product
export const updateProduct = async (id: string, data: Partial<Product>) => {
  const refDoc = doc(db, "products", id);
  await updateDoc(refDoc, { ...data });
  await addDoc(logsCol, {
    action: "update",
    productId: id,
    timestamp: serverTimestamp(),
  });
};

// ✅ Delete a product
export const deleteProduct = async (id: string) => {
  await deleteDoc(doc(db, "products", id));
  await addDoc(logsCol, {
    action: "delete",
    productId: id,
    timestamp: serverTimestamp(),
  });
};

// ✅ Subscribe to real-time updates
export const subscribeProducts = (onChange: (items: Product[]) => void) => {
  const q = query(productsCol, orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Product),
    }));
    onChange(items);
  });
};
