import { apiFetchFirstSuccess } from "./client";
import { unwrapData, type ApiEnvelope } from "./response";

export type ProductRecord = {
id: string;
sku: string;
name: string;
unit: string;
status?: "active" | "archived";
[key: string]: unknown;
};

export type InventoryRecord = {
sku: string;
quantity: number;
updatedAt?: string;
[key: string]: unknown;
};

export type CreateProductPayload = {
sku: string;
name: string;
unit: string;
};

export type AdjustInventoryPayload = {
sku: string;
quantity: number;
action: "add" | "reduce";
note?: string;
};

export type AddEntryPayload = {
shiftId?: string;
sku: string;
quantity: number;
entryType: "stock-in" | "stock-out" | "waste" | "adjustment";
note?: string;
actorStaffId?: string;
actorEmail?: string;
actorRole?: "owner" | "manager" | "staff";
requireStaffAuthorization?: boolean;
authorizedRole?: "staff";
};

const STOCK_PATHS = {
createProduct: ["api/stock/product/create", "api/stock/product/create-product"],
listProducts: ["api/stock/product/list", "api/stock/product/list-products"],
listInventory: ["api/stock/inventory/list", "api/stock/inventory/list-inventory"],
adjustInventory: [
    "api/stock/inventory/adjust",
    "api/stock/inventory/adjust-inventory",
],
addEntry: ["api/stock/entry/add", "api/stock/entry/add-entry"],
};

export async function createProduct(payload: CreateProductPayload, token: string) {
const res = await apiFetchFirstSuccess<ApiEnvelope<ProductRecord> | ProductRecord>(
    STOCK_PATHS.createProduct,
    {
    method: "POST",
    body: payload,
    token,
    }
);
return unwrapData(res);
}

export async function listProducts(token: string) {
const res = await apiFetchFirstSuccess<ApiEnvelope<ProductRecord[]> | ProductRecord[]>(
    STOCK_PATHS.listProducts,
    { token }
);
return unwrapData(res);
}

export async function listInventory(token: string) {
const res = await apiFetchFirstSuccess<ApiEnvelope<InventoryRecord[]> | InventoryRecord[]>(
    STOCK_PATHS.listInventory,
    { token }
);
return unwrapData(res);
}

export async function adjustInventory(payload: AdjustInventoryPayload, token: string) {
const res = await apiFetchFirstSuccess<ApiEnvelope<InventoryRecord> | InventoryRecord>(
    STOCK_PATHS.adjustInventory,
    {
    method: "POST",
    body: payload,
    token,
    }
);
return unwrapData(res);
}

export async function addEntry(payload: AddEntryPayload, token: string) {
const res = await apiFetchFirstSuccess<ApiEnvelope<unknown> | unknown>(
    STOCK_PATHS.addEntry,
    {
    method: "POST",
    body: payload,
    token,
    }
);
return unwrapData(res);
}
