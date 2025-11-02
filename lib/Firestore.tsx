"use client";

import { db, storage } from "./Firebase";
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
  FirestoreError,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

// 💡 Product structure definition
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

// 🔗 Firestore references
const productsCol = collection(db, "products");
const logsCol = collection(db, "logs");

// 🌟 Helper: Upload product image and return its URL
const uploadProductImage = async (imageFile: File): Promise<string> => {
  const fileRef = ref(storage, `product-images/${uuidv4()}_${imageFile.name}`);
  await uploadBytes(fileRef, imageFile);
  return await getDownloadURL(fileRef);
};

// 🌱 Add a new product with optional image upload
export const addProduct = async (product: Product, imageFile?: File) => {
  try {
    let imageUrl = "";

    if (imageFile) {
      imageUrl = await uploadProductImage(imageFile);
    }

    const docRef = await addDoc(productsCol, {
      ...product,
      qty: Number(product.qty),
      price: Number(product.price),
      imageUrl,
      createdAt: serverTimestamp(),
    });

    await addDoc(logsCol, {
      action: "add",
      productId: docRef.id,
      timestamp: serverTimestamp(),
    });

    console.log(`✅ Product "${product.name}" added successfully!`);
    return docRef;
  } catch (error) {
    const err = error as FirestoreError;
    console.error("❌ Failed to add product:", err.message);
    throw err;
  }
};

// 🛠️ Update an existing product
export const updateProduct = async (id: string, data: Partial<Product>) => {
  try {
    const refDoc = doc(db, "products", id);
    await updateDoc(refDoc, { ...data });

    await addDoc(logsCol, {
      action: "update",
      productId: id,
      timestamp: serverTimestamp(),
    });

    console.log(`🔄 Product "${id}" updated successfully.`);
  } catch (error) {
    const err = error as FirestoreError;
    console.error("❌ Failed to update product:", err.message);
    throw err;
  }
};

// 🧹 Delete a product
export const deleteProduct = async (id: string) => {
  try {
    await deleteDoc(doc(db, "products", id));

    await addDoc(logsCol, {
      action: "delete",
      productId: id,
      timestamp: serverTimestamp(),
    });

    console.log(`🗑️ Product "${id}" deleted successfully.`);
  } catch (error) {
    const err = error as FirestoreError;
    console.error("❌ Failed to delete product:", err.message);
    throw err;
  }
};

// 📡 Real-time product listener
export const subscribeProducts = (onChange: (items: Product[]) => void) => {
  try {
    const q = query(productsCol, orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => {
      const items: Product[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Product),
      }));
      onChange(items);
    });
  } catch (error) {
    const err = error as FirestoreError;
    console.error("❌ Subscription error:", err.message);
    throw err;
  }
};
