import { Product } from "@/app/components/stock/ProductsTable";

const STORAGE_KEY = "stockvar_products";

export function getProducts(): Product[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function saveProducts(products: Product[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

export function addProduct(product: Product) {
  const products = getProducts();
  saveProducts([product, ...products]);
}
